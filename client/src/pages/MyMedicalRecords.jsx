import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaFilePrescription, FaNotesMedical, FaFileAlt, FaDownload, FaFilePdf, FaUpload, FaCheck, FaTimes } from "react-icons/fa";

const MyMedicalRecords = () => {
  const { user, token } = useSelector((state) => state.user);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [consultationNotes, setConsultationNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("records");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'uploading', 'success', 'error'
  const [recordTitle, setRecordTitle] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Simulating API call to fetch user medical records
    const fetchMedicalRecords = async () => {
      try {
        const response = await fetch("/api/medical-records", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setMedicalRecords(data);
      } catch (error) {
        console.error("Error fetching medical records:", error);
      }
    };

    // Simulating API call to fetch prescriptions
    const fetchPrescriptions = async () => {
      try {
        // Mocked data for prescriptions
        setPrescriptions([
          {
            id: "p1",
            date: "2023-09-15",
            doctor: "Dr. Jane Smith",
            specialization: "General Medicine",
            diagnosis: "Common Cold",
            medications: [
              { name: "Acetaminophen", dosage: "500mg", frequency: "Every 6 hours", duration: "5 days" },
              { name: "Loratadine", dosage: "10mg", frequency: "Once daily", duration: "7 days" }
            ],
            notes: "Stay hydrated and rest well.",
          },
          {
            id: "p2",
            date: "2023-08-22",
            doctor: "Dr. Robert Johnson",
            specialization: "Cardiology",
            diagnosis: "Hypertension",
            medications: [
              { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days" },
              { name: "Hydrochlorothiazide", dosage: "12.5mg", frequency: "Once daily", duration: "30 days" }
            ],
            notes: "Monitor blood pressure regularly. Schedule a follow-up in 30 days.",
          }
        ]);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };

    // Simulating API call to fetch consultation notes
    const fetchConsultationNotes = async () => {
      try {
        // Mocked data for consultation notes
        setConsultationNotes([
          {
            id: "c1",
            date: "2023-09-15",
            doctor: "Dr. Jane Smith",
            specialization: "General Medicine",
            subjective: "Patient complains of sore throat, runny nose, and mild fever for the past 3 days.",
            objective: {
              temperature: "99.8°F",
              pulse: "78 bpm",
              respiration: "18/min",
              bloodPressure: "122/78 mmHg",
              weight: "68 kg",
              height: "175 cm",
              generalAppearance: "Mild nasal congestion. Throat shows mild redness."
            },
            assessment: "Common cold (Viral Upper Respiratory Infection)",
            plan: {
              treatment: "Symptomatic treatment",
              medications: "Acetaminophen for fever and Loratadine for congestion",
              tests: "None required at this time",
              followUp: "Return if symptoms worsen or persist beyond 7 days",
              patientEducation: "Rest, stay hydrated, and use saline nasal spray for congestion"
            }
          },
          {
            id: "c2",
            date: "2023-08-22",
            doctor: "Dr. Robert Johnson",
            specialization: "Cardiology",
            subjective: "Patient reports occasional headaches and dizziness. No chest pain or shortness of breath.",
            objective: {
              temperature: "98.6°F",
              pulse: "82 bpm",
              respiration: "16/min",
              bloodPressure: "148/92 mmHg",
              weight: "74 kg",
              height: "170 cm",
              generalAppearance: "Alert and oriented. No acute distress."
            },
            assessment: "Hypertension, uncontrolled",
            plan: {
              treatment: "Start on antihypertensive medication",
              medications: "Lisinopril 10mg daily and Hydrochlorothiazide 12.5mg daily",
              tests: "Lipid panel, Comprehensive metabolic panel, ECG",
              followUp: "Return in 30 days to reassess",
              patientEducation: "Low sodium diet, regular exercise, daily blood pressure monitoring"
            }
          }
        ]);
      } catch (error) {
        console.error("Error fetching consultation notes:", error);
      }
    };

    if (token) {
      fetchMedicalRecords();
      fetchPrescriptions();
      fetchConsultationNotes();
    }
  }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is PDF
      if (file.type === 'application/pdf') {
        setUploadFile(file);
        setUploadFileName(file.name);
        setUploadStatus(null);
      } else {
        alert('Please upload a PDF file');
        setUploadFile(null);
        setUploadFileName("");
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    if (!recordTitle.trim()) {
      alert('Please enter a title for your medical record');
      return;
    }

    setUploadStatus('uploading');
    
    // Simulate file upload with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Mock successful upload after 100% progress
        setTimeout(() => {
          // Add the uploaded record to the list (mock implementation)
          const newRecord = {
            id: `record-${Date.now()}`,
            type: recordTitle,
            date: new Date().toISOString().split('T')[0],
            doctor: "Self-uploaded",
            notes: "Personal medical record",
            file: URL.createObjectURL(uploadFile),
            fileName: uploadFileName
          };
          
          setMedicalRecords(prev => [newRecord, ...prev]);
          setUploadStatus('success');
          setUploadFile(null);
          setUploadFileName("");
          setRecordTitle("");
          setUploadProgress(0);
          
          // Reset after 3 seconds
          setTimeout(() => {
            setUploadStatus(null);
          }, 3000);
        }, 500);
      }
    }, 300);
  };

  const cancelUpload = () => {
    setUploadFile(null);
    setUploadFileName("");
    setRecordTitle("");
    setUploadStatus(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderUploadForm = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <FaUpload className="mr-2 text-blue-600" />
          Upload Medical Record
        </h3>
        
        <form onSubmit={handleUpload}>
          <div className="mb-3">
            <label htmlFor="recordTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Record Title
            </label>
            <input
              type="text"
              id="recordTitle"
              value={recordTitle}
              onChange={(e) => setRecordTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Blood Test Results, X-Ray Report"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-1">
              Select PDF File
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="fileUpload"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
              >
                Choose File
              </button>
              <span className="ml-3 text-sm text-gray-500">
                {uploadFileName ? uploadFileName : "No file chosen"}
              </span>
              {uploadFileName && (
                <button 
                  type="button" 
                  onClick={cancelUpload}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
          
          {uploadStatus === 'uploading' && (
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <div className="mb-3 text-green-600 flex items-center">
              <FaCheck className="mr-1" />
              Record uploaded successfully!
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!uploadFile || uploadStatus === 'uploading'}
              className={`px-4 py-2 rounded-md text-white flex items-center ${
                !uploadFile || uploadStatus === 'uploading'
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <FaUpload className="mr-2" />
              Upload Record
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "records":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaFileAlt className="mr-2 text-blue-600" />
              My Medical Records
            </h2>
            
            {/* Upload Form */}
            {renderUploadForm()}
            
            {medicalRecords.length > 0 ? (
              <ul className="space-y-4">
                {medicalRecords.map((record) => (
                  <li key={record.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    <p><strong>Record Type:</strong> {record.type}</p>
                    <p><strong>Date:</strong> {record.date}</p>
                    <p><strong>Doctor:</strong> {record.doctor}</p>
                    <p><strong>Notes:</strong> {record.notes}</p>
                    {record.file ? (
                      <a href={record.file} download={record.fileName || "medical_record.pdf"} className="text-blue-500 flex items-center mt-2 hover:underline">
                        <FaDownload className="mr-1" /> Download File
                      </a>
                    ) : (
                      <p className="text-red-500"><strong>No File Available</strong></p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 border rounded-lg bg-white">No medical records found.</p>
            )}
          </>
        );
      case "prescriptions":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaFilePrescription className="mr-2 text-green-600" />
              My Prescriptions
            </h2>
            {prescriptions.length > 0 ? (
              <ul className="space-y-4">
                {prescriptions.map((prescription) => (
                  <li key={prescription.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-lg font-semibold">{prescription.diagnosis}</p>
                        <p className="text-gray-600">{prescription.date}</p>
                      </div>
                      <button 
                        className="text-blue-600 flex items-center hover:text-blue-800"
                        onClick={() => alert("Downloading PDF...")}
                      >
                        <FaFilePdf className="mr-1" /> PDF
                      </button>
                    </div>
                    <div className="mt-3">
                      <p><strong>Doctor:</strong> {prescription.doctor} ({prescription.specialization})</p>
                      <p className="mt-2"><strong>Medications:</strong></p>
                      <ul className="list-disc pl-5 mt-1">
                        {prescription.medications.map((med, idx) => (
                          <li key={idx}>
                            <strong>{med.name}</strong> {med.dosage}, {med.frequency}, for {med.duration}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2"><strong>Notes:</strong> {prescription.notes}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 border rounded-lg bg-white">No prescriptions found.</p>
            )}
          </>
        );
      case "consultations":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaNotesMedical className="mr-2 text-red-600" />
              My Consultation Notes
            </h2>
            {consultationNotes.length > 0 ? (
              <ul className="space-y-4">
                {consultationNotes.map((consultation) => (
                  <li key={consultation.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-lg font-semibold">{consultation.assessment}</p>
                        <p className="text-gray-600">{consultation.date}</p>
                      </div>
                      <button 
                        className="text-blue-600 flex items-center hover:text-blue-800"
                        onClick={() => alert("Downloading PDF...")}
                      >
                        <FaFilePdf className="mr-1" /> PDF
                      </button>
                    </div>
                    <div className="mt-3">
                      <p><strong>Doctor:</strong> {consultation.doctor} ({consultation.specialization})</p>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium border-b pb-1 mb-2">Subjective</p>
                          <p>{consultation.subjective}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium border-b pb-1 mb-2">Objective</p>
                          <ul className="space-y-1">
                            <li><strong>Temperature:</strong> {consultation.objective.temperature}</li>
                            <li><strong>Pulse:</strong> {consultation.objective.pulse}</li>
                            <li><strong>Blood Pressure:</strong> {consultation.objective.bloodPressure}</li>
                            <li><strong>Appearance:</strong> {consultation.objective.generalAppearance}</li>
                          </ul>
                        </div>
                        
                        <div>
                          <p className="font-medium border-b pb-1 mb-2">Assessment</p>
                          <p>{consultation.assessment}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium border-b pb-1 mb-2">Plan</p>
                          <ul className="space-y-1">
                            <li><strong>Treatment:</strong> {consultation.plan.treatment}</li>
                            <li><strong>Medications:</strong> {consultation.plan.medications}</li>
                            <li><strong>Follow-up:</strong> {consultation.plan.followUp}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 border rounded-lg bg-white">No consultation notes found.</p>
            )}
          </>
        );
      default:
        return <p>Unknown tab selected.</p>;
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-6">
        <div className="flex items-center mb-6">
          <img
            src={user?.photo || "https://accounts.practo.com/profile_picture/22269865/medium_thumbnail"}
            alt="User"
            className="w-16 h-16 rounded-lg border-2 border-gray-300"
          />
          <div className="ml-3">
            <p className="font-semibold">{user?.UserName || "User"}</p>
            <p className="text-sm text-gray-500">{user?.Mobile || "No Mobile Number"}</p>
          </div>
        </div>
        <ul className="space-y-3">
          <li><Link to="/my-appointments" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Appointments</Link></li>
          <li><Link to="/my-tests" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Tests</Link></li>
          <li><Link to="/my-medical-records" className="block py-2 px-3 rounded-lg hover:bg-gray-200 font-bold">My Medical Records</Link></li>
          <li><Link to="/my-online-consultations" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Online Consultations</Link></li>
          <li><Link to="/my-feedback" className="block py-2 px-3 rounded-lg hover:bg-gray-200">My Feedback</Link></li>
          <li><Link to="/profile" className="block py-2 px-3 rounded-lg hover:bg-gray-200">View / Update Profile</Link></li>
          <li><Link to="/payments" className="block py-2 px-3 rounded-lg hover:bg-gray-200">Payments</Link></li>
          <li><Link to="/settings" className="block py-2 px-3 rounded-lg hover:bg-gray-200">Settings</Link></li>
          <li><button className="w-full text-left py-2 px-3 text-red-500 hover:bg-gray-200">Logout</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6 bg-gray-50 overflow-y-auto">
        {/* Tab Navigation */}
        <div className="mb-6 flex border-b">
          <button
            className={`py-2 px-4 font-medium flex items-center ${
              activeTab === "records" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("records")}
          >
            <FaFileAlt className="mr-2" />
            Medical Records
          </button>
          <button
            className={`py-2 px-4 font-medium flex items-center ${
              activeTab === "prescriptions" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("prescriptions")}
          >
            <FaFilePrescription className="mr-2" />
            Prescriptions
          </button>
          <button
            className={`py-2 px-4 font-medium flex items-center ${
              activeTab === "consultations" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("consultations")}
          >
            <FaNotesMedical className="mr-2" />
            Consultation Notes
          </button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MyMedicalRecords;