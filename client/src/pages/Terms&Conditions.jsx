import React from "react";
import { FaRegFileAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg my-10 border border-gray-200">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Terms & Conditions</h1>
      <p className="text-gray-600 text-center mb-4">Effective Date: 13 March 2025</p>
      
      <div className="mt-6 space-y-8">
        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegFileAlt className="mr-2 text-blue-600" /> 1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing or using Total Access MD (“Company,” “we,” “our,” or “us”), you agree to abide by these Terms & Conditions. If you do not agree, please refrain from using our services.
          </p>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegFileAlt className="mr-2 text-blue-600" /> 2. Telemedicine Services
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We provide virtual medical consultations through licensed healthcare professionals. Our services do not replace emergency medical care. In case of an emergency, call 911.
          </p>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegFileAlt className="mr-2 text-blue-600" /> 3. Eligibility
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Be at least 18 years old (or have guardian consent if under 18)</li>
            <li>Provide accurate and truthful medical history</li>
            <li>Agree to comply with HIPAA and telehealth guidelines</li>
          </ul>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegFileAlt className="mr-2 text-blue-600" /> 4. Patient Responsibilities
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Providing correct medical and contact information</li>
            <li>Following medical advice given by healthcare providers</li>
            <li>Using a secure internet connection for telehealth sessions</li>
            <li>Understanding that online consultations have limitations compared to in-person visits</li>
          </ul>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegFileAlt className="mr-2 text-blue-600" /> 5. Payment & Insurance
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Payment is required at the time of booking, unless covered by insurance.</li>
            <li>We accept credit cards, cryptocurrency, and other approved payment methods.</li>
            <li>Insurance claims will be processed according to the provider’s terms.</li>
          </ul>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegFileAlt className="mr-2 text-blue-600" /> 6. Cancellations & Refunds
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Appointments must be canceled at least 24 hours in advance for a full refund.</li>
            <li>No-shows or late cancellations may be subject to fees.</li>
          </ul>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegFileAlt className="mr-2 text-blue-600" /> 7. Privacy & Confidentiality
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We comply with HIPAA and take data protection seriously. Your medical and personal data is protected under strict security measures.
          </p>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegFileAlt className="mr-2 text-blue-600" /> 8. Use of Website & Services
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Users must not misuse, hack, or disrupt the website.</li>
            <li>AI-generated medical advice is not provided. Our telemedicine doctors personally review and diagnose each case.</li>
            <li>We do not prescribe controlled substances (e.g., opioids, benzodiazepines) through online consultations.</li>
          </ul>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegFileAlt className="mr-2 text-blue-600" /> 9. Limitation of Liability
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Total Access MD is not responsible for any misinterpretation of medical advice, service interruptions due to technical issues, or delayed diagnosis due to incomplete patient-provided information.
          </p>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegFileAlt className="mr-2 text-blue-600" /> 10. Modifications to Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to modify these Terms at any time. Continued use of our services constitutes acceptance of the changes.
          </p>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegFileAlt className="mr-2 text-blue-600" /> 11. Contact Us
          </h2>
          <p className="text-gray-600">
            For any questions about these Terms, contact us at:
            <br />
            <span className="flex items-center">
              <FaEnvelope className="mr-2 text-blue-600" />
              <a href="mailto:support@totalaccessmd.net" className="text-blue-500 hover:underline">support@totalaccessmd.net</a>
            </span>
            <span className="flex items-center">
              <FaPhoneAlt className="mr-2 text-blue-600" />
              <a href="tel:7879493280" className="text-blue-500 hover:underline">787-949-3280</a>
            </span>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;