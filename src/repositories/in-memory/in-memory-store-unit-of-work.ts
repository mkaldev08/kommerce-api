import type {
  StoreRepositories,
  StoreUnitOfWork,
} from '@/modules/store/application/ports/store-unit-of-work'
import { InMemoryBusinessUnitsRepository } from './in-memory-business-units-repository'
import { InMemoryCashMovementsRepository } from './in-memory-cash-movements-repository'
import { InMemoryCashRegistersRepository } from './in-memory-cash-registers-repository'
import { InMemoryCompaniesRepository } from './in-memory-companies-repository'
import { InMemoryCustomersRepository } from './in-memory-customers-repository'
import { InMemoryInvoiceItemsRepository } from './in-memory-invoice-items-repository'
import { InMemoryInvoicesRepository } from './in-memory-invoices-repository'
import { InMemoryPaymentsRepository } from './in-memory-payments-repository'
import { InMemoryProductsRepository } from './in-memory-products-repository'
import { InMemoryStocksRepository } from './in-memory-stocks-repository'
import { InMemoryWorkShiftsRepository } from './in-memory-work-shifts-repository'

export class InMemoryStoreUnitOfWork implements StoreUnitOfWork {
  repositories: StoreRepositories

  constructor() {
    const invoices = new InMemoryInvoicesRepository()
    const payments = new InMemoryPaymentsRepository(invoices)

    this.repositories = {
      businessUnits: new InMemoryBusinessUnitsRepository(),
      cashMovements: new InMemoryCashMovementsRepository(),
      cashRegisters: new InMemoryCashRegistersRepository(),
      companies: new InMemoryCompaniesRepository(),
      customers: new InMemoryCustomersRepository(),
      invoiceItems: new InMemoryInvoiceItemsRepository(),
      invoices,
      payments,
      products: new InMemoryProductsRepository(),
      stocks: new InMemoryStocksRepository(),
      workShifts: new InMemoryWorkShiftsRepository(),
    }
  }

  async execute<T>(fn: (repos: StoreRepositories) => Promise<T>): Promise<T> {
    return fn(this.repositories)
  }
}
