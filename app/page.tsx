import React from "react";
import oauth2Client, { GMAIL_SCOPES } from "@/app/lib/google-oauth";
import crypto from "crypto";
import Link from "next/link";

export default function Page() {
  const state = crypto.randomBytes(16).toString("hex");

  // Generate the authorization URL with Gmail scopes
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GMAIL_SCOPES,
    state,
    prompt: "consent", // Force consent screen to ensure we get refresh token
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <Link href={authorizationUrl}>
        <button className="px-6 py-3 bg-blue-400 rounded-md text-white font-semibold hover:bg-blue-300 transition duration-300 border-3 border-blue-300 cursor-pointer">
          Sign In with Google
        </button>
      </Link>
    </div>
  );
}
