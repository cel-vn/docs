import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // Use TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOTP(email: string, code: string, name?: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: `${process.env.APP_NAME} - Login Verification Code`,
        html: this.getOTPEmailTemplate(code, name),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string, role: string, password: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: `Welcome to ${process.env.APP_NAME}`,
        html: this.getWelcomeEmailTemplate(name, role, password),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  private getOTPEmailTemplate(code: string, name?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Verification Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { background-color: #1e40af; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0; }
          .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${process.env.APP_NAME}</h1>
            <p>Login Verification Code</p>
          </div>
          <div class="content">
            ${name ? `<p>Hello ${name},</p>` : '<p>Hello,</p>'}
            <p>You've requested to sign in to your ${process.env.APP_NAME} account. Please use the verification code below:</p>
            
            <div class="otp-code">${code}</div>
            
            <div class="warning">
              <strong>Important:</strong>
              <ul>
                <li>This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 5} minutes</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this code, please ignore this email</li>
              </ul>
            </div>
            
            <p>If you have any issues, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(name: string, role: string, password: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${process.env.APP_NAME}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
          .role-badge { background-color: #065f46; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin: 10px 0; }
          .credentials { background-color: #1e40af; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .password { font-family: monospace; font-size: 18px; font-weight: bold; letter-spacing: 2px; }
          .features { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ${process.env.APP_NAME}!</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>Welcome to ${process.env.APP_NAME}! Your account has been successfully created.</p>
            
            <p>Your role: <span class="role-badge">${role.toUpperCase()}</span></p>
            
            <div class="credentials">
              <h3 style="margin-top: 0; color: white;">Your Login Credentials:</h3>
              <p><strong>Email:</strong> ${process.env.FROM_EMAIL}</p>
              <p><strong>Password:</strong> <span class="password">${password}</span></p>
            </div>

            <div class="warning">
              <strong>Important Security Notice:</strong>
              <ul>
                <li>Please change your password after your first login</li>
                <li>Do not share your credentials with anyone</li>
                <li>Use a strong, unique password</li>
              </ul>
            </div>
            
            <div class="features">
              <h3>What you can do:</h3>
              <ul>
                <li>Access comprehensive documentation</li>
                <li>Explore project management resources</li>
                ${role === 'admin' ? '<li>Manage user accounts and system settings</li>' : ''}
                ${role === 'member' ? '<li>Contribute to documentation and collaborate with the team</li>' : ''}
                ${role === 'customer' ? '<li>Access customer-specific resources and support</li>' : ''}
              </ul>
            </div>
            
            <p>You can now sign in using your email address and password. We'll send you a verification code each time you log in for enhanced security.</p>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
