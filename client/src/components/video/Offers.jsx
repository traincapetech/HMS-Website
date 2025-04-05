import React from 'react'
import { ArrowRight, MoveRight, Check, Sparkles } from "lucide-react";

function Offers() {
  return (
    <div className="container mx-auto px-4 py-4">
    <div className="grid grid-cols-2 gap-4 sm:gap-6">
      {/* First Consultation Offer */}
      <div
        className="bg-gradient-to-br from-emerald-50 to-emerald-100 
    rounded-2xl 
    border 
    border-emerald-200/50 
    overflow-hidden 
    transform 
    transition-all 
    duration-300 
    hover:scale-105 
    hover:shadow-2xl 
    group"
      >
        <div className="p-4 sm:p-6 relative">
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-emerald-600">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 opacity-70 group-hover:animate-pulse" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm md:text-2xl font-bold text-emerald-800 flex items-center gap-2">
              <Check className="w-6 sh-6 text-emerald-600" />
              First Consultation Free
            </h3>
            <p className="text-[12px] sm:text-base text-emerald-700">
              Enjoy unlimited follow-ups for 7 days after your initial consultation
            </p>
            <button
              className="
          flex 
          items-center 
          gap-2 
          bg-emerald-600 
          text-white 
          px-4 sm:px-6 
          py-2 sm:py-3 
          rounded-lg 
          text-sm sm:text-base
          hover:bg-emerald-700 
          transition-all 
          duration-300 
          group/button"
            >
              Book Now
              <MoveRight className="w-4 h-4 sm:w-5 sm:h-5 transform transition-transform group-hover/button:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Special Consultation Offer */}
      <div
        className="bg-gradient-to-br from-orange-50 to-orange-100 
    rounded-2xl 
    border 
    border-orange-200/50 
    overflow-hidden 
    transform 
    transition-all 
    duration-300 
    hover:scale-105 
    hover:shadow-2xl 
    group"
      >
        <div className="p-4 sm:p-6 relative">
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-orange-600">
            <Sparkles className=" w-8 h-8 opacity-70 group-hover:animate-pulse" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm md:text-2xl font-bold text-orange-800 flex items-center gap-2">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              Special Consultation
            </h3>
            <p className="text-[12px] sm:text-base text-orange-700">
              Exclusive consultation available at just $49 - Limited time offer!
            </p>
            <button
              className="
          flex 
          items-center 
          gap-2 
          bg-orange-600 
          text-white 
          px-4 sm:px-6 
          py-2 sm:py-3 
          rounded-lg 
          text-[12px] sm:text-base
          hover:bg-orange-700 
          transition-all 
          duration-300 
          group/button"
            >
              Book Now
              <MoveRight className="w-4 h-4 sm:w-5 sm:h-5 transform transition-transform group-hover/button:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Offers