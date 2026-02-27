import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Transporter, SendMailOptions } from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create a test SMTP transporter
    // For production, you would use your actual email service credentials
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', // For testing purposes
      port: 587,
      secure: false,
      auth: {
        user: 'your-ethereal-email@ethereal.email', // Replace with your Ethereal email
        pass: 'your-ethereal-password', // Replace with your Ethereal password
      },
    });
    
    // Email content
    const mailOptions = {
      from: '"NeuroDiverse App" <noreply@neurodiverse.app>',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4a5568; text-align: center;">NeuroDiverse Password Reset</h2>
          <p style="color: #4a5568; font-size: 16px;">You requested a password reset for your NeuroDiverse account.</p>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <p style="font-size: 14px; color: #718096; margin: 0;">Your OTP code is:</p>
            <h1 style="font-size: 32px; color: #4299e1; letter-spacing: 5px; margin: 10px 0;">${otp}</h1>
          </div>
          <p style="color: #4a5568; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this password reset, please ignore this email.</p>
          <p style="color: #718096; font-size: 12px; text-align: center; margin-top: 30px;">© ${new Date().getFullYear()} NeuroDiverse. All rights reserved.</p>
        </div>
      `,
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Return the OTP (in a real app, you would store this securely and verify it later)
    return NextResponse.json({ success: true, otp });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}