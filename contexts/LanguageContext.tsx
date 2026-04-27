"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "pt-BR" | "en-US" | "es-ES";

interface Translations {
  dashboard: string;
  generate: string;
  history: string;
  settings: string;
  pricing: string;
  login: string;
  signup: string;
  logout: string;
  welcome: string;
  startGenerating: string;
  noActivity: string;
  connectRepo: string;
  viewRepo: string;
  disconnect: string;
  connect: string;
  postsGenerated: string;
  mostUsedPlatform: string;
  consistencyStreak: string;
  monthlyGoals: string;
  engagements: string;
  daysInRow: string;
  startToday: string;
  noPostsYet: string;
  keepGenerating: string;
  quickStats: string;
  engagementRate: string;
  avgReactions: string;
  wordsTotal: string;
  completion: string;
  recentActivity: string;
  githubRepository: string;
}

const translations: Record<Language, Translations> = {
  "pt-BR": {
    dashboard: "Dashboard",
    generate: "Gerar",
    history: "Histórico",
    settings: "Configurações",
    pricing: "Preços",
    login: "Entrar",
    signup: "Cadastrar",
    logout: "Sair",
    welcome: "Bem-vindo de volta",
    startGenerating: "Gerar Conteúdo",
    noActivity: "Nenhuma atividade ainda",
    connectRepo: "Conectar Repositório",
    viewRepo: "Ver Repositório",
    disconnect: "Desconectar",
    connect: "Conectar",
    postsGenerated: "Posts Gerados",
    mostUsedPlatform: "Plataforma Mais Usada",
    consistencyStreak: "Sequência",
    monthlyGoals: "Metas Mensais",
    engagements: "gerações",
    daysInRow: "dias seguidos",
    startToday: "Comece hoje!",
    noPostsYet: "Nenhum post ainda",
    keepGenerating: "Continue gerando para ver",
    quickStats: "Estatísticas Rápidas",
    engagementRate: "Taxa de Engajamento",
    avgReactions: "Média de Reações",
    wordsTotal: "Total de Palavras",
    completion: "Conclusão",
    recentActivity: "Atividade Recente",
    githubRepository: "Repositório GitHub",
  },
  "en-US": {
    dashboard: "Dashboard",
    generate: "Generate",
    history: "History",
    settings: "Settings",
    pricing: "Pricing",
    login: "Log in",
    signup: "Sign up",
    logout: "Log out",
    welcome: "Welcome back",
    startGenerating: "Generate Content",
    noActivity: "No activity yet",
    connectRepo: "Connect Repository",
    viewRepo: "View Repository",
    disconnect: "Disconnect",
    connect: "Connect",
    postsGenerated: "Posts Generated",
    mostUsedPlatform: "Most Used Platform",
    consistencyStreak: "Consistency Streak",
    monthlyGoals: "Monthly Goals",
    engagements: "generations",
    daysInRow: "days in a row",
    startToday: "Start today!",
    noPostsYet: "No posts yet",
    keepGenerating: "Keep generating to see",
    quickStats: "Quick Stats",
    engagementRate: "Engagement Rate",
    avgReactions: "Avg Reactions",
    wordsTotal: "Words Total",
    completion: "Completion",
    recentActivity: "Recent Activity",
    githubRepository: "GitHub Repository",
  },
  "es-ES": {
    dashboard: "Panel",
    generate: "Generar",
    history: "Historial",
    settings: "Ajustes",
    pricing: "Precios",
    login: "Iniciar sesión",
    signup: "Registrarse",
    logout: "Cerrar sesión",
    welcome: "Bienvenido de nuevo",
    startGenerating: "Generar Contenido",
    noActivity: "Sin actividad todavía",
    connectRepo: "Conectar Repositorio",
    viewRepo: "Ver Repositorio",
    disconnect: "Desconectar",
    connect: "Conectar",
    postsGenerated: "Posts Generados",
    mostUsedPlatform: "Plataforma Más Usada",
    consistencyStreak: "Racha",
    monthlyGoals: "Metas Mensuales",
    engagements: "generaciones",
    daysInRow: "días seguidos",
    startToday: "¡Comenzar hoy!",
    noPostsYet: "Sin posts todavía",
    keepGenerating: "Seguir generando para ver",
    quickStats: "Estadísticas Rápidas",
    engagementRate: "Tasa de Interacción",
    avgReactions: "Promedio de Reacciones",
    wordsTotal: "Total de Palabras",
    completion: "Completado",
    recentActivity: "Actividad Reciente",
    githubRepository: "Repositorio GitHub",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const initialLanguage: Language = (() => {
    if (typeof window === "undefined") return "en-US";
    const saved = localStorage.getItem("language") as Language;
    if (saved && translations[saved]) return saved;
    return "en-US";
  })();

  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [t, setT] = useState<Translations>(translations[initialLanguage]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setT(translations[lang]);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
