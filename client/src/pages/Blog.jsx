import React, { useEffect, useState } from "react";
import Checkup from "../assets/Checkup.jpg";
import Healthy from "../assets/Healthy.jpg";
import Mental from "../assets/Mental.jpg";
import Exercise from "../assets/Exercise.jpg"
const Blog = () => {
    const posts = [
        {
            title: "The Importance of Regular Health Checkups",
            date: "March 15, 2023",
            author: "Dr. Aryan Mehta",
            excerpt: "Regular health checkups are essential for maintaining good health. They help in early detection of potential health issues.",
            content: "Regular health checkups are essential for maintaining good health. They help in early detection of potential health issues, allowing for timely intervention and treatment. It's recommended to have a checkup at least once a year, depending on your age and health history. During these visits, your doctor can monitor your health, provide vaccinations, and offer advice on lifestyle changes.",
            image: Checkup,
            link: "#",
            tags: ["Health", "Wellness", "Prevention"]
        },
        {
            title: "Healthy Eating: Tips for a Balanced Diet",
            date: "March 10, 2023",
            author: "Dr. Neha Sharma",
            excerpt: "Eating a balanced diet is crucial for overall health. Here are some tips to help you maintain a healthy diet.",
            content: "Eating a balanced diet is crucial for overall health. It involves consuming a variety of foods in the right proportions. Focus on fruits, vegetables, whole grains, and lean proteins. Limit processed foods, sugars, and saturated fats. Remember, moderation is key, and it's important to stay hydrated.",
            image: Healthy,
            link: "#",
            tags: ["Nutrition", "Diet", "Health"]
        },
        {
            title: "Understanding Mental Health: A Comprehensive Guide",
            date: "March 5, 2023",
            author: "Dr. Priya Singh",
            excerpt: "Mental health is just as important as physical health. This guide provides insights into maintaining mental well-being.",
            content: "Mental health is just as important as physical health. It encompasses emotional, psychological, and social well-being. To maintain mental health, engage in regular physical activity, practice mindfulness, and seek support when needed. It's essential to recognize the signs of mental health issues and address them promptly.",
            image: Mental,
            link: "#",
            tags: ["Mental Health", "Wellness", "Support"]
        },
        {
            title: "The Benefits of Regular Exercise",
            date: "February 28, 2023",
            author: "Dr. Rohan Verma",
            excerpt: "Regular exercise has numerous benefits for both physical and mental health. Discover how to incorporate exercise into your daily routine.",
            content: "Regular exercise has numerous benefits for both physical and mental health. It helps control weight, reduces the risk of chronic diseases, and improves mood. Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity each week. Find activities you enjoy to make it easier to stick with your routine.",
            image: Exercise,
            link: "#",
            tags: ["Fitness", "Exercise", "Health"]
        },
    ];

    const [expandedPostIndex, setExpandedPostIndex] = useState(null);
    const [search, setSearch] = useState("");

    const togglePost = (index) => {
        setExpandedPostIndex(expandedPostIndex === index ? null : index);
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
        post.author.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
    );
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-6">TAMD Blog</h1>
                <p className="text-lg text-gray-600 text-center mb-8">
                    Explore expert insights, health tips, and wellness guides curated just for you.
                </p>

                {/* Search Bar */}
                <div className="flex justify-center mb-8">
                    <input
                        type="text"
                        placeholder="Search for blogs..."
                        className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Blog Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
                        >
                            <img src={post.image} alt={post.title} className="w-full h-56 object-cover rounded-t-lg" />
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                                <p className="text-sm text-gray-500 mb-1">{post.date} | {post.author}</p>
                                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                                <div className="flex flex-wrap mb-4">
                                    {post.tags.map((tag, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-3 py-1 rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                {post.content && (
                                    <div>
                                        <button
                                            onClick={() => togglePost(index)}
                                            className="hover:cursor-pointer text-blue-600 hover:text-blue-800 font-semibold mb-2 transition-colors"
                                        >
                                            {expandedPostIndex === index ? "Show Less" : "Read More"}
                                        </button>
                                        {expandedPostIndex === index && (
                                            <p className="text-gray-700 mt-2">{post.content}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* No results found */}
                {filteredPosts.length === 0 && (
                    <p className="text-center text-gray-600 text-lg mt-8">
                        No results found. Try searching for something else.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Blog;
