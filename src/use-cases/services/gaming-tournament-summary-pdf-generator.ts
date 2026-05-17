export interface GamingTournamentSummaryPdfGenerator {
  generate(data: { tournaments: Array<any> }): Promise<Buffer>
}
