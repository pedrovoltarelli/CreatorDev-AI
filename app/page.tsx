"use client";

import Link from "next/link";
import { ArrowRight, Zap, BarChart3, Rocket } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const languagesList: { code: Language; label: string; flag: string }[] = [
  { code: "pt-BR", label: "Português", flag: "🇧🇷" },
  { code: "en-US", label: "English", flag: "🇺🇸" },
  { code: "es-ES", label: "Español", flag: "🇪🇸" },
];

export default function Home() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="fixed top-20 right-6 z-50 flex gap-1">
        {languagesList.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-2 py-1 rounded text-sm transition-colors ${
              language === lang.code
                ? "bg-violet-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {lang.flag}
          </button>
        ))}
      </div>
      <main>
        <section className="relative min-h-[85vh] flex items-center">
          <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              AI-Powered Content Generation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-zinc-50 mb-6 leading-[1.1]">
              Turn Your Builds Into
              <br />
              <span className="text-zinc-400">Content That Connects</span>
            </h1>
            
            <p className="text-xl text-zinc-400 mb-12 max-w-xl mx-auto leading-relaxed">
              Stop building in silence. CreatorDev AI converts your daily progress into ready-to-publish content for social media and newsletters.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register"
                className="btn-primary text-base px-8 py-4"
              >
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="btn-secondary text-base px-8 py-4">
                <Rocket className="w-4 h-4" />
                See Demo
              </button>
            </div>
            
            <p className="text-zinc-600 mt-8 text-sm">
              5 free generations • No credit card required
            </p>
          </div>
        </section>

        <section className="py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-zinc-50 mb-4">
                Everything You Need to Ship Content
              </h2>
              <p className="text-zinc-400 text-lg">
                From daily updates to viral launches, we handle the content.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card group hover:border-zinc-700">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-5">
                  <Zap className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-lg font-medium text-zinc-50 mb-2">AI Content Generator</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Generate tweets, LinkedIn posts, newsletters, devlogs and more with AI.
                </p>
              </div>
              
              <div className="card group hover:border-zinc-700">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-5">
                  <BarChart3 className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-lg font-medium text-zinc-50 mb-2">Analytics Dashboard</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Track your engagement, consistency streaks and growth metrics.
                </p>
              </div>
              
              <div className="card group hover:border-zinc-700">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-5">
                  <Rocket className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-lg font-medium text-zinc-50 mb-2">Content Templates</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Prebuilt templates for launches, features, bug fixes and milestones.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-zinc-50 mb-4">
                About CreatorDev AI
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                CreatorDev AI helps indie hackers and developers turn their daily builds into engaging content. 
                Connect your GitHub repository and let AI generate tweets, LinkedIn posts, newsletters and devlogs 
                about your progress.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-medium text-zinc-50 mb-3">For Developers</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li>• Connect your GitHub repository</li>
                  <li>• Auto-generate content from commits</li>
                  <li>• Track your building streak</li>
                  <li>• Build in public effortlessly</li>
                </ul>
              </div>
              <div className="card">
                <h3 className="text-lg font-medium text-zinc-50 mb-3">Key Features</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li>• AI-powered content generation</li>
                  <li>• Multi-platform support</li>
                  <li>• Analytics dashboard</li>
                  <li>• Template library</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-zinc-600 text-sm">
              © 2026 CreatorDev AI. Built for indie hackers and developers.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}