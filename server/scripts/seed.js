require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const User = require('../src/models/User');
const WorkerProfile = require('../src/models/WorkerProfile');

const CHHATTISGARH_DISTRICTS = [
  'Raipur', 'Durg', 'Bilaspur', 'Korba', 'Raigarh',
  'Jagdalpur', 'Rajnandgaon', 'Ambikapur', 'Dhamtari',
  'Mahasamund', 'Kanker', 'Dantewada', 'Balod', 'Bemetara', 'Surguja',
];

const TIER2_CITIES = [
  'Indore', 'Bhopal', 'Nagpur', 'Lucknow', 'Kanpur',
  'Jaipur', 'Surat', 'Coimbatore', 'Kochi', 'Chandigarh',
  'Patna', 'Ranchi', 'Guwahati', 'Vizag', 'Mysore',
];

const SKILLS = ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Mechanic', 'Cleaner'];

const INDIAN_NAMES_FIRST = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan',
  'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Aanya', 'Aadhya', 'Kavya', 'Myra',
  'Anika', 'Neha', 'Riya', 'Sneha', 'Pooja', 'Meera', 'Priya', 'Kavita', 'Ritu',
];

const INDIAN_NAMES_LAST = [
  'Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Joshi', 'Rao',
  'Nair', 'Pillai', 'Reddy', 'Iyer', 'Agarwal', 'Mehta', 'Chopra', 'Saxena',
];

function randomIndianName() {
  const first = faker.helpers.arrayElement(INDIAN_NAMES_FIRST);
  const last = faker.helpers.arrayElement(INDIAN_NAMES_LAST);
  return `${first} ${last}`;
}

function generateUniqueEmail(name) {
  const slug = name.toLowerCase().replace(/\s+/g, '.');
  const num = faker.number.int({ min: 100, max: 9999 });
  return `${slug}${num}@email.com`;
}

async function generateRandomSkills() {
  const count = faker.number.int({ min: 1, max: 3 });
  return faker.helpers.arrayElements(SKILLS, count);
}

async function seed() {
  console.log('🌱 Starting seed...\n');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing collections
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await WorkerProfile.deleteMany({});
    console.log('✅ Collections cleared\n');

    const hashedPassword = await bcrypt.hash('password123', 10);
    let totalUsers = 0;
    let totalWorkers = 0;

    // --- 1. Create 10 Customer Users ---
    console.log('👥 Creating 10 customer users...');
    const customers = [];
    for (let i = 0; i < 10; i++) {
      const name = randomIndianName();
      const email = generateUniqueEmail(name);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'customer',
      });
      customers.push(user);
      totalUsers++;
    }
    console.log(`   ✅ ${customers.length} customers created\n`);

    // --- 2. Create Workers for Chhattisgarh Districts (10 each) ---
    console.log('🏗️  Creating workers for Chhattisgarh districts (10 per district)...');
    for (const district of CHHATTISGARH_DISTRICTS) {
      for (let i = 0; i < 10; i++) {
        const name = randomIndianName();
        const email = generateUniqueEmail(`${district}.${name}`);

        const user = await User.create({
          name,
          email,
          password: hashedPassword,
          role: 'worker',
        });
        totalUsers++;

        const skills = await generateRandomSkills();
        const minPrice = faker.number.int({ min: 100, max: 300 });
        const maxPrice = faker.number.int({ min: Math.max(minPrice + 100, 300), max: 1000 });
        const rating = parseFloat((faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 })).toFixed(1));
        const totalReviews = faker.number.int({ min: 5, max: 50 });
        const totalRatingSum = parseFloat((rating * totalReviews).toFixed(1));

        await WorkerProfile.create({
          userId: user._id,
          skills,
          location: district,
          priceRange: { min: minPrice, max: maxPrice },
          availability: faker.datatype.boolean(),
          rating,
          totalReviews,
          totalRatingSum,
          isVerified: faker.datatype.boolean(),
        });
        totalWorkers++;
      }
      console.log(`   ✅ ${district}: 10 workers`);
    }
    console.log(`   ✅ Chhattisgarh total: ${CHHATTISGARH_DISTRICTS.length * 10} workers\n`);

    // --- 3. Create Workers for Tier-2 Cities (5 each) ---
    console.log('🌆 Creating workers for Tier-2 cities (5 per city)...');
    for (const city of TIER2_CITIES) {
      for (let i = 0; i < 5; i++) {
        const name = randomIndianName();
        const email = generateUniqueEmail(`${city}.${name}`);

        const user = await User.create({
          name,
          email,
          password: hashedPassword,
          role: 'worker',
        });
        totalUsers++;

        const skills = await generateRandomSkills();
        const minPrice = faker.number.int({ min: 100, max: 300 });
        const maxPrice = faker.number.int({ min: Math.max(minPrice + 100, 300), max: 1000 });
        const rating = parseFloat((faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 })).toFixed(1));
        const totalReviews = faker.number.int({ min: 5, max: 50 });
        const totalRatingSum = parseFloat((rating * totalReviews).toFixed(1));

        await WorkerProfile.create({
          userId: user._id,
          skills,
          location: city,
          priceRange: { min: minPrice, max: maxPrice },
          availability: faker.datatype.boolean(),
          rating,
          totalReviews,
          totalRatingSum,
          isVerified: faker.datatype.boolean(),
        });
        totalWorkers++;
      }
      console.log(`   ✅ ${city}: 5 workers`);
    }
    console.log(`   ✅ Tier-2 cities total: ${TIER2_CITIES.length * 5} workers\n`);

    // --- Summary ---
    console.log('═══════════════════════════════════════');
    console.log('📊 SEED SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`   Total users created:    ${totalUsers}`);
    console.log(`   Total worker profiles:  ${totalWorkers}`);
    console.log(`   - Chhattisgarh:         ${CHHATTISGARH_DISTRICTS.length * 10}`);
    console.log(`   - Tier-2 cities:        ${TIER2_CITIES.length * 5}`);
    console.log(`   Customers:              10`);
    console.log('═══════════════════════════════════════');
    console.log('✅ Seed completed successfully!\n');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
