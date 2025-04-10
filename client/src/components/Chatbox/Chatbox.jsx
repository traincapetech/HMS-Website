import React, { useState, useEffect, useRef } from 'react';

// You'll need to replace this import with your actual data file
// The enhanced data structure is provided in the next artifact
import data from "./medical-chatbot-data.json";

const EnhancedMedicalChatbot = () => {
  const questions = data.questions;
  
  // State management
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState('default'); // 'default', 'dark', or 'pastel'
  const [contactData, setContactData] = useState(null);
  const [processingContactData, setProcessingContactData] = useState(false);
  const [symptomAssessment, setSymptomAssessment] = useState(null);
  
  // Refs
  const chatInitialized = useRef(false);
  const messagesEndRef = useRef(null);
  
  // Function to simulate typing effect for bot messages
  const addBotMessageWithTypingEffect = (message) => {
    setIsTyping(true);
    
    // Simulate typing with delay proportional to message length
    const typingDelay = Math.min(Math.max(message.text.length * 20, 500), 1500);
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { ...message, sender: 'bot' }]);
      setIsTyping(false);
    }, typingDelay);
  };
  
  // Function to redirect to appointment booking page
  const redirectToAppointmentPage = (action) => {
    // Close the chat
    setIsChatOpen(false);
    
    // Redirect based on action type
    if (action === "contact_doctor") {
      // Redirect to the doctor contact page
      window.location.href = '/doctor';
    } else {
      // Default to video consultation for appointment booking
      window.location.href = '/video';
    }
  };
  
  // Process AI-based responses with enhanced features
  const processAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Contact information collection mode - detects phone numbers and emails
    if (processingContactData) {
      // Simple regex to detect phone numbers and email addresses
      const phoneRegex = /(\d{3}[-.\s]??\d{3}[-.\s]??\d{4}|\d{10})/g;
      const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
      
      const phoneMatch = userMessage.match(phoneRegex);
      const emailMatch = userMessage.match(emailRegex);
      
      if (phoneMatch || emailMatch) {
        // Store the contact information
        const newContactData = {
          phone: phoneMatch ? phoneMatch[0] : (contactData?.phone || ''),
          email: emailMatch ? emailMatch[0] : (contactData?.email || ''),
          query: contactData?.query || 'General query',
          timestamp: new Date().toISOString()
        };
        
        setContactData(newContactData);
        
        // Simulate storing data in database
        console.log("STORING CONTACT DATA:", newContactData);
        
        // TODO: In a real implementation, you would send this to your backend API
        // Example:
        // await axios.post(`${API_BASE_URL}/contact/save`, newContactData);
        
        // Response after saving contact info
        setTimeout(() => {
          setChatHistory(prev => [
            ...prev,
            {
              sender: 'bot',
              text: `Thank you for providing your contact information. One of our healthcare professionals will reach out to you soon regarding your ${newContactData.query}.\n\nIs there anything else you'd like to know about our services?`,
              isAI: true,
              options: [
                { text: "Tell me about booking an appointment", nextQuestion: "contact_doctor" },
                { text: "Return to main menu", nextQuestion: "start" }
              ]
            }
          ]);
          setIsTyping(false);
          setProcessingContactData(false);
        }, 1500);
        
        return;
      } else {
        // No contact info found, ask again
        setTimeout(() => {
          setChatHistory(prev => [
            ...prev,
            {
              sender: 'bot',
              text: "I couldn't detect a valid phone number or email address. Please provide a phone number (e.g., 123-456-7890) or email address so we can contact you.",
              isAI: true
            }
          ]);
          setIsTyping(false);
        }, 1000);
        
        return;
      }
    }
    
    // Check if we're in symptom assessment mode
    if (symptomAssessment) {
      processSymptomInput(userMessage);
      return;
    }
    
    // Enhanced keyword-based medical response system
    let responseText = "I understand you have a medical question. While I can provide general information, please consult with a healthcare professional for personalized medical advice. How else can I help you today?";
    let suggestedNextQuestion = null;
    let contactRequest = false;
    let startSymptomCheck = false;
    
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Handle office contact info request
    if (lowercaseMessage.includes("call office") || lowercaseMessage.includes("office number") || 
        lowercaseMessage.includes("phone number") || lowercaseMessage.includes("contact office") ||
        lowercaseMessage.includes("call your office") || lowercaseMessage.includes("call the office")) {
      responseText = "You can reach our office at **888-555-1234**.\n\nOur hours of operation are:\nMonday-Friday: 8am-6pm\nSaturday: 9am-2pm\nSunday: Closed\n\nFor emergency situations, please call 911.";
      suggestedNextQuestion = "appointment";
    }
    
    // Medication information detection
    else if (lowercaseMessage.includes("medication") || lowercaseMessage.includes("medicine") || 
        lowercaseMessage.includes("drug") || lowercaseMessage.includes("pill") || 
        lowercaseMessage.includes("tablet") || lowercaseMessage.includes("dose") || 
        lowercaseMessage.includes("side effect")) {
      
      // Common medications detection
      if (lowercaseMessage.includes("paracetamol") || lowercaseMessage.includes("acetaminophen") || lowercaseMessage.includes("tylenol")) {
        responseText = "**Paracetamol (Acetaminophen)**: This is a pain reliever and fever reducer.\n\n**Common side effects**:\n• Rare when taken as directed\n• Nausea, stomach pain\n• Headache\n• Rash or allergic reactions (rare)\n\n**Important precautions**:\n• Do not exceed recommended dose (max 4g/day for adults)\n• Liver damage can occur with overdose or when taken with alcohol\n• May be harmful for people with liver disease\n• Should be used with caution in patients with kidney disease\n\nIf you're experiencing concerning side effects from paracetamol, please consult with a healthcare provider.";
      }
      else if (lowercaseMessage.includes("ibuprofen") || lowercaseMessage.includes("advil") || lowercaseMessage.includes("motrin")) {
        responseText = "**Ibuprofen**: This is a nonsteroidal anti-inflammatory drug (NSAID) used for pain relief, fever reduction, and reducing inflammation.\n\n**Common side effects**:\n• Stomach pain, heartburn, nausea\n• Headache, dizziness\n• Mild allergic reactions\n• Increased risk of bleeding\n\n**Important precautions**:\n• Take with food to reduce stomach irritation\n• Not recommended for people with heart conditions or kidney disease\n• Can increase risk of heart attack, stroke, and stomach/intestinal bleeding\n• Should not be taken during late pregnancy\n\nIf you're experiencing concerning side effects from ibuprofen, please consult with a healthcare provider.";
      }
      else if (lowercaseMessage.includes("aspirin")) {
        responseText = "**Aspirin**: This is a nonsteroidal anti-inflammatory drug (NSAID) used for pain relief, fever reduction, inflammation, and prevention of blood clots.\n\n**Common side effects**:\n• Stomach irritation, heartburn, nausea\n• Increased risk of bleeding\n• Ringing in the ears at high doses\n• Allergic reactions\n\n**Important precautions**:\n• Should not be given to children due to risk of Reye's syndrome\n• Take with food to reduce stomach irritation\n• Can interact with many medications\n• People with asthma, nasal polyps, or bleeding disorders should avoid aspirin\n\nIf you're experiencing concerning side effects from aspirin, please consult with a healthcare provider.";
      }
      else if (lowercaseMessage.includes("antibiotic") || lowercaseMessage.includes("amoxicillin") || lowercaseMessage.includes("penicillin") || lowercaseMessage.includes("azithromycin")) {
        responseText = "**Antibiotics**: Medications used to treat bacterial infections. Common ones include amoxicillin, azithromycin, and ciprofloxacin.\n\n**Common side effects**:\n• Diarrhea, nausea, vomiting\n• Rash or allergic reactions\n• Yeast infections\n• Digestive issues\n\n**Important precautions**:\n• Always complete the full prescribed course\n• Take as directed (some with food, some on empty stomach)\n• Inform your doctor of any allergies to medications\n• May reduce effectiveness of birth control pills\n• Antibiotics don't work against viral infections\n\nIf you're experiencing concerning side effects from antibiotics, please consult with a healthcare provider.";
      }
      else if (lowercaseMessage.includes("statin") || lowercaseMessage.includes("cholesterol") || lowercaseMessage.includes("lipitor") || lowercaseMessage.includes("atorvastatin") || lowercaseMessage.includes("simvastatin")) {
        responseText = "**Statins**: Medications used to lower cholesterol levels. Examples include atorvastatin (Lipitor), simvastatin (Zocor), and rosuvastatin (Crestor).\n\n**Common side effects**:\n• Muscle pain, tenderness, or weakness\n• Liver enzyme elevation\n• Headache\n• Digestive issues\n• Rash\n\n**Important precautions**:\n• Regular liver function monitoring may be needed\n• Report unexplained muscle pain to your doctor\n• May interact with grapefruit juice and certain medications\n• May slightly increase risk of diabetes\n\nIf you're experiencing concerning side effects from statins, please consult with a healthcare provider.";
      }
      else if (lowercaseMessage.includes("blood pressure") || lowercaseMessage.includes("hypertension") || lowercaseMessage.includes("lisinopril") || lowercaseMessage.includes("amlodipine") || lowercaseMessage.includes("metoprolol")) {
        responseText = "**Blood Pressure Medications**: Several classes exist, including ACE inhibitors (lisinopril), calcium channel blockers (amlodipine), beta-blockers (metoprolol), and diuretics.\n\n**Common side effects** (vary by medication class):\n• Dizziness, headache\n• Fatigue\n• Swelling in ankles/feet\n• Persistent dry cough (ACE inhibitors)\n• Frequent urination (diuretics)\n\n**Important precautions**:\n• Don't stop taking abruptly\n• Monitor blood pressure regularly\n• May cause dizziness when standing up quickly\n• Some interact with certain foods or supplements\n\nIf you're experiencing concerning side effects from blood pressure medications, please consult with a healthcare provider.";
      }
      else {
        responseText = "For information about specific medications, including side effects and precautions, it's best to consult with a healthcare provider or pharmacist. They can provide personalized advice based on your medical history and current medications.\n\nSome general medication precautions include:\n• Always take medications as prescribed\n• Be aware of potential interactions with other drugs\n• Report any unusual side effects to your healthcare provider\n• Keep all medications out of reach of children\n• Check expiration dates\n\nWould you like to ask about a specific medication?";
      }
      
      // Add a suggestion to contact a pharmacist
      responseText += "\n\nFor personalized advice about medications, our pharmacists are available for consultation. Would you like to schedule a pharmacy consultation?";
      suggestedNextQuestion = "medication_consultation";
    }
    
    // TAMD Coins information
    else if (lowercaseMessage.includes("tamd coin") || lowercaseMessage.includes("rewards") || lowercaseMessage.includes("loyalty")) {
      responseText = "TAMD Coins are our loyalty rewards program. You earn coins with each visit and service, which can be redeemed for discounts on future appointments, lab tests, and medications.\n\n• Regular visits: 100 coins\n• Specialist referrals: 50 coins\n• Annual check-ups: 200 coins\n• Completing health surveys: 25 coins\n\n500 coins = $25 discount on services\nYou can check your coin balance in your patient portal.";
    }
    
    // Booking process information
    else if (lowercaseMessage.includes("book") || lowercaseMessage.includes("appointment") || lowercaseMessage.includes("schedule")) {
      responseText = "Our appointment booking process is simple:\n\n1. Select your preferred doctor or specialty from our directory\n2. Choose an available date and time\n3. Fill in your details or log in to your account\n4. Upload any relevant medical records (optional)\n5. Confirm your appointment\n\nYou'll receive an email and text confirmation, and can manage appointments through your patient portal. Would you like me to help you schedule an appointment now?";
      suggestedNextQuestion = "contact_doctor";
      contactRequest = true;
    }
    
    // Health records upload
    else if (lowercaseMessage.includes("record") || lowercaseMessage.includes("upload") || lowercaseMessage.includes("document")) {
      responseText = "You can upload your health records and medical documents in several ways:\n\n1. Through your patient portal: Log in and select 'Documents' → 'Upload'\n2. During appointment booking: There's an upload option in the appointment form\n3. Email to records@totalaccessmd.net (securely encrypted)\n\nWe accept PDF, JPG, and PNG formats up to 20MB per file. Your records help our doctors provide better care by understanding your medical history.";
    }
    
    // Doctor availability
    else if (lowercaseMessage.includes("doctor") && (lowercaseMessage.includes("available") || lowercaseMessage.includes("schedule") || lowercaseMessage.includes("when"))) {
      responseText = "Our doctors have varying availability based on their specialties:\n\n• Primary Care: Monday-Friday 8am-5pm, Saturday 9am-1pm\n• Specialists: Schedule varies, check the doctor's profile\n• Urgent Care: 7 days a week, 7am-9pm\n• Telehealth: Extended hours including evenings\n\nYou can see real-time availability in our booking system. Would you like to check doctor availability now?";
      suggestedNextQuestion = "contact_doctor";
      contactRequest = true;
    }
    
    // Symptom checker initiation
    else if (lowercaseMessage.includes("symptom") || lowercaseMessage.includes("not feeling well") || lowercaseMessage.includes("sick") || lowercaseMessage.includes("pain") || lowercaseMessage.includes("hurt")) {
      responseText = "I can help assess your symptoms with our AI-powered symptom checker. This tool is for informational purposes only and doesn't replace professional medical advice.\n\nTo begin a symptom assessment, please describe your main symptom or concern briefly.";
      startSymptomCheck = true;
    }
    
    // Common symptoms and conditions (keeping the existing ones and adding more)
    else if (lowercaseMessage.includes("headache") || lowercaseMessage.includes("head pain") || lowercaseMessage.includes("migraine")) {
      responseText = "Headaches can range from mild to severe and have many causes. If you're experiencing a severe, sudden headache, persistent headaches, or headache with fever, confusion, stiff neck, seizures, double vision, weakness, numbness, or difficulty speaking, please seek immediate medical attention. For recurrent headaches, our specialists can help evaluate and treat the underlying cause.";
      suggestedNextQuestion = "pain_symptoms";
    } 
    else if (lowercaseMessage.includes("fever") || lowercaseMessage.includes("temperature")) {
      responseText = "Fever (temperature above 100.4°F or 38°C) is often a sign that your body is fighting an infection. For adults, a fever is generally not dangerous unless it reaches 103°F (39.4°C) or higher. For infants and toddlers, even slight fevers may indicate serious infection. If the fever is accompanied by severe headache, unusual skin rash, stiff neck, or persistent vomiting, medical attention is recommended.";
      suggestedNextQuestion = "fever_symptoms";
    }
    else if (lowercaseMessage.includes("cough") || lowercaseMessage.includes("phlegm")) {
      responseText = "Coughs can be caused by viral infections, allergies, asthma, or more serious conditions. A persistent cough lasting more than 3 weeks, coughing up blood, or cough with shortness of breath should be evaluated by a healthcare provider. Our providers can help determine the cause and appropriate treatment for your cough.";
      suggestedNextQuestion = "respiratory_symptoms";
    }
    else if (lowercaseMessage.includes("chest pain") || lowercaseMessage.includes("chest pressure")) {
      responseText = "⚠️ Chest pain or pressure, especially if severe or accompanied by pain radiating to the arm, jaw, or back, shortness of breath, nausea, or lightheadedness could indicate a heart attack or other serious condition requiring immediate medical attention. Please call 911 or go to the nearest emergency room immediately.";
      suggestedNextQuestion = "cardiac_emergency";
    }
    else if (lowercaseMessage.includes("diabetes") || lowercaseMessage.includes("blood sugar")) {
      responseText = "Diabetes is a chronic condition affecting how your body processes blood glucose. Common symptoms include increased thirst/urination, extreme hunger, unexplained weight loss, fatigue, and blurred vision. If you're concerned about diabetes, we recommend screening through blood tests. Our specialists can help with diagnosis, treatment, and management of all types of diabetes.";
      suggestedNextQuestion = "diabetes_info";
    }
    else if (lowercaseMessage.includes("blood pressure") || lowercaseMessage.includes("hypertension")) {
      responseText = "Healthy blood pressure is generally considered below 120/80 mmHg. Hypertension (high blood pressure) often has no symptoms but can lead to serious health problems like heart disease and stroke. Regular monitoring, lifestyle modifications, and sometimes medication are essential for management. Our providers can help evaluate and treat high blood pressure.";
      suggestedNextQuestion = "heart_info";
    }
    else if (lowercaseMessage.includes("pregnancy") || lowercaseMessage.includes("pregnant")) {
      responseText = "Congratulations on your pregnancy or considering starting a family. Prenatal care is essential for a healthy pregnancy. We recommend scheduling an appointment with our obstetrics team as soon as possible to begin prenatal care, discuss nutrition, supplements, and create a care plan for your pregnancy journey.";
      suggestedNextQuestion = "appointment";
    }
    else if (lowercaseMessage.includes("rash") || lowercaseMessage.includes("skin") || lowercaseMessage.includes("itching")) {
      responseText = "Skin rashes can have many causes including allergies, infections, autoimmune conditions, or reactions to medications. If you're experiencing a widespread rash, rapidly spreading rash, fever with rash, painful rash, or signs of infection, please seek medical attention. Our dermatology team can help diagnose and treat skin conditions.";
      suggestedNextQuestion = "skin_symptoms";
    }
    else if (lowercaseMessage.includes("weight") || lowercaseMessage.includes("obesity") || lowercaseMessage.includes("diet")) {
      responseText = "Maintaining a healthy weight is important for overall health. Our team offers personalized weight management programs, nutritional counseling, and medical weight loss options if appropriate. We take a comprehensive approach considering your medical history, metabolism, lifestyle, and goals.";
      suggestedNextQuestion = "lifestyle_wellness";
    }
    else if (lowercaseMessage.includes("vaccine") || lowercaseMessage.includes("vaccination") || lowercaseMessage.includes("immunization")) {
      responseText = "Vaccinations are essential for preventing serious infectious diseases. We offer all recommended vaccines for children, adolescents, and adults, including seasonal flu shots, travel vaccines, and routine immunizations. Our providers can review your vaccination history and ensure you're up-to-date with recommended immunizations.";
      suggestedNextQuestion = "immunizations";
    }
    else if (lowercaseMessage.includes("depression") || lowercaseMessage.includes("anxiety") || lowercaseMessage.includes("stress")) {
      responseText = "Mental health is an essential part of overall wellbeing. If you're experiencing symptoms of depression, anxiety, or other mental health concerns, please know that effective treatments are available. Our mental health team provides supportive, confidential care including therapy, medication management when appropriate, and referrals to specialized services.";
      suggestedNextQuestion = "mental_health";
    }
    else if (lowercaseMessage.includes("covid") || lowercaseMessage.includes("coronavirus")) {
      responseText = "We offer COVID-19 testing, vaccination, and care for patients with COVID-19. If you're experiencing symptoms like fever, cough, shortness of breath, loss of taste/smell, or have been exposed to someone with COVID-19, please call before visiting our facility so we can take appropriate precautions.";
      suggestedNextQuestion = "respiratory_symptoms";
    }
    else if (lowercaseMessage.includes("insurance") || lowercaseMessage.includes("coverage") || lowercaseMessage.includes("billing")) {
      responseText = "Our facility accepts most major insurance plans including Blue Cross, Aetna, UnitedHealthcare, Cigna, and Medicare/Medicaid. For specific questions about coverage for procedures, medications, or services, our billing department can help verify your benefits and explain any out-of-pocket costs.";
      suggestedNextQuestion = "insurance_payment";
    }
    else if (lowercaseMessage.includes("appointment") || lowercaseMessage.includes("schedule") || lowercaseMessage.includes("visit")) {
      responseText = "We're happy to help you schedule an appointment with the appropriate provider. We offer in-person visits as well as telemedicine options for many types of care. Please let us know what type of appointment you need, and we'll find a convenient time for you.";
      suggestedNextQuestion = "contact_doctor";
    }
    else if (lowercaseMessage.includes("emergency") || lowercaseMessage.includes("urgent")) {
      responseText = "If you're experiencing a medical emergency such as severe chest pain, difficulty breathing, severe bleeding, or signs of stroke, please call 911 or go to the nearest emergency room immediately. For urgent but non-life-threatening concerns, our urgent care center is available with extended hours.";
      suggestedNextQuestion = "emergency";
    }
    
    // Process the appropriate response
    setTimeout(() => {
      if (startSymptomCheck) {
        // Initialize the symptom checker
        setSymptomAssessment({
          stage: 'initial', 
          symptoms: [],
          duration: null,
          severity: null
        });
        
        setChatHistory(prev => [
          ...prev,
          { 
            sender: 'bot', 
            text: responseText,
            isAI: true
          }
        ]);
      }
      else if (contactRequest) {
        setChatHistory(prev => [
          ...prev,
          { 
            sender: 'bot', 
            text: responseText,
            isAI: true,
            options: suggestedNextQuestion ? [
              { text: "Tell me more about this", nextQuestion: suggestedNextQuestion },
              { text: "I need to speak with a provider", nextQuestion: "appointment" },
              { text: "Return to main menu", nextQuestion: "start" }
            ] : [
              { text: "I need to speak with a provider", nextQuestion: "appointment" },
              { text: "Return to main menu", nextQuestion: "start" }
            ]
          }
        ]);
        
        // Only activate contact collection if no direct option was selected
        if (!suggestedNextQuestion) {
          setProcessingContactData(true);
          setContactData({ query: lowercaseMessage.includes("book") ? "Appointment Booking" : "General Query" });
          
          // Ask for contact info after a brief delay
          setTimeout(() => {
            setChatHistory(prev => [
              ...prev,
              { 
                sender: 'bot', 
                text: "Please provide your phone number or email address so we can contact you regarding your request.",
                isAI: true
              }
            ]);
          }, 1000);
        }
      }
      else {
        setChatHistory(prev => [
          ...prev,
          { 
            sender: 'bot', 
            text: responseText,
            isAI: true,
            options: suggestedNextQuestion ? [
              { text: "Tell me more about this", nextQuestion: suggestedNextQuestion },
              { text: "I need to speak with a provider", nextQuestion: "appointment" },
              { text: "Return to main menu", nextQuestion: "start" }
            ] : [
              { text: "I need to speak with a provider", nextQuestion: "appointment" },
              { text: "Return to main menu", nextQuestion: "start" }
            ]
          }
        ]);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  // Process symptom assessment inputs
  const processSymptomInput = (userInput) => {
    const currentStage = symptomAssessment.stage;
    const lowercaseInput = userInput.toLowerCase();
    
    // Update symptom assessment based on current stage
    let updatedAssessment = { ...symptomAssessment };
    let responseText = '';
    
    switch (currentStage) {
      case 'initial':
        // Collect the main symptom
        updatedAssessment.symptoms.push(userInput);
        updatedAssessment.stage = 'duration';
        responseText = `I see you're experiencing ${userInput}. How long have you been experiencing this symptom?`;
        break;
        
      case 'duration':
        // Collect duration information
        updatedAssessment.duration = userInput;
        updatedAssessment.stage = 'severity';
        responseText = "On a scale of 1-10, how would you rate the severity of your symptoms (with 10 being the most severe)?";
        break;
        
      case 'severity':
        // Collect severity rating
        updatedAssessment.severity = userInput;
        updatedAssessment.stage = 'additional';
        responseText = "Do you have any additional symptoms or medical conditions we should know about?";
        break;
        
      case 'additional':
        // Collect additional information and provide assessment
        updatedAssessment.additionalInfo = userInput;
        updatedAssessment.stage = 'complete';
        
        // Generate assessment based on collected information
        let assessmentText = generateSymptomAssessment(updatedAssessment);
        responseText = assessmentText;
        break;
        
      default:
        // Reset assessment if we reach an unknown stage
        setSymptomAssessment(null);
        responseText = "I apologize, but there was an issue with the symptom assessment. Let's start over. What can I help you with today?";
    }
    
    // Save the updated assessment
    setSymptomAssessment(updatedAssessment);
    
    // Display response to user
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        { 
          sender: 'bot', 
          text: responseText,
          isAI: true,
          options: updatedAssessment.stage === 'complete' ? [
            { text: "Schedule an appointment", action: "redirect_appointment" },
            { text: "Return to main menu", nextQuestion: "start" }
          ] : null
        }
      ]);
      
      // Reset assessment when complete
      if (updatedAssessment.stage === 'complete') {
        setSymptomAssessment(null);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  // Generate a symptom assessment based on collected data
  const generateSymptomAssessment = (assessment) => {
    const mainSymptom = assessment.symptoms[0].toLowerCase();
    const severityLevel = parseInt(assessment.severity) || 5;
    
    let urgencyLevel = "moderate";
    let recommendedAction = "schedule an appointment with one of our healthcare providers for a proper evaluation";
    let possibleConditions = [];
    
    // Determine urgency level based on symptoms and severity
    if (severityLevel >= 8) {
      urgencyLevel = "high";
      recommendedAction = "seek immediate medical attention";
    } else if (severityLevel <= 3 && !assessment.additionalInfo.includes("fever") && !assessment.additionalInfo.includes("breath")) {
      urgencyLevel = "low";
      recommendedAction = "monitor your symptoms and schedule a regular appointment if they persist";
    }
    
    // Generate possible conditions based on main symptom
    if (mainSymptom.includes("headache") || mainSymptom.includes("head pain")) {
      possibleConditions = ["tension headache", "migraine", "sinus infection"];
      if (severityLevel >= 8 || assessment.additionalInfo.includes("neck") || assessment.additionalInfo.includes("vomit")) {
        urgencyLevel = "high";
        possibleConditions.push("meningitis", "stroke");
        recommendedAction = "seek immediate medical attention";
      }
    } else if (mainSymptom.includes("chest pain") || mainSymptom.includes("chest")) {
      urgencyLevel = "high";
      possibleConditions = ["heart attack", "angina", "pulmonary embolism", "costochondritis"];
      recommendedAction = "seek immediate medical attention";
    } else if (mainSymptom.includes("cough") || mainSymptom.includes("breath")) {
      possibleConditions = ["common cold", "bronchitis", "asthma", "allergies"];
      if (severityLevel >= 7 || assessment.additionalInfo.includes("breath") || assessment.additionalInfo.includes("blue")) {
        urgencyLevel = "high";
        possibleConditions.push("pneumonia", "COVID-19");
        recommendedAction = "seek immediate medical attention";
      }
    } else if (mainSymptom.includes("stomach") || mainSymptom.includes("abdomen") || mainSymptom.includes("nausea")) {
      possibleConditions = ["gastritis", "food poisoning", "indigestion", "irritable bowel syndrome"];
      if (severityLevel >= 8 || assessment.additionalInfo.includes("severe") || assessment.additionalInfo.includes("vomit blood")) {
        urgencyLevel = "high";
        possibleConditions.push("appendicitis", "intestinal obstruction");
        recommendedAction = "seek immediate medical attention";
      }
    } else {
      possibleConditions = ["various conditions requiring professional diagnosis"];
    }
    
    // Construct response
    let response = `Based on the information you've provided about your ${mainSymptom} that has lasted ${assessment.duration} with a severity of ${assessment.severity}/10, this appears to be a ${urgencyLevel} urgency situation.\n\n`;
    
    response += `Possible conditions that might cause these symptoms include: ${possibleConditions.join(", ")}. However, please note that this is not a diagnosis.\n\n`;
    
    response += `Recommendation: I recommend you ${recommendedAction}.\n\n`;
    
    if (urgencyLevel === "high") {
      response += "⚠️ IMPORTANT: The symptoms you've described may indicate a serious medical condition requiring prompt attention. Please don't delay seeking medical care.\n\n";
    }
    
    response += "Would you like to schedule an appointment with one of our healthcare providers?";
    
    return response;
  };

  // Initialize chat when component mounts or when chat is opened
  useEffect(() => {
    if (isChatOpen && !chatInitialized.current) {
      setCurrentQuestion(questions.start);
      
      // Add initial message with typing effect
      addBotMessageWithTypingEffect({
        text: questions.start.text,
        options: questions.start.options
      });
      
      chatInitialized.current = true;
    }
  }, [isChatOpen]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    // Add user selection to chat history
    setChatHistory([
      ...chatHistory,
      { sender: 'user', text: option.text }
    ]);
    
    // Check if this is an appointment booking or doctor contact request
    if (option.text.toLowerCase().includes("schedule") && option.text.toLowerCase().includes("appointment") || 
        option.nextQuestion === "appointment") {
      
      // Add a message indicating redirection
      setChatHistory(prev => [
        ...prev,
        { 
          sender: 'bot', 
          text: "Great! I'll redirect you to our appointment booking page now...",
          isAI: true
        }
      ]);
      
      // Redirect after a short delay to allow the message to be seen
      setTimeout(() => {
        redirectToAppointmentPage("appointment");
      }, 1500);
      
      return;
    }
    
    // Check if this is a doctor contact request
    if ((option.text.toLowerCase().includes("doctor") && (
          option.text.toLowerCase().includes("contact") || 
          option.text.toLowerCase().includes("speak") || 
          option.text.toLowerCase().includes("talk") ||
          option.text.toLowerCase().includes("need"))) || 
        option.nextQuestion === "contact_doctor") {
      
      // Add a message indicating redirection
      setChatHistory(prev => [
        ...prev,
        { 
          sender: 'bot', 
          text: "I'll connect you with our doctors now...",
          isAI: true
        }
      ]);
      
      // Redirect after a short delay to allow the message to be seen
      setTimeout(() => {
        redirectToAppointmentPage("contact_doctor");
      }, 1500);
      
      return;
    }
    
    // Get next question for non-redirection options
    const nextQuestion = questions[option.nextQuestion];
    
    // Add bot response to chat history with typing effect
    addBotMessageWithTypingEffect({ 
      text: nextQuestion.text,
      options: nextQuestion.options,
      freeText: nextQuestion.freeText,
      isEnd: nextQuestion.isEnd
    });
    
    // Set current question
    setCurrentQuestion(nextQuestion);
  };

  // Handle free text input with AI integration
  const handleFreeTextSubmit = (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user input to chat history
    setChatHistory([
      ...chatHistory,
      { sender: 'user', text: userInput }
    ]);
    
    // Check if we're in a structured flow, AI symptom assessment, or contact collection mode
    if (currentQuestion && currentQuestion.nextQuestion && !processingContactData && !symptomAssessment) {
      // Structured flow - get next question
      const nextQuestion = questions[currentQuestion.nextQuestion];
      
      // Add bot response to chat history with typing effect
      addBotMessageWithTypingEffect({ 
        text: nextQuestion.text,
        options: nextQuestion.options,
        freeText: nextQuestion.freeText,
        isEnd: nextQuestion.isEnd
      });
      
      // Set current question
      setCurrentQuestion(nextQuestion);
    } else {
      // AI mode - process with AI
      setCurrentQuestion(null); // Exit structured flow
      setIsTyping(true);
      processAIResponse(userInput);
    }
    
    // Clear input
    setUserInput('');
  };

  // Reset chat to beginning
  const resetChat = () => {
    setChatHistory([]);
    setUserInput('');
    
    // Set directly to start question
    setCurrentQuestion(questions.start);
    
    // Add the first message with typing effect
    addBotMessageWithTypingEffect({
      text: questions.start.text,
      options: questions.start.options
    });
  };

  // Switch to AI free text mode
  const switchToAIMode = () => {
    addBotMessageWithTypingEffect({ 
      text: "I'm now in AI assistant mode. I can help with symptom assessment, booking information, TAMD coins, doctor availability, and health record uploads. What would you like to know about?",
      isAI: true
    });
    setCurrentQuestion(null);
  };

  // Toggle between themes
  const cycleTheme = () => {
    if (theme === 'default') setTheme('dark');
    else if (theme === 'dark') setTheme('pastel');
    else setTheme('default');
  };

  // Theme-based style variables
  const themeStyles = {
    default: {
      primary: 'bg-blue-600 hover:bg-blue-700',
      secondary: 'bg-blue-700 hover:bg-blue-800',
      accent: 'bg-purple-700 hover:bg-purple-800',
      chatBg: 'bg-gray-50',
      userBubble: 'bg-blue-500 text-white',
      botBubble: 'bg-gray-200 text-gray-800',
      aiBubble: 'bg-purple-200 text-purple-900',
      header: 'bg-blue-600 text-white',
      inputBorder: 'focus:ring-blue-500'
    },
    dark: {
      primary: 'bg-gray-800 hover:bg-gray-900',
      secondary: 'bg-gray-700 hover:bg-gray-800',
      accent: 'bg-indigo-700 hover:bg-indigo-800',
      chatBg: 'bg-gray-900',
      userBubble: 'bg-indigo-600 text-white',
      botBubble: 'bg-gray-700 text-gray-100',
      aiBubble: 'bg-indigo-900 text-indigo-100',
      header: 'bg-gray-800 text-white',
      inputBorder: 'focus:ring-indigo-500'
    },
    pastel: {
      primary: 'bg-teal-500 hover:bg-teal-600',
      secondary: 'bg-teal-600 hover:bg-teal-700',
      accent: 'bg-pink-500 hover:bg-pink-600',
      chatBg: 'bg-blue-50',
      userBubble: 'bg-teal-500 text-white',
      botBubble: 'bg-pink-100 text-pink-900',
      aiBubble: 'bg-purple-100 text-purple-900',
      header: 'bg-gradient-to-r from-teal-500 to-blue-500 text-white',
      inputBorder: 'focus:ring-teal-500'
    }
  };
  
  const style = themeStyles[theme];

  // Add a medication consultation option to the medical-chatbot-data.json structure at runtime
  useEffect(() => {
    if (!questions.medication_consultation) {
      questions.medication_consultation = {
        id: "medication_consultation",
        text: "Our clinical pharmacists can review your medications and answer questions about side effects, interactions, and proper usage. How would you like to proceed?",
        options: [
          { text: "Schedule a pharmacy consultation", nextQuestion: "pharmacy_appointment" },
          { text: "Ask about another medication", nextQuestion: null },
          { text: "Return to main menu", nextQuestion: "start" }
        ]
      };
    }
    
    if (!questions.pharmacy_appointment) {
      questions.pharmacy_appointment = {
        id: "pharmacy_appointment",
        text: "Please provide your contact information so our pharmacy team can schedule your consultation:",
        freeText: true,
        nextQuestion: "thankyou"
      };
    }
  }, [questions]);

  // Add call_office option to the medical-chatbot-data.json structure at runtime
  useEffect(() => {
    if (!questions.call_office) {
      questions.call_office = {
        id: "call_office",
        text: "You can reach our office at +1 (787) 949-3280.\n\nOur hours of operation are:\nMonday-Friday: 8am-6pm\nSaturday: 9am-2pm\nSunday: Closed\n\nFor emergency situations, please call 911.",
        options: [
          { text: "Schedule an appointment", action: "redirect_appointment" },
          { text: "Contact a doctor", action: "contact_doctor" },
          { text: "Return to main menu", nextQuestion: "start" }
        ]
      };
    }
    
    // Modify existing appointment-related options in questions data
    Object.keys(questions).forEach(key => {
      const question = questions[key];
      
      if (question.options) {
        question.options = question.options.map(option => {
          // If the option text mentions scheduling an appointment
          if ((option.text.toLowerCase().includes("schedule") && option.text.toLowerCase().includes("appointment")) || 
              option.nextQuestion === "appointment") {
            return { ...option, action: "redirect_appointment" };
          }
          
          // If the option text mentions contacting a doctor
          if ((option.text.toLowerCase().includes("doctor") && 
              (option.text.toLowerCase().includes("contact") || 
               option.text.toLowerCase().includes("speak") || 
               option.text.toLowerCase().includes("talk") || 
               option.text.toLowerCase().includes("need"))) || 
              option.nextQuestion === "contact_doctor") {
            return { ...option, action: "contact_doctor" };
          }
          
          return option;
        });
      }
    });
    
    // ... existing code for other question modifications ...
  }, [questions]);

  // Update handleOptionSelect to handle the action property
  useEffect(() => {
    // Create a new wrapper for handleOptionSelect that handles the action property
    const originalHandleOptionSelect = handleOptionSelect;
    
    // Override handleOptionSelect
    window.handleOptionSelect = (option) => {
      if (option.action === "redirect_appointment") {
        // Add user selection to chat history
        setChatHistory([
          ...chatHistory,
          { sender: 'user', text: option.text }
        ]);
        
        // Add a message indicating redirection
        setChatHistory(prev => [
          ...prev,
          { 
            sender: 'bot', 
            text: "Great! I'll redirect you to our appointment booking page now...",
            isAI: true
          }
        ]);
        
        // Redirect after a short delay
        setTimeout(() => {
          redirectToAppointmentPage("");
        }, 1500);
      } 
      else if (option.action === "contact_doctor") {
        // Add user selection to chat history
        setChatHistory([
          ...chatHistory,
          { sender: 'user', text: option.text }
        ]);
        
        // Add a message indicating redirection
        setChatHistory(prev => [
          ...prev,
          { 
            sender: 'bot', 
            text: "I'll connect you with our doctors now...",
            isAI: true
          }
        ]);
        
        // Redirect after a short delay
        setTimeout(() => {
          redirectToAppointmentPage("contact_doctor");
        }, 1500);
      }
      else {
        // Use the original handler for non-redirect options
        originalHandleOptionSelect(option);
      }
    };
    
    return () => {
      // Cleanup
      delete window.handleOptionSelect;
    };
  }, [chatHistory, handleOptionSelect]);

  return (
    <div className="fixed bottom-4 left-4 z-50"> {/* Changed from right-4 to left-4 */}
      {/* Chat button */}
      <div className="flex flex-col items-start space-y-2"> {/* Changed from items-end to items-start */}
        {/* Theme toggle button */}
        <button
          onClick={cycleTheme}
          className={`${style.secondary} text-white p-2 rounded-full shadow-lg focus:outline-none`}
        >
          {theme === 'default' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
        
        {/* Main chat button */}
        <button
          onClick={toggleChat}
          className={`${style.primary} text-white p-4 rounded-full shadow-lg focus:outline-none relative`}
        >
          {isChatOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
            </>
          )}
        </button>
      </div>
      
      {/* Chat container */}
      {isChatOpen && (
        <div className="absolute bottom-16 left-0 w-96 h-128 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out"> {/* Changed from right-0 to left-0 */}
          {/* Chat header */}
          <div className={`${style.header} p-4 rounded-t-lg flex justify-between items-center`}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold">Medical Support</h2>
                <p className="text-xs opacity-75">Online & Available 24/7</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={resetChat}
                className={`text-xs ${style.secondary} text-white px-2 py-1 rounded hover:bg-blue-800`}
                title="Restart conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              {/* Add AI Mode button */}
              <button 
                onClick={switchToAIMode}
                className={`text-xs ${style.accent} text-white px-2 py-1 rounded flex items-center space-x-1`}
                title="Switch to AI Assistant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>AI Mode</span>
              </button>
              <button 
                onClick={toggleChat}
                className="text-white hover:text-gray-200"
                title="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className={`flex-1 p-4 overflow-y-auto ${style.chatBg}`}>
            {chatHistory.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
                
                <div 
                  className={`max-w-3/4 p-3 rounded-lg shadow ${
                    message.sender === 'user' 
                      ? `${style.userBubble} rounded-br-none` 
                      : message.isAI 
                        ? `${style.aiBubble} rounded-bl-none`
                        : `${style.botBubble} rounded-bl-none`
                  }`}
                >
                  {/* <p className="text-sm">{message.text}</p> */}
                  <pre className="text-sm whitespace-pre-wrap">{message.text}</pre>
                  
                  {/* Render option buttons */}
                  {message.sender === 'bot' && message.options && (
                    <div className="mt-3 flex flex-col space-y-2">
                      {message.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(option)}
                          className="bg-white text-gray-800 px-3 py-2 text-sm rounded border border-gray-300 text-left hover:bg-gray-100 transition-colors duration-200 shadow-sm"
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ml-2 flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className={`p-3 rounded-lg shadow ${style.botBubble} rounded-bl-none`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* User input area */}
          <div className="border-t p-3 bg-white rounded-b-lg">
            <form onSubmit={handleFreeTextSubmit} className="flex">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={currentQuestion && !currentQuestion.freeText ? "Type to use AI assistant..." : "Type your message..."}
                className={`flex-1 p-3 text-sm border rounded-l-lg focus:outline-none focus:ring-2 ${style.inputBorder}`}
                disabled={isTyping}
              />
              <button 
                type="submit"
                className={`text-white px-4 py-2 rounded-r-lg text-sm ${isTyping ? 'bg-gray-400' : currentQuestion && !currentQuestion.freeText ? style.accent : style.primary}`}
                disabled={isTyping}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                Medical assistance available 24/7. For emergencies, please call 911.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMedicalChatbot;