"use client";

import { useEffect, useState } from "react";

interface GmailData {
  emailAddress?: string;
  messagesTotal?: number;
  threadsTotal?: number;
}

interface DashboardClientProps {
  accessToken: string;
  gmailData: GmailData | null;
}

export default function DashboardClient({
  accessToken,
  gmailData,
}: DashboardClientProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Gmail Dashboard</h1>

      <div className="space-y-4">
        {gmailData ? (
          <>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                Account Information
              </h2>
              <div className="space-y-2">
                <p className="font-normal">
                  Email:{" "}
                  <span className="font-semibold">
                    {gmailData.emailAddress}
                  </span>
                </p>
                <p className="font-normal">
                  Total Messages:{" "}
                  <span className="font-semibold">
                    {gmailData.messagesTotal}
                  </span>
                </p>
                <p className="font-normal">
                  Total Threads:{" "}
                  <span className="font-semibold">
                    {gmailData.threadsTotal}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-600">
                Access Token (for debugging):
              </p>
              <p className="break-all mt-2 text-xs font-mono">{accessToken}</p>
            </div>
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Unable to fetch Gmail data. Please try logging in again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
