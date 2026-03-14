import type {
  ClassData,
  ClassesRepository,
} from "@/repositories/classes-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateClassInput {
  id: string;
  name?: string;
  schedule?: string;
  instructorId?: string;
  schoolYearId?: string;
}

interface UpdateClassUseCaseResponse {
  class: ClassData;
}

export class UpdateClassUseCase {
  constructor(private classesRepository: ClassesRepository) {}

  async execute(input: UpdateClassInput): Promise<UpdateClassUseCaseResponse> {
    const existing = await this.classesRepository.findById(input.id);
    if (!existing) {
      throw new ResourceNotFoundError("Class not found");
    }

    const cls = await this.classesRepository.update(input.id, {
      name: input.name,
      schedule: input.schedule,
      instructorId: input.instructorId,
      schoolYearId: input.schoolYearId,
    });
    return { class: cls };
  }
}
