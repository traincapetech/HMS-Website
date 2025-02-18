import React from "react";
//import WritingImage from "../assets/writing.jpg"; // Replace with actual image path
import ExpertiseImage from "../assets/expertise.webp";
import InspireImage from "../assets/inspire.jpg";
import EducateImage from "../assets/educate.webp";
import EditorImage from "../assets/editor.jpg";
import PractoProImage from "../assets/TAMD.png";

const PractoHealthFeed = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <section className="py-16 px-6 text-center bg-blue-100">
                <h1 className="text-4xl font-bold text-blue-700">Write. Educate. Inspire</h1>
                <p className="text-lg text-gray-700 mt-4 max-w-3xl mx-auto">
                    Health Feed is a medium for doctors and health experts to publish health tips and articles to connect with millions of people.
                </p>
                <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
                    Start Writing
                </button>
            </section>

            {/* How it Helps - Share Expertise */}
            <section className="py-16 px-6 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold text-blue-700">Share Your Expertise</h2>
                    <p className="text-lg mt-4 text-gray-700">
                        As an expert, you can share your knowledge with millions of health and fitness enthusiasts.
                    </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img src={ExpertiseImage} alt="Expertise" className="rounded-lg shadow-lg w-3/4 md:w-2/3 h-auto max-h-80" />
                </div>
            </section>

            {/* Inspire People */}
            <section className="py-16 px-6 flex flex-col md:flex-row-reverse items-center bg-gray-100">
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold text-blue-700">Inspire People</h2>
                    <p className="text-lg mt-4 text-gray-700">
                        Everything that you publish on Health Feed will inspire someone to live healthier and longer.
                    </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img src={InspireImage} alt="Inspire" className="rounded-lg shadow-lg w-3/4 md:w-2/3 h-auto max-h-80" />
                </div>
            </section>

            {/* Educate and Engage */}
            <section className="py-16 px-6 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold text-blue-700">Educate & Engage</h2>
                    <p className="text-lg mt-4 text-gray-700">
                        It’s a unique opportunity to educate your own patients and engage with a wider audience.
                    </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img src={EducateImage} alt="Educate" className="rounded-lg shadow-lg w-3/4 md:w-2/3 h-auto max-h-80" />
                </div>
            </section>

            {/* Article Editor Features */}
            <section className="py-16 px-6 flex flex-col md:flex-row-reverse items-center bg-gray-100">
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold text-blue-700">We Know You're Busy</h2>
                    <p className="text-lg mt-4 text-gray-700">
                        So, we’ve made writing articles super simple:
                    </p>
                    <ul className="text-gray-600 mt-4 list-disc pl-6">
                        <li>Easy-to-use article editor</li>
                        <li>One-click upload of images & videos</li>
                        <li>Access to millions of free stock photos</li>
                        <li>Regular feedback from our editorial team</li>
                        <li>Detailed analysis of your articles' performance</li>
                    </ul>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img src={EditorImage} alt="Editor" className="rounded-lg shadow-lg w-3/4 md:w-2/3 h-auto max-h-80" />
                </div>
            </section>

            {/* Practo Pro App */}
            <section className="py-16 px-6 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold text-blue-700">Join Thousands of Health Experts</h2>
                    <p className="text-lg mt-4 text-gray-700">
                        Download the TAMD app, a powerful app that lets you manage and grow your practice.
                    </p>
                    <ul className="text-gray-600 mt-4 list-disc pl-6">
                        <li>Manage your profile with an advanced profile editor</li>
                        <li>Respond to patient stories</li>
                        <li>Provide online consultations</li>
                        <li>Manage your clinic with a Ray by TAMD subscription</li>
                        <li>Access patient records from anywhere</li>
                        <li>Track your clinic’s performance</li>
                        <li>Manage and track your Prime subscription</li>
                    </ul>
                    <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
                        Download TAMD Mobile App
                    </button>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img src={PractoProImage} alt="Practo Pro" className="rounded-lg shadow-lg w-3/4 md:w-2/3 h-auto max-h-80" />
                </div>
            </section>
        </div>
    );
};

export default PractoHealthFeed;
