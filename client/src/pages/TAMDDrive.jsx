import React, { useEffect } from "react";
import MedicalRecords from "../assets/MedicalRecords.webp"
import {useNavigate} from 'react-router-dom';
const TAMDDrive = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
      const navigate = useNavigate();
    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            {/* Hero Section */}
            <section className="bg-blue-600 text-white text-center py-16 px-6">
                <h1 className="text-5xl font-bold">All Your Medical Records in One Place</h1>
                <p className="text-lg mt-4">Join thousands of users who securely store and access their medical records online.</p>
                <button 
                onClick={()=>{
                    navigate('/video')
                }}
                className="hover:cursor-pointer mt-6 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition">
                    Get Started
                </button>
            </section>

            {/* Never Lose Records Section */}
            <section className="py-16 px-6 flex flex-col md:flex-row items-center text-center md:text-left">
                {/* Left Content */}
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold text-blue-600">Never Lose Your Medical Records</h2>
                    <p className="text-lg mt-4 max-w-lg">
                        Access prescriptions, treatment plans, and reports anytime, anywhere.
                        Upload all your records in just a few clicks and keep them secure forever.
                    </p>
                </div>

                {/* Right Image */}
                <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
                    <img
                        src={MedicalRecords}
                        alt="Medical Records"
                        className="rounded-lg shadow-lg w-3/4 md:w-2/3 h-auto max-h-80"
                    />
                </div>
            </section>


            {/* Secure & Private */}
            <section className="bg-gray-200 py-16 px-6 text-center">
                <h2 className="text-3xl font-bold text-blue-600">Safe & Secure</h2>
                <p className="text-lg mt-4 max-w-2xl mx-auto">
                    TAMD Drive uses advanced security measures and end-to-end encryption
                    to ensure your health data remains confidential and accessible only to you.
                </p>
                <button 
                onClick={()=>{
                    navigate('/contactUs')
                }}
                className="hover:cursor-pointer mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition">
                    Learn More
                </button>
            </section>

            {/* How It Works */}
            <section className="py-16 px-6 text-center">
                <h2 className="text-3xl font-bold text-blue-600">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8 mt-6 max-w-5xl mx-auto">
                    {[
                        { step: "1", title: "Sign Up", description: "Create your TAMD Drive account in minutes." },
                        { step: "2", title: "Upload Records", description: "Easily upload prescriptions, lab reports & more." },
                        { step: "3", title: "Access Anytime", description: "View your records anytime, from any device." }
                    ].map(({ step, title, description }) => (
                        <div key={step} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 text-5xl font-bold">{step}</div>
                            <h3 className="text-xl font-semibold mt-2">{title}</h3>
                            <p className="text-gray-600 mt-2">{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-blue-600 text-white py-16 px-6 text-center">
                <h2 className="text-3xl font-bold">Don't Take Our Word for It</h2>
                <div className="grid md:grid-cols-3 gap-8 mt-6 max-w-5xl mx-auto">
                    {[
                        { name: "Viswanathan Narayanaswamy", review: "Great app for storing health records and prescriptions." },
                        { name: "Niranjan Sheelavant", review: "Helps keep track of medical history. Love the reminders!" },
                        { name: "Ashish Kole", review: "Getting my prescription directly in the app is super convenient." }
                    ].map(({ name, review }) => (
                        <div key={name} className="bg-white p-6 rounded-lg shadow-md text-gray-800">
                            <p className="italic">"{review}"</p>
                            <h3 className="mt-4 font-semibold text-blue-600">{name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mobile App Features */}
            <section className="py-16 px-6 text-center">
                <h2 className="text-3xl font-bold text-blue-600">Manage Your Medical Records On the Go</h2>
                <p className="text-lg mt-4 max-w-2xl mx-auto">
                    The TAMD mobile app helps you keep track of your health effortlessly.
                </p>
                <div className="grid md:grid-cols-3 gap-8 mt-6 max-w-5xl mx-auto">
                    {[
                        { title: "Medicine Reminders", description: "Never miss a dose with smart notifications." },
                        { title: "Upload & Store", description: "Keep all your health documents in one place." },
                        { title: "Offline Access", description: "View records even without internet." }
                    ].map(({ title, description }) => (
                        <div key={title} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-blue-600">{title}</h3>
                            <p className="text-gray-600 mt-2">{description}</p>
                        </div>
                    ))}
                </div>
                <button className="hover:cursor-pointer mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition">
                    Download the App
                </button>
            </section>
        </div>
    );
};

export default TAMDDrive;