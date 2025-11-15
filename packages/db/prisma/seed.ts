import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bulgariafromabove.com' },
    update: {},
    create: {
      email: 'admin@bulgariafromabove.com',
      username: 'admin',
      password: adminPassword,
      avatarId: 'avatar-1',
      provider: 'email',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'player1@example.com' },
      update: {},
      create: {
        email: 'player1@example.com',
        username: 'player1',
        password: await hash('Password123!', 10),
        avatarId: 'avatar-2',
        provider: 'email',
      },
    }),
    prisma.user.upsert({
      where: { email: 'player2@example.com' },
      update: {},
      create: {
        email: 'player2@example.com',
        username: 'player2',
        password: await hash('Password123!', 10),
        avatarId: 'avatar-3',
        provider: 'email',
      },
    }),
  ]);

  console.log('✅ Created sample users:', users.length);

  // Create sample photos (you'll need to replace these with actual photo URLs)
  const samplePhotos = [
    {
      url: 'https://example.com/photos/rila.jpg',
      thumbnailUrl: 'https://example.com/photos/rila-thumb.jpg',
      latitude: 42.1333,
      longitude: 23.5833,
      city: 'Rila Monastery',
      region: 'Rila Mountains',
      category: 'landmark',
      difficulty: 2,
      approved: true,
      uploadedBy: admin.id,
    },
    {
      url: 'https://example.com/photos/sofia.jpg',
      thumbnailUrl: 'https://example.com/photos/sofia-thumb.jpg',
      latitude: 42.6977,
      longitude: 23.3219,
      city: 'Sofia',
      region: 'Sofia City',
      category: 'city',
      difficulty: 1,
      approved: true,
      uploadedBy: admin.id,
    },
    {
      url: 'https://example.com/photos/plovdiv.jpg',
      thumbnailUrl: 'https://example.com/photos/plovdiv-thumb.jpg',
      latitude: 42.1354,
      longitude: 24.7453,
      city: 'Plovdiv',
      region: 'Plovdiv',
      category: 'city',
      difficulty: 2,
      approved: true,
      uploadedBy: admin.id,
    },
    {
      url: 'https://example.com/photos/varna.jpg',
      thumbnailUrl: 'https://example.com/photos/varna-thumb.jpg',
      latitude: 43.2141,
      longitude: 27.9147,
      city: 'Varna',
      region: 'Black Sea Coast',
      category: 'coast',
      difficulty: 2,
      approved: true,
      uploadedBy: admin.id,
    },
    {
      url: 'https://example.com/photos/belogradchik.jpg',
      thumbnailUrl: 'https://example.com/photos/belogradchik-thumb.jpg',
      latitude: 43.6261,
      longitude: 22.6833,
      city: 'Belogradchik',
      region: 'Northwestern Bulgaria',
      category: 'nature',
      difficulty: 3,
      approved: true,
      uploadedBy: admin.id,
    },
  ];

  const photos = await Promise.all(
    samplePhotos.map((photo) =>
      prisma.photo.create({
        data: photo,
      })
    )
  );

  console.log('✅ Created sample photos:', photos.length);

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
