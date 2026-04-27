"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Zap, TrendingUp, Target, Flame, ArrowUpRight, ExternalLink, X, Check, Loader2, GitBranch } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Activity {
  title: string;
  platform: string;
  time: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [connectedRepo, setConnectedRepo] = useState<{name: string; url: string} | null>(null);
  
  const [stats, setStats] = useState({
    postsGenerated: 0,
    mostUsedPlatform: "None",
    streak: 0,
    monthlyGoal: 0,
    goalTarget: 20,
  });
  
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [quickStats, setQuickStats] = useState({
    engagementRate: "0%",
    avgReactions: "0",
    wordsTotal: "0",
    completion: "0%",
  });

  useEffect(() => {
    const storedRepo = localStorage.getItem("connected_repo");
    if (storedRepo) {
      setConnectedRepo(JSON.parse(storedRepo));
    }
    
    const storedStats = localStorage.getItem("user_stats");
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    }
    
    const storedActivity = localStorage.getItem("recent_activity");
    if (storedActivity) {
      setRecentActivity(JSON.parse(storedActivity));
    }
    
    const storedQuick = localStorage.getItem("quick_stats");
    if (storedQuick) {
      setQuickStats(JSON.parse(storedQuick));
    }
    
    const interval = setInterval(() => {
      const freshStats = localStorage.getItem("user_stats");
      if (freshStats) {
        setStats(JSON.parse(freshStats));
      }
      const freshActivity = localStorage.getItem("recent_activity");
      if (freshActivity) {
        setRecentActivity(JSON.parse(freshActivity));
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const connectRepo = async () => {
    if (!repoUrl) return;
    
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      alert("Invalid GitHub URL. Example: https://github.com/user/repo");
      return;
    }
    
    setLoadingRepo(true);
    
    try {
      const [, owner, repo] = match;
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      
      if (!res.ok) {
        throw new Error("Repository not found");
      }
      
      const repoData = await res.json();
      const repoInfo = { name: repoData.name, url: repoUrl };
      
      setConnectedRepo(repoInfo);
      localStorage.setItem("connected_repo", JSON.stringify(repoInfo));
      setShowRepoModal(false);
      setRepoUrl("");
      
      addActivity(`Connected: ${repoData.name}`, "GitHub", true);
    } catch (err) {
      alert("Could not fetch repository. Make sure it's public or connect via GitHub OAuth in Settings.");
    } finally {
      setLoadingRepo(false);
    }
  };

  const disconnectRepo = () => {
    setConnectedRepo(null);
    localStorage.removeItem("connected_repo");
  };

  const addActivity = (title: string, platform: string, isNew = false) => {
    const newActivity: Activity[] = [
      { title, platform, time: "Just now" },
      ...recentActivity.slice(0, 4)
    ];
    setRecentActivity(newActivity);
    localStorage.setItem("recent_activity", JSON.stringify(newActivity));
  };

  const renderStats = () => {
    const statsList = [
      { label: t.postsGenerated, value: stats.postsGenerated.toString(), icon: Zap, color: "text-violet-400", change: stats.postsGenerated === 0 ? t.noPostsYet : `${stats.postsGenerated} this month` },
      { label: t.mostUsedPlatform, value: stats.mostUsedPlatform, icon: Target, color: "text-blue-400", change: t.keepGenerating },
      { label: t.consistencyStreak, value: stats.streak.toString(), icon: Flame, color: "text-orange-400", change: stats.streak === 0 ? t.startToday : t.daysInRow },
      { label: t.monthlyGoals, value: `${stats.monthlyGoal}/${stats.goalTarget}`, icon: ArrowUpRight, color: "text-emerald-400", change: t.engagements },
    ];
    return statsList;
  };

  const renderQuickStats = () => {
    const list = [
      { label: t.engagementRate, value: quickStats.engagementRate },
      { label: t.avgReactions, value: quickStats.avgReactions },
      { label: t.wordsTotal, value: quickStats.wordsTotal },
      { label: t.completion, value: quickStats.completion },
    ];
    return list;
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
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-50 mb-1">{t.dashboard}</h1>
            <p className="text-zinc-500">{t.welcome}, {user?.name}</p>
          </div>
          <Link 
            href="/dashboard/generate" 
            className="px-5 py-2.5 bg-white text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            {t.startGenerating}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {renderStats().map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card hover:border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-zinc-500">{stat.label}</h3>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-semibold text-zinc-50 mb-1">{stat.value}</p>
                <p className="text-sm text-zinc-600">{stat.change}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h3 className="text-base font-medium text-zinc-300 mb-5">{t.recentActivity}</h3>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Zap className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p>{t.noActivity}</p>
                  <p className="text-sm mt-1">Generate your first post to see it here</p>
                </div>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-white/2">
                    <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 truncate">{activity.title}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{activity.platform} · {activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-base font-medium text-zinc-300 mb-5">{t.quickStats}</h3>
            <div className="grid grid-cols-2 gap-3">
              {renderQuickStats().map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-white/2">
                  <p className="text-xl font-semibold text-zinc-50">{stat.value}</p>
                  <p className="text-sm text-zinc-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              </div>
              <div>
                <h3 className="text-base font-medium text-zinc-300">{t.githubRepository}</h3>
                <p className="text-sm text-zinc-600">
                  {connectedRepo ? (
                    <span className="text-emerald-400">{connectedRepo.name}</span>
                  ) : (
                    t.connectRepo
                  )}
                </p>
              </div>
            </div>
            {connectedRepo ? (
              <div className="flex gap-2">
                <a 
                  href={connectedRepo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm border border-zinc-700 text-zinc-300 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {t.viewRepo}
                </a>
                <button 
                  onClick={disconnectRepo}
                  className="px-4 py-2 text-sm border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  {t.disconnect}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowRepoModal(true)}
                className="px-4 py-2 text-sm bg-white text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                {t.connect}
              </button>
            )}
          </div>
        </div>
      </main>

      {showRepoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-zinc-50">Connect Repository</h2>
              <button 
                onClick={() => setShowRepoModal(false)}
                className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-500 mb-2">GitHub Repository URL</label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full"
                />
              </div>
              
              <button
                onClick={connectRepo}
                disabled={loadingRepo || !repoUrl}
                className="w-full py-3 px-4 bg-white text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loadingRepo ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Connect
                  </>
                )}
              </button>
            </div>
            
            <p className="mt-4 text-xs text-zinc-600 text-center">
              Or connect via GitHub OAuth for private repos in Settings
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
