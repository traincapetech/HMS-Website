import React from 'react';
import corporate from '../assets/Corporate.jpg';
import OurServices from '../components/OurServices';

const Corporate = () => {
  return (
    <>
  
    <div className="w-full">
      {/* Banner Section */}
      <div
        className="bg-[#152B54] w-full flex flex-col lg:flex-row items-center justify-between p-6 lg:p-20"
        style={{
          backgroundImage: `url(${corporate})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      >
        <div className="absolute inset-0 mt-26 h-[94vh] bg-black opacity-40"></div>

        {/* Left Section (Text) */}
        <div className="text-white relative z-10 max-w-lg lg:max-w-xl text-center lg:text-left mb-6 lg:mb-0">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Welcome to Our Hospital
          </h1>
          <p className="text-lg lg:text-xl font-semibold text-black lg:text-white">
            Your Health is Our Priority. Book a Demo Now to Learn More About Our Services.
          </p>
        </div>

        {/* Right Section (Form) */}
        <div className="relative z-10 bg-black text-white bg-opacity-60 p-8 rounded-lg max-w-sm w-full">
          <h2 className="text-2xl text-yellow-400 mb-6 text-center">Schedule a Demo</h2>
          <form action="submit_form.php" method="POST">
            <div className="mb-4">
              <label htmlFor="name" className="text-yellow-400">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full p-3 mt-2 rounded border border-gray-300"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="text-yellow-400">Email Address:</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full p-3 mt-2 rounded border border-gray-300"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="text-yellow-400">Phone Number:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full p-3 mt-2 rounded border border-gray-300"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="date" className="text-yellow-400">Preferred Demo Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className="w-full p-3 mt-2 rounded border border-gray-300"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
    <OurServices />
    </>
  );
}

export default Corporate;
