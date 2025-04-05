import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });
};

/**
 * Send appointment confirmation email to patient
 * @param {Object} data - Appointment data
 * @param {string} data.to - Recipient email
 * @param {string} data.name - Patient name
 * @param {string} data.doctor - Doctor name
 * @param {string} data.date - Appointment date
 * @param {string} data.time - Appointment time
 * @param {string} data.zoomLink - Zoom meeting link (optional)
 * @param {string} data.zoomPassword - Zoom meeting password (optional)
 */
export const sendAppointmentConfirmation = async (data) => {
  const { to, name, doctor, date, time, zoomLink, zoomPassword } = data;
  
  if (!to || !name || !doctor || !date || !time) {
    console.error('Missing required data for appointment confirmation email');
    throw new Error('Missing required data for email');
  }
  
  // Format date to be more readable
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Create email transporter
  const transporter = createTransporter();
  
  // Build email content with conditional Zoom details
  let zoomSection = '';
  if (zoomLink) {
    zoomSection = `
      <div style="margin-top: 20px; margin-bottom: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 5px;">
        <h3 style="color: #0066cc; margin-top: 0;">Video Consultation Details</h3>
        <p>Your appointment will take place via Zoom. Please join the meeting 5 minutes before your appointment time.</p>
        <p><strong>Zoom Link:</strong> <a href="${zoomLink}" target="_blank">${zoomLink}</a></p>
        ${zoomPassword ? `<p><strong>Meeting Password:</strong> ${zoomPassword}</p>` : ''}
        <p><em>Note: If you've never used Zoom before, you may need to download the app or browser extension.</em></p>
      </div>
    `;
  }
  
  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER || '"HMS Support" <your-email@gmail.com>',
    to,
    subject: `Appointment Confirmation with Dr. ${doctor}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Appointment Confirmed</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${name},</p>
          
          <p>Your appointment has been successfully scheduled. Here are the details:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Doctor:</strong> Dr. ${doctor}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${time}</p>
          </div>
          
          ${zoomSection}
          
          <h3>Preparing for Your Appointment</h3>
          <ul>
            <li>Have your medical history ready</li>
            <li>Prepare a list of any medications you're currently taking</li>
            <li>Write down any questions you have for the doctor</li>
            <li>Find a quiet, well-lit area for your video consultation</li>
          </ul>
          
          <p>If you need to reschedule or cancel your appointment, please do so at least 24 hours in advance.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666;">Thank you for choosing our services.</p>
            <p style="color: #666;">Best regards,<br>The HMS Team</p>
          </div>
        </div>
      </div>
    `
  };
  
  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Appointment confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    throw error;
  }
};

/**
 * Send notification email to doctor about new appointment
 * @param {Object} data - Appointment data
 */
export const sendDoctorNotification = async (data) => {
  const { doctorEmail, doctorName, patientName, date, time, zoomLink } = data;
  
  if (!doctorEmail || !doctorName || !patientName || !date || !time) {
    console.error('Missing required data for doctor notification email');
    throw new Error('Missing required data for email');
  }
  
  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Create email transporter
  const transporter = createTransporter();
  
  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER || '"HMS System" <your-email@gmail.com>',
    to: doctorEmail,
    subject: `New Appointment: ${patientName} on ${formattedDate}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a73e8; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">New Appointment</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear Dr. ${doctorName},</p>
          
          <p>You have a new appointment scheduled with a patient. Here are the details:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Patient:</strong> ${patientName}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${time}</p>
            ${zoomLink ? `<p><strong>Zoom Link:</strong> <a href="${zoomLink}" target="_blank">${zoomLink}</a></p>` : ''}
          </div>
          
          <p>Please log in to your dashboard to view more details about this appointment and the patient.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666;">Thank you for your service.</p>
            <p style="color: #666;">Best regards,<br>The HMS Team</p>
          </div>
        </div>
      </div>
    `
  };
  
  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Doctor notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending doctor notification email:', error);
    throw error;
  }
}; 