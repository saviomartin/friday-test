"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const fetchAuthUrl = async () => {
      try {
        const response = await fetch("/api/auth/generate-url");
        const data = await response.json();

        if (data.url) {
          router.push(data.url);
        } else {
          console.error("No URL returned from auth endpoint");
        }
      } catch (error) {
        console.error("Error fetching auth URL:", error);
      }
    };

    fetchAuthUrl();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Redirecting to Google sign-in...
        </h1>
        <p className="text-gray-600">
          Please wait while we redirect you to Google&apos;s authentication
          page.
        </p>
      </div>
    </div>
  );
}
