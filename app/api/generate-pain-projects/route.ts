import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  let painDescription: string = "";  
  try {
    const body = await request.json();
    painDescription = body.painDescription;
    
    if (!painDescription) {
      return NextResponse.json({ error: "Descrição da dor é obrigatória", projects: [] }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY não encontrada no .env");
      return NextResponse.json({ error: "API key não configurada", projects: [] }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Você é um assistente técnico que sugere projetos de programação detalhados.
Retorne APENAS um JSON no formato:
{
  "projects": [
    {
      "title": "Nome do Projeto",
      "description": "Descrição detalhada com 2-3 frases explicando o propósito, o público-alvo e como resolve a dor",
      "functions": ["função1()", "função2()"],
      "features": ["feature1", "feature2"],
      "endpoints": ["GET /api/resource", "POST /api/resource"],
      "database": ["users table", "logs table"],
      "architecture": "MVC/Microservices/Monolith",
      "auth": "JWT/OAuth2/Session",
      "deployment": "Docker/Vercel/AWS"
    }
  ]
}
Gere 5 projetos práticos para resolver ou mitigar a dor descrita.`,
        },
        {
          role: "user",
          content: `Dor: ${painDescription}. Sugira 5 projetos de programação com especificações detalhadas.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content || "{}";
    const parsed = JSON.parse(content);
    const projects = Array.isArray(parsed.projects) ? parsed.projects : [];

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("Erro na API generate-pain-projects:", error);
    
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      const mockProjects = [
        {
          title: `App de monitoramento para: ${painDescription}`,
          description: `Um aplicativo mobile completo para monitorar métricas relacionadas à dor "${painDescription}". O sistema coleta dados em tempo real, processa alertas automáticos e gera relatórios para tomada de decisão. Ideal para equipes que precisam de visibilidade constante sobre o problema.`,
          functions: ["monitor()", "alert()", "report()"],
          features: ["Dashboard em tempo real", "Notificações push", "Relatórios PDF"],
          endpoints: ["GET /api/metrics", "POST /api/alerts", "GET /api/reports"],
          database: ["metrics table", "alerts table", "users table"],
          architecture: "Microservices",
          auth: "JWT",
          deployment: "Docker + Kubernetes"
        },
        {
          title: `Dashboard analítico para: ${painDescription}`,
          description: `Uma plataforma web de análise de dados focada em extrair insights sobre a dor "${painDescription}". Permite filtrar grandes volumes de dados, visualizar tendências e exportar relatórios personalizados. Perfeito para analistas e gestores que precisam entender a fundo o problema.`,
          functions: ["fetchData()", "filterData()", "exportCSV()"],
          features: ["Gráficos interativos", "Filtros avançados", "Exportação de dados"],
          endpoints: ["GET /api/data", "POST /api/filters", "GET /api/export"],
          database: ["datasets table", "filters table"],
          architecture: "MVC",
          auth: "OAuth2",
          deployment: "Vercel"
        },
        {
          title: `Bot automatizado para: ${painDescription}`,
          description: `Um bot inteligente que automatiza tarefas repetitivas relacionadas à dor "${painDescription}". Executa processos em background, integra-se com APIs externas e mantém logs detalhados de todas as operações. Ideal para reduzir o trabalho manual e aumentar a eficiência operacional.`,
          functions: ["startBot()", "processTask()", "sendReport()"],
          features: ["Agendamento de tarefas", "Integração com APIs", "Logs detalhados"],
          endpoints: ["POST /api/bot/start", "GET /api/bot/status", "POST /api/bot/task"],
          database: ["tasks table", "logs table"],
          architecture: "Monolith",
          auth: "API Key",
          deployment: "AWS Lambda"
        },
        {
          title: `API REST para gerenciar: ${painDescription}`,
          description: `Uma API RESTful robusta para gerenciar todos os dados e operações relacionadas à dor "${painDescription}". Oferece endpoints documentados, autenticação segura e controle de rate limiting. Perfeita para ser consumida por múltiplos frontends ou integrações de terceiros.`,
          functions: ["create()", "read()", "update()", "delete()"],
          features: ["Autenticação JWT", "Documentação Swagger", "Rate limiting"],
          endpoints: ["POST /api/items", "GET /api/items/:id", "PUT /api/items/:id", "DELETE /api/items/:id"],
          database: ["items table", "users table", "permissions table"],
          architecture: "RESTful",
          auth: "JWT",
          deployment: "Heroku"
        },
        {
          title: `Interface web para resolver: ${painDescription}`,
          description: `Uma aplicação web moderna e responsiva para resolver a dor "${painDescription}" através de formulários dinâmicos e validação em tempo real. Suporta temas personalizáveis e oferece feedback imediato para o usuário. Ideal para usuários finais que precisam de uma solução simples e intuitiva.`,
          functions: ["handleSubmit()", "validateForm()", "showResults()"],
          features: ["Formulário dinâmico", "Validação em tempo real", "Tema dark/light"],
          endpoints: ["GET /api/form", "POST /api/submit", "GET /api/results"],
          database: ["submissions table", "forms table"],
          architecture: "SPA",
          auth: "Session",
          deployment: "Netlify"
        }
      ];
      return NextResponse.json({ projects: mockProjects, warning: "Usando dados de exemplo (quota excedida)" });
    }
    
    return NextResponse.json({ error: error.message || "Erro desconhecido", projects: [] }, { status: 500 });
  }
}
