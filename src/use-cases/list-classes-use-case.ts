import type {
  ClassData,
  ClassesRepository,
} from "@/repositories/classes-repository";

interface ListClassesUseCaseResponse {
  classes: ClassData[];
}

export class ListClassesUseCase {
  constructor(private classesRepository: ClassesRepository) {}

  async execute(schoolYearId?: string): Promise<ListClassesUseCaseResponse> {
    const classes = await this.classesRepository.findAll(schoolYearId);
    return { classes };
  }
}
