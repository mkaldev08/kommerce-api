export interface StockData {
  id: string
  productId: string
  quantity: number
  location: string
  supplierId?: string | null
}

export interface CreateStockInput {
  productId: string
  quantity: number
  location: string
  supplierId?: string | null
}

export interface StocksRepository {
  create(data: CreateStockInput): Promise<StockData>
  findByProductAndLocation(
    productId: string,
    location: string,
  ): Promise<StockData | null>
  updateQuantity(id: string, quantity: number): Promise<StockData>
}
