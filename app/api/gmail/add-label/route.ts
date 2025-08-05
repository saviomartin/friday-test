import { NextResponse } from "next/server";
import oauth2Client from "../../../lib/google-oauth";
import { google } from "googleapis";

interface EmailData {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  labels: string[];
}

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // First, ensure UPI Payments label exists
    let upiLabel;
    const labels = await gmail.users.labels.list({ userId: "me" });
    upiLabel = labels.data.labels?.find((l) => l.name === "UPI Payments");

    if (!upiLabel) {
      const newLabel = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
          name: "UPI Payments",
          labelListVisibility: "labelShow",
          messageListVisibility: "show",
        },
      });
      upiLabel = newLabel.data;
    }

    // Get the current time and calculate time 10 minutes ago
    const currentTime = new Date();
    const tenMinutesAgo = new Date(currentTime.getTime() - 10 * 60 * 1000);

    // Convert to Unix timestamp in seconds (Gmail API uses seconds)
    const afterTimestamp = Math.floor(tenMinutesAgo.getTime() / 1000);

    // Get the list of messages within the time range
    const messageList = await gmail.users.messages.list({
      userId: "me",
      q: `in:inbox after:${afterTimestamp}`,
    });

    let emails: EmailData[] = [];

    if (messageList.data.messages) {
      // Fetch details for each message
      const emailPromises = messageList.data.messages.map(async (message) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: message.id!,
          format: "metadata",
          metadataHeaders: ["Subject", "From", "Date"],
        });

        const headers = email.data.payload?.headers;
        const subject =
          headers?.find((h) => h.name === "Subject")?.value || "No Subject";
        const from =
          headers?.find((h) => h.name === "From")?.value || "Unknown Sender";
        const date = headers?.find((h) => h.name === "Date")?.value || "";

        // If it's an HDFC Bank alert and UPI label exists, add the label
        if (
          from.includes("alerts@hdfcbank.net") &&
          upiLabel?.id &&
          !email.data.labelIds?.includes(upiLabel.id)
        ) {
          await gmail.users.messages.modify({
            userId: "me",
            id: email.data.id!,
            requestBody: {
              addLabelIds: [upiLabel.id],
            },
          });
        }

        return {
          id: email.data.id!,
          subject,
          from,
          date: new Date(date).toLocaleDateString(),
          snippet: email.data.snippet || "",
          labels: email.data.labelIds || [],
        };
      });

      emails = await Promise.all(emailPromises);
    }

    return NextResponse.json({
      emails,
      message: "Emails fetched and labels updated successfully",
    });
  } catch (error) {
    console.error("Error processing emails:", error);
    return NextResponse.json(
      { error: "Failed to process emails" },
      { status: 500 }
    );
  }
}
