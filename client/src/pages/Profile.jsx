import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: user?.UserName || "",
    phone: user?.Mobile || "",
    email: user?.Email || "",
    gender: user?.Gender || "",
    dob: user?.DOB || "",
    bloodGroup: user?.BloodGroup || "",
    timezone: "(UTC+05:30) Asia/Kolkata",
    address: user?.Address || "",
    city: user?.City || "",
    state: user?.State || "",
    country: "India",
    pincode: user?.Pincode || "",
    extraPhone: user?.ExtraPhone || "",
    language: user?.Language || "English",
    profilePhoto: user?.photo || "https://via.placeholder.com/150",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    console.log("Updated Profile Data:", formData);
    alert("Profile Updated Successfully!");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start p-6 min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <img
            src={formData.profilePhoto}
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-2 border-gray-300"
          />
          <h2 className="text-lg font-semibold mt-3">{formData.name}</h2>
          <p className="text-gray-500">{formData.phone}</p>
        </div>
        <div className="mt-4 space-y-2">
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500 cursor-pointer border border-gray-300 rounded-md p-1"
            onChange={(e) =>
              setFormData({ ...formData, profilePhoto: URL.createObjectURL(e.target.files[0]) })
            }
          />
        </div>
      </div>

      {/* Main Profile Form */}
      <div className="w-full md:w-3/4 p-6 bg-white rounded-lg shadow-lg mt-6 md:mt-0 md:ml-6">
        <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700">Phone Number *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select an option</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-gray-700">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select an option</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          {/* Address */}
          <div className="col-span-2">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-gray-700">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Extra Phone Number */}
          <div>
            <label className="block text-gray-700">Extra Phone Numbers</label>
            <input
              type="text"
              name="extraPhone"
              value={formData.extraPhone}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-gray-700">Language</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;