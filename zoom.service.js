//zoom.service.js
import fetch from "node-fetch";
import base64 from "base-64";
import nodemailer from "nodemailer";

const ZoomAccountId = "dYnaii3oR4K7Z2ddvdHn9w";
const ZoomClientId = "ZAbcvuI5S7CnaXV77UgC0Q";
const ZoomClientSecret = "KqC5kk5Et4I0r13i076VrBjp2XJ86ISq";


//create a transporter object using your email service 
const transporter = nodemailer.createTransport({
//    host: "smtp.mailtrap.io",
//    port: 2525,
    service: "gmail",
    auth: {
        user: "blacksaura2@gmail.com",
        //pass: "kumar737498@Saurav",
        pass: "tbxq zjye tbjf rrvn",
    },
});

//function to send email
const sendEmail = async(to, subject, text) =>{
    try{
        const mailOptions ={
            from: "blacksaura2@gmail.com",
            to: to,
            subject: subject,
            text: text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent to: ", to,"Response: ",info.response);
    } catch (error){
        console.log("Error sending email: ",to,"Error:", error);
    }
};

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

const generateZoomMeeting = async() => {
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
                    join_before_host: true,
                    meeting_authentication: true,
                    meeting_invitees: [
                        // {email: 'naureen.130613@gmail.com'}, //invites are going to be both doctor and patient email 
                         {email : 'naureen.130613@gmail.com'},
                         {email: 'sumitjain8061@gmail.com'},
                    ],
                      mute_upon_entry: true,
                      participant_video: true,
                      private_meeting: true,
                      waiting_room: false,
                      watermark: false,
                      continuous_meeting_chat: {
                        enable: true,
                      },
                    },
                    start_time: new Date().toLocaleDateString(),
                    timezone: 'Asia/Delhi',
                    topic: 'TAMD Appointment Meeting',
                    type: 2 //1 for instant meeting, 2 for scheduled meeting
                }),
            }
        );

        const jsonResponse = await response.json();

        if(jsonResponse.id){
            console.log('Meeting created successfully. Meeting id: ', jsonResponse.id);
            console.log('Join URL: ', jsonResponse.join_url);
            console.log('Password: ',jsonResponse.password);

            //define the invitees
            const invitees = [
                {email: 'naureen.130613@gmail.com'},
                {email: 'sumitjain8061@gmail.com'},
            ];


            //email content
            const subject ="Invitation : zoom meeting";
            const text = `you are invited to zoom meeting.
            Meeting ID: ${jsonResponse.id}
            Join URL: ${jsonResponse.join_url}
            Password: ${jsonResponse.password}`;

            //send emails to each invitees
            for(const invitee of invitees){
                console.log('Sending email to: ', invitee.email);
                await sendEmail(invitee.email, subject, text);
            }
        }else{
            console.log('Failed to create meeting', jsonResponse);
        }

        console.log("generateZoomMeeting jsonResponse -->", jsonResponse);
    } catch (error) {
        console.log("genrateZoomMeeting Error --> ", error);
        throw error;
    }
}

//generateZoomAccessToken();
export {generateZoomMeeting};