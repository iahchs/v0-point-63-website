import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is set
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.service || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format the email content
    const emailContent = `
      <h2>New Project Inquiry from Point 63</h2>
      
      <p><strong>Client Information:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${body.name}</li>
        <li><strong>Email:</strong> ${body.email}</li>
        ${body.phone ? `<li><strong>Phone:</strong> ${body.phone}</li>` : ''}
      </ul>
      
      <p><strong>Project Details:</strong></p>
      <ul>
        <li><strong>Service Interested In:</strong> ${body.service}</li>
        ${body.budget ? `<li><strong>Budget Range:</strong> ${body.budget}</li>` : ''}
      </ul>
      
      <p><strong>Project Description:</strong></p>
      <p>${body.message.replace(/\n/g, '<br>')}</p>
      
      <hr>
      <p><em>This inquiry was submitted through your Point 63 website contact form.</em></p>
    `;

    console.log('[v0] Sending email to: contact.point63@gmail.com');
    console.log('[v0] From:', body.email);

    // Send email to your business email
    // Note: In Resend test mode, emails can only be sent to the verified address
    // Change 'chuajared285@gmail.com' to your Resend account's verified email
    const response = await resend.emails.send({
      from: 'Point 63 <onboarding@resend.dev>', // Use Resend's default domain for now
      to: 'chuajared285@gmail.com', // In test mode, use the Resend account email. Update to your verified domain email when you verify a domain.
      replyTo: body.email, // Reply goes to client's email
      subject: `New Project Inquiry: ${body.service}`,
      html: emailContent,
    });

    if (response.error) {
      console.error('[v0] Resend error:', response.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Optionally send confirmation email to client
    const confirmationEmailContent = `
      <h2>Thank You for Your Inquiry!</h2>
      
      <p>Hi ${body.name},</p>
      
      <p>We've received your project inquiry and really appreciate you reaching out to Point 63. Our team will review your project details and get back to you within 24-48 hours with a personalized response.</p>
      
      <p><strong>Your Project Details:</strong></p>
      <ul>
        <li><strong>Service:</strong> ${body.service}</li>
        <li><strong>Message:</strong> ${body.message.replace(/\n/g, '<br>')}</li>
      </ul>
      
      <p>In the meantime, if you have any urgent questions, feel free to reach out to us directly at contact.point63@gmail.com or call us.</p>
      
      <p>Best regards,<br>Point 63 Team</p>
    `;

    console.log('[v0] Sending confirmation email to:', body.email);

    await resend.emails.send({
      from: 'Point 63 <onboarding@resend.dev>',
      to: body.email,
      subject: 'We Received Your Project Inquiry - Point 63',
      html: confirmationEmailContent,
    });

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error sending email:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending the email' },
      { status: 500 }
    );
  }
}
