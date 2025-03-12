import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-sm">
        {/* Column 1 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">TAMD</h3>
          <ul className="space-y-1">
            <li><a href="/About" className="hover:underline">About</a></li>
            <li><a href="/Blog" className="hover:underline">Blog</a></li>
            <li><a href="/careers" className="hover:underline">Careers</a></li>
            <li><a href="/careers" className="hover:underline">Press</a></li>
            <li><a href="/ContactUs" className="hover:underline">Contact Us</a></li>
            <li><a href="/FAQPage" className="hover:underline">FAQ</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">For Patients</h3>
          <ul className="space-y-1">
            <li><a href="/ShowDoctors" className="hover:underline">Search For Doctors</a></li>
            <li><a href="/SearchClinics" className="hover:underline">Search For Clinics</a></li>
            <li><a href="/SearchHospitals" className="hover:underline">Search For Hospitals</a></li>
            <li><a href="/CovidHospitalListing" className="hover:underline">Covid Hospital Listing</a></li>
            <li><a href="/TAMDCareClinics" className="hover:underline">TAMD Care Clinics</a></li>
            <li><a href="/ReadHealthArticles" className="hover:underline">Read Health Articles</a></li>
            <li><a href="/ReadAboutMedicines" className="hover:underline">Read About Medicines</a></li>
            <li><a href="/TAMDDrive" className="hover:underline">TAMD Drive</a></li>
            {/* <li><a href="/support" className="hover:underline">Health App</a></li> */}
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">For Doctors</h3>
          <ul className="space-y-1">
            <li><a href="/ProfilePage" className="hover:underline">TAMD Profile</a></li>
            <li><a href="/PractoHealthFeed" className="hover:underline">TAMD Health Feed</a></li>
          </ul>
          <h3 className="text-lg font-semibold mb-2">For Corporates</h3>
          <ul className="space-y-1">
            <li><a href="/WellnessPlans" className="hover:underline">Wellness Plans</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">For Hospitals</h3>
          <ul className="space-y-1">
            <li><a href="/InstaByTAMD" className="hover:underline">Insta by TAMD</a></li>
            <li><a href="/privacy-policy" className="hover:underline">Qikwell by TAMD</a></li>
            <li><a href="/ProfilePage" className="hover:underline">TAMD Profile</a></li>
            <li><a href="/TAMDReachPage" className="hover:underline">TAMD Reach</a></li>
            <li><a href="/TAMDDrive" className="hover:underline">TAMD Drive</a></li>
          </ul>
        </div>

        {/* Column 5 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">More</h3>
          <ul className="space-y-1">
            <li><a href="/HelpPage" className="hover:underline">Help</a></li>
            {/* <li><a href="/help-center" className="hover:underline">Developers</a></li> */}
            <li><a href="/PrivacyPolicy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/TermsAndConditions" className="hover:underline">Terms and Conditions</a></li>
            {/* <li><a href="/help-center" className="hover:underline">HealthCare Directory</a></li> */}
            {/* <li><a href="/community" className="hover:underline">TAMD Health Wiki</a></li> */}
          </ul>
        </div>

        {/* Column 6 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <ul className="space-y-1">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">YouTube</a></li>
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
