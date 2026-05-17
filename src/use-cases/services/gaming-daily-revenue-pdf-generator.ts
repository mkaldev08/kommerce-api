export interface GamingDailyRevenuePdfGenerator {
  generate(data: {
    revenue: Array<{ label: string; revenue: number }>
  }): Promise<Buffer>
}
