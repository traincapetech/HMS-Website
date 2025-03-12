import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const faqs = [
    { question: "What services does TAMD Hospital provide?", answer: "TAMD Hospital offers a wide range of healthcare services, including emergency care, surgery, maternity, pediatrics, cardiology, and specialized wellness programs." },
    { question: "Do I need an appointment before visiting?", answer: "While walk-ins are welcome for emergency cases, we recommend booking an appointment online or calling our reception for better service." },
    { question: "Does TAMD Hospital accept insurance?", answer: "Yes, we accept most major insurance providers. Please check with our billing department for specific details." },
    { question: "What are the visiting hours?", answer: "General visiting hours are from 9 AM to 8 PM. However, ICU and special care unit timings may vary." },
    { question: "How can I book a telemedicine consultation?", answer: "You can schedule a telemedicine appointment via our website or mobile app by selecting your preferred doctor and available slot." },
    { question: "Is there a pharmacy inside the hospital?", answer: "Yes, our 24/7 in-house pharmacy ensures patients receive prescribed medications conveniently." },
    { question: "What should I bring for my first visit?", answer: "Please bring your ID, insurance card, and any relevant medical records." },
    { question: "Are there any special services for seniors?", answer: "Yes, we offer specialized programs and services tailored for senior patients." }
];

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <div className="relative bg-cover bg-center h-72 flex items-center justify-center" style={{ backgroundImage: `url('/images/hospital-faq.jpg')` }}>
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <h1 className="text-4xl font-extrabold text-white relative z-10">FAQ's (Frequently Asked Questions)</h1>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto my-12 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Common Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-300 pb-4">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className={`w-full flex justify-between items-center p-4 text-lg font-semibold text-gray-700 bg-gray-200 rounded-md focus:outline-none hover:bg-gray-300 transition duration-200 ease-in-out ${openIndex === index ? 'bg-gray-300' : ''}`}
                            >
                                {faq.question}
                                {openIndex === index ? <FaMinus className="text-blue-600" /> : <FaPlus className="text-blue-600" />}
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-40' : 'max-h-0'}`}>
                                {openIndex === index && <p className="p-4 text-gray-600 bg-gray-100 rounded-md">{faq.answer}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Section */}
            <div className="bg-blue-600 text-white py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                <p className="mb-6 text-lg">Feel free to reach out to our support team for any additional information.</p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition duration-200 ease-in-out">Contact Us</button>
            </div>
        </div>
    );
};

export default FAQPage;