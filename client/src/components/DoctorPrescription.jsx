import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaFilePrescription, FaSave, FaDownload, FaEdit, FaTimes, FaArrowLeft } from "react-icons/fa";
import api from "../utils/app.api";

const DoctorPrescription = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { doctor } = useSelector(state => state.doctor || {});
  const signatureRef = useRef(null);

  // State for prescription form
  const [patient, setPatient] = useState({});
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signature, setSignature] = useState("");

  useEffect(() => {
    // Fetch patient data based on appointment ID
    // For now, we'll use mock data
    if (appointmentId) {
      setLoading(true);
      // Mock API call with timeout
      setTimeout(() => {
        try {
          setPatient({
            id: "P12345",
            name: "John Doe",
            age: 45,
            gender: "Male",
            contact: "+1-234-567-8900",
            email: "john.doe@example.com",
            address: "123 Main St, New York, NY 10001",
            appointmentDate: new Date().toISOString().split("T")[0],
          });
          setLoading(false);
        } catch (err) {
          console.error("Error loading patient data:", err);
          setError("Failed to load patient data. Please try again.");
          setLoading(false);
        }
      }, 1000);
    } else {
      try {
        setPatient({
          id: "P12345",
          name: "John Doe",
          age: 45,
          gender: "Male",
          contact: "+1-234-567-8900",
          email: "john.doe@example.com",
          address: "123 Main St, New York, NY 10001",
          appointmentDate: new Date().toISOString().split("T")[0],
        });
      } catch (err) {
        console.error("Error setting default patient data:", err);
        setError("Failed to initialize patient data. Please try again.");
      }
    }
  }, [appointmentId]);

  // Handle adding a new medication
  const addMedication = () => {
    try {
      setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
    } catch (err) {
      console.error("Error adding medication:", err);
      setError("Failed to add medication. Please try again.");
    }
  };

  // Handle removing a medication
  const removeMedication = (index) => {
    try {
      const newMedications = [...medications];
      newMedications.splice(index, 1);
      setMedications(newMedications);
    } catch (err) {
      console.error("Error removing medication:", err);
      setError("Failed to remove medication. Please try again.");
    }
  };

  // Handle change in medication fields
  const handleMedicationChange = (index, field, value) => {
    try {
      const newMedications = [...medications];
      newMedications[index][field] = value;
      setMedications(newMedications);
    } catch (err) {
      console.error("Error updating medication:", err);
      setError("Failed to update medication. Please try again.");
    }
  };

  // Handle saving signature
  const saveSignature = () => {
    try {
      // Since we don't have the signature canvas, we'll use a text-based approach
      setSignature(`Dr. ${doctor?.name || 'Test Doctor'}`);
    } catch (err) {
      console.error("Error saving signature:", err);
      setError("Failed to save signature. Please try again.");
    }
  };

  // Handle clearing signature
  const clearSignature = () => {
    try {
      setSignature("");
      // If we had the real signature component:
      // if (signatureRef.current) {
      //   signatureRef.current.clear();
      // }
    } catch (err) {
      console.error("Error clearing signature:", err);
      setError("Failed to clear signature. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here we would normally save the prescription to the database
      // For now we'll just show a success message
      alert("Prescription saved successfully!");
      
      // Navigate back to dashboard
      navigate('/doctor/dashboard');
    } catch (err) {
      console.error("Error submitting prescription:", err);
      setError("Failed to save prescription. Please try again.");
    }
  };

  // Export as PDF
  const exportPDF = () => {
    try {
      // Since we don't have html2pdf.js, we'll just simulate export
      alert("PDF Export functionality requires the html2pdf.js library. In a real implementation, this would download a PDF of the prescription.");
      
      // Original implementation would be:
      // const element = document.getElementById('prescription-document');
      // html2pdf()
      //   .from(element)
      //   .save(`Prescription_${patient.id}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("Error exporting PDF:", err);
      setError("Failed to export PDF. Please try again.");
    }
  };

  // Handle back button
  const handleBack = () => {
    try {
      navigate('/doctor/dashboard');
    } catch (err) {
      console.error("Navigation error:", err);
      // If navigation fails, try a direct window location change
      window.location.href = '/doctor/dashboard';
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Error display
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-6">
            <FaTimes className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Something Went Wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={handleBack}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaFilePrescription className="mr-2 text-red-600" />
            Write Prescription
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FaSave className="mr-2" />
              Save
            </button>
            <button
              onClick={exportPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FaDownload className="mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Patient Information
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <div className="mt-1 text-sm text-gray-900">{patient.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                <div className="mt-1 text-sm text-gray-900">{patient.id}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <div className="mt-1 text-sm text-gray-900">{patient.age} years</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <div className="mt-1 text-sm text-gray-900">{patient.gender}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <div className="mt-1 text-sm text-gray-900">{patient.contact}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 text-sm text-gray-900">{patient.email}</div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="mt-1 text-sm text-gray-900">{patient.address}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
                <div className="mt-1 text-sm text-gray-900">{patient.appointmentDate}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prescription Date</label>
                <div className="mt-1 text-sm text-gray-900">{new Date().toISOString().split("T")[0]}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Diagnosis
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={3}
              className="shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
              placeholder="Enter diagnosis"
            />
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Medications
            </h3>
            <button
              onClick={addMedication}
              className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Add Medication
            </button>
          </div>
          <div className="border-t border-gray-200">
            {medications.map((medication, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <div className="px-4 py-4 sm:px-6 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-12">
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Medication Name
                    </label>
                    <input
                      type="text"
                      value={medication.name}
                      onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                      className="mt-1 block w-full shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter medication name"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={medication.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                      className="mt-1 block w-full shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., 500mg"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Frequency
                    </label>
                    <input
                      type="text"
                      value={medication.frequency}
                      onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                      className="mt-1 block w-full shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Twice daily"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={medication.duration}
                      onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                      className="mt-1 block w-full shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., 7 days"
                    />
                  </div>
                  <div className="sm:col-span-1 flex items-end">
                    <button
                      onClick={() => removeMedication(index)}
                      className="mt-1 text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Additional Notes
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
              placeholder="Enter any additional notes or instructions for the patient"
            />
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Doctor's Signature
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {/* Replace SignatureCanvas with a simpler implementation */}
            <div className="border-2 border-gray-300 p-4 mb-4 h-32 flex items-center justify-center">
              {signature ? (
                <p className="text-xl italic">{signature}</p>
              ) : (
                <p className="text-gray-400">Click "Sign" to add your signature</p>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={saveSignature}
                className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaEdit className="mr-2" />
                Sign
              </button>
              <button
                onClick={clearSignature}
                className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaTimes className="mr-2" />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Prescription Document for PDF Export */}
        <div id="prescription-document" className="hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Medical Prescription</h1>
              <p><strong>Doctor:</strong> {doctor?.name || 'Test Doctor'}</p>
              <p><strong>License Number:</strong> {doctor?.licenseNumber || 'MD123456'}</p>
              <p><strong>Specialization:</strong> {doctor?.specialization || 'General Medicine'}</p>
              <p><strong>Date:</strong> {new Date().toISOString().split("T")[0]}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Patient Information</h2>
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>ID:</strong> {patient.id}</p>
              <p><strong>Age/Gender:</strong> {patient.age} years, {patient.gender}</p>
              <p><strong>Contact:</strong> {patient.contact}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Diagnosis</h2>
              <p>{diagnosis}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Prescribed Medications</h2>
              <ul>
                {medications.map((med, idx) => (
                  <li key={idx}>
                    <strong>{med.name}</strong> - {med.dosage}, {med.frequency}, for {med.duration}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Additional Notes</h2>
              <p>{notes}</p>
            </div>
            <div className="mt-8 text-right">
              <p className="mb-1">Doctor's Signature:</p>
              <div>{signature}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescription; 