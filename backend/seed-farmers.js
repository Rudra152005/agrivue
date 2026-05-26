const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Farmer = require('./src/models/Farmer');

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI;

const farmersData = [
  { name: 'Arjun Kumar', aadhaarId: '874920193847', village: 'Rampur', district: 'Patna', state: 'Bihar', landSize: 4.5, beneficiaryStatus: 'active' },
  { name: 'Vikram Singh', aadhaarId: '472819384756', village: 'Shivpur', district: 'Varanasi', state: 'Uttar Pradesh', landSize: 12.0, beneficiaryStatus: 'pending' },
  { name: 'Priya Sharma', aadhaarId: '983746510293', village: 'Kondhwa', district: 'Pune', state: 'Maharashtra', landSize: 2.5, beneficiaryStatus: 'active' },
  { name: 'Ramesh Yadav', aadhaarId: '384756192837', village: 'Hodal', district: 'Palwal', state: 'Haryana', landSize: 8.0, beneficiaryStatus: 'inactive' },
  { name: 'Suresh Patel', aadhaarId: '564738291048', village: 'Sanand', district: 'Ahmedabad', state: 'Gujarat', landSize: 15.5, beneficiaryStatus: 'active' }
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log('MongoDB connected for farmer seeding...');

    await Farmer.deleteMany({});
    await User.deleteMany({ email: { $regex: '@farmer.com' } });
    console.log('Cleared existing farmers...');

    for (const data of farmersData) {
      const email = `${data.aadhaarId}@farmer.com`;
      const password = 'password123';
      
      const user = await User.create({
        name: data.name,
        email,
        password,
        role: 'farmer'
      });

      await Farmer.create({
        user: user._id,
        aadhaarId: data.aadhaarId,
        contactNumber: `91${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        village: data.village,
        district: data.district,
        state: data.state,
        landSize: data.landSize,
        beneficiaryStatus: data.beneficiaryStatus
      });
    }

    console.log('Farmers seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
