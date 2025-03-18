import React, { useEffect } from "react";

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
            {/* Hero Section */}
            <section className="text-center mb-16">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">About TAMD Hospital</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    At TAMD Hospital, we are committed to delivering world-class healthcare with compassion, innovation, and excellence. Our mission is to make quality healthcare accessible to everyone.
                </p>
            </section>

            {/* Navigation Bar */}
            <nav className="bg-white shadow-lg rounded-lg mb-16 p-6">
                <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <li><a href="#overview" className="text-blue-700 hover:text-blue-900 transition duration-300">Overview</a></li>
                    <li><a href="#mission" className="text-blue-700 hover:text-blue-900 transition duration-300">Our Mission</a></li>
                    <li><a href="#offerings" className="text-blue-700 hover:text-blue-900 transition duration-300">Our Offerings</a></li>
                    <li><a href="#approach" className="text-blue-700 hover:text-blue-900 transition duration-300">Our Approach</a></li>
                    <li><a href="#testimonials" className="text-blue-700 hover:text-blue-900 transition duration-300">What Doctors Say</a></li>
                    <li><a href="#contact" className="text-blue-700 hover:text-blue-900 transition duration-300">Contact Us</a></li>
                </ul>
            </nav>

            {/* Overview Section */}
            <section id="overview" className="mb-16">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Quality Healthcare Made Simple</h2>
                    <p className="text-gray-600 leading-relaxed">
                        TAMD Hospital is a leading healthcare provider dedicated to delivering world-class medical services. With state-of-the-art technology, a team of expert doctors, and a patient-centric approach, we ensure personalized care that prioritizes your well-being. From diagnostics to advanced treatments, we are here to transform lives with expertise, care, and trust.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section id="mission" className="mb-16">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Health is a Habit</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Good health is not just a goal—it’s a daily habit. At TAMD Hospital, we encourage you to make healthy choices every day. From balanced nutrition to regular exercise, small, consistent efforts lead to long-term benefits. Together, we can build a healthier future.
                    </p>
                </div>
            </section>

            {/* Offerings Section */}
            <section id="offerings" className="mb-16">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Offerings</h2>
                    <p className="text-gray-600 mb-6">
                        At TAMD Hospital, we provide a wide range of services to meet your healthcare needs:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Extensive Doctor Network</h3>
                            <p className="text-gray-600">Access a verified directory of expert doctors across multiple specializations.</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Effortless Appointment Booking</h3>
                            <p className="text-gray-600">Schedule consultations at top hospitals and clinics nationwide with ease.</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Online Consultation</h3>
                            <p className="text-gray-600">Connect with experienced doctors across 20+ specialties anytime, anywhere.</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Health Plans</h3>
                            <p className="text-gray-600">Subscription-based plans offering unlimited doctor consultations round the clock.</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Hospital Management</h3>
                            <p className="text-gray-600">Streamlining operations with our cutting-edge practice management software.</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Diagnostics</h3>
                            <p className="text-gray-600">Get lab tests done from the comfort of your home with reliable sample collection.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Approach Section */}
            <section id="approach" className="mb-16">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Approach to Healthcare</h2>
                    <p className="text-gray-600 mb-6">
                        At TAMD Hospital, we are committed to delivering high-quality, trusted, and accessible healthcare that goes beyond treatment—it’s about care that transforms lives.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
                            <p className="text-gray-600">Fostering a deep connection between doctors and patients for better health outcomes.</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust</h3>
                            <p className="text-gray-600">Upholding the highest standards of care, integrity, and commitment.</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency</h3>
                            <p className="text-gray-600">Ensuring clarity and trust in every interaction.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="mb-16">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">What Doctors Say About Us</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Aryan Mehta</h3>
                            <p className="text-gray-600 mb-2">Cardiologist, 15+ Years Experience</p>
                            <p className="text-gray-700 italic">
                                "TAMD has transformed healthcare with seamless access to consultations, diagnostics, and medication. Their patient-centric approach ensures better outcomes and trust."
                            </p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Neha Sharma</h3>
                            <p className="text-gray-600 mb-2">Orthopedic Surgeon, 10+ Years Experience</p>
                            <p className="text-gray-700 italic">
                                "With TAMD’s digital solutions, I can provide uninterrupted, high-quality care to my patients. Their innovative platform is reshaping the future of healthcare."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="mb-16">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
                    <p className="text-gray-600 mb-6">
                        Have questions? Feel free to reach out to us. You can contact us via email or visit our office for more information.
                    </p>
                    <div className="flex justify-center">
                        <a href="mailto:info@tamdhospital.com" className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition duration-300">
                            Email Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;