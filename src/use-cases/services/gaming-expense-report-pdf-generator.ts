export interface GamingExpenseReportPdfGenerator {
  generate(data: { expenses: Array<any> }): Promise<Buffer>
}
