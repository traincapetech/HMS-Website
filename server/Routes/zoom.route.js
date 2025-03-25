//zoom.route.js
import express from "express";
import {generateZoomMeeting} from "../zoom.service.js";

const router = express.Router();

//Routes
router.post("/ZoomMeeting", async(req, res) => {
    try{
        await generateZoomMeeting();
        res.status(200).json({message :" Zoom Meeting Created Successfully"});
    } catch (error){
        console.error("Error creating Zoom Meeting", error);
        res.status(500).json({error: "Failed to create meeting"});
}
});


export default router;