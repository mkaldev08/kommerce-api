import { uuidv7 } from 'uuidv7'
import type {
  CreateStockInput,
  StockData,
  StocksRepository,
} from '@/modules/store/application/ports/repositories/stocks-repository'

export class InMemoryStocksRepository implements StocksRepository {
  items: StockData[] = []

  async create(data: CreateStockInput): Promise<StockData> {
    const stock: StockData = {
      id: uuidv7(),
      productId: data.productId,
      quantity: data.quantity,
      location: data.location,
      supplierId: data.supplierId ?? null,
    }

    this.items.push(stock)

    return stock
  }

  async findByProductAndLocation(
    productId: string,
    location: string,
  ): Promise<StockData | null> {
    return (
      this.items.find(
        (item) => item.productId === productId && item.location === location,
      ) ?? null
    )
  }

  async updateQuantity(id: string, quantity: number): Promise<StockData> {
    const stockIndex = this.items.findIndex((item) => item.id === id)

    if (stockIndex === -1) {
      throw new Error('Stock not found')
    }

    const updated = { ...this.items[stockIndex], quantity }
    this.items[stockIndex] = updated

    return updated
  }
}
