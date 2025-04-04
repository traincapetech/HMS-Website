import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pricing from '../Models/pricing.model.js';

dotenv.config();

const defaultPricing = [
    {
        serviceName: 'General Consultation',
        serviceType: 'consultation',
        basePrice: 50,
        currency: 'USD',
        description: 'Initial consultation with a general physician',
        duration: 30,
        isActive: true
    },
    {
        serviceName: 'Specialist Consultation',
        serviceType: 'consultation',
        basePrice: 80,
        currency: 'USD',
        description: 'Consultation with a specialist doctor',
        duration: 45,
        isActive: true
    },
    {
        serviceName: 'Follow-up Consultation',
        serviceType: 'consultation',
        basePrice: 30,
        currency: 'USD',
        description: 'Follow-up consultation with your doctor',
        duration: 20,
        isActive: true
    },
    {
        serviceName: 'Emergency Consultation',
        serviceType: 'consultation',
        basePrice: 100,
        currency: 'USD',
        description: 'Emergency consultation with a doctor',
        duration: 60,
        isActive: true
    },
    {
        serviceName: 'Basic Health Checkup',
        serviceType: 'test',
        basePrice: 150,
        currency: 'USD',
        description: 'Comprehensive basic health checkup package',
        duration: 120,
        isActive: true
    },
    {
        serviceName: 'Advanced Health Checkup',
        serviceType: 'test',
        basePrice: 300,
        currency: 'USD',
        description: 'Comprehensive advanced health checkup package',
        duration: 180,
        isActive: true
    }
];

const initializePricing = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing pricing entries
        await Pricing.deleteMany({});
        console.log('Cleared existing pricing entries');

        // Insert default pricing entries
        const pricingEntries = await Pricing.insertMany(defaultPricing);
        console.log(`Successfully initialized ${pricingEntries.length} pricing entries`);

        process.exit(0);
    } catch (error) {
        console.error('Error initializing pricing:', error);
        process.exit(1);
    }
};

initializePricing(); 