import Pricing from '../Models/pricing.model.js';

// Create a new pricing entry
export const createPricing = async (req, res) => {
    try {
        const {
            serviceName,
            serviceType,
            specialtyId,
            basePrice,
            discountedPrice,
            isDiscounted,
            currency,
            description,
            duration
        } = req.body;

        // Create pricing entry
        const pricing = new Pricing({
            serviceName,
            serviceType,
            specialtyId,
            basePrice,
            discountedPrice,
            isDiscounted: isDiscounted || false,
            currency: currency || 'USD',
            description,
            duration,
            lastUpdatedBy: req.user.id
        });

        await pricing.save();

        return res.status(201).json({
            success: true,
            message: 'Pricing created successfully',
            pricing
        });
    } catch (error) {
        console.error('Create pricing error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create pricing',
            error: error.message
        });
    }
};

// Get all pricing entries
export const getAllPricing = async (req, res) => {
    try {
        // Filter by query parameters
        const filter = {};
        
        if (req.query.serviceType) {
            filter.serviceType = req.query.serviceType;
        }
        
        if (req.query.specialtyId) {
            filter.specialtyId = req.query.specialtyId;
        }
        
        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === 'true';
        }

        // Get pricing entries with optional filters
        const pricing = await Pricing.find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: pricing.length,
            pricing
        });
    } catch (error) {
        console.error('Get all pricing error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch pricing entries',
            error: error.message
        });
    }
};

// Get pricing by ID
export const getPricingById = async (req, res) => {
    try {
        const pricing = await Pricing.findById(req.params.id);

        if (!pricing) {
            return res.status(404).json({
                success: false,
                message: 'Pricing entry not found'
            });
        }

        return res.status(200).json({
            success: true,
            pricing
        });
    } catch (error) {
        console.error('Get pricing error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch pricing entry',
            error: error.message
        });
    }
};

// Update pricing
export const updatePricing = async (req, res) => {
    try {
        const {
            serviceName,
            serviceType,
            specialtyId,
            basePrice,
            discountedPrice,
            isDiscounted,
            currency,
            description,
            duration,
            isActive
        } = req.body;

        const pricing = await Pricing.findById(req.params.id);

        if (!pricing) {
            return res.status(404).json({
                success: false,
                message: 'Pricing entry not found'
            });
        }

        // Update fields
        if (serviceName) pricing.serviceName = serviceName;
        if (serviceType) pricing.serviceType = serviceType;
        if (specialtyId) pricing.specialtyId = specialtyId;
        if (basePrice !== undefined) pricing.basePrice = basePrice;
        if (discountedPrice !== undefined) pricing.discountedPrice = discountedPrice;
        if (isDiscounted !== undefined) pricing.isDiscounted = isDiscounted;
        if (currency) pricing.currency = currency;
        if (description !== undefined) pricing.description = description;
        if (duration !== undefined) pricing.duration = duration;
        if (isActive !== undefined) pricing.isActive = isActive;
        
        // Save last updated by
        pricing.lastUpdatedBy = req.user.id;

        await pricing.save();

        return res.status(200).json({
            success: true,
            message: 'Pricing updated successfully',
            pricing
        });
    } catch (error) {
        console.error('Update pricing error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update pricing',
            error: error.message
        });
    }
};

// Delete pricing (soft delete)
export const deletePricing = async (req, res) => {
    try {
        const pricing = await Pricing.findById(req.params.id);

        if (!pricing) {
            return res.status(404).json({
                success: false,
                message: 'Pricing entry not found'
            });
        }

        // Soft delete by setting isActive to false
        pricing.isActive = false;
        pricing.lastUpdatedBy = req.user.id;
        
        await pricing.save();

        return res.status(200).json({
            success: true,
            message: 'Pricing deactivated successfully'
        });
    } catch (error) {
        console.error('Delete pricing error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to deactivate pricing',
            error: error.message
        });
    }
};

// Hard delete pricing (permanent delete)
export const hardDeletePricing = async (req, res) => {
    try {
        const pricing = await Pricing.findById(req.params.id);

        if (!pricing) {
            return res.status(404).json({
                success: false,
                message: 'Pricing entry not found'
            });
        }

        // Permanently delete
        await Pricing.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Pricing permanently deleted'
        });
    } catch (error) {
        console.error('Hard delete pricing error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete pricing',
            error: error.message
        });
    }
}; 