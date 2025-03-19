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
  
  // Process AI-based responses
  const processAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simulate AI processing delay (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Keyword-based response system (placeholder for actual AI integration)
    let responseText = "I understand you're describing medical symptoms. For accurate medical advice, please consult with a healthcare professional. Is there anything specific you'd like to know about our services?";
    
    // Simple keyword matching for demonstration
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes("pain") || lowercaseMessage.includes("hurt")) {
      responseText = "I understand you're experiencing pain. While I can't provide specific medical advice, our doctors can help assess your condition. Would you like to schedule an appointment?";
    } else if (lowercaseMessage.includes("appointment") || lowercaseMessage.includes("schedule")) {
      responseText = "We have several appointment options available. You can book with a general practitioner or a specialist. Would you like me to help you schedule one?";
    } else if (lowercaseMessage.includes("insurance") || lowercaseMessage.includes("coverage")) {
      responseText = "We accept most major insurance plans including Blue Cross, Aetna, UnitedHealthcare, and Cigna. Would you like to speak with our billing department for specific coverage questions?";
    } else if (lowercaseMessage.includes("covid") || lowercaseMessage.includes("vaccine")) {
      responseText = "We offer COVID-19 testing and vaccination services. Our clinic follows all CDC guidelines to ensure your safety. Would you like information about scheduling a test or vaccine?";
    } else if (lowercaseMessage.includes("emergency")) {
      responseText = "If you're experiencing a medical emergency, please call 911 immediately or go to your nearest emergency room. For urgent but non-emergency issues, our urgent care center is open daily from 8am to 8pm.";
    }
    
    // Add AI response to chat history with typing effect
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        { 
          sender: 'bot', 
          text: responseText,
          isAI: true,
          options: [
            { text: "Book an appointment", nextQuestion: "appointment" },
            { text: "Return to main menu", nextQuestion: "start" }
          ]
        }
      ]);
      setIsTyping(false);
    }, 1500);
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
    
    // Get next question
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

  // Handle free text input
  const handleFreeTextSubmit = (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user input to chat history
    setChatHistory([
      ...chatHistory,
      { sender: 'user', text: userInput }
    ]);
    
    // Check if we're in a structured flow or AI mode
    if (currentQuestion && currentQuestion.nextQuestion) {
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
      text: "I'm now in AI assistant mode. Please describe your medical concern or question, and I'll do my best to help you.",
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
              {/* Removed AI assistant mode button */}
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