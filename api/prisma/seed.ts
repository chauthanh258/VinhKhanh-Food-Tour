import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock data for Vinh Khanh Food Tour...');

  // Xóa data cũ
  await prisma.poiTranslation.deleteMany();
  await prisma.poi.deleteMany();

  // ----- POI 1: Ốc Oanh -----
  const ocOanh = await prisma.poi.create({
    data: {
      lat: 10.762145, 
      lng: 106.708145,
      rating: 4.5,
      translations: {
        create: [
          {
            language: 'vi',
            name: 'Ốc Oanh - Hải Sản Tươi Sống',
            description: 'Quán ốc nổi tiếng bậc nhất phố Vĩnh Khánh với không gian rộng rãi, náo nhiệt đặc trưng của phố lẩu.',
            specialties: 'Ốc hương rang muối tuyết, càng ghẹ rang me, sò huyết cháy tỏi, cháo hàu.',
            priceRange: '100.000đ - 350.000đ',
            audioUrl: '/audio/vi/oc-oanh.mp3',
            imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&auto=format&fit=crop'
          },
          {
            language: 'en',
            name: 'Oc Oanh - Fresh Seafood',
            description: 'The most iconic snail restaurant on Vinh Khanh street. Vibrant atmosphere with local street food vibes.',
            specialties: 'Sweet snails with salt, crab claws in tamarind sauce, garlic butter clams.',
            priceRange: '5$ - 15$',
            audioUrl: '/audio/en/oc-oanh.mp3',
            imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&auto=format&fit=crop'
          }
        ]
      }
    }
  });

  // ----- POI 2: Sushi Nhí -----
  const sushiNhi = await prisma.poi.create({
    data: {
      lat: 10.761895, 
      lng: 106.707831,
      rating: 4.8,
      translations: {
        create: [
          {
            language: 'vi',
            name: 'Sushi Nhí',
            description: 'Điểm đến lý tưởng cho người yêu món Nhật với chất lượng cao nhưng mức giá "vỉa hè".',
            specialties: 'Sashimi cá hồi, Sushi lươn Nhật, Salad rong biển, Cơm cuộn Cali.',
            priceRange: '50.000đ - 200.000đ',
            audioUrl: '/audio/vi/sushi-nhi.mp3',
            imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400&auto=format&fit=crop'
          },
          {
            language: 'en',
            name: 'Sushi Nhi',
            description: 'Top-rated Japanese food on a budget. Fresh catches and beautifully presented platters.',
            specialties: 'Salmon Sashimi, Unagi Sushi, Seaweed Salad, California Rolls.',
            priceRange: '3$ - 10$',
            audioUrl: '/audio/en/sushi-nhi.mp3',
            imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400&auto=format&fit=crop'
          }
        ]
      }
    }
  });

  // ----- POI 3: Lẩu Bò Khu Châu Quế -----
  const lauBo = await prisma.poi.create({
    data: {
      lat: 10.762512, 
      lng: 106.708899,
      rating: 4.2,
      translations: {
        create: [
          {
            language: 'vi',
            name: 'Lẩu Bò Khu Châu Quế',
            description: 'Nổi tiếng với nước dùng lẩu gia truyền đậm đà, xương bò hầm mềm rục cực kỳ hấp dẫn.',
            specialties: 'Lẩu bò thập cẩm, Bò bóp thấu, Xương ống tủy hầm, Gân bò chua ngọt.',
            priceRange: '150.000đ - 400.000đ',
            audioUrl: '/audio/vi/lau-bo.mp3',
            imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=400&auto=format&fit=crop'
          },
          {
            language: 'en',
            name: 'Chau Que Beef Hotpot',
            description: 'Famous for its traditional bone broth passed down through generations. Hearty and warm.',
            specialties: 'Beef mix hotpot, Rare beef with lime, Beef marrow soup.',
            priceRange: '7$ - 20$',
            audioUrl: '/audio/en/lau-bo.mp3',
            imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=400&auto=format&fit=crop'
          }
        ]
      }
    }
  });

  console.log('✅ Seed completed successfully!');
  console.log(`Created 3 POIs with Vietnamese and English translations.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
