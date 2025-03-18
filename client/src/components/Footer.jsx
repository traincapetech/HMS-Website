import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-sm">
        {/* Column 1 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">TAMD</h3>
          <ul className="space-y-1">
            <li><Link to="/About" className="hover:underline">About</Link></li>
            <li><Link to="/Blog" className="hover:underline">Blog</Link></li>
            <li><Link to="/careers" className="hover:underline">Careers</Link></li>
            <li><Link to="/careers" className="hover:underline">Press</Link></li>
            <li><Link to="/ContactUs" className="hover:underline">Contact Us</Link></li>
            <li><Link to="/FAQPage" className="hover:underline">FAQ</Link></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">For Patients</h3>
          <ul className="space-y-1">
            <li><Link to="/ShowDoctors" className="hover:underline">Search For Doctors</Link></li>
            <li><Link to="/SearchClinics" className="hover:underline">Search For Clinics</Link></li>
            <li><Link to="/SearchHospitals" className="hover:underline">Search For Hospitals</Link></li>
            <li><Link to="/CovidHospitalListing" className="hover:underline">Covid Hospital Listing</Link></li>
            <li><Link to="/TAMDCareClinics" className="hover:underline">TAMD Care Clinics</Link></li>
            <li><Link to="/ReadHealthArticles" className="hover:underline">Read Health Articles</Link></li>
            <li><Link to="/ReadAboutMedicines" className="hover:underline">Read About Medicines</Link></li>
            <li><Link to="/TAMDDrive" className="hover:underline">TAMD Drive</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">For Doctors</h3>
          <ul className="space-y-1">
            <li><Link to="/ProfilePage" className="hover:underline">TAMD Profile</Link></li>
            <li><Link to="/PractoHealthFeed" className="hover:underline">TAMD Health Feed</Link></li>
          </ul>
          <h3 className="text-lg font-semibold mb-2">For Corporates</h3>
          <ul className="space-y-1">
            <li><Link to="/WellnessPlans" className="hover:underline">Wellness Plans</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">For Hospitals</h3>
          <ul className="space-y-1">
            <li><Link to="/InstaByTAMD" className="hover:underline">Insta by TAMD</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Qikwell by TAMD</Link></li>
            <li><Link to="/ProfilePage" className="hover:underline">TAMD Profile</Link></li>
            <li><Link to="/TAMDReachPage" className="hover:underline">TAMD Reach</Link></li>
            <li><Link to="/TAMDDrive" className="hover:underline">TAMD Drive</Link></li>
          </ul>
        </div>

        {/* Column 5 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">More</h3>
          <ul className="space-y-1">
            <li><Link to="/HelpPage" className="hover:underline">Help</Link></li>
            <li><Link to="/PrivacyPolicy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/TermsAndConditions" className="hover:underline">Terms and Conditions</Link></li>
          </ul>
        </div>

        {/* Column 6 - External Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <ul className="space-y-1">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:underline">YouTube</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-center text-sm">
        <p>&copy; 2025 TAMD. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
