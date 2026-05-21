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

    // Send email to your business email
    const response = await resend.emails.send({
      from: 'Point 63 <onboarding@resend.dev>', // Use Resend's default domain for now
      to: 'contact.point63@gmail.com', // Your business email
      replyTo: body.email, // Reply goes to client's email
      subject: `New Project Inquiry: ${body.service}`,
      html: emailContent,
    });

    if (response.error) {
      console.error('Resend error:', response.error);
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
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending the email' },
      { status: 500 }
    );
  }
}
