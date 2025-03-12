import React from "react";
import { FaShieldAlt, FaUserShield, FaLock, FaClipboardList, FaRegAddressCard } from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg my-10 border border-gray-200">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Privacy Policy</h1>
      <p className="text-gray-600 text-center mb-4">Effective Date: 13 March 2025</p>
      
      <div className="mt-6 space-y-8">
        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaShieldAlt className="mr-2 text-blue-600" /> 1. Introduction
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to <strong>Total Access MD</strong>. We are committed to protecting your personal and health information while providing telemedicine services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
          </p>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaUserShield className="mr-2 text-blue-600" /> 2. Information We Collect
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Personal Information:</strong> Name, DOB, Contact, Insurance, Payment Details.</li>
            <li><strong>Health Information (PHI):</strong> Medical History, Symptoms, Prescriptions, Physician Notes.</li>
            <li><strong>Automatically Collected:</strong> IP Address, Browser Data, Cookies.</li>
          </ul>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaLock className="mr-2 text-blue-600" /> 3. How We Use Your Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We use your data to provide telemedicine services, process payments, schedule appointments, and ensure compliance with healthcare regulations. <strong>We do not sell or rent your data.</strong>
          </p>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaClipboardList className="mr-2 text-blue-600" /> 4. Information Sharing & Disclosure
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Your information may be shared with healthcare providers, insurance companies, legal authorities, and third-party service providers (secured under HIPAA agreements).
          </p>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegAddressCard className="mr-2 text-blue-600" /> 5. Your Rights & Choices
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Access, update, or delete your information.</li>
            <li>Request a copy of health records.</li>
            <li>Withdraw consent for data collection.</li>
            <li>File a complaint if data is misused.</li>
          </ul>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaShieldAlt className="mr-2 text-blue-600" /> 6. Security Measures
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We follow HIPAA-compliant security measures including encryption, access control, and regular audits.
          </p>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaClipboardList className="mr-2 text-blue-600" /> 7. Cookies & Tracking
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our website uses cookies to improve functionality. You can disable them in your browser settings, but some services may be affected.
          </p>
        </section>

        <section className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaRegAddressCard className="mr-2 text-blue-600" /> 8. Contact Us
          </h2>
          <p className="text-gray-600">
            Email: <a href="mailto:privacy@totalaccessmd.net" className="text-blue-500 hover:underline">privacy@totalaccessmd.net</a>
            <br /> Phone: <a href="tel:7879493280" className="text-blue-500 hover:underline">787-949-3280</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;