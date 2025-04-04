const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// Get statistics for a doctor's dashboard
exports.getDoctorStatistics = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    
    // Verify the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    
    // Get today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Count total unique patients for this doctor
    const uniquePatients = await Appointment.distinct('patientId', { doctorId });
    const totalPatientsCount = uniquePatients.length;
    
    // Count today's appointments
    const todayAppointmentsCount = await Appointment.countDocuments({
      doctorId,
      appointmentDate: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    // Count pending prescriptions (appointments completed but no prescription)
    const completedAppointments = await Appointment.find({
      doctorId,
      status: 'completed'
    });
    
    // Get appointment IDs that have prescriptions
    const appointmentsWithPrescriptions = await Prescription.distinct('appointmentId');
    
    // Filter completed appointments that don't have prescriptions
    const pendingPrescriptionsCount = completedAppointments.filter(
      appointment => !appointmentsWithPrescriptions.includes(appointment._id.toString())
    ).length;
    
    // Return the statistics
    return res.status(200).json({
      success: true,
      data: {
        totalPatients: totalPatientsCount,
        todayAppointments: todayAppointmentsCount,
        pendingPrescriptions: pendingPrescriptionsCount,
        doctorName: doctor.Name,
        doctorSpecialty: doctor.Speciality
      }
    });
    
  } catch (error) {
    console.error('Error fetching doctor statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message
    });
  }
};

// Get all appointments for a doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    
    // Optional query parameters for filtering
    const { status, date } = req.query;
    
    // Build filter object
    const filter = { doctorId };
    
    if (status) {
      filter.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      filter.appointmentDate = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    // Find appointments and populate patient information
    const appointments = await Appointment.find(filter)
      .populate('patientId', 'Name Email Phone Age Gender')
      .sort({ appointmentDate: 1 });
    
    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
    
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments',
      error: error.message
    });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    
    if (!['scheduled', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    // Check if the doctor making the request is the one assigned to the appointment
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }
    
    appointment.status = status;
    await appointment.save();
    
    return res.status(200).json({
      success: true,
      data: appointment
    });
    
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating appointment',
      error: error.message
    });
  }
};

// Add prescription to an appointment
exports.addPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { medications, instructions, followUpDate } = req.body;
    
    // Validate input
    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Medications are required and must be an array'
      });
    }
    
    // Verify the appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    // Check if the doctor making the request is the one assigned to the appointment
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add prescription to this appointment'
      });
    }
    
    // Check if prescription already exists
    const existingPrescription = await Prescription.findOne({ appointmentId });
    if (existingPrescription) {
      return res.status(400).json({
        success: false,
        message: 'Prescription already exists for this appointment'
      });
    }
    
    // Create new prescription
    const prescription = new Prescription({
      doctorId: req.user.id,
      patientId: appointment.patientId,
      appointmentId,
      medications,
      instructions: instructions || '',
      followUpDate: followUpDate || null
    });
    
    await prescription.save();
    
    // Update appointment status to completed if not already
    if (appointment.status !== 'completed') {
      appointment.status = 'completed';
      await appointment.save();
    }
    
    return res.status(201).json({
      success: true,
      data: prescription
    });
    
  } catch (error) {
    console.error('Error adding prescription:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while adding prescription',
      error: error.message
    });
  }
};