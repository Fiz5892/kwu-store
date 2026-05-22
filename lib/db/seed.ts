import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { categories, products, siteConfig } from './schema';
import 'dotenv/config';

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL belum diset di .env.local');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log('🌱 Mulai seeding database...\n');

  // 1. Site Config
  console.log('📝 Menambahkan site config...');
  await db.insert(siteConfig).values({
    storeName: 'Toko Hijau',
    storeTagline: 'Belanja mudah dan nyaman',
    whatsappNumber: '6281234567890',
    aboutTitle: 'Tentang Toko Hijau',
    aboutText:
      'Toko Hijau adalah toko online yang menyediakan berbagai macam produk berkualitas tinggi dengan harga yang terjangkau. Kami berkomitmen untuk memberikan pelayanan terbaik dan pengalaman belanja yang menyenangkan bagi setiap pelanggan.\n\nDengan sistem pemesanan via WhatsApp, kami memastikan setiap pesanan diproses dengan cepat dan personal. Kami percaya bahwa belanja online harusnya mudah, nyaman, dan menyenangkan.',
    address: 'Jl. Hijau Daun No. 123, Malang, Jawa Timur 65145',
    email: 'hello@tokohijau.com',
    instagram: 'tokohijau',
    facebook: 'tokohijau',
    operationalHours: 'Senin - Sabtu, 08:00 - 20:00 WIB',
  });

  // 2. Categories
  console.log('📂 Menambahkan kategori...');
  const insertedCategories = await db
    .insert(categories)
    .values([
      { name: 'Makanan', slug: 'makanan', description: 'Berbagai makanan lezat dan berkualitas' },
      { name: 'Minuman', slug: 'minuman', description: 'Minuman segar dan menyehatkan' },
      { name: 'Snack', slug: 'snack', description: 'Cemilan nikmat untuk menemani harimu' },
      { name: 'Lainnya', slug: 'lainnya', description: 'Produk lainnya yang tidak kalah menarik' },
    ])
    .returning();

  const catMap: Record<string, number> = {};
  insertedCategories.forEach((c) => {
    catMap[c.slug] = c.id;
  });

  // 3. Products
  console.log('🛍️  Menambahkan produk...');
  await db.insert(products).values([
    {
      name: 'Nasi Goreng Spesial',
      slug: 'nasi-goreng-spesial',
      description:
        'Nasi goreng dengan bumbu rahasia khas rumahan. Dilengkapi dengan telur dadar, ayam suwir, dan kerupuk. Porsi jumbo yang mengenyangkan.',
      price: '35000',
      comparePrice: '45000',
      categoryId: catMap['makanan'],
      images: ['https://picsum.photos/seed/nasi-goreng/600/600'],
      stock: 50,
      orderCount: 120,
      isActive: true,
      weight: 500,
    },
    {
      name: 'Mie Ayam Bakso Komplit',
      slug: 'mie-ayam-bakso-komplit',
      description:
        'Mie ayam dengan topping bakso jumbo, pangsit goreng, dan sayuran segar. Kuah kaldu yang gurih dan mie yang kenyal.',
      price: '30000',
      categoryId: catMap['makanan'],
      images: ['https://picsum.photos/seed/mie-ayam/600/600'],
      stock: 30,
      orderCount: 89,
      isActive: true,
      weight: 450,
    },
    {
      name: 'Ayam Geprek Sambal Matah',
      slug: 'ayam-geprek-sambal-matah',
      description:
        'Ayam geprek crispy dengan sambal matah segar khas Bali. Disajikan dengan nasi putih hangat dan lalapan.',
      price: '28000',
      comparePrice: '35000',
      categoryId: catMap['makanan'],
      images: ['https://picsum.photos/seed/ayam-geprek/600/600'],
      stock: 40,
      orderCount: 67,
      isActive: true,
      weight: 400,
    },
    {
      name: 'Es Teh Manis Jumbo',
      slug: 'es-teh-manis-jumbo',
      description:
        'Es teh manis segar dengan ukuran jumbo 500ml. Dibuat dari teh pilihan berkualitas tinggi.',
      price: '8000',
      categoryId: catMap['minuman'],
      images: ['https://picsum.photos/seed/es-teh/600/600'],
      stock: 100,
      orderCount: 45,
      isActive: true,
      weight: 550,
    },
    {
      name: 'Jus Alpukat Premium',
      slug: 'jus-alpukat-premium',
      description:
        'Jus alpukat kental dengan susu dan gula aren. Menggunakan alpukat segar berkualitas premium.',
      price: '18000',
      comparePrice: '22000',
      categoryId: catMap['minuman'],
      images: ['https://picsum.photos/seed/jus-alpukat/600/600'],
      stock: 25,
      orderCount: 34,
      isActive: true,
      weight: 400,
    },
    {
      name: 'Kopi Susu Gula Aren',
      slug: 'kopi-susu-gula-aren',
      description:
        'Kopi robusta pilihan dengan susu segar dan gula aren asli. Rasa yang pas antara manis, creamy, dan pahit.',
      price: '15000',
      categoryId: catMap['minuman'],
      images: ['https://picsum.photos/seed/kopi-susu/600/600'],
      stock: 60,
      orderCount: 12,
      isActive: true,
      weight: 350,
    },
    {
      name: 'Keripik Singkong Pedas',
      slug: 'keripik-singkong-pedas',
      description:
        'Keripik singkong renyah dengan bumbu pedas yang bikin nagih. Cocok untuk cemilan di rumah atau oleh-oleh.',
      price: '15000',
      comparePrice: '20000',
      categoryId: catMap['snack'],
      images: ['https://picsum.photos/seed/keripik/600/600'],
      stock: 80,
      orderCount: 5,
      isActive: true,
      weight: 200,
    },
    {
      name: 'Brownies Coklat Premium',
      slug: 'brownies-coklat-premium',
      description:
        'Brownies coklat lembut dan moist dengan topping coklat chips. Dibuat dari coklat Belgia premium.',
      price: '45000',
      categoryId: catMap['snack'],
      images: ['https://picsum.photos/seed/brownies/600/600'],
      stock: 20,
      orderCount: 0,
      isActive: true,
      weight: 300,
    },
    {
      name: 'Pisang Goreng Crispy',
      slug: 'pisang-goreng-crispy',
      description:
        'Pisang goreng dengan tepung crispy renyah. Bisa dipilih topping: keju, coklat, atau original.',
      price: '12000',
      categoryId: catMap['snack'],
      images: ['https://picsum.photos/seed/pisang-goreng/600/600'],
      stock: 45,
      orderCount: 0,
      isActive: true,
      weight: 250,
    },
    {
      name: 'Rendang Daging Sapi',
      slug: 'rendang-daging-sapi',
      description:
        'Rendang daging sapi asli Padang dengan bumbu rempah yang kaya. Dimasak selama berjam-jam hingga empuk dan meresap.',
      price: '75000',
      categoryId: catMap['makanan'],
      images: ['https://picsum.photos/seed/rendang/600/600'],
      stock: 15,
      orderCount: 0,
      isActive: true,
      weight: 500,
    },
    {
      name: 'Tote Bag Canvas Hijau',
      slug: 'tote-bag-canvas-hijau',
      description:
        'Tote bag dari bahan canvas tebal yang kuat dan tahan lama. Desain minimalis warna hijau sage yang aesthetic.',
      price: '55000',
      comparePrice: '75000',
      categoryId: catMap['lainnya'],
      images: ['https://picsum.photos/seed/tote-bag/600/600'],
      stock: 30,
      orderCount: 0,
      isActive: true,
      weight: 200,
    },
    {
      name: 'Tumbler Stainless 500ml',
      slug: 'tumbler-stainless-500ml',
      description:
        'Tumbler stainless steel berkualitas tinggi kapasitas 500ml. Bisa menjaga suhu panas maupun dingin hingga 12 jam.',
      price: '89000',
      comparePrice: '120000',
      categoryId: catMap['lainnya'],
      images: ['https://picsum.photos/seed/tumbler/600/600'],
      stock: 25,
      orderCount: 0,
      isActive: true,
      weight: 350,
    },
  ]);

  console.log('\n✅ Seeding selesai!');
  console.log('   - 1 site config');
  console.log('   - 4 kategori');
  console.log('   - 12 produk');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error saat seeding:', err);
  process.exit(1);
});
