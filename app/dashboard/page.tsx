"use client";
import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = Record<string, never>;

const CRON_API_KEY = process.env.NEXT_PUBLIC_CRON_API_KEY || "";

async function createCronJob(accessToken: string) {
  try {
    const response = await fetch("https://api.cron-job.org/jobs", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CRON_API_KEY}`,
      },
      body: JSON.stringify({
        job: {
          url: "https://friday-test-savio.vercel.app/api/gmail/add-label",
          enabled: true,
          saveResponses: true,
          requestMethod: 1, // POST
          extendedData: {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken }),
          },
          schedule: {
            timezone: "UTC",
            expiresAt: 0,
            hours: [-1],
            mdays: [-1],
            minutes: [-1], // Every minute
            months: [-1],
            wdays: [-1],
          },
        },
      }),
    });

    const data = await response.json();
    console.log("Cron job created:", data);
    return data;
  } catch (error) {
    console.error("Error creating cron job:", error);
    throw error;
  }
}

const Page = ({}: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
};

const DashboardContent = ({}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const setupToken = async () => {
      // If we have a token in the URL, save it to localStorage
      if (token) {
        localStorage.setItem("google_access_token", token);

        try {
          // Create cron job with the token
          await createCronJob(token);
          console.log("Cron job created successfully");
        } catch (error) {
          console.error("Failed to create cron job:", error);
        }

        // Remove token from URL for security
        router.replace("/dashboard");
      }

      // Get token from localStorage and redirect to Gmail
      const storedToken = localStorage.getItem("google_access_token");
      if (storedToken) {
        router.push(`https://mail.google.com?code=${storedToken}`);
      }
    };

    setupToken();
  }, [token, router]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p className="font-normal">Access Token:</p>
        <p className="break-all mt-2 text-sm">
          {token || "No access token found"}
        </p>
      </div>
    </div>
  );
};

export default Page;
