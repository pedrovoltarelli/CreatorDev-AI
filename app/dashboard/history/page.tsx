"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Clock, ThumbsUp, MessageCircle, Share2, ExternalLink, Eye, Trash2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  platform: string;
  date: string;
  content: string;
  engagement: {
    likes?: number;
    retweets?: number;
    replies?: number;
    comments?: number;
    views?: number;
    clicks?: number;
    opens?: number;
    upvotes?: number;
  };
}

export default function HistoryPage() {
  const [posts, setPosts] = useState<Post[]>(() => {
    if (typeof window === "undefined") return [];
    const storedHistory = localStorage.getItem("content_history");
    if (!storedHistory) return [];
    try {
      return JSON.parse(storedHistory);
    } catch {
      return [];
    }
  });

  const clearHistory = () => {
    localStorage.removeItem("content_history");
    setPosts([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Content History</h1>
              <p className="text-gray-400">Timeline of your generated content</p>
            </div>
            {posts.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-300 mb-2">No content yet</h2>
              <p className="text-gray-500">Start generating content to see your history here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-1">{post.title}</h2>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs">
                          {post.platform}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.date}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-2">{post.content}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    {post.engagement.likes !== undefined && (
                      <span className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        {post.engagement.likes}
                      </span>
                    )}
                    {post.engagement.retweets !== undefined && (
                      <span className="flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        {post.engagement.retweets}
                      </span>
                    )}
                    {post.engagement.replies !== undefined && (
                      <span className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {post.engagement.replies}
                      </span>
                    )}
                    {post.engagement.views !== undefined && (
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {post.engagement.views}
                      </span>
                    )}
                    {post.engagement.clicks !== undefined && (
                      <span className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        {post.engagement.clicks}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
