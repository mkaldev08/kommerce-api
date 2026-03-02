import z from "zod";

export const listProductsQuerySchema = z.object({
  businessUnitId: z.string().trim().min(1),
});

export const getProductByIdParamsSchema = z.object({
  productId: z.string().trim().min(1),
});

export const getProductByIdQuerySchema = z.object({
  businessUnitId: z.string().trim().min(1),
});

export const createProductBodySchema = z.object({
  businessUnitId: z.string().trim().min(1),
  name: z.string().trim().min(2),
  description: z.string().trim().default(""),
  category: z.string().trim().min(2).default("Geral"),
  price: z.coerce.number().positive(),
  vat_rate: z.coerce.number().min(0).default(14),
  is_service: z.coerce.boolean().default(false),
  is_active: z.coerce.boolean().default(true),
  stock: z.coerce.number().int().nonnegative().default(0),
  location: z.string().trim().min(2),
});

export const updateProductParamsSchema = z.object({
  productId: z.string().trim().min(1),
});

export const updateProductBodySchema = z.object({
  businessUnitId: z.string().trim().min(1),
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().optional(),
  category: z.string().trim().min(2).optional(),
  price: z.coerce.number().positive().optional(),
  vat_rate: z.coerce.number().min(0).optional(),
  is_service: z.coerce.boolean().optional(),
  is_active: z.coerce.boolean().optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  location: z.string().trim().min(2).optional(),
});

export const deleteProductParamsSchema = z.object({
  productId: z.string().trim().min(1),
});

export const createCategoryBodySchema = z.object({
  name: z.string().trim().min(2),
});
