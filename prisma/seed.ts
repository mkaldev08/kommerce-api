import { prisma } from '@/lib/prisma'

async function main() {
  console.log('Starting database seed...')

  // Create or find Luanda Province
  const luandaProvince = await prisma.province.upsert({
    where: { name: 'Luanda' },
    update: {},
    create: {
      name: 'Luanda',
    },
  })

  console.log(`Province created: ${luandaProvince.name}`)

  // Luanda municipalities
  const municipalities = [
    'Cazenga',
    'Kilamba Kiaxi',
    'Maianga',
    'Rangel',
    'Sambizanga',
    'Samba',
    'Talatona',
    'Viana',
    'Prenda',
    'Cacuaco',
    'Belas',
    'Ingombota',
  ]

  for (const municipalityName of municipalities) {
    const municipality = await prisma.municipality.upsert({
      where: { name: municipalityName },
      update: {},
      create: {
        name: municipalityName,
        province_id: luandaProvince.id,
      },
    })

    console.log(`Municipality created: ${municipality.name}`)
  }

  console.log('Database seed completed!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
