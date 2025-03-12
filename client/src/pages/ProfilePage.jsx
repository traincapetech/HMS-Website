import React, { useState } from "react";
import { FaUser, FaPhone, FaClipboardList, FaComments, FaCheckCircle, FaAppStore, FaWhatsapp } from "react-icons/fa";

const ProfilePage = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Name:", name);
        console.log("Phone:", phone);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <h1 className="text-6xl md:text-8xl font-bold text-center mb-4">Create Your TAMD Profile</h1>
                <p className="text-center text-gray-600 mb-4">Patients are looking for doctors like you</p>
                <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">Start your digital journey with TAMD Profile</p>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-semibold mb-6">Let’s take the first step and create your account:</h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Name</label>
                        <div className="flex items-center rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-shadow duration-200 hover:shadow-lg">
                            <FaUser className="text-gray-500 p-3" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border-0 p-3 w-full focus:outline-none rounded-xl bg-gray-100 placeholder-gray-500"
                                placeholder="Type full name"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Phone</label>
                        <div className="flex items-center rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-shadow duration-200 hover:shadow-lg">
                            <span className="border p-3 rounded-l-xl rounded-r-none bg-gray-200">+91 (IN)</span>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="border-0 p-3 w-full focus:outline-none rounded-xl bg-gray-100 placeholder-gray-500"
                                placeholder="Type number"
                                required
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Note: OTP will be sent to this number for verification.</p>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white py-3 rounded-full w-full transition-colors duration-300 text-lg font-semibold shadow-md hover:shadow-2xl"
                    >
                        Create Profile
                    </button>
                    <p className="text-center mt-4">
                        If you already have an account, <a href="#" className="text-blue-500 hover:underline">please login here</a>.
                    </p>
                </form>

                {/* Feature Sections */}
                <div className="mt-16 grid gap-8 md:grid-cols-2">
                    {/* Profile Editor */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-semibold mb-6">Profile Editor</h2>
                        <p className="mb-4 text-gray-600">Edit your profile from anywhere, effortlessly</p>
                        <ul className="list-disc list-inside mb-4">
                            <li className="flex items-center">
                                <FaClipboardList className="text-blue-600 mr-3 text-2xl" />
                                Easily add or modify your details
                            </li>
                            <li className="flex items-center">
                                <FaComments className="text-blue-600 mr-3 text-2xl" />
                                Add information that matters to your patients - timings, fees, new services, and much more
                            </li>
                            <li className="flex items-center">
                                <FaCheckCircle className="text-blue-600 mr-3 text-2xl" />
                                Keep all your information up to date, with ease
                            </li>
                        </ul>
                    </div>

                    {/* Patient Feedback */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-semibold mb-6">Keep track of patient feedback</h2>
                        <ul className="list-disc list-inside mb-4">
                            <li className="flex items-center">
                                <FaComments className="text-blue-600 mr-3 text-2xl" />
                                Know what your patients have to say about you
                            </li>
                            <li className="flex items-center">
                                <FaComments className="text-blue-600 mr-3 text-2xl" />
                                Interact with them through your TAMD profile
                            </li>
                            <li className="flex items-center">
                                <FaComments className="text-blue-600 mr-3 text-2xl" />
                                Build your credibility by replying to their feedback
                            </li>
                            <li className="flex items-center">
                                <FaComments className="text-blue-600 mr-3 text-2xl" />
                                Let everyone read the great feedback patients leave for you
                            </li>
                        </ul>
                    </div>

                    {/* Profile Reminder */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-semibold mb-6">Profile Reminder</h2>
                        <p className="mb-4 text-gray-600">Improve your profile with tips from us. Does your profile have all the information? We’ll remind you about all the minute details that can make a huge impact on your online presence.</p>
                    </div>

                    {/* 3 Simple Steps */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-semibold mb-6">Create your free TAMD profile in 3 simple steps</h2>
                        <ol className="list-decimal list-inside mb-4">
                            <li>Register or find yourself on TAMD.com</li>
                            <li>Enter your name, email id, mobile number, and clinic or establishment name.</li>
                            <li>Add your profile information and complete a simple verification process online, and go live!</li>
                        </ol>
                        <p className="text-sm text-gray-500">Note: Verifying your medical registration and qualification ensures that you get listed as a genuine medical practitioner.</p>
                    </div>

                    {/* Practo Pro App */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-semibold mb-6">TAMD app</h2>
                        <p className="mb-4 text-gray-600">Download TAMD app - A powerful app that lets you manage and grow your practice.</p>
                        <ul className="list-disc list-inside mb-4">
                            <li className="flex items-center">
                                <FaAppStore className="text-blue-600 mr-3 text-2xl" />
                                Manage your profile with advanced profile editor
                            </li>
                            <li className="flex items-center">
                                <FaComments className="text-blue-600 mr-3 text-2xl" />
                                Respond to patient stories for your practice
                            </li>
                            <li className="flex items-center">
                                <FaComments className="text-blue-600 mr-3 text-2xl" />
                                Provide online consultation to patients
                            </li>
                            <li className="flex items-center">
                                <FaComments className="text-blue-600 mr-3 text-2xl" />
                                Manage your clinic with a Ray by TAMD subscription
                            </li>
                            <li className="flex items-center">
                                <FaComments className="text-blue-600 mr-3 text-2xl" />
                                See patient records from anywhere
                            </li>
                            <li className="flex items-center">
                                <FaComments className="text-blue-600 mr-3 text-2xl" />
                                Track your clinic’s performance on the go
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;