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
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/blog" className="hover:underline">Blog</Link></li>
            <li><Link to="/careers" className="hover:underline">Careers</Link></li>
            <li><Link to="/press" className="hover:underline">Press</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact Us</Link></li> {/* ✅ Fixed Link */}
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">For Patients</h3>
          <ul className="space-y-1">
            <li><Link to="/search-for-doctors" className="hover:underline">Search For Doctors</Link></li>
            <li><Link to="/consulting" className="hover:underline">Search For Clinics</Link></li>
            <li><Link to="/hospital-list" className="hover:underline">Covid Hospital Listing</Link></li>
            <li><Link to="/health-articles" className="hover:underline">Read Health Articles</Link></li>
            <li><Link to="/medicines" className="hover:underline">Read About Medicines</Link></li>
            <li><Link to="/tamd-drive" className="hover:underline">TAMD Drive</Link></li>
            <li><Link to="/health-app" className="hover:underline">Health App</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">For Doctors</h3>
          <ul className="space-y-1">
            <li><Link to="/tamd-profile" className="hover:underline">TAMD Profile</Link></li>
          </ul>
          <h3 className="text-lg font-semibold mt-4 mb-2">For Corporates</h3>
          <ul className="space-y-1">
            <li><Link to="/wellness-plans" className="hover:underline">Wellness Plans</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">For Hospitals</h3>
          <ul className="space-y-1">
            <li><Link to="/insta" className="hover:underline">Insta by TAMD</Link></li>
            <li><Link to="/qikwell" className="hover:underline">Qikwell by TAMD</Link></li>
            <li><Link to="/tamd-reach" className="hover:underline">TAMD Reach</Link></li>
            <li><Link to="/tamd-drive" className="hover:underline">TAMD Drive</Link></li>
          </ul>
        </div>

        {/* Column 5 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">More</h3>
          <ul className="space-y-1">
            <li><Link to="/help" className="hover:underline">Help</Link></li>
            <li><Link to="/developers" className="hover:underline">Developers</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:underline">Terms and Conditions</Link></li>
            <li><Link to="/healthcare-directory" className="hover:underline">HealthCare Directory</Link></li>
            <li><Link to="/community" className="hover:underline">TAMD Health Wiki</Link></li>
          </ul>
        </div>

        {/* Column 6 - Social Media */}
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
