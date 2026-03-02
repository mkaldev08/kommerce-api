import type { InvoiceType } from '@/modules/store/domain/enums'
import { BusinessUnitNotStoreError } from '../errors/business-unit-not-store-error'
import { CashRegisterClosedError } from '../errors/cash-register-closed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { WorkShiftNotOpenError } from '../errors/work-shift-not-open-error'
import type { BusinessUnitsRepository } from '../ports/repositories/business-units-repository'
import type { CashRegistersRepository } from '../ports/repositories/cash-registers-repository'
import type { CompaniesRepository } from '../ports/repositories/companies-repository'
import type { InvoicesRepository } from '../ports/repositories/invoices-repository'
import type { WorkShiftsRepository } from '../ports/repositories/work-shifts-repository'
import { err, ok, type Result } from '../result'

interface CreateInvoiceRequest {
  number: string
  series: string
  type: InvoiceType
  companyId: string
  businessUnitId: string
  cashRegisterId: string
  operatorId: string
  customerId?: string | null
}

interface CreateInvoiceResponse {
  invoiceId: string
}

export class CreateInvoiceUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private businessUnitsRepository: BusinessUnitsRepository,
    private cashRegistersRepository: CashRegistersRepository,
    private workShiftsRepository: WorkShiftsRepository,
    private invoicesRepository: InvoicesRepository,
  ) {}

  async execute(
    request: CreateInvoiceRequest,
  ): Promise<Result<CreateInvoiceResponse, Error>> {
    const [company, businessUnit, cashRegister] = await Promise.all([
      this.companiesRepository.findById(request.companyId),
      this.businessUnitsRepository.findById(request.businessUnitId),
      this.cashRegistersRepository.findById(request.cashRegisterId),
    ])

    if (!company || !businessUnit || !cashRegister) {
      return err(new ResourceNotFoundError())
    }

    if (
      businessUnit.type !== 'STORE' ||
      businessUnit.companyId !== company.id
    ) {
      return err(new BusinessUnitNotStoreError())
    }

    if (cashRegister.status !== 'OPEN') {
      return err(new CashRegisterClosedError())
    }

    const openShift =
      await this.workShiftsRepository.findOpenByCashRegisterAndOperator(
        request.cashRegisterId,
        request.operatorId,
      )

    if (!openShift) {
      return err(new WorkShiftNotOpenError())
    }

    const invoice = await this.invoicesRepository.create({
      number: request.number,
      series: request.series,
      type: request.type,
      taxableAmount: 0,
      vatAmount: 0,
      companyId: request.companyId,
      businessUnitId: request.businessUnitId,
      cashRegisterId: request.cashRegisterId,
      customerId: request.customerId ?? null,
    })

    return ok({ invoiceId: invoice.id })
  }
}
