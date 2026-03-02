export interface ProductData {
  id: string
  name: string
  description?: string | null
  price: number
  vatRate: number
  isService: boolean
}

export interface CreateProductInput {
  name: string
  description?: string | null
  price: number
  vatRate: number
  isService: boolean
}

export interface ProductsRepository {
  create(data: CreateProductInput): Promise<ProductData>
  findById(id: string): Promise<ProductData | null>
}
