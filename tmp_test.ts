import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const doubts = await prisma.doubt.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  })
  console.log(`Found ${doubts.length} doubts`);
  for (const d of doubts) {
    console.log(`Doubt: ${d.title}`);
    console.log(`Whiteboard: ${d.whiteboardImage ? d.whiteboardImage.substring(0, 50) + '...' : 'null'}`);
    console.log(`Images: ${d.images ? d.images.substring(0, 50) + '...' : 'null'}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
