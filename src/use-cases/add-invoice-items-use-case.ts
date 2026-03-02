import { InvoiceEntity } from '@/modules/store/domain/entities/invoice'
import { InvoiceItemEntity } from '@/modules/store/domain/entities/invoice-item'
import type { VATStatus } from '@/modules/store/domain/enums'
import { Money } from '@/modules/store/domain/value-objects/money'
import { InsufficientStockError } from '../errors/insufficient-stock-error'
import { InvoiceNotFoundError } from '../errors/invoice-not-found-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import type { StoreUnitOfWork } from '../ports/store-unit-of-work'
import { err, ok, type Result } from '../result'

interface AddInvoiceItemsRequest {
  invoiceId: string
  items: Array<{
    productId: string
    quantity: number
    vatStatus: VATStatus
  }>
}

interface AddInvoiceItemsResponse {
  taxableAmount: number
  vatAmount: number
}

export class AddInvoiceItemsUseCase {
  constructor(private unitOfWork: StoreUnitOfWork) {}

  async execute(
    request: AddInvoiceItemsRequest,
  ): Promise<Result<AddInvoiceItemsResponse, Error>> {
    return this.unitOfWork.execute(async (repos) => {
      const invoice = await repos.invoices.findById(request.invoiceId)

      if (!invoice) {
        return err(new InvoiceNotFoundError())
      }

      const invoiceEntity = new InvoiceEntity({
        number: invoice.number,
        series: invoice.series,
        type: invoice.type,
      })

      const invoiceItems: InvoiceItemEntity[] = []

      for (const item of request.items) {
        const product = await repos.products.findById(item.productId)

        if (!product) {
          return err(new ResourceNotFoundError())
        }

        const vatRate = item.vatStatus === 'TAXED' ? product.vatRate : 0

        const invoiceItem = new InvoiceItemEntity({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: Money.fromDecimal(product.price),
          vatRate,
          vatStatus: item.vatStatus,
        })

        if (!product.isService) {
          const stock = await repos.stocks.findByProductAndLocation(
            product.id,
            invoice.businessUnitId,
          )

          if (!stock || stock.quantity < item.quantity) {
            return err(new InsufficientStockError())
          }

          await repos.stocks.updateQuantity(
            stock.id,
            stock.quantity - item.quantity,
          )
        }

        invoiceItems.push(invoiceItem)
      }

      invoiceEntity.addItems(invoiceItems)

      const newTaxableAmount = Money.fromDecimal(invoice.taxableAmount)
        .add(invoiceEntity.getTaxableAmount())
        .toDecimal()

      const newVatAmount = Money.fromDecimal(invoice.vatAmount)
        .add(invoiceEntity.getVatAmount())
        .toDecimal()

      await repos.invoiceItems.createMany(
        invoiceItems.map((item) => ({
          invoiceId: invoice.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toDecimal(),
          vatRate: item.vatRate,
          vatAmount: item.vatAmount.toDecimal(),
          subtotal: item.subtotal.toDecimal(),
          vatStatus: item.vatStatus,
        })),
      )

      await repos.invoices.updateTotals(
        invoice.id,
        newTaxableAmount,
        newVatAmount,
      )

      return ok({ taxableAmount: newTaxableAmount, vatAmount: newVatAmount })
    })
  }
}
