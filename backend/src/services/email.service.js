/**
 * Email Service
 * 
 * TODO: Integrate with a real email provider:
 * - SendGrid: https://sendgrid.com (free 100 emails/day)
 * - Resend: https://resend.com (free 100 emails/day)
 * - AWS SES: https://aws.amazon.com/ses/ (free tier available)
 * 
 * Install: npm install @sendgrid/mail
 * Then replace the stub implementations below.
 */

import { env } from '../config/environment.js';

const isDevelopment = env.node === 'development';

export const emailService = {
  /**
   * Send password reset email
   * @param {string} email - User's email address
   * @param {string} token - Reset token (valid for 1 hour)
   * @returns {Promise<boolean>}
   */
  async sendPasswordReset(email, token) {
    const resetUrl = `${env.frontendUrl}/reset-password?token=${token}`;
    
    if (isDevelopment) {
      console.info('='.repeat(60));
      console.info('[DEV MODE] Password Reset Email');
      console.info('='.repeat(60));
      console.info(`To: ${email}`);
      console.info(`Reset URL: ${resetUrl}`);
      console.info(`Token (1h expiry): ${token}`);
      console.info('='.repeat(60));
      return true;
    }
    
    // TODO: Replace with real email provider
    // Example with SendGrid:
    // const msg = {
    //   to: email,
    //   from: 'noreply@eduverse.com',
    //   subject: 'Reset Your EduVerse Password',
    //   html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Valid for 1 hour.</p>`
    // };
    // await sgMail.send(msg);
    
    console.warn('[Email Service] No email provider configured. Email not sent.');
    return false;
  },

  /**
   * Send welcome email to new users
   * @param {string} email - User's email address
   * @param {string} name - User's name
   * @returns {Promise<boolean>}
   */
  async sendWelcome(email, name) {
    if (isDevelopment) {
      console.info(`[DEV MODE] Welcome email would be sent to: ${email} (${name})`);
      return true;
    }
    
    // TODO: Implement welcome email
    return false;
  }
};

