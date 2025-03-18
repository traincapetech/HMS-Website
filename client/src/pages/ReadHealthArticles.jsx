import React, { useEffect, useState } from "react";
import Yoga from "../assets/Exercises.jpg";
import Healthy from "../assets/Healthy.webp";
import Awareness from "../assets/Awareness.webp";
import Hydration from "../assets/Hydration.jpg";
import stress from "../assets/Stress.webp";
import Sleep from "../assets/Sleep.jpg";
import Mindfulness from "../assets/Mindfulness.jpg";
import Outdoor from "../assets/Outdoor.jpg";
import Nutrition from "../assets/Nutrition.webp";
import Checkup from "../assets/Checkup.webp";
import Relationships from "../assets/Relationships.webp";
import Fiber from "../assets/Fiber.webp";
import YogaBenefits from "../assets/YogaBenefits.webp";
import Snacks from "../assets/Snacks.jpeg";

const articles = [
  {
    id: 1,
    title: "The Benefits of Regular Exercise",
    subtitle: "Why staying active is essential for health",
    image: Yoga,
    content: [
      "Improves cardiovascular health.",
      "Boosts mental well-being.",
      "Strengthens muscles and bones.",
      "Reduces the risk of chronic diseases.",
      "Enhances mood and reduces anxiety.",
      "Improves sleep quality.",
      "Increases energy levels.",
      "Promotes better overall health."
    ]
  },
  {
    id: 2,
    title: "Healthy Eating Habits",
    subtitle: "A guide to balanced nutrition",
    image: Healthy,
    content: [
      "Rich in fruits, vegetables, and whole grains.",
      "Supports overall well-being.",
      "Helps prevent chronic diseases.",
      "Focus on portion control.",
      "Limit processed foods high in sugar.",
      "Incorporate lean proteins.",
      "Stay hydrated.",
      "Enjoy a variety of foods for balanced nutrition."
    ]
  },
  {
    id: 3,
    title: "Mental Health Awareness",
    subtitle: "Understanding the importance of mental well-being",
    image: Awareness,
    content: [
      "Mental health is as important as physical health.",
      "Practicing mindfulness can reduce stress.",
      "Seek professional help when needed.",
      "Engage in regular physical activity.",
      "Prioritize self-care and emotional well-being.",
      "Recognize signs of mental health issues.",
      "Build a support network.",
      "Practice gratitude and positive thinking."
    ]
  },
  {
    id: 4,
    title: "Importance of Hydration",
    subtitle: "Why water is crucial for your body",
    image: Hydration,
    content: [
      "Regulates body temperature.",
      "Keeps skin healthy.",
      "Supports overall bodily functions.",
      "Aids in digestion and nutrient absorption.",
      "Improves energy levels.",
      "Enhances cognitive function.",
      "Promotes healthy weight management.",
      "Aids in detoxification."
    ]
  },
  {
    id: 5,
    title: "Managing Stress Effectively",
    subtitle: "Techniques to reduce daily stress",
    image: stress,
    content: [
      "Practice meditation and mindfulness.",
      "Engage in regular physical activity.",
      "Establish a healthy sleep routine.",
      "Identify stressors and develop coping strategies.",
      "Practice deep breathing exercises.",
      "Maintain a balanced diet.",
      "Connect with friends and family.",
      "Consider professional counseling if needed."
    ]
  },
  {
    id: 6,
    title: "Sleep Hygiene",
    subtitle: "Tips for a better night's sleep",
    image: Sleep,
    content: [
      "Establish a regular sleep schedule.",
      "Create a restful environment.",
      "Limit screen time before bed.",
      "Avoid caffeine and heavy meals before sleep.",
      "Engage in relaxing activities before bedtime.",
      "Keep your bedroom dark and cool.",
      "Consider using white noise or calming music.",
      "Practice relaxation techniques."
    ]
  },
  {
    id: 7,
    title: "The Power of Mindfulness",
    subtitle: "How mindfulness can improve your life",
    image: Mindfulness,
    content: [
      "Reduces anxiety and stress.",
      "Improves focus and concentration.",
      "Enhances emotional resilience.",
      "Promotes self-awareness.",
      "Encourages a positive outlook.",
      "Can be practiced through meditation.",
      "Incorporates mindful breathing techniques.",
      "Helps in managing difficult emotions."
    ]
  },
  {
    id: 8,
    title: "Benefits of Outdoor Activities",
    subtitle: "Why spending time outside is good for you",
    image: Outdoor,
    content: [
      "Boosts mood and reduces stress.",
      "Increases physical fitness.",
      "Promotes social interaction.",
      "Enhances creativity and cognitive function.",
      "Provides exposure to sunlight for vitamin D.",
      "Encourages a connection with nature.",
      "Can improve sleep quality.",
      "Offers opportunities for adventure and exploration."
    ]
  },
  {
    id: 9,
    title: "Understanding Nutrition Labels",
    subtitle: "How to read and interpret food labels",
    image: Nutrition,
    content: [
      "Pay attention to serving sizes.",
      "Check calories and key nutrients.",
      "Look for added sugars and unhealthy fats.",
      "Understand the % Daily Value (%DV).",
      "Choose foods with higher fiber content.",
      "Be aware of allergens listed.",
      "Use labels to make informed choices.",
      "Compare products to find healthier options."
    ]
  },
  {
    id: 10,
    title: "The Importance of Routine Checkups",
    subtitle: "Why regular health screenings matter",
    image: Checkup,
    content: [
      "Detect health issues early.",
      "Stay on track with health goals.",
      "Routine screenings for blood pressure and cholesterol.",
      "Can lead to early intervention.",
      "Helps maintain a healthy lifestyle.",
      "Encourages open communication with healthcare providers.",
      "Provides an opportunity for vaccinations.",
      "Promotes overall health awareness."
    ]
  },
  {
    id: 11,
    title: "Building Healthy Relationships",
    subtitle: "The role of social connections in well-being",
    image: Relationships,
    content: [
      "Provide emotional support.",
      "Reduce stress and anxiety.",
      "Enhance overall happiness.",
      "Encourage open communication.",
      "Foster trust and mutual respect.",
      "Engage in shared activities.",
      "Support each other's goals.",
      "Build a strong support network."
    ]
  },
  {
    id: 12,
    title: "The Role of Fiber in Your Diet",
    subtitle: "Why fiber is essential for digestive health",
    image: Fiber,
    content: [
      "Improves digestion and regularity.",
      "Regulates blood sugar levels.",
      "Promotes heart health.",
      "Helps maintain a healthy weight.",
      "Increases feelings of fullness.",
      "Reduces the risk of certain diseases.",
      "Found in fruits, vegetables, and whole grains.",
      "Aids in detoxification."
    ]
  },
  {
    id: 13,
    title: "Understanding Food Allergies",
    subtitle: "Recognizing and managing food allergies",
    image: Awareness,
    content: [
      "Be aware of common allergens.",
      "Recognize symptoms of food allergies.",
      "Consult with a healthcare professional for testing.",
      "Read food labels carefully.",
      "Avoid cross-contamination.",
      "Carry an epinephrine auto-injector if prescribed.",
      "Educate friends and family about your allergies.",
      "Create an emergency action plan."
    ]
  },
  {
    id: 14,
    title: "The Benefits of Yoga",
    subtitle: "How yoga can enhance physical and mental health",
    image: YogaBenefits,
    content: [
      "Improves flexibility and balance.",
      "Reduces stress and anxiety.",
      "Promotes mindfulness and relaxation.",
      "Enhances physical strength.",
      "Supports mental clarity and focus.",
      "Can be adapted for all fitness levels.",
      "Encourages a sense of community.",
      "Improves overall well-being."
    ]
  },
  {
    id: 15,
    title: "Healthy Snacking Options",
    subtitle: "Choosing nutritious snacks for better health",
    image: Snacks,
    content: [
      "Opt for fruits, nuts, and yogurt.",
      "Choose whole-grain options.",
      "Avoid processed snacks high in sugar.",
      "Plan your snacks to avoid unhealthy choices.",
      "Incorporate protein-rich snacks.",
      "Stay mindful of portion sizes.",
      "Experiment with healthy recipes.",
      "Make snacking a part of a balanced diet."
    ]
  },
];

const ReadHealthArticles = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Read Health Articles</h1>
      
      {selectedArticle ? (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <button onClick={() => setSelectedArticle(null)} className="text-blue-600 underline mb-4">Back</button>
          <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-60 object-cover rounded-lg mb-4" />
          <h2 className="text-3xl font-semibold">{selectedArticle.title}</h2>
          <h3 className="text-xl font-medium text-gray-700 mt-2">{selectedArticle.subtitle}</h3>
          <ul className="list-disc list-inside mt-4 text-gray-700">
            {selectedArticle.content.map((point, index) => (
              <li key={index} className="mb-2">{point}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(article => (
            <div key={article.id} className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition" onClick={() => setSelectedArticle(article)}>
              <img src={article.image} alt={article.title} className="w-full h-40 object-cover rounded-lg" />
              <h3 className="text-xl font-semibold mt-4">{article.title}</h3>
              <p className="text-gray-600 mt-2">{article.subtitle}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadHealthArticles;