//zoom.service.js
import fetch from "node-fetch";
import base64 from "base-64";
import nodemailer from "nodemailer";

const ZoomAccountId = "upoJUPN9SOOrNYnKHqMAqA";
const ZoomClientId = "BV1rBaqNTeGXQ2hDTs8iLQ";
const ZoomClientSecret = "4foaqQih9ZHFLsJ2q1a7wjXjlDfBGSUo";


//create a transporter object using your email service 
const transporter = nodemailer.createTransport({
   host: "smtp.hostinger.com",
   port: 465,
   secure: true,
   auth:{
    user: "support@tamdhealth.com",
    pass: "Tamd@1289",
   }
});

//function to send email
const sendEmail = async({to, subject, html}) =>{
    try{
        const mailOptions ={
            from: "support@tamdhealth.com",
            to: to,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent to: ", to,"Response: ",info.response);
        return info;
    } catch (error){
        console.log("Error sending email: ",to,"Error:", error);
        throw error;
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

const generateZoomMeeting = async({patientEmail, startTime, topic}) => {
    try {
        const zoomAccessToken = await generateZoomAccessToken();

        //format the start time
        const startTimeISO = new Date(startTime).toISOString();


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
                    schedule_for: 'support@tamdhealth.com', //host email 
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
                    // contact_email: 'sumitjain8061@gmail.com', //doctor email
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
                        //  {email : 'naureen.130613@gmail.com'},
                        //  {email: 'sumitjain8061@gmail.com'},
                        {email: patientEmail},
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
        
        if(!response.ok){
            throw new Error(jsonResponse.message || 'Failed to create zoom meeting');
        }

        if(jsonResponse.id){
            console.log('Meeting created successfully. Meeting id: ', jsonResponse.id);
            console.log('Join URL: ', jsonResponse.join_url);
            console.log('Password: ',jsonResponse.password);

            // //define the invitees
            // const invitees = [
            //     // {email: 'ab852759@gmail.com'},
            //     {email : patientEmail},
           // ];


           // return the meeting details 
           return{
            id: jsonResponse.id,
            join_url: jsonResponse.join_url,
            password: jsonResponse.password,
            start_time: jsonResponse.start_time,
           };
        }else{
            throw new Error('Failed to create zoom meeting');
        }
    }
    catch (error) {
        console.error("generateZoomMeeting Error --> ", error);
        throw error;
    }
};

    //         //email content
    //         const subject ="Invitation : zoom meeting";
    //         const text = `you are invited to zoom meeting.
    //         Meeting ID: ${jsonResponse.id}
    //         Join URL: ${jsonResponse.join_url}
    //         Password: ${jsonResponse.password}`;

    //         //send emails to each invitees
    //         for(const invitee of invitees){
    //             console.log('Sending email to: ', patientEmail);
    //             await sendEmail(patientEmail, subject, text);
    //         }
    //     }else{
    //         console.log('Failed to create meeting', jsonResponse);
    //     }

    //     console.log("generateZoomMeeting jsonResponse -->", jsonResponse);
    // }catch (error) {
    //     console.log("genrateZoomMeeting Error --> ", error);
    //     throw error;
    // }

//     return {
//         id: jsonResponse.id,
//         join_url: jsonResponse.join_url,
//         password: jsonResponse.password,
//         start_time: jsonResponse.start_time
//     };


// }

//generateZoomAccessToken();
export {generateZoomMeeting, sendEmail};