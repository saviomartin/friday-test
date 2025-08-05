import oauth2Client, { GMAIL_SCOPES } from "@/app/lib/google-oauth";
import crypto from "crypto";
import { redirect } from "next/navigation";

export default function Page() {
  const state = crypto.randomBytes(16).toString("hex");

  // Generate the authorization URL with Gmail scopes
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GMAIL_SCOPES,
    state,
    prompt: "consent", // Force consent screen to ensure we get refresh token
  });

  // Since this is a server component, redirect will work immediately
  redirect(authorizationUrl);
}
