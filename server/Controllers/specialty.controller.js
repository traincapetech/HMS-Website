import Doctor from '../Models/doctor.model.js';

// Get all unique specialties from doctors collection
export const getAllSpecialties = async (req, res) => {
  try {
    // Find all doctors and extract unique specialties
    const doctors = await Doctor.find().select('Speciality');
    
    // Extract unique specialties
    const uniqueSpecialties = [...new Set(doctors.map(doc => doc.Speciality))].filter(Boolean);
    
    // If no specialties found, use a default list
    if (uniqueSpecialties.length === 0) {
      return res.status(200).json({
        success: true,
        specialties: [
          "Covid Treatment",
          "Sexual Health",
          "Eye Specialist",
          "Womens Health",
          "Diet & Nutrition",
          "Skin & Hair",
          "Bones and Joints",
          "Child Specialist",
          "Dental Care",
          "Heart",
          "Kidney Issues",
          "Cancer",
          "Ayurveda",
          "General Physician",
          "Mental Wellness",
          "Homoeopath",
          "General Surgery",
          "Urinary Issues",
          "Lungs and Breathing",
          "Physiotherapy",
          "Ear, Nose, Throat",
          "Brain and Nerves",
          "Diabetes Management",
          "Veterinary",
        ]
      });
    }
    
    return res.status(200).json({
      success: true,
      specialties: uniqueSpecialties.sort() // Sort alphabetically
    });
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching specialties',
      error: error.message
    });
  }
}; 