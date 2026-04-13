# 🤖 CreatorDev Bot - Discord Bot

Um bot Discord completo e modular construído com Node.js e discord.js, com sistema de tickets, painel de informações, regras e notificador do Instagram.

## 📋 Recursos

- **🎫 Sistema de Tickets Avançado**: Criação automática de tickets com categorias, permissões e transcrição
- **📊 Painel de Informações**: Comando /server-info com dados do servidor
- **📜 Sistema de Regras**: Painel de regras com botão de aceite e cargo automático
- **📢 Notificador do Instagram**: Monitoramento de novos posts e notificações em tempo real

## 📁 Estrutura do Projeto

```
creatordev-bot/
├── index.js              # Arquivo principal
├── config.json            # Configurações do bot
├── package.json           # Dependências
├── commands/             # Comandos slash
│   ├── ticket-painel.js
│   ├── server-info.js
│   ├── regras.js
│   ├── fechar-ticket.js
│   ├── adicionar-usuario.js
│   └── remover-usuario.js
├── events/               # Eventos do Discord
│   ├── interactionCreate.js
│   └── ready.js
└── systems/              # Sistemas adicionais
    ├── ticket/
    │   └── ticketSystem.js
    └── instagram/
        └── instagramNotifier.js
```
