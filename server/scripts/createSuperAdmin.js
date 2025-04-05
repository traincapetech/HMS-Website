import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../Models/admin.model.js';

dotenv.config();

const createSuperAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if superadmin already exists
        const existingSuperAdmin = await Admin.findOne({ role: 'superadmin' });
        if (existingSuperAdmin) {
            console.log('Superadmin already exists');
            process.exit(0);
        }

        // Create superadmin
        const superAdmin = new Admin({
            username: 'superadmin',
            password: 'Admin@123', // Will be hashed by the pre-save hook
            email: 'admin@hms.com',
            fullName: 'System Administrator',
            role: 'superadmin',
            permissions: {
                manageDoctors: true,
                managePatients: true,
                managePricing: true
            }
        });

        await superAdmin.save();
        console.log('Superadmin created successfully');
        console.log('Username:', superAdmin.username);
        console.log('Password: Admin@123');
        console.log('Please change the password after first login');

        process.exit(0);
    } catch (error) {
        console.error('Error creating superadmin:', error);
        process.exit(1);
    }
};

createSuperAdmin(); 