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

/**
 * Sends a notification email to the admin when a new physio application is submitted.
 * @param {Object} application 
 * @returns {Promise<Object>} { success: boolean, error?: string }
 */
async function sendAdminPhysioApplicationNotification(application) {
  if (!process.env.SMTP_PASSWORD) {
    console.error('Email failed: SMTP_PASSWORD is not configured in environment variables.');
    return { success: false, error: 'SMTP configuration is missing.' };
  }

  const transporter = createTransporter();
  const fromEmail = process.env.SMTP_FROM || 'noreply@nexmove.example.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'NEXmove Physio System';
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM || 'admin@nexmove.example.com';

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: adminEmail,
      subject: 'New Physiotherapist Application Submitted',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <h2 style="color: #087f80; border-bottom: 2px solid #eaf7f6; padding-bottom: 10px;">New Application Received</h2>
          <p>A new "Join as Physio" application has been submitted.</p>
          
          <div style="background-color: #f5f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <ul style="list-style: none; padding-left: 0;">
              <li style="margin-bottom: 10px;"><strong>Name:</strong> ${application.full_name}</li>
              <li style="margin-bottom: 10px;"><strong>Email:</strong> ${application.email}</li>
              <li style="margin-bottom: 10px;"><strong>Phone:</strong> ${application.phone}</li>
              <li style="margin-bottom: 10px;"><strong>City:</strong> ${application.city}</li>
              <li style="margin-bottom: 10px;"><strong>HCPC Number:</strong> ${application.hcpc_number || 'N/A'}</li>
            </ul>
          </div>

          <p>Log in to the Admin Dashboard to review the complete application.</p>
        </div>
      `,
      text: `A new "Join as Physio" application has been submitted by ${application.full_name} (${application.email}). Please check the admin dashboard for details.`
    });

    console.log(`Admin notification email sent successfully (Message ID: ${info.messageId})`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send admin notification email:`, error);
    return { success: false, error: error.message };
  }
}


function escapePractitionerEmailHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function sendPhysioPasswordResetEmail(account) {
  if (!process.env.SMTP_PASSWORD) {
    console.error('Practitioner password reset email failed: SMTP_PASSWORD is not configured.');
    return { success: false, error: 'SMTP configuration is missing.' };
  }

  const transporter = createTransporter();
  const fromEmail = process.env.SMTP_FROM || 'noreply@nexmove.example.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'NEXmove Physio';
  const safeName = escapePractitionerEmailHtml(account.full_name || 'Practitioner');
  const safeResetUrl = escapePractitionerEmailHtml(account.reset_url || '');

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: account.email,
      subject: 'Reset your NEXmove Practitioner Portal password',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#26343d;line-height:1.6">
          <h2 style="color:#1B2A4A">Reset your practitioner password</h2>
          <p>Hello <strong>${safeName}</strong>,</p>
          <p>Use the button below to reset your NEXmove Practitioner Portal password. This link expires in 60 minutes.</p>
          <p style="margin:28px 0">
            <a href="${safeResetUrl}" style="display:inline-block;background:#1B2A4A;color:#fff;text-decoration:none;padding:13px 20px;border-radius:10px;font-weight:700">Reset password</a>
          </p>
          <p>If you did not request this, you can ignore this email.</p>
          <p style="color:#667178;font-size:13px">For security, never share this reset link with anyone.</p>
        </div>
      `,
      text: `Hello ${account.full_name || 'Practitioner'},\n\nReset your NEXmove Practitioner Portal password using this link:\n${account.reset_url}\n\nThis link expires in 60 minutes.\n`
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send practitioner password reset email to ${account.email}:`, error);
    return { success: false, error: error.message };
  }
}


