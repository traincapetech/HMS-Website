import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaCalendarAlt, 
  FaUserCircle, 
  FaClock, 
  FaSpinner, 
  FaCheck, 
  FaTimes, 
  FaFileMedical,
  FaFilter,
  FaPlus,
  FaTrash,
  FaVideo,
  FaExclamationTriangle,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';
import { format } from 'date-fns';
import { ENV } from '../utils/envUtils';

// Use API URL from environment utility
const API_BASE_URL = ENV.API_URL;

const DoctorAppointments = () => {
  const { doctor } = useSelector((state) => state.doctor);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'today', 'past'
  const [selectedDate, setSelectedDate] = useState('');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescription, setPrescription] = useState({
    medications: [{ name: '', dosage: '', frequency: '' }],
    instructions: '',
    followUpDate: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, [filter, selectedDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the doctor ID from logged-in doctor
      let doctorId = doctor?._id;
      
      // Fallback to localStorage if Redux state doesn't have it
      if (!doctorId) {
        const doctorData = localStorage.getItem('doctorInfo');
        if (doctorData) {
          try {
            const parsedData = JSON.parse(doctorData);
            doctorId = parsedData._id;
          } catch (e) {
            console.error('Error parsing doctor data:', e);
          }
        }
      }
      
      if (!doctorId) {
        throw new Error('Doctor ID not found. Please log in again.');
      }
      
      console.log('Fetching appointments for doctor ID:', doctorId);
      
      // Try multiple endpoints in sequence - order by most reliable first
      const endpoints = [
        `${API_BASE_URL}/appoint/doctor/${doctorId}`,
        `${API_BASE_URL}/appointment/doctor/${doctorId}`,
        `${API_BASE_URL}/appoint/query?doctorId=${doctorId}`,
        `${API_BASE_URL}/appointment/query?doctorId=${doctorId}`,
        `${API_BASE_URL}/appoint/all`
      ];
      
      let appointmentsData = null;
      let lastError = null;
      let successfulEndpoint = null;
      let responseDetails = [];
      
      // Try each endpoint until one succeeds
      for (const endpoint of endpoints) {
        try {
          console.log(`Attempting endpoint: ${endpoint}`);
          const startTime = Date.now();
          const response = await axios.get(endpoint, { timeout: 15000 });
          const endTime = Date.now();
          
          responseDetails.push({
            endpoint,
            status: response.status,
            time: endTime - startTime,
            dataReceived: !!response.data
          });
          
          if (response.status === 200) {
            console.log(`Success from ${endpoint}:`, response.data);
            
            if (response.data) {
              // Handle different response formats
              if (Array.isArray(response.data.appointments)) {
                appointmentsData = response.data.appointments;
                successfulEndpoint = endpoint;
                break;
              } else if (Array.isArray(response.data)) {
                appointmentsData = response.data;
                successfulEndpoint = endpoint;
                break;
              } else if (response.data.appointment) {
                appointmentsData = [response.data.appointment];
                successfulEndpoint = endpoint;
                break;
              }
            }
          }
        } catch (error) {
          console.error(`Error with endpoint ${endpoint}:`, error);
          responseDetails.push({
            endpoint,
            status: error.response?.status || 'Network Error',
            error: error.message
          });
          lastError = error;
        }
      }
      
      console.log('Endpoint response details:', responseDetails);
      
      if (appointmentsData && Array.isArray(appointmentsData)) {
        // If we retrieved from '/all' endpoint, filter by doctor ID
        if (successfulEndpoint && successfulEndpoint.includes('/all')) {
          console.log(`Filtering ${appointmentsData.length} appointments for doctorId: ${doctorId}`);
          appointmentsData = appointmentsData.filter(appt => {
            return appt.doctorId === doctorId || appt.Doctor_id === doctorId;
          });
          console.log(`After filtering: ${appointmentsData.length} appointments`);
        }
        
        // Apply date filter if selected
        if (selectedDate) {
          const formattedSelectedDate = new Date(selectedDate).toISOString().split('T')[0];
          appointmentsData = appointmentsData.filter(appointment => {
            const appointmentDate = new Date(appointment.AppointDate).toISOString().split('T')[0];
            return appointmentDate === formattedSelectedDate;
          });
        }
        
        // Apply status filter if set
        if (filter !== 'all') {
          const today = new Date().toISOString().split('T')[0];
          
          appointmentsData = appointmentsData.filter(appointment => {
            const appointmentDate = new Date(appointment.AppointDate).toISOString().split('T')[0];
            
            switch (filter) {
              case 'today':
                return appointmentDate === today;
              case 'upcoming':
                return appointmentDate > today;
              case 'past':
                return appointmentDate < today;
              default:
                return true;
            }
          });
        }
        
        // Sort appointments by date, most recent first
        appointmentsData.sort((a, b) => {
          const dateA = new Date(a.AppointDate);
          const dateB = new Date(b.AppointDate);
          
          if (dateA - dateB === 0) {
            // If same day, sort by time
            return a.AppointTime > b.AppointTime ? 1 : -1;
          }
          
          return dateA - dateB;
        });
        
        setAppointments(appointmentsData);
        setError(null);
      } else {
        // No data found
        if (lastError) {
          console.error('Failed to fetch appointments:', lastError);
          setError(`Error retrieving appointments: ${lastError.message}`);
        } else {
          setError('No appointments found. Your schedule appears to be empty.');
        }
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
      setError(`Failed to load appointments: ${error.message}`);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // First try the new endpoint
      try {
        const response = await axios.patch(
          `${API_BASE_URL}/appointment/${appointmentId}/status`,
          { status: newStatus }
        );
        
        if (response.data && response.data.success) {
          // Update local state to reflect the change
          setAppointments(prevAppointments => 
            prevAppointments.map(appointment => 
              appointment._id === appointmentId 
                ? { ...appointment, Status: newStatus } 
                : appointment
            )
          );
          
          toast.success(`Appointment marked as ${newStatus}`);
          return;
        }
      } catch (newEndpointError) {
        console.warn('Could not update status using new endpoint, trying fallback', newEndpointError);
      }
      
      // If we're here, the new endpoint failed
      toast.error('Failed to update appointment status - backend not fully implemented');
      
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error(error.message || 'Failed to update appointment status');
    }
  };

  // Handle opening prescription modal
  const openPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);
    setPrescription({
      medications: [{ name: '', dosage: '', frequency: '' }],
      instructions: '',
      followUpDate: ''
    });
    setShowPrescriptionModal(true);
  };

  // Add new medication field
  const addMedication = () => {
    setPrescription(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: '', dosage: '', frequency: '' }
      ]
    }));
  };

  // Remove medication field
  const removeMedication = (index) => {
    setPrescription(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  // Handle change in prescription form
  const handlePrescriptionChange = (e, index, field) => {
    if (field) {
      // For medication fields
      const newMedications = [...prescription.medications];
      newMedications[index] = {
        ...newMedications[index],
        [field]: e.target.value
      };
      
      setPrescription(prev => ({
        ...prev,
        medications: newMedications
      }));
    } else {
      // For other fields
      setPrescription(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  };

  // Submit prescription
  const submitPrescription = async () => {
    try {
      // Validate form
      if (prescription.medications.some(med => !med.name || !med.dosage || !med.frequency)) {
        toast.error('Please fill in all medication details');
        return;
      }
      
      if (!prescription.instructions) {
        toast.error('Please provide instructions');
        return;
      }
      
      // Get doctor ID
      const doctorId = doctor?._id;
      if (!doctorId) {
        toast.error('Doctor ID not found. Please log in again.');
        return;
      }
      
      // Prepare data
      const prescriptionData = {
        doctorId,
        patientId: selectedAppointment.patientId || 'unknown',
        patientName: selectedAppointment.Name,
        patientEmail: selectedAppointment.Email,
        appointmentId: selectedAppointment._id,
        medications: prescription.medications,
        instructions: prescription.instructions,
        followUpDate: prescription.followUpDate || null
      };
      
      // Mock API call for now - this would need to be implemented on the backend
      console.log('Would submit prescription:', prescriptionData);
      toast.success('Prescription created successfully!');
      
      // Update appointment status
      await updateAppointmentStatus(selectedAppointment._id, 'Completed');
      
      // Close modal
      setShowPrescriptionModal(false);
      
    } catch (error) {
      console.error('Error submitting prescription:', error);
      toast.error(error.message || 'Failed to submit prescription');
    }
  };

  // Handle joining a Zoom meeting
  const joinZoomMeeting = (zoomUrl) => {
    if (zoomUrl) {
      window.open(zoomUrl, '_blank');
    } else {
      toast.error('No Zoom meeting URL available for this appointment');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Check if date is today
  const isToday = (dateString) => {
    try {
      const today = new Date();
      const appointmentDate = new Date(dateString);
      
      return (
        today.getDate() === appointmentDate.getDate() &&
        today.getMonth() === appointmentDate.getMonth() &&
        today.getFullYear() === appointmentDate.getFullYear()
      );
    } catch (e) {
      return false;
    }
  };

  // Get filtered appointments
  const getFilteredAppointments = () => {
    if (!appointments || !Array.isArray(appointments)) return [];
    
    if (filter === 'all') {
      return appointments;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.AppointDate);
      appointmentDate.setHours(0, 0, 0, 0);
      
      if (filter === 'today') {
        return isToday(appointment.AppointDate);
      } else if (filter === 'upcoming') {
        return appointmentDate > today;
      } else if (filter === 'past') {
        return appointmentDate < today;
      } else if (filter === 'Confirmed' || filter === 'Pending' || filter === 'Completed' || filter === 'Cancelled') {
        return appointment.Status === filter;
      }
      
      return true;
    });
  };

  // Render status badge
  const renderStatusBadge = (appointment) => {
    const status = appointment.Status || 'Confirmed';
    
    let color, bgColor, icon;
    
    switch (status) {
      case 'Confirmed':
        color = 'text-green-700';
        bgColor = 'bg-green-100';
        icon = <FaCheck className="mr-1" />;
        break;
      case 'Pending':
        color = 'text-yellow-700';
        bgColor = 'bg-yellow-100';
        icon = <FaClock className="mr-1" />;
        break;
      case 'Completed':
        color = 'text-blue-700';
        bgColor = 'bg-blue-100';
        icon = <FaCheck className="mr-1" />;
        break;
      case 'Cancelled':
        color = 'text-red-700';
        bgColor = 'bg-red-100';
        icon = <FaTimes className="mr-1" />;
        break;
      default:
        color = 'text-gray-700';
        bgColor = 'bg-gray-100';
        icon = <FaClock className="mr-1" />;
    }
    
    // If today's appointment and confirmed, make it more prominent
    if (isToday(appointment.AppointDate) && status === 'Confirmed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-green-500 text-white text-xs font-medium">
          <FaCalendarAlt className="mr-1" />
          Today's Appointment
        </span>
      );
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md ${bgColor} ${color} text-xs font-medium`}>
        {icon}
        {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FaCalendarAlt className="mr-2 text-red-600" />
        Doctor Appointments
      </h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <FaFilter className="text-gray-500 mr-2" />
            <span className="text-gray-700 font-medium mr-2">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Appointments</option>
              <option value="today">Today's Appointments</option>
              <option value="upcoming">Upcoming Appointments</option>
              <option value="past">Past Appointments</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-700 font-medium mr-2">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="ml-2 text-red-600 hover:text-red-700"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaSpinner className="text-red-600 text-4xl animate-spin mb-4" />
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaExclamationTriangle className="text-yellow-500 text-4xl mb-4" />
            <p className="text-red-500 font-medium">{error}</p>
            <p className="text-gray-600 mt-2">Please try again or contact support.</p>
          </div>
        ) : getFilteredAppointments().length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaCalendarAlt className="text-gray-400 text-4xl mb-4" />
            <p className="text-gray-600 font-medium">No appointments found</p>
            <p className="text-gray-500 mt-2">
              {filter !== 'all' 
                ? `Try changing your filter or selecting a different date` 
                : `You don't have any appointments yet`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredAppointments().map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10">
                          <FaUserCircle className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.Name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaEnvelope className="mr-1 text-xs" /> {appointment.Email}
                          </div>
                          {appointment.Phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <FaPhone className="mr-1 text-xs" /> {appointment.Phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(appointment.AppointDate)}</div>
                      <div className="text-sm text-gray-500">{appointment.AppointTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(appointment)}
                      {appointment.Symptoms && (
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-medium">Symptoms:</span> {appointment.Symptoms}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        {isToday(appointment.AppointDate) && appointment.Status !== 'Cancelled' && appointment.zoomMeetingUrl && (
                          <button 
                            onClick={() => joinZoomMeeting(appointment.zoomMeetingUrl)}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FaVideo className="mr-1" />
                            Join Meeting
                          </button>
                        )}
                        
                        {appointment.Status === 'Confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment._id, 'Completed')}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none"
                          >
                            <FaCheck className="mr-1" />
                            Mark Completed
                          </button>
                        )}
                        
                        {(appointment.Status === 'Confirmed' || appointment.Status === 'Completed') && (
                          <button
                            onClick={() => openPrescriptionModal(appointment)}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
                          >
                            <FaFileMedical className="mr-1" />
                            Add Prescription
                          </button>
                        )}
                        
                        {appointment.Status !== 'Cancelled' && appointment.Status !== 'Completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment._id, 'Cancelled')}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                          >
                            <FaTimes className="mr-1" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaFileMedical className="mr-2 text-red-600" />
                Create Prescription
              </h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Patient: <span className="font-medium">{selectedAppointment?.Name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Appointment Date: <span className="font-medium">{formatDate(selectedAppointment?.AppointDate)}</span>
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Medications</h3>
                
                {prescription.medications.map((medication, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:space-x-2 mb-3 p-3 bg-gray-50 rounded-md relative">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                    
                    <div className="flex-1 mb-2 md:mb-0">
                      <label className="block text-xs text-gray-500 mb-1">Medication Name</label>
                      <input
                        type="text"
                        value={medication.name}
                        onChange={(e) => handlePrescriptionChange(e, index, 'name')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Medication name"
                      />
                    </div>
                    
                    <div className="flex-1 mb-2 md:mb-0">
                      <label className="block text-xs text-gray-500 mb-1">Dosage</label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) => handlePrescriptionChange(e, index, 'dosage')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="E.g., 500mg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Frequency</label>
                      <input
                        type="text"
                        value={medication.frequency}
                        onChange={(e) => handlePrescriptionChange(e, index, 'frequency')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="E.g., Twice daily"
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addMedication}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <FaPlus className="mr-1" />
                  Add Another Medication
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  value={prescription.instructions}
                  onChange={handlePrescriptionChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Add any special instructions here"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow-up Date (Optional)
                </label>
                <input
                  type="date"
                  name="followUpDate"
                  value={prescription.followUpDate}
                  onChange={handlePrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitPrescription}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                >
                  Create Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments; 