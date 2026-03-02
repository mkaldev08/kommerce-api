export interface InventoryProductData {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  vat_rate: number;
  is_service: boolean;
  is_active: boolean;
  stock: number;
  location: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateInventoryProductInput {
  businessUnitId: string;
  name: string;
  description: string;
  category?: string;
  price: number;
  vat_rate: number;
  is_service: boolean;
  is_active?: boolean;
  stock: number;
  location: string;
}

export interface UpdateInventoryProductInput {
  businessUnitId: string;
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  vat_rate?: number;
  is_service?: boolean;
  is_active?: boolean;
  stock?: number;
  location?: string;
}

export interface InventoryRepository {
  listByBusinessUnitId(businessUnitId: string): Promise<InventoryProductData[]>;
  findByIdAndBusinessUnitId(
    productId: string,
    businessUnitId: string,
  ): Promise<InventoryProductData | null>;
  create(data: CreateInventoryProductInput): Promise<InventoryProductData>;
  update(
    productId: string,
    data: UpdateInventoryProductInput,
  ): Promise<InventoryProductData | null>;
  delete(productId: string): Promise<boolean>;
}
