"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";

function GitHubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      localStorage.setItem("github_code", code);
      router.push("/dashboard/settings?github=connected");
    } else {
      router.push("/dashboard/settings?github=error");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500">Connecting to GitHub...</p>
        </div>
      </main>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <Navigation />
        <main className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
        </main>
      </div>
    }>
      <GitHubCallbackContent />
    </Suspense>
  );
}