import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 md:py-8">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 text-xs sm:text-sm">
        {/* Column 1 */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">TAMD</h3>
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
          <h3 className="text-base sm:text-lg font-semibold mb-2">For Patients</h3>
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
          <h3 className="text-base sm:text-lg font-semibold mb-2">For Doctors</h3>
          <ul className="space-y-1">
            <li><Link to="/TAMDHealthFeed" className="hover:underline">TAMD Health Feed</Link></li>
          </ul>
          <h3 className="text-base sm:text-lg font-semibold mt-3 mb-2">For Corporates</h3>
          <ul className="space-y-1">
            <li><Link to="/WellnessPlans" className="hover:underline">Wellness Plans</Link></li>
          </ul>
        </div>

        {/* Column 4 - Hidden on small screens, visible on medium and up */}
        <div className="hidden sm:block">
          <h3 className="text-base sm:text-lg font-semibold mb-2">For Hospitals</h3>
          <ul className="space-y-1">
            <li><Link to="/InstaByTAMD" className="hover:underline">Insta by TAMD</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Qikwell by TAMD</Link></li>
            <li><Link to="/TAMDReachPage" className="hover:underline">TAMD Reach</Link></li>
            <li><Link to="/TAMDDrive" className="hover:underline">TAMD Drive</Link></li>
          </ul>
        </div>

        {/* Column 5 - Hidden on small screens, visible on medium and up */}
        <div className="hidden sm:block">
          <h3 className="text-base sm:text-lg font-semibold mb-2">More</h3>
          <ul className="space-y-1">
            <li><Link to="/HelpPage" className="hover:underline">Help</Link></li>
            <li><Link to="/PrivacyPolicy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/TermsAndConditions" className="hover:underline">Terms and Conditions</Link></li>
          </ul>
        </div>

        {/* Column 6 - External Links */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">Follow Us</h3>
          <ul className="space-y-1">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:underline">YouTube</a></li>
          </ul>
        </div>
      </div>

      {/* Additional columns for mobile only - second row */}
      <div className="sm:hidden max-w-screen-xl mx-auto px-4 mt-6 grid grid-cols-2 gap-4 text-xs">
        <div>
          <h3 className="text-base font-semibold mb-2">For Hospitals</h3>
          <ul className="space-y-1">
            <li><Link to="/InstaByTAMD" className="hover:underline">Insta by TAMD</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Qikwell by TAMD</Link></li>
            <li><Link to="/TAMDReachPage" className="hover:underline">TAMD Reach</Link></li>
            <li><Link to="/TAMDDrive" className="hover:underline">TAMD Drive</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-base font-semibold mb-2">More</h3>
          <ul className="space-y-1">
            <li><Link to="/HelpPage" className="hover:underline">Help</Link></li>
            <li><Link to="/PrivacyPolicy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/TermsAndConditions" className="hover:underline">Terms and Conditions</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-6 md:mt-8 text-center text-xs sm:text-sm">
        <p>&copy; 2025 TAMD. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;