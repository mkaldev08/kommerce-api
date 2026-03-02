import { uuidv7 } from 'uuidv7'
import type {
  CreateProductInput,
  ProductData,
  ProductsRepository,
} from '@/modules/store/application/ports/repositories/products-repository'

export class InMemoryProductsRepository implements ProductsRepository {
  items: ProductData[] = []

  async create(data: CreateProductInput): Promise<ProductData> {
    const product: ProductData = {
      id: uuidv7(),
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      vatRate: data.vatRate,
      isService: data.isService,
    }

    this.items.push(product)

    return product
  }

  async findById(id: string): Promise<ProductData | null> {
    return this.items.find((item) => item.id === id) ?? null
  }
}
