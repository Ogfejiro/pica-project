import ejs from 'ejs';
import path from 'path';
import { type EmailService } from '../../types/emailTypes.js';
import { EmailTemplate, type TemplateDataMap } from './templates.js';
import { logger } from '../../lib/logger.js';
import { nodemailerProvider } from './nodemailerProvider.js';

/**
 * AppMailer abstracts the email logic away from controllers and coordinates
 * rendering EJS templates and sending the resulting HTML.
 */
export class AppMailer {
  // Pass the actual EmailService implementation (e.g. NodemailerProvider)
  constructor(private emailService: EmailService) {}

  /**
   * Core function to render an EJS template and send it cleanly typed
   */
  async sendTemplate<T extends EmailTemplate>(
    to: string,
    subject: string,
    template: T,
    data: TemplateDataMap[T]
  ): Promise<void> {
    try {
      //Resolve path explicitly relative to the CWD where 'npm run dev' runs
      const templatePath = path.join(process.cwd(), 'src/views', `${template}.ejs`);

      const html = await ejs.renderFile(templatePath, data);

      await this.emailService.send({
        to,
        subject,
        html,
      });

      logger.info(`Successfully dispatched ${template} email to ${to}`);
    } catch (error) {
      logger.error(`Failed to dispatch ${template} email to ${to}`, error);
      throw error;
    }
  }

  // --- Domain-specific helper methods to keep controllers clean ---

  async sendWelcomeEmail(to: string, data: TemplateDataMap[EmailTemplate.WELCOME]) {
    await this.sendTemplate(to, 'Welcome to ServPro!', EmailTemplate.WELCOME, data);
  }

  async sendVerificationEmail(to: string, data: TemplateDataMap[EmailTemplate.VERIFY_EMAIL]) {
    await this.sendTemplate(
      to,
      'Please verify your email address',
      EmailTemplate.VERIFY_EMAIL,
      data
    );
  }
}

export const mailer = new AppMailer(nodemailerProvider);
