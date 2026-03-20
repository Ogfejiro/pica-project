export interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface EmailService {
  send(options: SendEmailOptions): Promise<void>;
}
