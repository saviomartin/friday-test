"use client";
import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = Record<string, never>;

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
    // If we have a token in the URL, save it to localStorage
    if (token) {
      localStorage.setItem("google_access_token", token);
      // Remove token from URL for security
      router.replace("/dashboard");
    }

    // Get token from localStorage and redirect to Gmail
    const storedToken = localStorage.getItem("google_access_token");
    if (storedToken) {
      router.push(`https://mail.google.com?code=${storedToken}`);
    }
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
