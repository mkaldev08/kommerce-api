import type { EnrollmentReportData } from "@/repositories/enrollment-report-repository";

export interface EnrollmentPdfGenerator {
  generate(data: EnrollmentReportData): Promise<Buffer>;
}
