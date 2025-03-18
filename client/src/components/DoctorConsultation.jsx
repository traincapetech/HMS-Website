import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaNotesMedical, FaSave, FaDownload, FaClipboardList } from "react-icons/fa";
import api from "../utils/app.api";

const DoctorConsultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { doctor } = useSelector((state) => state.doctor);
  
  // State for patient data
  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(false);

  // State for consultation form
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState({
    temperature: "",
    pulse: "",
    respiration: "",
    bloodPressure: "",
    weight: "",
    height: "",
    generalAppearance: "",
  });
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState({
    treatment: "",
    medications: "",
    tests: "",
    followUp: "",
    patientEducation: "",
  });

  useEffect(() => {
    // Fetch patient data based on appointment ID
    // For now, we'll use mock data
    if (appointmentId) {
      setLoading(true);
      // Mock API call with timeout
      setTimeout(() => {
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
      }, 1000);
    } else {
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
    }
  }, [appointmentId]);

  // Handle change in objective data
  const handleObjectiveChange = (field, value) => {
    setObjective({
      ...objective,
      [field]: value,
    });
  };

  // Handle change in plan data
  const handlePlanChange = (field, value) => {
    setPlan({
      ...plan,
      [field]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Here we would normally save the consultation to the database
    // For now we'll just show a success message
    alert("Consultation notes saved successfully!");
    
    // Navigate back to dashboard
    // navigate('/doctor/dashboard');
  };

  // Export as PDF
  const exportPDF = () => {
    // Since we don't have html2pdf.js, we'll just simulate export
    alert("PDF Export functionality requires the html2pdf.js library. In a real implementation, this would download a PDF of the consultation notes.");
    
    // Original implementation would be:
    // const element = document.getElementById('consultation-document');
    // html2pdf()
    //   .from(element)
    //   .save(`Consultation_${patient.id}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaNotesMedical className="mr-2 text-red-600" />
            Consultation Notes
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
                <label className="block text-sm font-medium text-gray-700">Consultation Date</label>
                <div className="mt-1 text-sm text-gray-900">{new Date().toISOString().split("T")[0]}</div>
              </div>
            </div>
          </div>
        </div>

        {/* SOAP Format (Subjective, Objective, Assessment, Plan) */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <FaClipboardList className="mr-2 text-red-600" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              SOAP Notes
            </h3>
          </div>
          
          {/* Subjective */}
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Subjective</h4>
            <textarea
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              rows={4}
              className="shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
              placeholder="Patient's description of symptoms, medical history, and current complaints"
            />
          </div>
          
          {/* Objective */}
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Objective</h4>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature</label>
                <input
                  type="text"
                  value={objective.temperature}
                  onChange={(e) => handleObjectiveChange('temperature', e.target.value)}
                  className="mt-1 block w-full shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., 98.6°F"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Pulse</label>
                <input
                  type="text"
                  value={objective.pulse}
                  onChange={(e) => handleObjectiveChange('pulse', e.target.value)}
                  className="mt-1 block w-full shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., 72 bpm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Respiration</label>
                <input
                  type="text"
                  value={objective.respiration}
                  onChange={(e) => handleObjectiveChange('respiration', e.target.value)}
                  className="mt-1 block w-full shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., 16/min"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
                <input
                  type="text"
                  value={objective.bloodPressure}
                  onChange={(e) => handleObjectiveChange('bloodPressure', e.target.value)}
                  className="mt-1 block w-full shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., 120/80 mmHg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight</label>
                <input
                  type="text"
                  value={objective.weight}
                  onChange={(e) => handleObjectiveChange('weight', e.target.value)}
                  className="mt-1 block w-full shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., 70 kg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <input
                  type="text"
                  value={objective.height}
                  onChange={(e) => handleObjectiveChange('height', e.target.value)}
                  className="mt-1 block w-full shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., 175 cm"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">General Appearance</label>
              <textarea
                value={objective.generalAppearance}
                onChange={(e) => handleObjectiveChange('generalAppearance', e.target.value)}
                rows={3}
                className="mt-1 shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
                placeholder="Physical examination findings, test results, and observable conditions"
              />
            </div>
          </div>
          
          {/* Assessment */}
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Assessment</h4>
            <textarea
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              rows={4}
              className="shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
              placeholder="Diagnosis and evaluation of the patient's condition"
            />
          </div>
          
          {/* Plan */}
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Plan</h4>
            
            <div className="grid grid-cols-1 gap-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Treatment Plan</label>
                <textarea
                  value={plan.treatment}
                  onChange={(e) => handlePlanChange('treatment', e.target.value)}
                  rows={2}
                  className="mt-1 shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Overall treatment strategy"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Medications</label>
                <textarea
                  value={plan.medications}
                  onChange={(e) => handlePlanChange('medications', e.target.value)}
                  rows={2}
                  className="mt-1 shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Prescribed medications (refer to prescription details if available)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Tests and Procedures</label>
                <textarea
                  value={plan.tests}
                  onChange={(e) => handlePlanChange('tests', e.target.value)}
                  rows={2}
                  className="mt-1 shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Ordered tests, imaging, or procedures"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Follow-up</label>
                <textarea
                  value={plan.followUp}
                  onChange={(e) => handlePlanChange('followUp', e.target.value)}
                  rows={2}
                  className="mt-1 shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Follow-up appointment details and instructions"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Education</label>
                <textarea
                  value={plan.patientEducation}
                  onChange={(e) => handlePlanChange('patientEducation', e.target.value)}
                  rows={2}
                  className="mt-1 shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Information and instructions for the patient"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Consultation Document for PDF Export */}
        <div id="consultation-document" className="hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Consultation Notes</h1>
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
              <h2 className="text-xl font-semibold mb-2">Subjective</h2>
              <p>{subjective || "No subjective information provided"}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Objective</h2>
              <p><strong>Vital Signs:</strong></p>
              <ul>
                <li>Temperature: {objective.temperature || "Not recorded"}</li>
                <li>Pulse: {objective.pulse || "Not recorded"}</li>
                <li>Respiration: {objective.respiration || "Not recorded"}</li>
                <li>Blood Pressure: {objective.bloodPressure || "Not recorded"}</li>
                <li>Weight: {objective.weight || "Not recorded"}</li>
                <li>Height: {objective.height || "Not recorded"}</li>
              </ul>
              <p><strong>General Appearance:</strong> {objective.generalAppearance || "Not recorded"}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Assessment</h2>
              <p>{assessment || "No assessment provided"}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Plan</h2>
              <p><strong>Treatment:</strong> {plan.treatment || "No treatment plan specified"}</p>
              <p><strong>Medications:</strong> {plan.medications || "No medications prescribed"}</p>
              <p><strong>Tests:</strong> {plan.tests || "No tests ordered"}</p>
              <p><strong>Follow-up:</strong> {plan.followUp || "No follow-up scheduled"}</p>
              <p><strong>Patient Education:</strong> {plan.patientEducation || "No specific education provided"}</p>
            </div>
            
            <div className="mt-8 text-right">
              <p className="mb-1">Doctor's Signature:</p>
              <p>Dr. {doctor?.name || 'Test Doctor'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultation; 