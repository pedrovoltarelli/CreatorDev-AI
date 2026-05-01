"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabase } from "@/lib/supabase";
import type { Pain, PainProject } from "@/types/pains";
import { Trash2, Plus, Sparkles, Pencil, Save, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function PainDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const painId = params.id as string;
  const [pain, setPain] = useState<Pain | null>(null);
  const [projects, setProjects] = useState<PainProject[]>([]);
  const [newProject, setNewProject] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const supabase = getSupabase();

  useEffect(() => {
    if (user && painId) fetchData();
  }, [user, painId]);

  const fetchData = async () => {
    if (!supabase) return;
    setLoading(true);
    const [{ data: painData }, { data: projectsData }] = await Promise.all([
      supabase.from("pains").select("*").eq("id", painId).eq("user_id", user!.id).single(),
      supabase.from("pain_projects").select("*").eq("pain_id", painId).eq("user_id", user!.id).order("created_at", { ascending: true }),
    ]);

    if (painData) setPain(painData);
    else router.push("/dashboard/pains");
    setProjects(projectsData || []);
    setLoading(false);
  };

  const generateProjects = async () => {
    if (!supabase) return;
    if (!pain) return;
    setGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-pain-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ painDescription: pain.description }),
      });

      const data = await response.json();
      const aiProjects = data.projects || [];
      if (!Array.isArray(aiProjects)) {
        setError("Resposta inválida da IA");
        setGenerating(false);
        return;
      }
      const inserts = aiProjects.map((proj: any) => ({
        pain_id: painId,
        user_id: user!.id,
        description: proj.description || proj.title || "",
        title: proj.title || "",
        functions: proj.functions || null,
        features: proj.features || null,
        endpoints: proj.endpoints || null,
        database: proj.database || null,
        architecture: proj.architecture || null,
        auth: proj.auth || null,
        deployment: proj.deployment || null,
        is_ai_generated: true,
      }));

      const { data: inserted, error } = await supabase.from("pain_projects").insert(inserts).select();
      if (error) setError(error.message);
      else setProjects([...projects, ...inserted]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const addManualProject = async () => {
    if (!supabase) return;
    if (!newProject.trim() || !pain) return;
    const { data, error } = await supabase
      .from("pain_projects")
      .insert([{ pain_id: pain.id, user_id: user!.id, description: newProject.trim(), is_ai_generated: false }])
      .select()
      .single();

    if (error) setError(error.message);
    else {
      setProjects([...projects, data]);
      setNewProject("");
    }
  };

  const deleteProject = async (id: string) => {
    if (!supabase) return;
    await supabase.from("pain_projects").delete().eq("id", id);
    setProjects(projects.filter((p) => p.id !== id));
  };

  const startEdit = (project: PainProject) => {
    setEditingId(project.id);
    setEditText(project.description);
  };

  const saveEdit = async () => {
    if (!supabase) return;
    if (!editingId || !editText.trim()) return;
    const { data, error } = await supabase
      .from("pain_projects")
      .update({ description: editText.trim() })
      .eq("id", editingId)
      .select()
      .single();

    if (error) setError(error.message);
    else {
      setProjects(projects.map((p) => (p.id === editingId ? data : p)));
      setEditingId(null);
      setEditText("");
    }
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Carregando...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="text-zinc-400 hover:text-white mb-4 flex items-center gap-2">
            ← Voltar
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Dor</h1>
            <p className="text-zinc-300 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">{pain?.description}</p>
          </div>

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Projetos Sugeridos</h2>
            <button
              onClick={generateProjects}
              disabled={generating}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {generating ? "Gerando..." : "Gerar com IA"}
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              placeholder="Adicionar projeto manualmente..."
              className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
              onKeyDown={(e) => e.key === "Enter" && addManualProject()}
            />
            <button
              onClick={addManualProject}
              disabled={!newProject.trim()}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {projects.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">Nenhum projeto gerado ainda</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  {editingId === project.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-white text-sm"
                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      />
                      <button onClick={saveEdit} className="text-violet-400 hover:text-violet-300">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-zinc-400 hover:text-zinc-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-semibold">{project.title || project.description}</h3>
                          {project.description && project.title && (
                            <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{project.description}</p>
                          )}
                          {project.is_ai_generated && (
                            <span className="text-xs text-violet-400">IA</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(project)} className="p-2 text-zinc-400 hover:text-white">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteProject(project.id)} className="p-2 text-zinc-400 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {project.functions && project.functions.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-zinc-500 mb-1">Funções:</p>
                          <div className="flex flex-wrap gap-1">
                            {project.functions.map((fn, i) => (
                              <code key={i} className="px-2 py-1 bg-zinc-800 rounded text-xs text-violet-300">{fn}</code>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {project.features && project.features.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-zinc-500 mb-1">Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {project.features.map((feat, i) => (
                              <span key={i} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">{feat}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {project.endpoints && project.endpoints.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-zinc-500 mb-1">Endpoints:</p>
                          <div className="flex flex-wrap gap-1">
                            {project.endpoints.map((ep, i) => (
                              <code key={i} className="px-2 py-1 bg-zinc-800 rounded text-xs text-green-300">{ep}</code>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {project.database && project.database.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-zinc-500 mb-1">Database:</p>
                          <div className="flex flex-wrap gap-1">
                            {project.database.map((tbl, i) => (
                              <span key={i} className="px-2 py-1 bg-zinc-800 rounded text-xs text-blue-300">{tbl}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {(project.architecture || project.auth || project.deployment) && (
                        <div className="flex flex-wrap gap-4 text-xs">
                          {project.architecture && (
                            <div>
                              <span className="text-zinc-500">Arch: </span>
                              <span className="text-violet-300">{project.architecture}</span>
                            </div>
                          )}
                          {project.auth && (
                            <div>
                              <span className="text-zinc-500">Auth: </span>
                              <span className="text-yellow-300">{project.auth}</span>
                            </div>
                          )}
                          {project.deployment && (
                            <div>
                              <span className="text-zinc-500">Deploy: </span>
                              <span className="text-cyan-300">{project.deployment}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
