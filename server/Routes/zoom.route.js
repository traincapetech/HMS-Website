//zoom.route.js
import express from "express";
import {generateZoomMeeting} from "../zoom.service.js";

const router = express.Router();

//Routes
router.post("/ZoomMeeting", async(req, res) => {
    try{
        const { doctorEmail, userEmail } = req.body;
        
        // Validate input parameters
        if (!doctorEmail || !userEmail) {
            return res.status(400).json({
                success: false,
                message: "Both doctorEmail and userEmail are required"
            });
        }
        
        // Generate Zoom meeting with both email addresses
        const meetingDetails = await generateZoomMeeting(doctorEmail, userEmail);
        
        res.status(200).json({
            success: true,
            message: "Zoom Meeting Created Successfully",
            meetingDetails
        });
    } catch (error){
        console.error("Error creating Zoom Meeting", error);
        res.status(500).json({
            success: false, 
            error: "Failed to create meeting",
            message: error.message
        });
    }
});


export default router;