"use client";

import { useEffect } from "react";
import oauth2Client, { GMAIL_SCOPES } from "@/app/lib/google-oauth";
import crypto from "crypto";

export default function Page() {
  useEffect(() => {
    const state = crypto.randomBytes(16).toString("hex");

    // Generate the authorization URL with Gmail scopes
    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: GMAIL_SCOPES,
      state,
      prompt: "consent", // Force consent screen to ensure we get refresh token
    });

    window.location.href = authorizationUrl;
  }, []);

  return null;
}
