import type {
  CashRegisterData,
  CashRegistersRepository,
} from "@/repositories/cash-registers-repository";

interface GetOpenCashRegisterRequest {
  businessUnitId: string;
}

interface GetOpenCashRegisterResponse {
  cashRegister: CashRegisterData | null;
}

export class GetOpenCashRegisterUseCase {
  constructor(private cashRegistersRepository: CashRegistersRepository) {}

  async execute(
    request: GetOpenCashRegisterRequest,
  ): Promise<GetOpenCashRegisterResponse> {
    const cashRegister =
      await this.cashRegistersRepository.findOpenByBusinessUnitId(
        request.businessUnitId,
      );

    return { cashRegister };
  }
}
