import { Google, Facebook, Apple } from "arctic";
import { decodeBase64IgnorePadding } from "@oslojs/encoding";

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_URL}/api/google/callback`,
);

export const facebook = new Facebook(
  process.env.FACEBOOK_CLIENT_ID!,
  process.env.FACEBOOK_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_URL}/api/facebook/callback`,
);

export const apple = new Apple(
  process.env.APPLE_CLIENT_ID!,
  process.env.APPLE_TEAM_ID!,
  process.env.APPLE_KEY_ID!,
  decodeBase64IgnorePadding(
    process.env
      .APPLE_PRIVATE_KEY! // `-----BEGIN PRIVATE KEY-----
      // MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgNdqjNlhz6YV/sSDL//nAfBuNre6wWftgZA9vGiIxgwKgCgYIKoZIzj0DAQehRANCAASXzES1q5O6MrbMtJ8Q+Mp1eqghpMgOamTenTVfPGd1mgZm87K80JxMX7d7qc6sVmgZwvhnMijihYZ0E0hc6DaZ
      // -----END PRIVATE KEY-----`
      // .replace("-----BEGIN PRIVATE KEY-----", "")
      // .replace("-----END PRIVATE KEY-----", "")
      .replaceAll("\r", "")
      .replaceAll("\n", "")
      .trim(),
  ),
  `${process.env.NEXT_PUBLIC_URL}/api/apple/callback`,
);
