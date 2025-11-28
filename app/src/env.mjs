import { z } from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  /*
   * ServerSide Environment variables, not available on the client.
   */
  server: {
    // NODE_ENV: z.enum(['development', 'test', 'production']),
    // NEXTAUTH_SECRET:
    //     process.env.NODE_ENV === 'production'
    //         ? z.string().min(1)
    //         : z.string().min(1).optional(),
    // NEXTAUTH_URL: z.preprocess(
    //     (str) => process.env.VERCEL_URL ?? str,
    //     process.env.VERCEL ? z.string().min(1) : z.string().url()
    // ),
    //
    // // S3 Environment Variables
    // AWS_S3_REGION_NAME: z.string().min(1),
    // AWS_ACCESS_KEY_ID: z.string().min(1),
    // AWS_SECRET_ACCESS_KEY: z.string().min(1),
    // AWS_STORAGE_BUCKET_NAME: z.string().min(1),
    //
    // // email
    // SMTP_HOST: z.string().optional(),
    // SMTP_PORT: z.string().optional(),
    // SMTP_USER: z.string().optional(),
    // SMTP_PASSWORD: z.string().optional(),
    // SMTP_FROM_EMAIL: z.string().email().optional(),
    //
    // GOOGLE_CLIENT_ID: z.string().optional(),
    // GOOGLE_CLIENT_SECRET: z.string().optional(),
    // APPLE_CLIENT_ID: z.string().optional(),
    // APPLE_CLIENT_SECRET: z.string().optional(),
  },

  /*
   * Environment variables available on the client (and server).
   */
  client: {
    // NEXT_PUBLIC_APP_NAME: z.string().optional(),
    // NEXT_PUBLIC_GOOGLE_MAP_API_KEY: z.string().optional(),
  },
  runtimeEnv: process.env,
});
