/**
 * All email template identifiers.
 * The value must exactly match the filename in src/views/ (without .ejs).
 */
export enum EmailTemplate {
  WELCOME = 'welcome',
  VERIFY_EMAIL = 'verify-email',
}

export type TemplateDataMap = {
  [EmailTemplate.WELCOME]: {
    businessName: string;
  };
  [EmailTemplate.VERIFY_EMAIL]: {
    otp: string;
    expiresInMinutes: number;
  };
};
