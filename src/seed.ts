import { getPayload } from 'payload'
import config from './payload.config'

const CATEGORIAS = [
  'Aperitivo',
  'Whisky',
  'Gin',
  'Champagne',
  'Vermouth',
  'Cerveza',
  'Barril',
  'Vino',
  'Gaseosa',
  'Lata',
  'Sin alcohol',
]

const BEBIDAS: Record<string, string[]> = {
  Aperitivo: ['Campari', 'Cynar', 'Aperol', 'Amargo Obrero', 'Fernet', 'Smirnoff'],
  Whisky: ['Jameson'],
  Gin: ['Gin Hillbing', 'Gin Bull Dog', 'Aconcagua'],
  Champagne: ['Champagne Cinzano'],
  Vermouth: [
    'La Fuerza Rosso',
    'La Fuerza Bianco',
    'La Fuerza Primavera',
    'La Fuerza Sideral',
    'Martini Rosso',
    'Martini Bianco',
    'Martini Extra Dry',
    'Primmo',
    'Primmo Rosa',
    'Federal',
    'Alfonsina Tropicale',
    'Alfonsina Florale',
    'Alfonsina Speciato',
    'Alfonsina Rose',
    'Feriado',
  ],
  Cerveza: ['Heineken', 'Blue Moon'],
  Barril: [
    'Jabalina IPA',
    'Jabalina Amber',
    'Jabalina Pilsen',
    'Jabalina Blonde',
    'Tinto de verano',
    'Heineken tirada',
  ],
  Vino: [
    'Coquena Torrontés',
    'Coquena Torrontés Tardío',
    'Coquena Malbec',
    'Coquena Rosado',
    'Coquena Corte',
    'Coquena Cabernet',
    'Coquena Tannat',
    'Potrero',
    'Potrero Naranjo',
    'Aniello',
    'Ojo Negro Pinot',
    'Ojo Negro Chardonnay',
    'Rosa di Roso',
    "Bianco d'Uco",
    'Arpeggio',
    'Tanito',
    '432',
    'Confiscado',
    'Biplano PG',
    'Biplano Criolla',
    'Biplano Blend Blancas',
    'Telefono',
    'Chakana Chardonnay',
    'Alpataco Pinot',
    'Rosso Duco',
  ],
  Gaseosa: ['Botella Coca', 'Botella Coca Zero', 'Botella Agua Tónica', 'Botella Pomelo'],
  Lata: ['Lata Coca', 'Lata Coca Zero', 'Lata Sprite'],
  'Sin alcohol': ['Sifón grande', 'Sifón chico', 'Agua con gas', 'Agua sin gas', 'Jugo de naranja'],
}

async function seed() {
  const payload = await getPayload({ config: await config })

  console.log('Creando categorías...')
  const categoryMap: Record<string, number> = {}

  for (const nombre of CATEGORIAS) {
    const cat = await payload.create({
      collection: 'categorias',
      data: { nombre },
      overrideAccess: true,
    })
    categoryMap[nombre] = cat.id
    console.log(`  ✓ ${nombre}`)
  }

  console.log('\nCreando bebidas...')
  let count = 0

  for (const [categoria, bebidas] of Object.entries(BEBIDAS)) {
    for (const nombre of bebidas) {
      await payload.create({
        collection: 'bebidas',
        data: {
          nombre,
          categoria: categoryMap[categoria],
          stock: 0,
          stockMinimo: 3,
        },
        overrideAccess: true,
      })
      count++
      console.log(`  ✓ ${nombre} (${categoria})`)
    }
  }

  console.log(`\nListo: ${CATEGORIAS.length} categorías y ${count} bebidas creadas.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('Error en seed:', err)
  process.exit(1)
})
