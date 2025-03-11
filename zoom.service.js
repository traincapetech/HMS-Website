//zoom.service.js
import fetch from "node-fetch";
import base64 from "base-64";

const ZoomAccountId = "dYnaii3oR4K7Z2ddvdHn9w";
const ZoomClientId = "ZAbcvuI5S7CnaXV77UgC0Q";
const ZoomClientSecret = "KqC5kk5Et4I0r13i076VrBjp2XJ86ISq";

const getAuthHeaders = () => {
    return {
        Authorization: `Basic ${base64.encode(`${ZoomClientId}:${ZoomClientSecret}`)}`,
        'Content-Type': 'application/json' 
    }
}

const generateZoomAccessToken = async() => {
    try {
        const response = await fetch(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZoomAccountId}`, 
            {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    grant_type: "account_credentials",
                    account_id: ZoomAccountId,
                })
            }
        );

        const jsonResponse = await response.json();
        // console.log("GenerateZoomAccessToken JsonResponse --> ", jsonResponse);

        return jsonResponse?.access_token;

    } catch (error) {
        console.log("GenerateZoomAccessToken Error :", error);
        throw error;
    }
};

const generateZoomMeeting = async(patientEmail) => {
    try {
        const zoomAccessToken = await generateZoomAccessToken();
        const response = await fetch(
            'https://api.zoom.us/v2/users/me/meetings',
            {
                method: "POST",
                headers: {
                    "Content-Type" : 'application/json',
                    'Authorization': `Bearer ${zoomAccessToken}`
                },
                body: JSON.stringify({
                    agenda: 'Zoom Meeting',
                    default_password: false,
                    duration: 60, 
                    password: '123456',
                    schedule_for: 'blacksaura2@gmail.com', //host email 
                    settings: {
                        allow_multiple_devices: true,
                        // alternative_hosts: 'sumitjain8061@gmail.com', //doctors and
                        // alternative_hosts_email_notification: true,
                        auto_recording: 'cloud', 
                        breakout_room: {
                             enable: true,
                        },
                    //     breakout_room: {
                    //         enable: true,
                    //         rooms: [
                    //         {
                    //           name: 'room1', 
                    //           participants: ['jchill@example.com', 'abc@gmail.com'],
                    //         },
                    //     ],
                    // },
                    calendar_type: 1, 
                    contact_email: 'sumitjain8061@gmail.com', //doctor email
                    contact_name: 'Jill Chill', //doctor name
                    email_notification: true,
                    encryption_type: 'enhanced_encryption',
                    focus_mode: true,
                  //  global_dial_in_countries: ['US'], 
                    host_video: true,
                    join_before_host: false,
                    meeting_authentication: true,
                    meeting_invitees: [{
                        email: patientEmail, //invites the patient 
                      },],
                      mute_upon_entry: true,
                      participant_video: true,
                      private_meeting: true,
                      waiting_room: false,
                      watermark: false,
                      continuous_meeting_chat: {
                        enable: true,
                      },
                    },
                    // start_time: new Date().toLocaleDateString(),
                    start_time: new Date().toISOString(), // Use ISO string for date format
                    timezone: 'Asia/Delhi',
                    topic: 'TAMD Appointment Meeting',
                    type: 2 //1 for instant meeting, 2 for scheduled meeting
                }),
            }
        );

        const jsonResponse = await response.json();

        console.log("generateZoomMeeting jsonResponse -->", jsonResponse);
    } catch (error) {
        console.log("genrateZoomMeeting Error --> ", error);
        throw error;
    }
};


export {generateZoomMeeting};

//generateZoomAccessToken();
//generateZoomMeeting();