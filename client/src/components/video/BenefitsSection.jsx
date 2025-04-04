import { Check } from "lucide-react"
import React from "react"
const benefits = [
  {
    title: "Consult Top Doctors 24x7",
    description: "Connect with verified doctors anytime, anywhere",
  },
  {
    title: "Convenient and Easy",
    description: "Skip travel and waiting rooms - consult from your home",
  },
  {
    title: "100% Secure Consultations",
    description: "Your privacy is guaranteed with our HIPAA-compliant platform",
  },
  {
    title: "Instant Digital Prescription",
    description: "Get your prescription immediately after consultation",
  },
]

export default function BenefitsSection() {
  return (
    <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-6">
      {benefits.map((benefit, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium mb-1">{benefit.title}</h3>
            <p className="text-muted-foreground">{benefit.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
