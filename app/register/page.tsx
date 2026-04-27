"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Check, Terminal } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { register } = useAuth();

  const passwordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    if (!/[A-Z]/.test(password)) return 2;
    if (!/[0-9]/.test(password)) return 2;
    return 3;
  };

  const strength = passwordStrength();
  const strengthColors = ["bg-red-500", "bg-yellow-500", "bg-emerald-500"];
  const strengthLabels = ["Weak", "Medium", "Strong"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await register(name, email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setEmailSent(true);
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex bg-zinc-950">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-zinc-900 to-zinc-950" />
          <div className="relative z-10 flex flex-col justify-center px-16">
            <div className="mb-8">
              <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center mb-6">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Check your<br />
                <span className="text-violet-400">inbox</span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                We&apos;ve sent a confirmation link to your email. Click it to activate your account.
              </p>
            </div>
          </div>
        </div>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <div className="w-20 h-20 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
            <p className="text-zinc-400 mb-2">
              We sent a confirmation link to
            </p>
            <p className="text-violet-400 font-medium mb-8">{email}</p>
            <p className="text-sm text-zinc-600">
              Click the link to activate your account. Check spam if you don&apos;t see it.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-zinc-950">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/30 via-transparent to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="mb-8">
            <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center mb-6">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Join<br />
              <span className="text-violet-400">CreatorDev AI</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Transform your daily builds into engaging content that grows your audience.
            </p>
          </div>
          
          <div className="space-y-3">
            {[
              "Unlimited content generations",
              "AI-powered optimization",
              "Multi-platform publishing"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-zinc-400">
                <div className="w-5 h-5 bg-violet-600/20 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-violet-400" />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center mb-4">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-zinc-500">Start building in public today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-medium text-zinc-400 mb-2 group-focus-within:text-violet-400 transition-colors">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-200"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-zinc-400 mb-2 group-focus-within:text-violet-400 transition-colors">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-200"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-zinc-400 mb-2 group-focus-within:text-violet-400 transition-colors">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all duration-200"
                  placeholder="Create a strong password"
                  required
                />
              </div>
              
              {password.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1 flex-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i < strength ? strengthColors[strength - 1] : "bg-zinc-800"
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs ml-3 ${
                      strength === 1 ? "text-red-400" : strength === 2 ? "text-yellow-400" : "text-emerald-400"
                    }`}>
                      {strengthLabels[strength - 1]}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: "At least 6 characters", met: password.length >= 6 },
                      { label: "Include uppercase letter", met: /[A-Z]/.test(password) },
                      { label: "Include number", met: /[0-9]/.test(password) }
                    ].map((req, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs ${req.met ? "text-emerald-400" : "text-zinc-600"}`}>
                        <Check className="w-3.5 h-3.5" />
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-xl font-medium hover:from-violet-700 hover:to-violet-800 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-violet-500/25"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
