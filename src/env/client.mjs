import { z } from "zod";

import { createEnv } from "@t3-oss/env-nextjs";

export const clientEnv = createEnv({
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_TESTMODE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_AZURE_BLOB_CONTAINER_NAME: z.enum(["prod", "staging"]),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_URL:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_URL_PROD
        : process.env.NEXT_PUBLIC_URL_DEV,
    NEXT_PUBLIC_STRIPE_TESTMODE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_TESTMODE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_AZURE_BLOB_CONTAINER_NAME:
      process.env.NEXT_PUBLIC_AZURE_BLOB_CONTAINER_NAME,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  isServer: typeof window === "undefined",
});
