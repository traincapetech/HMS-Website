import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall";
import axios from "axios";

const VideocallRoom = () => {
    const { channelName } = useParams();
    const [token, setToken] = useState("");

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.post("http://localhost:5000/generate-token", {
                    channelName,
                });
                setToken(response.data.token);
            } catch (error) {
                console.error("Error fetching token:", error);
            }
        };

        fetchToken();
    }, [channelName]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h1 className="text-xl font-semibold">Room: {channelName}</h1>
                {token ? (
                    <VideoCall channelName={channelName} token={token} />
                ) : (
                    <p className="text-gray-500">Loading token...</p>
                )}
            </div>
        </div>
    );
};

export default VideocallRoom;
