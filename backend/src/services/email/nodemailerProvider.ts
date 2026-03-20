import nodemailer, { type Transporter } from 'nodemailer';
import { type SendEmailOptions, type EmailService } from '../../types/emailTypes.js';
import { env } from '../../config/index.js';
import { logger } from '../../lib/logger.js';

/**
 * Builds the correct nodemailer transport options based on
 * the EMAIL_PROVIDER env var:
 *   - "gmail"  → uses Gmail App Password (no host/port needed)
 *   - "smtp"   → uses generic SMTP (host, port, user, pass)
 */
function createTransport(): Transporter {
  if (env.EMAIL_PROVIDER === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS, // Gmail App Password (not your account password)
      },
    });
  }

  // Default: generic SMTP
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for 587/25
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
}

/**
 * NodemailerProvider implements the EmailService interface.
 * It is the only place in the codebase that knows about nodemailer.
 */
export class NodemailerProvider implements EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport();
  }

  async send(options: SendEmailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    logger.info(`[Nodemailer] Email sent to ${options.to} via ${env.EMAIL_PROVIDER}`);
  }
}

export const nodemailerProvider = new NodemailerProvider();
