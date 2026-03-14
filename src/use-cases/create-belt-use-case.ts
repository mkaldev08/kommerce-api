import type {
  BeltData,
  BeltsRepository,
  CreateBeltInput,
} from "@/repositories/belts-repository";

interface CreateBeltUseCaseResponse {
  belt: BeltData;
}

export class CreateBeltUseCase {
  constructor(private beltsRepository: BeltsRepository) {}

  async execute(input: CreateBeltInput): Promise<CreateBeltUseCaseResponse> {
    const belt = await this.beltsRepository.create(input);
    return { belt };
  }
}
