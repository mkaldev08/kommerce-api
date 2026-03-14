import type {
  ClassData,
  ClassesRepository,
} from "@/repositories/classes-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FindClassByIdUseCaseResponse {
  class: ClassData;
}

export class FindClassByIdUseCase {
  constructor(private classesRepository: ClassesRepository) {}

  async execute(id: string): Promise<FindClassByIdUseCaseResponse> {
    const cls = await this.classesRepository.findById(id);
    if (!cls) {
      throw new ResourceNotFoundError("Class not found");
    }
    return { class: cls };
  }
}
