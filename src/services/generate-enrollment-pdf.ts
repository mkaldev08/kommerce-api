import { generatePdf } from "@/services/generate-pdf";
import { renderEnrollmentTemplate } from "@/templates/enrollment-template";
import type { EnrollmentPdfGenerator } from "@/use-cases/services/enrollment-pdf-generator";
import type { EnrollmentReportData } from "@/repositories/enrollment-report-repository";

export class EnrollmentPdfGeneratorService implements EnrollmentPdfGenerator {
  async generate(data: EnrollmentReportData): Promise<Buffer> {
    const html = renderEnrollmentTemplate(data);
    return generatePdf(html, { format: "A4" });
  }
}
