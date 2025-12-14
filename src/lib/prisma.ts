import 'dotenv/config'
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaBetterSQLite3({ url: connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
