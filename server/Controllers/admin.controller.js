import Admin from '../Models/admin.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Register a new admin (only existing admins can create new ones)
export const registerAdmin = async (req, res) => {
    try {
        const { username, password, email, fullName, role, permissions } = req.body;

        // Check if admin with same username or email exists
        const existingAdmin = await Admin.findOne({
            $or: [{ username }, { email }]
        });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin with this username or email already exists'
            });
        }

        // Create new admin
        const newAdmin = new Admin({
            username,
            password, // Will be hashed via pre-save hook
            email,
            fullName,
            role: role || 'admin',
            permissions: permissions || {
                manageDoctors: true,
                managePatients: true,
                managePricing: true
            }
        });

        await newAdmin.save();

        // Don't return the password
        newAdmin.password = undefined;

        return res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            admin: newAdmin
        });
    } catch (error) {
        console.error('Admin registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to register admin',
            error: error.message
        });
    }
};

// Admin login
export const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated'
            });
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: admin._id, 
                username: admin.username,
                role: admin.role,
                permissions: admin.permissions
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Don't return the password
        const adminObj = admin.toObject();
        delete adminObj.password;

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: adminObj
        });
    } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// Get all admins (for superadmin)
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        
        return res.status(200).json({
            success: true,
            count: admins.length,
            admins
        });
    } catch (error) {
        console.error('Get all admins error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch admins',
            error: error.message
        });
    }
};

// Get single admin
export const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');
        
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        return res.status(200).json({
            success: true,
            admin
        });
    } catch (error) {
        console.error('Get admin error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch admin',
            error: error.message
        });
    }
};

// Update admin
export const updateAdmin = async (req, res) => {
    try {
        const { username, email, fullName, role, permissions, isActive } = req.body;
        
        // Check if admin exists
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Update fields
        if (username) admin.username = username;
        if (email) admin.email = email;
        if (fullName) admin.fullName = fullName;
        if (role) admin.role = role;
        if (permissions) admin.permissions = { ...admin.permissions, ...permissions };
        if (isActive !== undefined) admin.isActive = isActive;

        await admin.save();

        // Don't return the password
        admin.password = undefined;

        return res.status(200).json({
            success: true,
            message: 'Admin updated successfully',
            admin
        });
    } catch (error) {
        console.error('Update admin error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update admin',
            error: error.message
        });
    }
};

// Change admin password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Check if admin exists
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Verify current password
        const isPasswordValid = await admin.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error.message
        });
    }
};

// Delete admin (soft delete by setting isActive to false)
export const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Soft delete
        admin.isActive = false;
        await admin.save();

        return res.status(200).json({
            success: true,
            message: 'Admin deactivated successfully'
        });
    } catch (error) {
        console.error('Delete admin error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to deactivate admin',
            error: error.message
        });
    }
}; 