import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VideocallHome = () => {
    const [channelName, setChannelName] = useState("");
    const navigate = useNavigate();

    const joinRoom = () => {
        if (channelName.trim() !== "") {
            navigate(`/room/${channelName}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-semibold text-center mb-4">Welcome to Video Call</h1>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Channel Name"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                />
                <button
                    className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                    onClick={joinRoom}
                >
                    Join Room
                </button>
            </div>
        </div>
    );
};

export default VideocallHome;
