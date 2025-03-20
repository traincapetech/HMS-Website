import React, { useEffect } from "react";
import { FaPills } from "react-icons/fa";
import MedicineImage from "../assets/MedicineImage.jpg"; // Replace with your actual image path
import Paracetamol from "../assets/Paracetamol.jpeg";
import Ibuprofen from "../assets/Ibuprofen.jpeg";
import Amoxicillin from "../assets/Amoxicillin.jpeg";
import Cetirizine from "../assets/Cetirizine.jpeg";
import PainRelief from "../assets/PainRelief.jpg";
import HeartHealth from "../assets/HeartHealth.jpg";
import FitnessWellness from "../assets/Fitness&Wellness.jpg"
const ReadAboutMedicines = () => {
    {/**Section 1: Genuine Medicines */ }
    const medicineData = [
        {
            id: 1,
            title: "Paracetamol",
            description: "Used to relieve pain and reduce fever.",
            benefits: "Effective for mild to moderate pain and fever management.",
            image: Paracetamol, // Replace with actual image path
        },
        {
            id: 2,
            title: "Ibuprofen",
            description: "A non-steroidal anti-inflammatory drug (NSAID).",
            benefits: "Reduces inflammation and treats pain from various conditions.",
            image: Ibuprofen,
        },
        {
            id: 3,
            title: "Amoxicillin",
            description: "An antibiotic used to treat bacterial infections.",
            benefits: "Helps fight infections like pneumonia and throat infections.",
            image: Amoxicillin,
        },
        {
            id: 4,
            title: "Cetirizine",
            description: "An antihistamine used for allergy relief.",
            benefits: "Treats hay fever, skin allergies, and runny nose.",
            image: Cetirizine,
        }
    ];
    {/* Section 2: Browse Medicines and Health Conditions */ }
    const healthConditions = [
        {
            id: 1,
            name: "Pain Relief",
            description: "Explore medicines that help relieve pain and inflammation.",
            image: PainRelief, // Replace with actual image path
        },
        {
            id: 2,
            name: "Heart Health",
            description: "Discover medicines that support cardiovascular well-being.",
            image: HeartHealth,
        },
        {
            id: 3,
            name: "Fitness & Wellness",
            description: "Find supplements and medicines for overall fitness and wellness.",
            image: FitnessWellness,
        },
        {
            id: 4,
            name: "Digestive Health",
            description: "Medicines for indigestion, acidity, and other digestive issues.",
            image: "path-to-digestive-health-image.jpg",
        }
    ];
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <h1 className="text-5xl font-extrabold text-center text-blue-700 mb-12 drop-shadow-lg">Read About Medicines</h1>
            {/**Section 1: Genuine Medicines */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Genuine Medicines</h2>
                <div className="flex overflow-x-auto space-x-6 scrollbar-hide p-2">
                    {medicineData.map((medicine) => (
                        <div
                            key={medicine.id}
                            className="bg-white rounded-2xl shadow-lg p-6 min-w-[300px] transform transition-transform hover:scale-105"
                        >
                            <img src={medicine.image} alt={medicine.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                            <h3 className="text-2xl font-semibold text-blue-600">{medicine.title}</h3>
                            <p className="text-gray-600 mt-2">{medicine.description}</p>
                            <p className="text-gray-500 mt-2"><strong>Benefits:</strong> {medicine.benefits}</p>
                        </div>
                    ))}
                </div>
            </div>


            {/* Section 2: Browse Medicines and Health Conditions */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Browse Medicines & Health Conditions</h2>
                <div className="flex overflow-x-auto space-x-6 scrollbar-hide p-2">
                    {healthConditions.map((condition) => (
                        <div
                            key={condition.id}
                            className="bg-white rounded-2xl shadow-lg p-6 min-w-[280px] transform transition-transform hover:scale-105"
                        >
                            <img src={condition.image} alt={condition.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                            <h3 className="text-2xl font-semibold text-blue-600">{condition.name}</h3>
                            <p className="text-gray-600 mt-2">{condition.description}</p>
                        </div>
                    ))}
                </div>
            </div>


            {/* Section 3: Know Your Medicine */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Know Your Medicine</h2>
                <img src={MedicineImage} alt="Know Your Medicine" className="w-full h-64 object-cover rounded-lg mb-6 shadow-md" />
                <p className="text-gray-700 leading-relaxed text-lg">
                    Understanding your medication is crucial for effective treatment. Always read the label and follow your healthcare provider's instructions.
                </p>
            </div>

            {/* Section 4: Disclaimer */}
            <div className="bg-gray-100 rounded-2xl shadow-lg p-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Disclaimer</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                    We’ve made all possible efforts to ensure that the information provided here is accurate, up-to-date, and complete. However, it should not be treated as a substitute for professional medical advice, diagnosis, or treatment.
                    TAMDCare provides a reference source for common information on medicines but does not guarantee its accuracy or completeness. Always consult your healthcare provider before making any medical decisions.
                </p>
            </div>
        </div>
    );
};

export default ReadAboutMedicines;
