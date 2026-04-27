"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Zap, Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const tones = [
  { value: "professional", label: "Professional" },
  { value: "viral", label: "Viral" },
  { value: "technical", label: "Technical" },
  { value: "personal", label: "Personal" },
  { value: "minimalist", label: "Minimalist" },
  { value: "founder", label: "Founder Mode" },
];

const platforms = [
  { value: "twitter", label: "X (Twitter)" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "newsletter", label: "Newsletter" },
  { value: "devlog", label: "Devlog" },
  { value: "reddit", label: "Reddit" },
];

const templates = [
  { value: "launch", label: "Launch Update" },
  { value: "feature", label: "New Feature" },
  { value: "bugfix", label: "Bug Fix Story" },
  { value: "milestone", label: "Milestone" },
  { value: "behind", label: "Behind the Scenes" },
];

interface GeneratedContent {
  platform: string;
  content: string;
  copied: boolean;
}

export default function GeneratePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [repoUrl, setRepoUrl] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("last_repo_url") || "";
  });
  const [repoData, setRepoData] = useState<{
    name: string;
    description: string;
    readme: string;
    language: string;
    stars: number;
    forks: number;
    openIssues: number;
    lastCommit: string;
    owner: string;
    topics: string[];
  } | null>(null);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [repoError, setRepoError] = useState("");
  
  const [formData, setFormData] = useState({
    build: "",
    features: "",
    bugs: "",
    lessons: "",
    metrics: "",
  });
  const [selectedTones, setSelectedTones] = useState<string[]>(["professional"]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter"]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [stats, setStats] = useState(() => {
    if (typeof window === "undefined") {
      return { postsGenerated: 0, mostUsedPlatform: "None", streak: 0, monthlyGoal: 0, goalTarget: 20 };
    }
    const storedStats = localStorage.getItem("user_stats");
    if (!storedStats) {
      return { postsGenerated: 0, mostUsedPlatform: "None", streak: 0, monthlyGoal: 0, goalTarget: 20 };
    }
    try {
      return JSON.parse(storedStats);
    } catch {
      return { postsGenerated: 0, mostUsedPlatform: "None", streak: 0, monthlyGoal: 0, goalTarget: 20 };
    }
  });

  const fetchRepoData = async () => {
    if (!repoUrl) return;
    
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      setRepoError("Invalid GitHub URL. Example: https://github.com/user/repo");
      return;
    }
    
    const [, owner, repo] = match;
    setLoadingRepo(true);
    setRepoError("");
    
    try {
      const githubToken = localStorage.getItem("github_token");
      const headers: HeadersInit = githubToken ? { Authorization: `Bearer ${githubToken}` } : {};
      
      const [repoRes, readmeRes, commitsRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}`, headers),
        fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`, headers).catch(() => null),
        fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, headers).catch(() => null)
      ]);
      
      if (!repoRes.ok) {
        throw new Error("Repository not found");
      }
      
      const repoInfo = await repoRes.json();
      
      let readmeContent = "";
      if (readmeRes?.ok) {
        readmeContent = await readmeRes.text();
      } else {
        const readmeFallback = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, headers);
        if (readmeFallback.ok) {
          const readmeData = await readmeFallback.json();
          readmeContent = atob(readmeData.content);
        }
      }
      
      let lastCommitDate = "";
      if (commitsRes?.ok) {
        const commits = await commitsRes.json();
        if (commits && commits.length > 0) {
          lastCommitDate = new Date(commits[0].commit.author.date).toLocaleDateString("pt-BR");
        }
      }
      
      setRepoData({
        name: repoInfo.name,
        description: repoInfo.description || "",
        readme: readmeContent,
        language: repoInfo.language || "Not specified",
        stars: repoInfo.stargazers_count || 0,
        forks: repoInfo.forks_count || 0,
        openIssues: repoInfo.open_issues_count || 0,
        lastCommit: lastCommitDate,
        owner: repoInfo.owner?.login || owner,
        topics: repoInfo.topics || []
      });
      
      localStorage.setItem("last_repo_url", repoUrl);
      
      if (!formData.build && repoInfo.description) {
        setFormData(prev => ({ ...prev, build: repoInfo.description }));
      }
    } catch (err) {
      setRepoError("Could not fetch repository. Make sure it's public or you're connected.");
    } finally {
      setLoadingRepo(false);
    }
  };

  const generateContent = async () => {
    setGenerating(true);
    setGeneratedContent([]);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
const context = `
GitHub: ${repoData?.owner}/${repoData?.name || "Unknown"}
Description: ${repoData?.description || formData.build || "A new project"}
Language: ${repoData?.language || "Not specified"}
Stars: ${repoData?.stars || 0} | Forks: ${repoData?.forks || 0} | Open Issues: ${repoData?.openIssues || 0}
Last Update: ${repoData?.lastCommit || "Recently"}
Topics: ${repoData?.topics?.join(", ") || "No topics"}
README: ${repoData?.readme?.substring(0, 800) || "No README available"}
Features: ${formData.features || "Not specified"}
Bugs Fixed: ${formData.bugs || "Not specified"}
Lessons: ${formData.lessons || "Not specified"}
Metrics: ${formData.metrics || "Not specified"}
Tones: ${selectedTones.join(", ")}
Platforms: ${selectedPlatforms.join(", ")}
Templates: ${selectedTemplates.join(", ") || "General"}
    `.trim();
    
    const newContent: GeneratedContent[] = selectedPlatforms.map(platform => {
      let content = "";
      const repoName = repoData?.name || "this project";
      const lang = repoData?.language !== "Not specified" ? repoData?.language : "";
      const stars = repoData?.stars || 0;
      const topics = repoData?.topics?.slice(0, 3).join(" ") || "";
      const metrics = formData.metrics ? `Metrics: ${formData.metrics}` : "";
      
      if (platform === "twitter") {
        const starText = stars > 0 ? ` ⭐ ${stars}` : "";
        const langText = lang ? `• ${lang}` : "";
        const topicText = topics ? `\n\n#${topics.split(" ").join(" #")}` : "";
        content = `Just shipped ${repoName}! 🚀\n\n${formData.build || "Big things happening."}\n\n${formData.features ? `What I built: ${formData.features}` : ""}${langText}${starText}${topicText}\n\n#buildinpublic #devlife`;
      } else if (platform === "linkedin") {
        const techStack = lang ? `Built with: ${lang}\n` : "";
        const results = formData.metrics ? `Results:\n${formData.metrics}\n` : "";
        content = `Excited to share what I've been working on!\n\n🚀 ${repoName}\n\n${formData.build || ""}\n\n${techStack}${formData.features ? `Key Features:\n${formData.features}\n` : ""}${results}${formData.lessons ? `Lessons learned:\n${formData.lessons}` : ""}\n\n#BuildInPublic #Developer #IndieMaker`;
      } else if (platform === "newsletter") {
        const techBadge = lang ? `[${lang}] ` : "";
        content = `📬 Weekly Update\n\n${techBadge}${formData.build || ""}\n\nRepository: github.com/${repoData?.owner}/${repoName}\nStars: ⭐ ${stars}\n\nWhat I built:\n${formData.features || "- New improvements"}\n\nChallenges overcome:\n${formData.bugs || "- None this week"}\n\nWhat I learned:\n${formData.lessons || "- Keep shipping"}\n\n${metrics}`;
      } else if (platform === "devlog") {
        content = `# DevLog\n\n## ${repoName}\n*${repoData?.description || "Building in public"}*\n\n**Stack:** ${lang || "Not specified"}\n**Stars:** ${stars} | **Forks:** ${repoData?.forks || 0}\n\n\n## What I Built\n${formData.build}\n\n## Features Shipped\n${formData.features}\n\n## Bugs Squashed\n${formData.bugs}\n\n## Learnings\n${formData.lessons}\n\n## Metrics\n${formData.metrics}`;
      } else {
        content = `${formData.build}\n\n${repoName} • ${lang}\n\n${formData.features ? `Features: ${formData.features}` : ""}\n${formData.bugs ? `Bugs: ${formData.bugs}` : ""}`;
      }
      
      return { platform, content, copied: false };
    });
    
    setGeneratedContent(newContent);
    
    const currentStats = JSON.parse(localStorage.getItem("user_stats") || '{"postsGenerated":0,"mostUsedPlatform":"None","streak":0,"monthlyGoal":0,"goalTarget":20}');
    const platformCounts: Record<string, number> = JSON.parse(localStorage.getItem("platform_counts") || '{}');
    
    selectedPlatforms.forEach(p => {
      platformCounts[p] = (platformCounts[p] || 0) + 1;
    });
    
    const mostUsed = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
    const newStats = {
      postsGenerated: currentStats.postsGenerated + selectedPlatforms.length,
      mostUsedPlatform: mostUsed,
      streak: currentStats.streak + 1,
      monthlyGoal: currentStats.monthlyGoal + selectedPlatforms.length,
      goalTarget: currentStats.goalTarget,
    };
    
    setStats(newStats);
    localStorage.setItem("user_stats", JSON.stringify(newStats));
    localStorage.setItem("platform_counts", JSON.stringify(platformCounts));
    
    const activity = { title: `Generated ${selectedPlatforms.length} post(s)`, platform: selectedPlatforms.join(", "), time: "Just now" };
    const prevActivity = JSON.parse(localStorage.getItem("recent_activity") || "[]");
    localStorage.setItem("recent_activity", JSON.stringify([activity, ...prevActivity.slice(0, 4)]));
    
    const newHistory = {
      id: Date.now().toString(),
      title: `Generated ${selectedPlatforms.length} post(s)`,
      platform: selectedPlatforms.join(", "),
      date: new Date().toISOString().split("T")[0],
      content: selectedPlatforms.map(p => generatedContent.find(gc => gc.platform === p)?.content || "").join("\n\n---\n\n"),
      engagement: {},
    };
    const prevHistory = JSON.parse(localStorage.getItem("content_history") || "[]");
    localStorage.setItem("content_history", JSON.stringify([newHistory, ...prevHistory.slice(0, 49)]));
    
    setGenerating(false);
  };

  const copyToClipboard = async (index: number) => {
    const content = generatedContent[index];
    await navigator.clipboard.writeText(content.content);
    setGeneratedContent(prev => prev.map((c, i) => i === index ? { ...c, copied: true } : c));
    setTimeout(() => {
      setGeneratedContent(prev => prev.map((c, i) => i === index ? { ...c, copied: false } : c));
    }, 2000);
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
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-zinc-50 mb-2">Generate Content</h1>
          <p className="text-zinc-500">Paste your GitHub repo or describe what you built</p>
        </div>

        <div className="space-y-8">
          <div className="card">
            <h2 className="text-base font-medium text-zinc-300 mb-5 flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub Repository
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="flex-1"
                />
                <button
                  onClick={fetchRepoData}
                  disabled={loadingRepo || !repoUrl}
                  className="px-5 py-2.5 bg-white text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingRepo ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                  Load Repo
                </button>
              </div>
              {repoError && <p className="text-sm text-red-400">{repoError}</p>}
              {repoData && (
                <div className="p-4 rounded-lg bg-white/2 border border-zinc-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-300">{repoData.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">{repoData.description}</p>
                    </div>
                    {repoData.language && (
                      <span className="px-2 py-1 text-xs bg-violet-500/20 text-violet-400 rounded">
                        {repoData.language}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <span>⭐</span> {repoData.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>⑂</span> {repoData.forks}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📌</span> {repoData.openIssues}
                    </span>
                    {repoData.lastCommit && (
                      <span className="flex items-center gap-1">
                        <span>📅</span> {repoData.lastCommit}
                      </span>
                    )}
                  </div>
                  {repoData.topics && repoData.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {repoData.topics.slice(0, 5).map((topic) => (
                        <span key={topic} className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                  {repoData.readme && (
                    <div className="mt-3 p-3 rounded bg-zinc-900/50 text-xs text-zinc-400 max-h-32 overflow-y-auto">
                      <p className="font-medium text-zinc-500 mb-1">README Preview:</p>
                      {repoData.readme.substring(0, 300)}...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-medium text-zinc-300 mb-5">What did you build?</h2>
            <div className="space-y-4">
              <textarea
                value={formData.build}
                onChange={(e) => setFormData({ ...formData, build: e.target.value })}
                placeholder="Describe your build today..."
                rows={4}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Features shipped"
                />
                <input
                  value={formData.bugs}
                  onChange={(e) => setFormData({ ...formData, bugs: e.target.value })}
                  placeholder="Bugs fixed"
                />
                <input
                  value={formData.lessons}
                  onChange={(e) => setFormData({ ...formData, lessons: e.target.value })}
                  placeholder="Lessons learned"
                />
                <input
                  value={formData.metrics}
                  onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                  placeholder="Metrics / achievements"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-medium text-zinc-300 mb-4">Select Tones</h2>
            <div className="flex flex-wrap gap-2">
              {tones.map((tone) => (
                <button
                  key={tone.value}
                  type="button"
                  onClick={() => setSelectedTones(prev => 
                    prev.includes(tone.value) 
                      ? prev.filter(t => t !== tone.value)
                      : [...prev, tone.value]
                  )}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedTones.includes(tone.value)
                      ? "bg-violet-600/20 text-violet-400 border border-violet-500/30"
                      : "border border-white/10 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {selectedTones.includes(tone.value) && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-medium text-zinc-300 mb-4">Output Platforms</h2>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => setSelectedPlatforms(prev => 
                    prev.includes(platform.value) 
                      ? prev.filter(p => p !== platform.value)
                      : [...prev, platform.value]
                  )}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedPlatforms.includes(platform.value)
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "border border-white/10 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-medium text-zinc-300 mb-4">Content Template</h2>
            <div className="flex flex-wrap gap-2">
              {templates.map((template) => (
                <button
                  key={template.value}
                  type="button"
                  onClick={() => setSelectedTemplates(prev => 
                    prev.includes(template.value)
                      ? prev.filter(t => t !== template.value)
                      : [...prev, template.value]
                  )}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedTemplates.includes(template.value)
                      ? "bg-zinc-700 text-zinc-100 border border-white/10"
                      : "border border-white/10 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {selectedTemplates.includes(template.value) && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateContent}
            disabled={generating}
            className="w-full py-4 px-6 bg-white text-zinc-900 rounded-lg text-base font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate Content
              </>
            )}
          </button>

          {generatedContent.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-zinc-300">Generated Content</h3>
              {generatedContent.map((content, index) => (
                <div key={content.platform} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-zinc-400">
                      {platforms.find(p => p.value === content.platform)?.label}
                    </span>
                    <button
                      onClick={() => copyToClipboard(index)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/5 text-zinc-400 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      {content.copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {content.copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{content.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
