import { prisma } from "@/lib/prisma";
import type {
  CreateInventoryProductInput,
  InventoryProductData,
  InventoryRepository,
  UpdateInventoryProductInput,
} from "../inventory-repository";

const STOCK_SEPARATOR = "::";

const withBusinessUnitPrefix = (
  businessUnitId: string,
  location: string,
): string => `${businessUnitId}${STOCK_SEPARATOR}${location}`;

const removeBusinessUnitPrefix = (
  businessUnitId: string,
  location: string,
): string => {
  const expectedPrefix = `${businessUnitId}${STOCK_SEPARATOR}`;

  if (location.startsWith(expectedPrefix)) {
    return location.slice(expectedPrefix.length);
  }

  return location;
};

const toInventoryProduct = (
  businessUnitId: string,
  product: {
    id: string;
    name: string;
    description: string | null;
    category: {
      name: string;
    } | null;
    price: unknown;
    vat_rate: unknown;
    is_service: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    stocks: Array<{
      quantity: number;
      location: string;
    }>;
  },
): InventoryProductData => {
  const stock = product.stocks.reduce((acc, item) => acc + item.quantity, 0);

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    category: product.category?.name ?? "Geral",
    price: Number(product.price),
    vat_rate: Number(product.vat_rate),
    is_service: product.is_service,
    is_active: product.is_active,
    stock,
    location:
      product.stocks.length > 0
        ? removeBusinessUnitPrefix(businessUnitId, product.stocks[0].location)
        : product.is_service
          ? "Serviço"
          : "Armazém principal",
    created_at: product.created_at,
    updated_at: product.updated_at,
  };
};

export class PrismaInventoryRepository implements InventoryRepository {
  async listByBusinessUnitId(
    businessUnitId: string,
  ): Promise<InventoryProductData[]> {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        stocks: true,
      },
      orderBy: {
        updated_at: "desc",
      },
    });

    return products
      .map((product) => {
        const scopedStocks = product.stocks.filter((stock) =>
          stock.location.startsWith(withBusinessUnitPrefix(businessUnitId, "")),
        );

        if (scopedStocks.length === 0 && !product.is_service) {
          return null;
        }

        return toInventoryProduct(businessUnitId, {
          ...product,
          stocks: scopedStocks,
        });
      })
      .filter((item) => item !== null);
  }

  async findByIdAndBusinessUnitId(
    productId: string,
    businessUnitId: string,
  ): Promise<InventoryProductData | null> {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        stocks: {
          where: {
            location: {
              startsWith: withBusinessUnitPrefix(businessUnitId, ""),
            },
          },
          orderBy: {
            updated_at: "desc",
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    if (product.stocks.length === 0 && !product.is_service) {
      return null;
    }

    return toInventoryProduct(businessUnitId, product);
  }

  async create(
    data: CreateInventoryProductInput,
  ): Promise<InventoryProductData> {
    const createdProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        category: {
          connectOrCreate: {
            where: {
              name: data.category ?? "Geral",
            },
            create: {
              name: data.category ?? "Geral",
            },
          },
        },
        price: data.price,
        vat_rate: data.vat_rate,
        is_service: data.is_service,
        is_active: data.is_active,
        stocks:
          data.is_service || data.stock === 0
            ? undefined
            : {
                create: {
                  quantity: data.stock,
                  location: withBusinessUnitPrefix(
                    data.businessUnitId,
                    data.location,
                  ),
                },
              },
      },
      include: {
        category: true,
        stocks: {
          where: {
            location: {
              startsWith: withBusinessUnitPrefix(data.businessUnitId, ""),
            },
          },
          orderBy: {
            updated_at: "desc",
          },
        },
      },
    });

    return toInventoryProduct(data.businessUnitId, createdProduct);
  }

  async update(
    productId: string,
    data: UpdateInventoryProductInput,
  ): Promise<InventoryProductData | null> {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!existingProduct) {
      return null;
    }

    const previousProduct = await this.findByIdAndBusinessUnitId(
      productId,
      data.businessUnitId,
    );

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: data.name,
        description: data.description,
        category: data.category
          ? {
              connectOrCreate: {
                where: {
                  name: data.category,
                },
                create: {
                  name: data.category,
                },
              },
            }
          : undefined,
        price: data.price,
        vat_rate: data.vat_rate,
        is_service: data.is_service,
        is_active: data.is_active,
      },
    });

    if (typeof data.stock === "number") {
      const effectiveLocation =
        data.location ?? previousProduct?.location ?? "Armazém principal";
      const scopedLocation = withBusinessUnitPrefix(
        data.businessUnitId,
        effectiveLocation,
      );

      await prisma.stock.upsert({
        where: {
          product_id_location: {
            product_id: productId,
            location: scopedLocation,
          },
        },
        update: {
          quantity: data.stock,
        },
        create: {
          product_id: productId,
          quantity: data.stock,
          location: scopedLocation,
        },
      });
    }

    return await this.findByIdAndBusinessUnitId(productId, data.businessUnitId);
  }

  async delete(productId: string): Promise<boolean> {
    const existing = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!existing) {
      return false;
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return true;
  }
}
