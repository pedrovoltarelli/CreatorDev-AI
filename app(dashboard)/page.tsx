import { Navigation } from "@/components/Navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Track your content creation and performance</p>
            </div>
            <ThemeToggle />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800/50 p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Posts Generated</h3>
              <p className="text-3xl font-bold text-white">142</p>
              <p className="text-sm text-green-400 mt-1">+12% from last month</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800/50 p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Most Used Platform</h3>
              <p className="text-3xl font-bold text-white">Twitter</p>
              <p className="text-sm text-blue-400 mt-1">45% of all posts</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800/50 p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Consistency Streak</h3>
              <p className="text-3xl font-bold text-white">14</p>
              <p className="text-sm text-green-400 mt-1">days in a row</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800/50 p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Monthly Goals</h3>
              <p className="text-3xl font-bold text-white">180/200</p>
              <p className="text-sm text-gray-500 mt-1">generations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-white">New post generated: "My First Feature Launch"</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-white">Weekly summary exported to newsletter</p>
                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-white">Connected GitHub repository</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">89%</p>
                  <p className="text-sm text-gray-400">Engagement Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">23</p>
                  <p className="text-sm text-gray-400">Avg Reactions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">156</p>
                  <p className="text-sm text-gray-400">Words Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">92%</p>
                  <p className="text-sm text-gray-400">Completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}