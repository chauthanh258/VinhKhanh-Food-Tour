import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getRandomCoords, getRandom } from '../src/utils/geo.util';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Admins (3)
  console.log('Creating admins...');
  for (let i = 1; i <= 3; i++) {
    await prisma.user.upsert({
      where: { email: `admin${i}@vinhkhanh.com` },
      update: {},
      create: {
        email: `admin${i}@vinhkhanh.com`,
        passwordHash,
        fullName: `Admin User ${i}`,
        role: Role.ADMIN,
      },
    });
  }

  // 2. Create Owners (50)
  console.log('Creating owners...');
  const owners = [];
  for (let i = 1; i <= 50; i++) {
    const owner = await prisma.user.upsert({
      where: { email: `owner${i}@gmail.com` },
      update: {},
      create: {
        email: `owner${i}@gmail.com`,
        passwordHash,
        fullName: `Owner Name ${i}`,
        role: Role.OWNER,
      },
    });
    owners.push(owner);
  }

  // 3. Create Users (200 for now to avoid timeout, can be increased)
  console.log('Creating normal users...');
  for (let i = 1; i <= 200; i++) {
    await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        passwordHash,
        fullName: `Regular User ${i}`,
        role: Role.USER,
      },
    });
  }

  // 4. Create Categories
  console.log('Creating categories...');
  const categoryNames = [
    { name: 'Hải sản', description: 'Các món hải sản tươi sống, đặc sản biển' },
    { name: 'Bánh', description: 'Bánh truyền thống, bánh ngọt, bánh mì' },
    { name: 'Ăn vặt', description: 'Các món ăn vặt đường phố, snack' },
    { name: 'Nước giải khát', description: 'Trà sữa, nước mía, sinh tố, cà phê' },
    { name: 'Phở & Mì', description: 'Phở, mì, hủ tiếu, bún bò' },
    { name: 'Lẩu & Nướng', description: 'Lẩu các loại, nướng BBQ, nướng than' },
  ];

  const categories = [];
  for (const cat of categoryNames) {
    const category = await prisma.category.create({
      data: {
        isActive: true,
        translations: {
          create: {
            name: cat.name,
            description: cat.description,
            language: 'vi',
          },
        },
      },
    });
    categories.push(category);
  }

  // 5. Create POIs (50)
  console.log('Creating 50 POIs...');
  const poiNames = [
    'Ốc Oanh', 'Sushi Nhí', 'Lẩu Bò Khu Nhà Cháy', 'Phá Lấu Cô Thảo', 'Bún Mắm 444',
    'Cơm Tấm Ba Ghiền', 'Bánh Mì Huỳnh Hoa', 'Phở Dậu', 'Xôi Gà Bà Chiểu', 'Chè Hà Trâm'
  ];

  for (let i = 1; i <= 50; i++) {
    const coords = getRandomCoords();
    const owner = owners[Math.floor(Math.random() * owners.length)];
    const baseName = poiNames[i % poiNames.length] + ' ' + i;
    const category = categories[Math.floor(Math.random() * categories.length)];

    const poi = await prisma.pOI.create({
      data: {
        lat: coords.lat,
        lng: coords.lng,
        rating: getRandom(3, 5),
        ownerId: owner.id,
        categoryId: category.id,
        isActive: true,
      },
    });

    // Create 1 translation per POI (default Vietnamese)
    await prisma.pOITranslation.create({
      data: {
        poiId: poi.id,
        name: `${baseName}`,
        description: `Mô tả mẫu cho ${baseName}. Ở đây chuyên phục vụ các món ngon tuyệt vời tại đường Vĩnh Khánh. Thưởng thức không gian tuyệt vời ở đây nha.`,
        specialties: 'Hải sản, Món ăn đường phố, Đặc sản địa phương',
        priceRange: '50.000đ - 200.000đ',
        imageUrl: `https://picsum.photos/seed/${poi.id}-vi/800/600`,
      },
    });

    // Create 3-8 menu items per POI
    const numMenu = Math.floor(Math.random() * 6) + 3; // 3 to 8
    for (let k = 1; k <= numMenu; k++) {
      await prisma.menuItem.create({
        data: {
          poiId: poi.id,
          name: `Món đặc biệt ${k} của ${baseName}`,
          price: getRandom(30000, 150000),
          description: `Mô tả món ăn đặc biệt số ${k} vô cùng hấp dẫn.`,
          imageUrl: `https://picsum.photos/seed/menu-${poi.id}-${k}/400/300`,
          isAvailable: true,
        },
      });
    }

    if (i % 10 === 0) console.log(`  Added ${i} POIs...`);
  }

  console.log('✅ Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
