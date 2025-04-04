import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true
    },
    serviceType: {
        type: String,
        required: [true, 'Service type is required'],
        enum: ['consultation', 'treatment', 'test', 'surgery', 'other'],
        default: 'consultation'
    },
    specialtyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty',
        required: false
    },
    basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: [0, 'Base price cannot be negative']
    },
    discountedPrice: {
        type: Number,
        required: false,
        min: [0, 'Discounted price cannot be negative']
    },
    isDiscounted: {
        type: Boolean,
        default: false
    },
    currency: {
        type: String,
        default: 'USD'
    },
    description: {
        type: String,
        required: false
    },
    duration: {
        type: Number, // in minutes
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: false
    }
}, {
    timestamps: true
});

// Create indexes for faster searching
pricingSchema.index({ serviceName: 1 });
pricingSchema.index({ serviceType: 1 });
pricingSchema.index({ specialtyId: 1 });

const Pricing = mongoose.model('Pricing', pricingSchema);

export default Pricing; 