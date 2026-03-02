import { beforeEach, describe, expect, it } from "vitest";
import type { BusinessUnit } from "generated/prisma/client";
import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type {
  CreateInventoryProductInput,
  InventoryProductData,
  InventoryRepository,
  UpdateInventoryProductInput,
} from "@/repositories/inventory-repository";
import { CreateProductInventoryUseCase } from "@/use-cases/create-product-inventory-use-case";
import { DeleteProductInventoryUseCase } from "@/use-cases/delete-product-inventory-use-case";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { GetProductByIdUseCase } from "@/use-cases/get-product-by-id-use-case";
import { ListProductsUseCase } from "@/use-cases/list-products-use-case";
import { UpdateProductInventoryUseCase } from "@/use-cases/update-product-inventory-use-case";

class InMemoryInventoryRepository implements InventoryRepository {
  private items: Array<InventoryProductData & { businessUnitId: string }> = [];

  async listByBusinessUnitId(
    businessUnitId: string,
  ): Promise<InventoryProductData[]> {
    return this.items
      .filter((item) => item.businessUnitId === businessUnitId)
      .map((item) => ({ ...item }));
  }

  async findByIdAndBusinessUnitId(
    productId: string,
    businessUnitId: string,
  ): Promise<InventoryProductData | null> {
    const product = this.items.find(
      (item) => item.id === productId && item.businessUnitId === businessUnitId,
    );

    return product ? { ...product } : null;
  }

  async create(
    data: CreateInventoryProductInput,
  ): Promise<InventoryProductData> {
    const product: InventoryProductData & { businessUnitId: string } = {
      id: crypto.randomUUID(),
      businessUnitId: data.businessUnitId,
      name: data.name,
      description: data.description,
      price: data.price,
      vat_rate: data.vat_rate,
      is_service: data.is_service,
      stock: data.stock,
      location: data.location,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.items.push(product);

    return { ...product };
  }

  async update(
    productId: string,
    data: UpdateInventoryProductInput,
  ): Promise<InventoryProductData | null> {
    const index = this.items.findIndex(
      (item) =>
        item.id === productId && item.businessUnitId === data.businessUnitId,
    );

    if (index === -1) {
      return null;
    }

    const current = this.items[index];

    const updated: InventoryProductData & { businessUnitId: string } = {
      ...current,
      ...data,
      location: data.location ?? current.location,
      stock: data.stock ?? current.stock,
      updated_at: new Date(),
      businessUnitId: current.businessUnitId,
    };

    this.items[index] = updated;

    return { ...updated };
  }

  async delete(productId: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === productId);

    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }
}

class InMemoryBusinessUnitRepositoryForInventory implements BusinessUnitRepository {
  private items: BusinessUnit[] = [];

  async findById(businessUnitId: string): Promise<BusinessUnit | null> {
    return this.items.find((item) => item.id === businessUnitId) ?? null;
  }

  async findByCompanyId(companyId: string): Promise<BusinessUnit[]> {
    return this.items.filter((item) => item.company_id === companyId);
  }

  async create(
    data: Omit<BusinessUnit, "id" | "created_at" | "updated_at">,
  ): Promise<BusinessUnit> {
    const businessUnit: BusinessUnit = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.items.push(businessUnit);
    return businessUnit;
  }
}

describe("Inventory Product Flow Use Cases", () => {
  let inventoryRepository: InMemoryInventoryRepository;
  let businessUnitRepository: InMemoryBusinessUnitRepositoryForInventory;
  let businessUnitId: string;

  let createUseCase: CreateProductInventoryUseCase;
  let listUseCase: ListProductsUseCase;
  let getByIdUseCase: GetProductByIdUseCase;
  let updateUseCase: UpdateProductInventoryUseCase;
  let deleteUseCase: DeleteProductInventoryUseCase;

  beforeEach(async () => {
    inventoryRepository = new InMemoryInventoryRepository();
    businessUnitRepository = new InMemoryBusinessUnitRepositoryForInventory();

    const businessUnit = await businessUnitRepository.create({
      name: "Loja Teste",
      type: "STORE",
      address: "Rua 1",
      company_id: "company-1",
    });

    businessUnitId = businessUnit.id;

    createUseCase = new CreateProductInventoryUseCase(
      inventoryRepository,
      businessUnitRepository,
    );
    listUseCase = new ListProductsUseCase(
      inventoryRepository,
      businessUnitRepository,
    );
    getByIdUseCase = new GetProductByIdUseCase(inventoryRepository);
    updateUseCase = new UpdateProductInventoryUseCase(
      inventoryRepository,
      businessUnitRepository,
    );
    deleteUseCase = new DeleteProductInventoryUseCase(inventoryRepository);
  });

  it("should create and list products by business unit", async () => {
    await createUseCase.execute({
      businessUnitId,
      name: "Produto 1",
      description: "Descrição",
      price: 100,
      vat_rate: 14,
      is_service: false,
      stock: 5,
      location: "Armazém principal",
    });

    const { products } = await listUseCase.execute({ businessUnitId });

    expect(products).toHaveLength(1);
    expect(products[0].name).toBe("Produto 1");
  });

  it("should get product by id and business unit", async () => {
    const { product: created } = await createUseCase.execute({
      businessUnitId,
      name: "Produto 2",
      description: "Descrição 2",
      price: 200,
      vat_rate: 14,
      is_service: false,
      stock: 8,
      location: "Armazém principal",
    });

    const { product } = await getByIdUseCase.execute({
      productId: created.id,
      businessUnitId,
    });

    expect(product.id).toBe(created.id);
    expect(product.stock).toBe(8);
  });

  it("should update stock and location", async () => {
    const { product: created } = await createUseCase.execute({
      businessUnitId,
      name: "Produto 3",
      description: "Descrição 3",
      price: 300,
      vat_rate: 14,
      is_service: false,
      stock: 2,
      location: "A1",
    });

    const { product: updated } = await updateUseCase.execute({
      productId: created.id,
      input: {
        businessUnitId,
        stock: 12,
        location: "A2",
      },
    });

    expect(updated.stock).toBe(12);
    expect(updated.location).toBe("A2");
  });

  it("should delete a product", async () => {
    const { product: created } = await createUseCase.execute({
      businessUnitId,
      name: "Produto 4",
      description: "Descrição 4",
      price: 400,
      vat_rate: 14,
      is_service: false,
      stock: 1,
      location: "A1",
    });

    await deleteUseCase.execute({ productId: created.id });

    await expect(
      getByIdUseCase.execute({
        productId: created.id,
        businessUnitId,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should fail listing products for non-existing business unit", async () => {
    await expect(
      listUseCase.execute({ businessUnitId: "non-existing-business-unit" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
