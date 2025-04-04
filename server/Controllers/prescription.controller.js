import mongoose from 'mongoose';

// Create a Prescription Schema
const prescriptionSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User' 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Doctor' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    notes: String
  }],
  diagnosis: String,
  notes: String,
  followUpDate: Date
}, { timestamps: true });

// Create the model if it doesn't exist
let Prescription;
try {
  Prescription = mongoose.model('Prescription');
} catch (error) {
  Prescription = mongoose.model('Prescription', prescriptionSchema);
}

// Controller functions
export const createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, medications, diagnosis, notes, followUpDate } = req.body;
    
    if (!patientId || !doctorId || !medications) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields (patientId, doctorId, medications)" 
      });
    }
    
    const prescription = new Prescription({
      patientId,
      doctorId,
      medications,
      diagnosis,
      notes,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined
    });
    
    await prescription.save();
    
    return res.status(201).json({
      success: true,
      prescription
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required"
      });
    }
    
    const prescriptions = await Prescription.find({ patientId })
      .sort({ date: -1 })
      .populate('doctorId', 'fullName email contactNumber specialization')
      .exec();
    
    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Prescription ID is required"
      });
    }
    
    const prescription = await Prescription.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      prescription
    });
  } catch (error) {
    console.error('Error updating prescription:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Prescription ID is required"
      });
    }
    
    const prescription = await Prescription.findByIdAndDelete(id);
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Prescription deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 