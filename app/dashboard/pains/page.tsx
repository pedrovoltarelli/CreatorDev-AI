"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabase } from "@/lib/supabase";
import type { Pain } from "@/types/pains";
import { Plus, Trash2, Edit2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PainsPage() {
  const { user } = useAuth();
  const [pains, setPains] = useState<Pain[]>([]);
  const [newPain, setNewPain] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const supabaseRef = useRef(getSupabase());
  const supabase = supabaseRef.current;
  const abortRef = useRef(false);

  useEffect(() => {
    abortRef.current = false;
    return () => { abortRef.current = true; };
  }, []);

  const fetchPains = useCallback(async () => {
    if (!supabase || abortRef.current) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("pains")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (abortRef.current) return;
    if (error) setError(error.message);
    else setPains(data || []);
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (user) fetchPains();
  }, [user, fetchPains]);

  useEffect(() => {
    if (user) fetchPains();
  }, [user]);

  const fetchPains = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("pains")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setPains(data || []);
    setLoading(false);
  };

  const addPain = async () => {
    if (!supabase) return;
    if (!newPain.trim() || !user) return;
    const { data, error } = await supabase
      .from("pains")
      .insert([{ description: newPain.trim(), user_id: user.id }])
      .select()
      .single();

    if (error) setError(error.message);
    else {
      setPains([data, ...pains]);
      setNewPain("");
    }
  };

  const deletePain = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from("pains").delete().eq("id", id);
    if (error) setError(error.message);
    else setPains(pains.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Dores</h1>
          <p className="text-gray-400 mb-8">Cadastre dores e gere projetos a partir delas</p>

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <div className="flex gap-2 mb-8">
            <input
              type="text"
              value={newPain}
              onChange={(e) => setNewPain(e.target.value)}
              placeholder="Descreva uma dor específica..."
              className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
              onKeyDown={(e) => e.key === "Enter" && addPain()}
            />
            <button
              onClick={addPain}
              disabled={!newPain.trim()}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>

          {loading ? (
            <p className="text-zinc-500">Carregando...</p>
          ) : pains.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-500">Nenhuma dor cadastrada ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pains.map((pain) => (
                <div
                  key={pain.id}
                  className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-violet-500/30 transition-all flex items-center justify-between"
                >
                  <div>
                    <p className="text-white">{pain.description}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(pain.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/pains/${pain.id}`}
                      className="p-2 text-zinc-400 hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deletePain(pain.id)}
                      className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
