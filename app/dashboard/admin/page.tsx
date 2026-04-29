"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name: string;
  plan: string;
  created_at: string;
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isLoading && !user?.isAdmin) {
      router.push("/dashboard");
      return;
    }
  }, [user, isLoading, mounted, router]);

  useEffect(() => {
    if (!mounted || !user?.isAdmin) return;

    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users);
      })
      .catch(err => console.error("Failed to fetch users:", err));
  }, [mounted, user]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  const totalGenerations = 0;

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-50 mb-2">Admin Dashboard</h1>
          <p className="text-zinc-500">Gerencie usuários e visualize dados do site</p>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="card p-6">
             <div className="flex items-center gap-3 mb-2">
               <Users className="w-5 h-5 text-blue-400" />
               <h3 className="text-sm font-medium text-zinc-400">Total de Usuários</h3>
             </div>
             <p className="text-3xl font-semibold text-zinc-50">{users.length}</p>
           </div>
         </div>

         <div className="card p-6 mb-6">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-medium text-zinc-200">Usuários</h2>
           </div>
          
          <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr className="border-b border-white/10">
                   <th className="text-left text-xs font-medium text-zinc-500 pb-3">Nome</th>
                   <th className="text-left text-xs font-medium text-zinc-500 pb-3">Email</th>
                   <th className="text-left text-xs font-medium text-zinc-500 pb-3">Plano</th>
                   <th className="text-left text-xs font-medium text-zinc-500 pb-3">Data de Cadastro</th>
                 </tr>
               </thead>
               <tbody>
                 {users.map((u) => (
                   <tr key={u.id} className="border-b border-white/5">
                     <td className="py-3 text-sm text-zinc-300">{u.name}</td>
                     <td className="py-3 text-sm text-zinc-400">{u.email}</td>
                     <td className="py-3">
                       <span className={`px-2 py-1 text-xs rounded ${
                         u.plan === "team" ? "bg-purple-500/20 text-purple-400" :
                         u.plan === "pro" ? "bg-blue-500/20 text-blue-400" :
                         u.plan === "creator" ? "bg-green-500/20 text-green-400" :
                         "bg-zinc-500/20 text-zinc-400"
                       }`}>
                         {u.plan}
                       </span>
                     </td>
                     <td className="py-3 text-sm text-zinc-300">
                       {new Date(u.created_at).toLocaleDateString("pt-BR")}
                     </td>
                   </tr>
                 ))}
                 {users.length === 0 && (
                   <tr>
                     <td colSpan={4} className="py-8 text-center text-sm text-zinc-500">
                       <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                       Nenhum usuário encontrado
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

       </main>
    </div>
  );
}
