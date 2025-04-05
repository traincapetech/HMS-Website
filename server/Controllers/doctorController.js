// This is just the profile function - add this to your existing controller file
exports.getDoctorProfile = async (req, res) => {
    try {
      // The doctor ID should be available in req.user.id after auth middleware
      const doctorId = req.user?.id;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated, please log in again'
        });
      }
      
      const doctor = await Doctor.findById(doctorId).select('-Password');
      
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }
      
      res.status(200).json({
        success: true,
        doctor
      });
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching doctor profile'
      });
    }
  }; 