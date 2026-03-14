import type { EnrollmentReportRepository } from "@/repositories/enrollment-report-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import type { EnrollmentPdfGenerator } from "@/use-cases/services/enrollment-pdf-generator";

interface ExportEnrollmentPdfUseCaseRequest {
  enrollmentId: string;
  businessUnitId: string;
}

interface ExportEnrollmentPdfUseCaseResponse {
  fileName: string;
  fileContent: Buffer;
}

export class ExportEnrollmentPdfUseCase {
  constructor(
    private enrollmentReportRepository: EnrollmentReportRepository,
    private enrollmentPdfGenerator: EnrollmentPdfGenerator,
  ) {}

  async execute(
    request: ExportEnrollmentPdfUseCaseRequest,
  ): Promise<ExportEnrollmentPdfUseCaseResponse> {
    const enrollment = await this.enrollmentReportRepository.findByEnrollmentId(
      request.enrollmentId,
    );

    if (!enrollment || enrollment.businessUnitId !== request.businessUnitId) {
      throw new ResourceNotFoundError();
    }

    const fileContent = await this.enrollmentPdfGenerator.generate(enrollment);

    return {
      fileName: `enrollment-${enrollment.id}.pdf`,
      fileContent,
    };
  }
}
