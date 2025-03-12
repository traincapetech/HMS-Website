import React from "react";

const VideoCallControls = ({ onLeave }) => {
    return (
        <div className="flex justify-center mt-4">
            <button 
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                onClick={onLeave}
            >
                Leave Call
            </button>
        </div>
    );
};

export default VideoCallControls;