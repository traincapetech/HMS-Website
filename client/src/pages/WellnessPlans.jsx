import React, { useState } from "react";
import { FaCheckCircle, FaUsers, FaBriefcase, FaHeartbeat } from "react-icons/fa";
import Exercise from "../assets/Exercises.jpg"
const WellnessPlans = () => {
    const [formData, setFormData] = useState({
        name: "",
        organization: "",
        contact: "",
        email: "",
        size: "",
        interest: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="wellness-plans bg-gray-100">
            {/* First Section */}
            <section
                className="hero-section relative flex items-center min-h-screen"
                style={{
                    backgroundImage: `url(${Exercise})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
                <div className="container mx-auto flex flex-col md:flex-row items-center relative z-10 py-16 px-6">

                    {/* Left Side Content */}
                    <div className="md:w-1/2 text-white pr-10">
                        <h1 className="text-5xl font-extrabold leading-tight">Discover Our Wellness Plans</h1>
                        <p className="mt-4 text-lg opacity-90">Empowering organizations with customized wellness solutions.</p>
                    </div>

                    {/* Right Side Form */}
                    <div className="md:w-1/2 bg-gradient-to-r from-blue-500 to-purple-600 p-10 rounded-2xl shadow-2xl max-w-lg w-full">
                        <h2 className="text-3xl font-semibold mb-6 text-center text-white">Schedule a Demo</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="flex flex-col">
                                <label className="text-white font-medium mb-1">Your Name</label>
                                <input type="text" name="name" placeholder="Enter your name" className="input-field bg-white text-gray-800 rounded-lg p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300" onChange={handleChange} required />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-white font-medium mb-1">Organization Name</label>
                                <input type="text" name="organization" placeholder="Enter organization name" className="input-field bg-white text-gray-800 rounded-lg p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300" onChange={handleChange} required />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-white font-medium mb-1">Contact Number</label>
                                <input type="tel" name="contact" placeholder="Enter contact number" className="input-field bg-white text-gray-800 rounded-lg p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300" onChange={handleChange} required />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-white font-medium mb-1">Official Email ID</label>
                                <input type="email" name="email" placeholder="Enter email ID" className="input-field bg-white text-gray-800 rounded-lg p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300" onChange={handleChange} required />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-white font-medium mb-1">Organization Size</label>
                                <select name="size" className="input-field bg-white text-gray-800 rounded-lg p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300" onChange={handleChange} required>
                                    <option value="">Select Organization Size</option>
                                    <option value="<500">Less than 500</option>
                                    <option value="500-1000">500 to 1000</option>
                                    <option value=">1000">More than 1000</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-white font-medium mb-1">Interested In</label>
                                <select name="interest" className="input-field bg-white text-gray-800 rounded-lg p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300" onChange={handleChange} required>
                                    <option value="">Select Interest</option>
                                    <option value="Mental Health">Mental Health</option>
                                    <option value="Corporate Wellness">Corporate Wellness</option>
                                </select>
                            </div>

                            <button type="submit" className="bg-white text-blue-600 rounded-lg py-3 text-lg font-semibold shadow-md hover:bg-gray-200 transition duration-300 w-full">
                                Submit
                            </button>

                        </form>
                    </div>

                </div>
            </section>


            {/* Second Section */}
            <section className="banner-section cursor-pointer py-12" onClick={() => console.log("Redirecting...")}>
                <div className="container mx-auto flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2">
                        <img src={Exercise} alt="Wellness" className="rounded-lg shadow-lg" />
                    </div>
                    <div className="md:w-1/2 p-6">
                        <h2 className="text-3xl font-semibold">Join Our Wellness Initiative</h2>
                        <p className="mt-4 text-lg">Transform employee well-being with our expert-backed programs.</p>
                        <p className="mt-2">With a rating of 4.5+, we ensure our healthcare solutions are top quality and uniquely personalized to every employee.</p>
                    </div>
                </div>
            </section>

            {/* Third Section - Our Services */}
            <section className="services-section py-12">
                <h2 className="text-center text-3xl font-bold">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {["Mental Health Support", "Fitness Programs", "Employee Assistance", "Corporate Training"].map((service, index) => (
                        <div key={index} className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
                            <FaCheckCircle className="text-green-500 text-3xl mr-4" />
                            <div>
                                <h3 className="text-xl font-semibold">{service}</h3>
                                <p className="text-gray-600">Comprehensive programs designed for well-being.</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Fourth Section - Why Choose Us */}
            <section className="choose-us-section text-center py-12 bg-gray-200">
                <h2 className="text-4xl font-bold text-gray-800">Why Choose Us?</h2>
                <p className="mt-4 text-lg text-gray-600">Providing innovative wellness solutions for a healthier workplace.</p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        <h3 className="text-xl font-semibold text-blue-600">For Organizations</h3>
                        <p className="mt-2 text-gray-700">Manage benefits, improve communication, and engage employees.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        <h3 className="text-xl font-semibold text-blue-600">For Employees</h3>
                        <p className="mt-2 text-gray-700">Better health, easy management, and more vitality.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        <h3 className="text-xl font-semibold text-blue-600">For Leaders</h3>
                        <p className="mt-2 text-gray-700">Culture of health and wellness, peer interactions.</p>
                    </div>
                </div>
            </section>

            {/* Fifth Section */}
            <section className="final-section flex flex-col md:flex-row items-center py-12">
                <div className="md:w-1/2 p-6">
                    <h2 className="text-3xl font-semibold">Comprehensive Wellness Solutions</h2>
                    <p className="mt-4">A holistic approach tailored for businesses of all sizes.</p>
                    <ul className="mt-6">
                        <li className="flex items-center mb-2"><FaUsers className="text-blue-500 mr-2" /> Trusted by organizations worldwide</li>
                        <li className="flex items-center mb-2"><FaBriefcase className="text-blue-500 mr-2" /> Customized corporate plans</li>
                        <li className="flex items-center mb-2"><FaHeartbeat className="text-blue-500 mr-2" /> Prioritizing employee well-being</li>
                    </ul>
                </div>
                <div className="md:w-1/2">
                    <img src={Exercise} alt="Wellness" className="rounded-lg shadow-lg" />
                </div>
            </section>
        </div>
    );
};

export default WellnessPlans;