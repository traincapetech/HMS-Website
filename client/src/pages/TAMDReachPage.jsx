import React, { useEffect, useState } from "react";

const TAMDReachPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a WhatsApp message
        const message = `Hello! I would like to request a free demo.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city}`;
        
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Replace with your WhatsApp number (in international format without +)
        const whatsappNumber = "17879493280"; // Example: 1234567890 for +91 1234567890
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Open WhatsApp
        window.open(whatsappUrl, "_blank");
    };
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Make Your Practice Visible to Millions</h1>
            <p className="text-center mb-4">TAMD Reach is an ad slot for clinics and hospitals for getting better visibility on TAMD.com.</p>
            <p className="text-center mb-8">Get a free demo</p>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Here’s how your TAMD Reach ad will look</h2>
                <p className="mb-4">Your TAMD Reach ad appears on all the prime positions on TAMD listing pages — desktop, mobile web, and app.</p>
                <h3 className="text-xl font-semibold mb-2">Who can use TAMD Reach?</h3>
                <p className="mb-4">Only clinics, hospitals, and medical health establishments can subscribe to TAMD Reach ad slots in accordance with MCI regulation 7.12.</p>
                <p className="text-red-500 font-bold">Note: Doctors cannot purchase TAMD Reach.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Benefits of Your TAMD Reach Subscription</h2>
                <ul className="list-disc list-inside mb-4">
                    <li>Make your practice visible to millions of users on TAMD.com</li>
                    <li>Get instant SMS alerts on every patient call</li>
                    <li>Get guaranteed views (impressions)</li>
                </ul>
                <p className="text-red-500 font-bold">Note: TAMD guarantees a minimum number of patient views for your ad on TAMD.com for the entire duration of your subscription.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Target Your Audience</h2>
                <h3 className="text-xl font-semibold mb-2">By Locality</h3>
                <p className="mb-4">Choose your ad placement by selecting multiple localities closest to your practice location.</p>
                <h3 className="text-xl font-semibold mb-2">By Keywords</h3>
                <p className="mb-4">Select keywords that are the most relevant to your practice — symptoms, services, and specialty.</p>
                <p className="mb-4">e.g. A clinic that specializes in diabetes treatment can choose keywords like endocrinologist, sugar disease, etc.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Reach Dashboard</h2>
                <p className="mb-4">Track the performance of your TAMD Reach subscription from anywhere (TAMD website or app) through the TAMD Reach dashboard.</p>
                <p className="mb-4">We’ll notify you about your TAMD Reach subscription activity and number of views through weekly emails.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Join Thousands of Doctors Using TAMD Reach</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Enter Your Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 rounded w-full"
                            placeholder="Type your name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Enter Your Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded w-full"
                            placeholder="Type your email"
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="border p-2 rounded-l-md bg-gray-200">+91 (IN)</span>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border p-2 rounded-r-md w-full"
                            placeholder="Type your number"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Enter Your City</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="border p-2 rounded w-full"
                            placeholder="Type your city"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Request Free Demo</button>
                </form>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">TAMD Pro App</h2>
                <p className="mb-4">Download TAMD Pro app - A powerful app that lets you manage and grow your practice.</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Manage your profile with advanced profile editor</li>
                    <li>Respond to patient stories for your practice</li>
                    <li>Provide online consultation to patients</li>
                    <li>Manage your clinic with a Ray by TAMD subscription</li>
                    <li>See patient records from anywhere</li>
                    <li>Track your clinic’s performance on the go</li>
                    <li>Manage and track your Prime subscription</li>
                </ul>
            </div>
        </div>
    );
};

export default TAMDReachPage;