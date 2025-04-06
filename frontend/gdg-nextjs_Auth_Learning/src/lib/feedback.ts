import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface FeedbackRequest extends NextApiRequest {
  body: {
    name: string;
    email: string;
    feedback: string;
  };
}

export default async function handler(
  req: FeedbackRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, feedback } = req.body;

  // Validate input
  if (!name || !email || !feedback) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Configure your email service
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.YOUR_EMAIL_ADDRESS, // Your personal email
    subject: `New Feedback from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Feedback: ${feedback}
    `,
    html: `
      <h3>New Feedback Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Feedback:</strong></p>
      <p>${feedback}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Feedback sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending feedback' });
  }
}