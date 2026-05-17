import type { GamingSessionData } from '@/repositories/gaming-sessions-repository'
export interface GamingSessionReceiptPdfGenerator {
  generate(data: GamingSessionData): Promise<Buffer>
}
