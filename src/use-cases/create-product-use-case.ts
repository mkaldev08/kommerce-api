import type { ProductsRepository } from '../ports/repositories/products-repository'
import { ok, type Result } from '../result'

interface CreateProductRequest {
  name: string
  description?: string | null
  price: number
  vatRate: number
  isService: boolean
}

interface CreateProductResponse {
  productId: string
}

export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(
    request: CreateProductRequest,
  ): Promise<Result<CreateProductResponse, Error>> {
    const product = await this.productsRepository.create({
      name: request.name,
      description: request.description ?? null,
      price: request.price,
      vatRate: request.vatRate,
      isService: request.isService,
    })

    return ok({ productId: product.id })
  }
}
