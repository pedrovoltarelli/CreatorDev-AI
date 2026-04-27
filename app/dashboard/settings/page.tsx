"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { User, Key, CreditCard, Trash2, AlertTriangle, Check, X, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabase } from "@/lib/supabase";

function GitHubConnect() {
  const searchParams = useSearchParams();
  const [githubConnected, setGithubConnected] = useState(false);
  const [connectStatus, setConnectStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const status = searchParams.get("github");
    if (status === "connected") {
      setGithubConnected(true);
      setConnectStatus("success");
      const code = localStorage.getItem("github_code");
      if (code) {
        localStorage.setItem("github_token", code);
        localStorage.removeItem("github_code");
      }
    } else if (status === "error") {
      setConnectStatus("error");
    }
  }, [searchParams]);

  const handleGitHubConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "YOUR_GITHUB_CLIENT_ID";
    const redirectUri = `${window.location.origin}/dashboard/github/callback`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,read:user`;
  };

  const handleGitHubDisconnect = () => {
    setGithubConnected(false);
    setConnectStatus("idle");
    localStorage.removeItem("github_token");
  };

  return (
    <div className="card">
      <h2 className="text-base font-medium text-zinc-300 mb-6 flex items-center gap-2">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        Integrations
      </h2>
      
      {connectStatus === "success" && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400">GitHub connected successfully!</span>
        </div>
      )}
      
      {connectStatus === "error" && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <X className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">Failed to connect GitHub. Please try again.</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/2">
          <div className="flex items-center gap-4">
            <svg className="w-5 h-5 text-zinc-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            <div>
              <h3 className="text-sm font-medium text-zinc-300">GitHub</h3>
              <p className="text-xs text-zinc-600">{githubConnected ? "Syncing commits automatically" : "Sync your commits"}</p>
            </div>
          </div>
          <button
            onClick={githubConnected ? handleGitHubDisconnect : handleGitHubConnect}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              githubConnected
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-white/5 text-zinc-400 border-zinc-700 hover:text-zinc-300 hover:bg-white/10"
            }`}
          >
            {githubConnected ? "Connected" : "Connect"}
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/2">
          <div className="flex items-center gap-4">
            <Key className="w-5 h-5 text-zinc-500" />
            <div>
              <h3 className="text-sm font-medium text-zinc-300">OpenAI API</h3>
              <p className="text-xs text-zinc-600">AI content generation</p>
            </div>
          </div>
          <span className="px-4 py-1.5 rounded-lg text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            Enabled
          </span>
        </div>
      </div>
    </div>
  );
}

const TIMEZONES = [
  { value: "UTC-12", label: "UTC-12", city: "Baker Island" },
  { value: "UTC-8", label: "UTC-8", city: "Los Angeles (PST)" },
  { value: "UTC-5", label: "UTC-5", city: "New York (EST)" },
  { value: "UTC-3", label: "UTC-3", city: "São Paulo (BRT)" },
  { value: "UTC+0", label: "UTC+0", city: "London (GMT)" },
  { value: "UTC+1", label: "UTC+1", city: "Paris (CET)" },
  { value: "UTC+3", label: "UTC+3", city: "Moscow (MSK)" },
  { value: "UTC+5", label: "UTC+5", city: "Mumbai (IST)" },
  { value: "UTC+8", label: "UTC+8", city: "Beijing (CST)" },
  { value: "UTC+9", label: "UTC+9", city: "Tokyo (JST)" },
];

function SettingsContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [originalUser, setOriginalUser] = useState({ name: "", email: "", timezone: "UTC+0", avatar: "" });
  const [formData, setFormData] = useState({ name: "", email: "", timezone: "UTC+0", avatar: "" });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (user) {
      const avatar = user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=violet`;
      const data = { name: user.name, email: user.email, timezone: "UTC+0", avatar };
      setFormData(data);
      setOriginalUser(data);
    }
  }, [user]);

  useEffect(() => {
    const changed = 
      formData.name !== originalUser.name ||
      formData.email !== originalUser.email ||
      formData.timezone !== originalUser.timezone ||
      formData.avatar !== originalUser.avatar;
    setHasChanges(changed);
  }, [formData, originalUser]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData(prev => ({ ...prev, avatar: ev.target?.result as string }));
      setUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    setSaveSuccess(false);

    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          name: formData.name,
          email: formData.email,
          timezone: formData.timezone,
          avatar: formData.avatar,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });

if (error) {
        console.warn("Supabase error, saving locally:", error.message);
        setSaveMessage("Saved locally");
      } else {
        setSaveMessage("Saved!");
      }

      setOriginalUser(formData);
      setSaveSuccess(true);
      
      localStorage.setItem("user", JSON.stringify({
        ...user,
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
      }));

      setTimeout(() => {
        setSaveSuccess(false);
        setSaveMessage("");
      }, 3000);
    } catch (err) {
      console.warn("Saving to localStorage only");
      setSaveMessage("Saved locally");
      setOriginalUser(formData);
      setSaveSuccess(true);
      localStorage.setItem("user", JSON.stringify({
        ...user,
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
      }));
      setTimeout(() => {
        setSaveSuccess(false);
        setSaveMessage("");
      }, 3000);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-zinc-50 mb-4">Please log in to continue</h1>
            <Link href="/login" className="px-5 py-2.5 bg-white text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors">
              Log in
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-50 mb-2">Settings</h1>
            <p className="text-zinc-500">Manage your account and preferences</p>
          </div>
          
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : saveSuccess && saveMessage ? saveMessage : "Save Changes"}
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-base font-medium text-zinc-300 mb-6 flex items-center gap-2">
              <User className="w-4 h-4" />
              Account Settings
            </h2>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <img
                  src={formData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}&backgroundColor=violet`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700"
                />
                <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-violet-700 transition-colors border border-zinc-900">
                  {uploadingAvatar ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-300">Profile Photo</h3>
                <p className="text-xs text-zinc-600">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-500 mb-2">Display Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-2">Timezone</label>
                <div className="relative">
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full appearance-none bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-violet-500/50 focus:outline-none transition-colors pr-10"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value} className="bg-zinc-900">
                        {tz.label} - {tz.city}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.069 11.992l-3.5-3.5M9.569 18.5l-3.5-3.5M18.45 18.5l-3.5-3.5M12 2v7M12 22v-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Suspense fallback={<div className="card"><p className="text-zinc-500">Loading...</p></div>}>
            <GitHubConnect />
          </Suspense>

          <div className="card">
            <h2 className="text-base font-medium text-zinc-300 mb-6 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Billing
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/2">
                <div>
                  <h3 className="text-sm font-medium text-zinc-300">Current Plan</h3>
                  <p className="text-xs text-zinc-600">Pro - $12/month</p>
                </div>
                <Link
                  href="/pricing"
                  className="px-4 py-1.5 rounded-lg text-sm bg-white/5 text-zinc-300 border border-zinc-700 hover:bg-white/10 transition-colors"
                >
                  Change Plan
                </Link>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/2">
                <div>
                  <h3 className="text-sm font-medium text-zinc-300">Next Billing Date</h3>
                  <p className="text-xs text-zinc-600">May 26, 2026</p>
                </div>
                <button className="px-4 py-1.5 rounded-lg text-sm bg-white/5 text-zinc-400 border border-zinc-700 hover:text-zinc-300 transition-colors">
                  Update Payment
                </button>
              </div>
            </div>
          </div>

          <div className="card border-red-500/10">
            <h2 className="text-base font-medium text-red-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Danger Zone
            </h2>
            <p className="text-sm text-zinc-600 mb-4">These actions cannot be undone.</p>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                <Trash2 className="w-4 h-4" />
                Deactivate Account
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete All Data
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}