const nodemailer = require('nodemailer');

/**
 * Creates a configured Nodemailer transporter using Vercel environment variables.
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.resend.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USERNAME || 'resend',
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

/**
 * Generates the HTML content for the approval email.
 * @param {Object} booking 
 * @returns {string} HTML email string
 */
function generateApprovalEmailHtml(booking) {
  const serviceName = booking.service_name || booking.service || 'Physiotherapy Assessment';
  const therapistName = booking.therapist_name ? booking.therapist_name : 'your physiotherapist';
  const clinicName = process.env.EMAIL_FROM_NAME || 'NEXmove Physio';
  
  // Format date if needed, assuming it's a string like YYYY-MM-DD from DB
  let formattedDate = booking.preferred_date;
  if (formattedDate) {
    try {
      const d = new Date(formattedDate);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      }
    } catch(e) {}
  }

  const time = booking.preferred_time || 'TBD';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <h2 style="color: #087f80; text-align: center; border-bottom: 2px solid #eaf7f6; padding-bottom: 10px;">Appointment Confirmed</h2>
      <p>Hello <strong>${booking.full_name || booking.name}</strong>,</p>
      <p>Your physiotherapy appointment has been officially approved. Please find the details of your upcoming visit below.</p>
      
      <div style="background-color: #f5f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #182535;">Appointment Details:</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li style="margin-bottom: 10px;"><strong>Date:</strong> ${formattedDate}</li>
          <li style="margin-bottom: 10px;"><strong>Time:</strong> ${time}</li>
          <li style="margin-bottom: 10px;"><strong>Service:</strong> ${serviceName}</li>
          <li style="margin-bottom: 10px;"><strong>Practitioner:</strong> ${therapistName}</li>
        </ul>
      </div>

      <p>If you need to reschedule or cancel your appointment, please contact us as soon as possible.</p>
      <p>We look forward to seeing you.</p>
      
      <br>
      <p style="margin-bottom: 5px;">Regards,</p>
      <p style="font-weight: bold; color: #087f80; margin-top: 0;">${clinicName}</p>
    </div>
  `;
}

/**
 * Sends an approval confirmation email to the client.
 * @param {Object} booking 
 * @returns {Promise<Object>} { success: boolean, error?: string }
 */
async function sendApprovalEmail(booking) {
  if (!process.env.SMTP_PASSWORD) {
    console.error('Email failed: SMTP_PASSWORD is not configured in Vercel environment variables.');
    return { success: false, error: 'SMTP configuration is missing.' };
  }

  const transporter = createTransporter();
  const fromEmail = process.env.SMTP_FROM || 'noreply@nexmove.example.com'; // User needs to configure their actual domain
  const fromName = process.env.EMAIL_FROM_NAME || 'NEXmove Physio';

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: booking.email,
      subject: 'Your Physiotherapy Appointment is Confirmed',
      html: generateApprovalEmailHtml(booking),
      text: `Hello ${booking.full_name || booking.name},\n\nYour physiotherapy appointment for ${booking.preferred_date} at ${booking.preferred_time} has been approved.\n\nRegards,\n${fromName}`
    });

    console.log(`Approval email sent successfully to ${booking.email} (Message ID: ${info.messageId})`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send approval email to ${booking.email}:`, error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendApprovalEmail
};
