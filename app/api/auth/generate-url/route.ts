import { NextResponse } from "next/server";
import oauth2Client, { GMAIL_SCOPES } from "@/app/lib/google-oauth";

export async function GET() {
  try {
    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: GMAIL_SCOPES,
      prompt: "consent",
    });

    return NextResponse.json({ url: authorizationUrl });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate authorization URL" },
      { status: 500 }
    );
  }
}
