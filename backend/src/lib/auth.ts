import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { emailOTP } from 'better-auth/plugins';
import { env } from '../config/index.js';
import { mailer } from '@/services/email/emailService.js';

export const auth = betterAuth({
  database: new Pool({
    connectionString: env.DATABASE_URL,
  }),
  advanced: {
    cookiePrefix: 'pica',
    disableSessionTokenCookies: false, // keep session in HttpOnly cookie
    cookies: {
      session_token: {
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    fields: {
      name: 'businessName', // Tells Better Auth to use businessName as the name field
    },
    additionalFields: {
      rcNumber: {
        type: 'string',
        required: true,
        fieldName: 'rcNumber',
      },
      phone: {
        type: 'string',
        required: true,
        fieldName: 'phoneNumber', // maps to the phoneNumber column in the DB
      },
    },
  },
  plugins: [
    emailOTP({
      sendVerificationOnSignUp: true,
      otpLength: 5,
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`sending ${otp} to ${email}`);
        await mailer.sendVerificationEmail(email, {
          otp: otp,
          expiresInMinutes: 10,
        });
      },
    }),
  ],
});
