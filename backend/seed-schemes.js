const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scheme = require('./src/models/Scheme');
const DroneSurvey = require('./src/models/DroneSurvey');

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI;

const schemes = [
  {
    title: "PM-Kisan Samman Nidhi",
    description: "Income support of Rs 6,000 per year in three equal installments to all landholding farmer families.",
    eligibilityCriteria: ["Landholding farmer families", "Not institutional landholders"],
    benefits: "Rs 6,000/year",
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)), // 2 months from now
    active: true
  },
  {
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
    eligibilityCriteria: ["Notified crops in notified areas"],
    benefits: "Comprehensive insurance cover against crop failure",
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    active: true
  },
  {
    title: "Soil Health Card Scheme",
    description: "Provides farmers with information on the nutrient status of their soil along with recommendations.",
    eligibilityCriteria: ["All farmers"],
    benefits: "Soil health testing and tailored fertilizer recommendations",
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    active: true
  },
  {
    title: "Kisan Credit Card (KCC)",
    description: "Timely and adequate credit support from the banking system to farmers for their cultivation needs.",
    eligibilityCriteria: ["Farmers, sharecroppers, tenant farmers"],
    benefits: "Short-term credit limits at affordable interest rates",
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    active: true
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log('MongoDB connected for seeding...');

    // Delete existing standard schemes to avoid duplicates, or just try to insert
    await Scheme.deleteMany({});
    console.log('Cleared existing schemes...');

    await Scheme.insertMany(schemes);
    console.log('Schemes seeded successfully!');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
