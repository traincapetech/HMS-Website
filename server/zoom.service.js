//zoom.service.js
import fetch from "node-fetch";
import base64 from "base-64";
import nodemailer from "nodemailer";

const ZoomAccountId = "dYnaii3oR4K7Z2ddvdHn9w";
const ZoomClientId = "ZAbcvuI5S7CnaXV77UgC0Q";
const ZoomClientSecret = "KqC5kk5Et4I0r13i076VrBjp2XJ86ISq";


//create a transporter object using your email service 
const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 587,
   secure: false, // true for 465, false for other ports
   auth: {
       user: "support@tamdhealth.com",
       pass: "Tamd@1289",
   },
});

//function to send email
const sendEmail = async(to, subject, text, html) =>{
    try{
        if (!to || typeof to !== 'string' || !to.trim()) {
            console.error("Invalid recipient email:", to);
            return;
        }
        
        const mailOptions = {
            from: '"TAMD Health Support" <support@tamdhealth.com>',
            to: to,
            subject: subject,
            text: text,
            html: html || undefined, // Only include if html is provided
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent to: ", to,"Response: ",info.response);
        return true;
    } catch (error){
        console.log("Error sending email: ",to,"Error:", error);
        return false;
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

const generateZoomMeeting = async(doctorEmail, userEmail) => {
    try {
        // Validate email parameters
        if (!doctorEmail || typeof doctorEmail !== 'string') {
            console.error("Invalid doctor email:", doctorEmail);
            doctorEmail = "doctor@example.com"; // Fallback for testing
        }
        
        if (!userEmail || typeof userEmail !== 'string') {
            console.error("Invalid user email:", userEmail);
            userEmail = "patient@example.com"; // Fallback for testing
        }

        console.log("Generating meeting for doctor:", doctorEmail, "and user:", userEmail);
        
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
                    agenda: 'TAMD Doctor Appointment',
                    default_password: false,
                    duration: 60, 
                    password: '123456',
                    schedule_for: 'support@tamdhealth.com', // Update to TAMD support email
                    settings: {
                        allow_multiple_devices: true,
                        auto_recording: 'cloud', 
                        breakout_room: {
                             enable: true,
                        },
                    calendar_type: 1, 
                    contact_email: 'support@tamdhealth.com', // Update to TAMD support email
                    contact_name: 'TAMD Health Support', // Updated name
                    email_notification: true,
                    encryption_type: 'enhanced_encryption',
                    focus_mode: true,
                    host_video: true,
                    join_before_host: true,
                    meeting_authentication: true,
                    meeting_invitees: [
                         {email: userEmail}, // User/patient email
                         {email: doctorEmail}, // Doctor email
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

            // Define the invitees with valid emails
            const invitees = [];
            
            if (userEmail && typeof userEmail === 'string' && userEmail.trim()) {
                invitees.push({ email: userEmail, type: 'Patient' });
            }
            
            if (doctorEmail && typeof doctorEmail === 'string' && doctorEmail.trim()) {
                invitees.push({ email: doctorEmail, type: 'Doctor' });
            }

            // Create HTML email template
            const createHtmlEmail = (recipientType) => {
                return `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #b22222; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .meeting-details { background-color: white; border-left: 4px solid #b22222; padding: 15px; margin: 20px 0; }
                        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                        .button { display: inline-block; background-color: #b22222; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>TAMD Health Video Consultation</h1>
                        </div>
                        <div class="content">
                            <p>Dear ${recipientType},</p>
                            <p>You are invited to a TAMD video appointment. Please join the meeting at your scheduled appointment time.</p>
                            
                            <div class="meeting-details">
                                <h3>Meeting Details</h3>
                                <p><strong>Meeting ID:</strong> ${jsonResponse.id}</p>
                                <p><strong>Password:</strong> ${jsonResponse.password}</p>
                            </div>
                            
                            <p style="text-align: center; margin: 30px 0;">
                                <a href="${jsonResponse.join_url}" class="button" target="_blank">Join Video Consultation</a>
                            </p>
                            
                            <p><strong>Note:</strong> If the button above doesn't work, you can copy and paste the following link into your browser:</p>
                            <p style="word-break: break-all;">${jsonResponse.join_url}</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message from TAMD Health. Please do not reply to this email.</p>
                            <p>&copy; 2023 TAMD Health. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                `;
            };

            // Plain text email content
            const subject = "TAMD Health: Your Video Consultation Information";
            const text = `
TAMD Health Video Consultation

You are invited to a TAMD video appointment.

Meeting Details:
Meeting ID: ${jsonResponse.id}
Join URL: ${jsonResponse.join_url}
Password: ${jsonResponse.password}

Please join the meeting at your scheduled appointment time.

This is an automated message from TAMD Health. Please do not reply to this email.
`;

            // Send emails to each invitee
            const emailPromises = [];
            for(const invitee of invitees){
                console.log('Sending email to: ', invitee.email);
                if (invitee.email && typeof invitee.email === 'string' && invitee.email.trim()) {
                    const htmlEmail = createHtmlEmail(invitee.type);
                    emailPromises.push(sendEmail(invitee.email, subject, text, htmlEmail));
                } else {
                    console.error("Invalid email in invitees:", invitee);
                }
            }

            // Wait for all emails to be sent
            await Promise.all(emailPromises);
            
            // Return the meeting details so they can be used or stored
            return {
                meetingId: jsonResponse.id,
                joinUrl: jsonResponse.join_url,
                password: jsonResponse.password
            };
        } else {
            console.log('Failed to create meeting', jsonResponse);
            throw new Error('Failed to create Zoom meeting');
        }
    } catch (error) {
        console.log("generateZoomMeeting Error --> ", error);
        throw error;
    }
}

//generateZoomAccessToken();
export {generateZoomMeeting};