import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-screen-lg mx-auto px-4">
        <p className="text-center">&copy; 2025 TAMD. All Rights Reserved.</p>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/terms-of-service" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
