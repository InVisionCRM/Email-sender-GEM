
import { EmailTemplate } from './types';

export const INITIAL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome_email',
    name: 'Welcome Email',
    subject: 'Welcome to Our Community!',
    content: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h1 style="color: #4A90E2;">Welcome Aboard!</h1>
  <p>Hi there,</p>
  <p>Thank you for signing up. We're so excited to have you as part of our community.</p>
  <p>You can expect to hear from us with product updates, special offers, and news.</p>
  <p>Best,<br>The Team</p>
  <a href="#" style="background-color: #4A90E2; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
</div>`
  },
  {
    id: 'password_reset',
    name: 'Password Reset',
    subject: 'Reset Your Password',
    content: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h1 style="color: #D0021B;">Password Reset Request</h1>
  <p>Hi there,</p>
  <p>We received a request to reset the password for your account.</p>
  <p>If you made this request, please click the button below. If you didn't, you can safely ignore this email.</p>
  <a href="#" style="background-color: #D0021B; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
</div>`
  },
  {
    id: 'monthly_newsletter',
    name: 'Monthly Newsletter',
    subject: 'This Month\'s Newsletter',
    content: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h1 style="color: #50E3C2;">Our Monthly Update</h1>
  <p>Hi there,</p>
  <p>Here's what's new this month! We've been working hard on some exciting features and updates.</p>
  <h2>Check Out Our New Templates!</h2>
  <p>We've added a variety of new templates to help you get started even faster.</p>
  <p>Cheers,<br>The Team</p>
</div>`
  }
];