"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";

function GitHubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    
    if (code) {
      // Redireciona para a API route que faz o exchange do token
      const apiUrl = new URL("/api/github/callback", window.location.origin);
      apiUrl.searchParams.set("code", code);
      if (state) apiUrl.searchParams.set("state", state);
      
      window.location.href = apiUrl.toString();
    } else {
      router.push("/dashboard/settings?github=error");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navigation />
      <main className="flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-vinc-500 border-t-violet-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Connecting to GitHub...</p>
        </div>
      </main>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950">
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