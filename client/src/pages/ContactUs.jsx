import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
// import { GrLocation } from "react-icons/gr";
// import { RiTeamLine } from "react-icons/ri";
import { IoMailOutline } from "react-icons/io5";
import emailjs from "@emailjs/browser";
import Contact from "../assets/contact.png";
import { Link } from "react-router-dom";

const ContactUs = () => {
  const [payoload, setPayoload] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phoneNumber: "",
    location: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Your EmailJS serviceIdD and templateId and Public Key
    const serviceId = "service_pjwgjas";
    const templateId = "template_eueffas";
    const publicId = "GmJ24jEVf6swWXgb0";

    // Create a new object that contains dynamic template params
    const { name, email, subject, message, phoneNumber, location } = payoload;
    const templateParams = {
      from_name: name,
      from_email: email,
      from_subject: subject,
      to_name: "Parichay singh Rana",
      message: `Name - ${name}\nEmail - ${email}\nCountry Name - ${location}\nWhatsapp-Number - ${phoneNumber}\nService Required - ${subject}\nMessage - ${message}`,
    };

    // Send the Email using EmailJS
    emailjs.send(serviceId, templateId, templateParams, publicId).then(
      (res) => {
        alert("Email sent successfully!", res);
      },
      (err) => {
        console.log(err);
      }
    );
    setPayoload({
      name: "",
      email: "",
      phoneNumber: "",
      subject: "",
      message: "",
      location: "",
    });
  };

  const handleChange = (e) => {
    setPayoload({ ...payoload, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="md:py-24 py-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 grid-cols-1">
          <div className="lg:mb-0 ">
            <div className="group w-full h-full">
              <div className="relative h-full">
                <img
                  src={Contact}
                  alt="ContactUs tailwind section"
                  className="w-full h-full bg-black object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-65"></div> {/* Semi-transparent overlay */}

                <div className="absolute top-0 w-full lg:p-11 md:p-5 p-2 z-10">
                  <div className="bg-transparent rounded-lg md:p-6 block border-4 border-transparent animate-borderGlow">
                    <div className="md:space-y-4 space-y-2">
                      <div>
                        <h4 className="md:text-3xl text-lg font-bold text-white">Office Address</h4>
                        <p className="text-sm md:text-lg text-slate-300">
                          India, USA, Nigeria
                        </p>
                      </div>
                      <div>
                        <h4 className="md:text-2xl text-lg font-bold text-white">
                          Phone Number & Email
                        </h4>
                        <p className="text-sm md:text-base flex items-center gap-2 text-slate-300">
                          <FaWhatsapp className="" />
                          <Link

                            to="https://wa.me/+916280281505"
                            target="_blank"
                          >
                            +91 6280281505
                          </Link>
                        </p>
                        <p className="text-sm md:text-base flex items-center gap-2 text-slate-300">
                          <IoMailOutline className="" />
                          <Link

                            to="mailto:sales@traincapetech.info"
                            target="_blank"
                          >
                            sales@traincapetech.info
                          </Link>
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg md:text-2xl font-bold text-white">Our Address</h4>
                        <p className="text-sm md:text-base text-slate-200">
                          Khandolia Plaza, 118\C, Dabri - Palam Rd, Vaishali, Vaishali {" "}
                          <br />
                          Colony, Dashrath Puri, New Delhi, Delhi, 110045
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg md:text-2xl font-bold text-white">Timings</h4>
                        <p className="text-sm md:text-base text-slate-200">
                          11:00 AM - 07:00 PM IST <br />
                          Monday to Saturday
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="relative w-full p-1 ">
            {/* <div className="absolute inset-0 border-2  animate-beamLight bg-gradient-to-r from-violet-900 via-transparent to-blue-500 bg-[length:400%_400%]"></div>  */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 animate-beam"></div>
            <div className="relative bg-gray-200 p-8 ">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Contact Form
              </h2>

              <form className="space-y-4 md:space-y-6">
                {/* Full Name Input */}
                <div>
                  <label htmlFor="name" className="block text-gray-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={payoload.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#152B54]"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={payoload.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#152B54]"
                  />
                </div>

                {/* Country Name */}
                <div>
                  <label htmlFor="location" className="block text-gray-600">
                    Country Name
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={payoload.location}
                    onChange={handleChange}
                    placeholder="Your Country"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#152B54]"
                  />
                </div>

                {/* Whatsapp Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-gray-600">
                    Whatsapp Number
                  </label>
                  <input
                    type="number"
                    name="phoneNumber"
                    value={payoload.phoneNumber}
                    onChange={handleChange}
                    placeholder="Your Whatsapp Number"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#152B54]"
                  />
                </div>

                {/* Select Service */}
                <div>
                  <label htmlFor="subject" className="block text-gray-600">
                    Select Service
                  </label>
                  <select
                    name="subject"
                    value={payoload.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#152B54]"
                  >
                    <option value="" disabled>
                      Select Service
                    </option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Project Management">Project Management</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-gray-600">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={payoload.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows="4"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#152B54]"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-[#152B54] text-white py-3 rounded-lg hover:bg-blue-900 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 to-indigo-500 animate-beam"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;