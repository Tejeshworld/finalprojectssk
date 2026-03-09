import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hubsToSeed = [
  { name: 'Computer Science', icon: '💻', color: '#6366f1' },
  { name: 'Programming', icon: '⌨️', color: '#3b82f6' },
  { name: 'Data Structures', icon: '🌳', color: '#10b981' },
  { name: 'Algorithms', icon: '⚙️', color: '#8b5cf6' },
  { name: 'Operating Systems', icon: '🖥️', color: '#f59e0b' },
  { name: 'Database Management Systems', icon: '🗄️', color: '#ec4899' },
  { name: 'Computer Networks', icon: '🌐', color: '#14b8a6' },
  { name: 'Software Engineering', icon: '📐', color: '#f43f5e' },
  { name: 'Artificial Intelligence', icon: '🧠', color: '#a855f7' },
  { name: 'Machine Learning', icon: '🤖', color: '#0ea5e9' },
  { name: 'Web Development', icon: '🕸️', color: '#eab308' },
  { name: 'Frontend Development', icon: '🎨', color: '#84cc16' },
  { name: 'Backend Development', icon: '🖧', color: '#64748b' },
  { name: 'JavaScript', icon: '🟨', color: '#facc15' },
  { name: 'Python', icon: '🐍', color: '#3b82f6' },
  { name: 'Java', icon: '☕', color: '#ef4444' },
  { name: 'C Programming', icon: '©️', color: '#3b82f6' },
  { name: 'C++', icon: '🚀', color: '#0284c7' },
  { name: 'Competitive Programming', icon: '🏆', color: '#f97316' },
  { name: 'System Design', icon: '🏗️', color: '#94a3b8' },
];

async function main() {
  console.log(`Start seeding ${hubsToSeed.length} hubs...`);

  for (const hubData of hubsToSeed) {
    const hub = await prisma.hub.upsert({
      where: { name: hubData.name },
      update: {},
      create: {
        name: hubData.name,
        description: `Community hub for ${hubData.name} discussions`,
        icon: hubData.icon,
        color: hubData.color,
      },
    });
    console.log(`✅ Upserted hub: ${hub.name}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
