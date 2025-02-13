import React from "react";
import Work from "../assets/Work.jpg";

const Careers = () => {
    const jobOpenings = [
        {
            title: "Cardiologist",
            location: "New York, NY",
            description: "We are looking for a skilled Cardiologist to join our team. The ideal candidate will have experience in diagnosing and treating heart conditions.",
            requirements: [
                "MD or DO degree",
                "Board certified in Cardiology",
                "Excellent communication skills",
                "Ability to work in a team environment"
            ],
            link: "#"
        },
        {
            title: "Nurse Practitioner",
            location: "Los Angeles, CA",
            description: "Join our team as a Nurse Practitioner. You will provide high-quality care to patients and collaborate with physicians.",
            requirements: [
                "Master's degree in Nursing",
                "Current NP license",
                "Strong clinical skills",
                "Compassionate patient care"
            ],
            link: "#"
        },
        {
            title: "Medical Assistant",
            location: "Chicago, IL",
            description: "We are seeking a Medical Assistant to support our healthcare team. Responsibilities include patient intake, scheduling, and administrative tasks.",
            requirements: [
                "High school diploma or equivalent",
                "Certification as a Medical Assistant",
                "Strong organizational skills",
                "Ability to multitask"
            ],
            link: "#"
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-5xl font-bold text-gray-900 text-center mb-8">Careers at TAMD</h1>
                <p className="text-xl text-gray-600 text-center mb-12">
                    Join our team and make a difference in the lives of our patients. We are committed to providing a supportive and inclusive work environment.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobOpenings.length > 0 ? (
                        jobOpenings.map((job, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                                <p className="text-gray-500 mb-1">{job.location}</p>
                                <p className="text-gray-700 mb-4">{job.description}</p>
                                <h3 className="font-semibold text-gray-800 mb-2">Requirements:</h3>
                                <ul className="list-disc list-inside mb-4">
                                    {job.requirements.map((req, idx) => (
                                        <li key={idx} className="text-gray-600">{req}</li>
                                    ))}
                                </ul>
                                <a href={job.link} className="text-blue-700 hover:text-blue-900 font-semibold">
                                    Apply Now
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white rounded-lg shadow-lg p-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Job Openings Available</h2>
                            <p className="text-gray-600 mb-4">Please check back later for new opportunities.</p>
                            <p className="text-gray-600 mb-4">In the meantime, feel free to explore our <a href="#culture" className="text-blue-700 hover:text-blue-900">company culture</a> and <a href="#benefits" className="text-blue-700 hover:text-blue-900">employee benefits</a>.</p>
                        </div>
                    )}
                </div>

                {/* Company Culture Section */}
                <div id="culture" className="mt-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        At TAMD, we believe in fostering a culture of collaboration, innovation, and respect. Our team is dedicated to providing the best care for our patients while supporting each other in our professional growth.
                    </p>
                    <img src={Work} alt="Teamwork" className="mx-auto rounded-lg shadow-md mb-6 h-48 object-cover" />
                </div>

                {/* Employee Benefits Section */}
                <div id="benefits" className="mt-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Employee Benefits</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        We offer a comprehensive benefits package to support our employees' health and well-being, including:
                    </p>
                    <div className="bg-white rounded-lg shadow-lg p-6 mx-auto max-w-2xl">
                        <ul className="list-disc list-inside mb-4">
                            <li className="text-gray-600">✅ Competitive salary and performance bonuses</li>
                            <li className="text-gray-600">✅ Health, dental, and vision insurance</li>
                            <li className="text-gray-600">✅ Retirement savings plan with company match</li>
                            <li className="text-gray-600">✅ Paid time off and flexible scheduling</li>
                            <li className="text-gray-600">✅ Continuing education and professional development opportunities</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Careers;