async function sendPhysioVerificationEmail(account) {
  if (!process.env.SMTP_PASSWORD) {
    console.error('Practitioner verification email failed: SMTP_PASSWORD is not configured.');
    return { success: false, error: 'SMTP configuration is missing.' };
  }

  const transporter = createTransporter();
  const fromEmail = process.env.SMTP_FROM || 'noreply@nexmove.example.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'NEXmove Physio';
  // Applicant-provided data must be escaped before insertion into HTML email.
  const safeName = escapePractitionerEmailHtml(account.full_name || 'Practitioner');
  const safeVerifyUrl = escapePractitionerEmailHtml(account.verify_url || '');

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: account.email,
      subject: 'Verify your NEXmove Practitioner Portal email',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#26343d;line-height:1.6">
          <h2 style="color:#1B2A4A">Verify your email</h2>
          <p>Hello <strong>${safeName}</strong>,</p>
          <p>Please verify your email address before submitting your NEXmove practitioner application.</p>
          <p style="margin:28px 0">
            <a href="${safeVerifyUrl}" style="display:inline-block;background:#1B2A4A;color:#fff;text-decoration:none;padding:13px 20px;border-radius:10px;font-weight:700">Verify email</a>
          </p>
          <p>This link expires in 24 hours. If you did not create this account, you can ignore this email.</p>
        </div>
      `,
      text: `Hello ${account.full_name || 'Practitioner'},\n\nVerify your NEXmove Practitioner Portal email:\n${account.verify_url}\n\nThis link expires in 24 hours.\n`
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send practitioner verification email to ${account.email}:`, error);
    return { success: false, error: error.message };
  }
}


async function sendPhysioApplicationStatusEmail(application) {
  if (!process.env.SMTP_PASSWORD || !application.email) {
    return { success: false, error: 'SMTP configuration or recipient is missing.' };
  }

  const transporter = createTransporter();
  const fromEmail = process.env.SMTP_FROM || 'noreply@nexmove.example.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'NEXmove Physio';
  const status = application.status || 'Pending';
  const verification = application.verification_status || 'Not Requested';
  const practitionerStatus = application.practitioner_status || '';

  let guidance = 'You can sign in to the NEXmove Practitioner Portal to see the latest status.';
  if (practitionerStatus === 'Active') {
    guidance = 'Your NEXmove practitioner account is now active. Sign in to manage your practitioner profile and view appointments assigned to you.';
  } else if (verification === 'Required') {
    guidance = 'Action required: sign in to the NEXmove Practitioner Portal and upload the requested verification documents.';
  } else if (verification === 'Issue') {
    guidance = 'Action required: NEXmove has left feedback on one or more verification documents. Sign in to review the note and upload an updated document.';
  } else if (verification === 'Verified' && status === 'Approved') {
    guidance = 'Your application and verification are approved. Your practitioner account is ready for final activation by NEXmove.';
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: application.email,
      subject: `NEXmove practitioner application update — ${status}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#26343d;line-height:1.6">
          <h2 style="color:#1B2A4A">Practitioner application update</h2>
          <p>Hello <strong>${application.full_name || 'Practitioner'}</strong>,</p>
          <p>Your NEXmove practitioner application has been updated.</p>
          <div style="background:#f7f4ed;padding:18px;border-radius:12px;margin:20px 0">
            <p style="margin:0 0 6px"><strong>Application status:</strong> ${status}</p>
            <p style="margin:0 0 6px"><strong>Verification status:</strong> ${verification}</p>
            ${practitionerStatus ? `<p style="margin:0"><strong>Practitioner status:</strong> ${practitionerStatus}</p>` : ''}
          </div>
          <p>${guidance}</p>
          <p><a href="${application.portal_url}" style="color:#1B2A4A;font-weight:700">Open Practitioner Portal</a></p>
        </div>
      `,
      text: `Hello ${application.full_name || 'Practitioner'},\n\nApplication status: ${status}\nVerification status: ${verification}${practitionerStatus ? `\nPractitioner status: ${practitionerStatus}` : ''}\n\n${guidance}\n\n${application.portal_url}\n`
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send practitioner status email to ${application.email}:`, error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendApprovalEmail,
  sendAdminPhysioApplicationNotification,
  sendPhysioPasswordResetEmail,
  sendPhysioVerificationEmail,
  sendPhysioApplicationStatusEmail
};
