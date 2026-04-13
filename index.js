require('dotenv').config();

const { Client, GatewayIntentBits, Collection, PermissionsBitField } = require('discord.js');
const { readdirSync } = require('fs');
const fs = require('fs');

const configFile = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const envToConfig = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,
  roles: {
    member: process.env.ROLE_MEMBER,
    owner: process.env.ROLE_OWNER,
    coowner: process.env.ROLE_COOWNER,
    manager: process.env.ROLE_MANAGER,
    mod: process.env.ROLE_MOD,
    staff: [
      process.env.ROLE_OWNER,
      process.env.ROLE_COOWNER,
      process.env.ROLE_MANAGER,
      process.env.ROLE_MOD
    ].filter(role => role),
    acceptRole: process.env.ROLE_ACCEPT_RULES
  },
  channels: {
    logs: process.env.CHANNEL_LOGS,
    notifications: process.env.CHANNEL_NOTIFICATIONS,
    tickets: process.env.CHANNEL_TICKETS
  },
  ticket: {
    categories: {
      duvidas: process.env.TICKET_CATEGORY_DUVIDAS,
      parcerias: process.env.TICKET_CATEGORY_PARCERIAS,
      orcamentos: process.env.TICKET_CATEGORY_ORCAMENTOS
    },
    maxTicketsPerUser: configFile.ticket?.maxTicketsPerUser || 3,
    closeConfirmation: configFile.ticket?.closeConfirmation ?? true
  },
  rules: configFile.rules,
  serverInfo: configFile.serverInfo,
  colors: configFile.colors,
  prefix: configFile.prefix
};

const config = { ...configFile, ...envToConfig };

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.config = config;
client.commands = new Collection();
client.tickets = new Collection();

const PORT = process.env.PORT || 8080;

async function loadCommands() {
  const commandsPath = './commands';
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`[COMMAND] Comando carregado: ${command.data.name}`);
  }
}

async function loadEvents() {
  const eventsPath = './events';
  const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`[EVENT] Evento carregado: ${event.name}`);
  }
}

async function loadSystems() {
  const systemsPath = './systems';
  
  try {
    const ticketSystem = require('./systems/ticket/ticketSystem.js');
    if (ticketSystem && ticketSystem.initialize) {
      ticketSystem.initialize(client);
      console.log('[SYSTEM] Sistema de Tickets inicializado');
    }
  } catch (err) {
    console.log('[SYSTEM] Sistema de Tickets não encontrado ou com erro:', err.message);
  }
}

async function deployCommands() {
  const { REST } = require('discord.js');
  const rest = new REST({ version: '10' }).setToken(config.token);

  const commands = [];
  const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  try {
    await rest.put(
      `/applications/${config.clientId}/guilds/${config.guildId}/commands`,
      { body: commands }
    );
    console.log('[DEPLOY] Comandos slash registrados com sucesso!');
  } catch (error) {
    console.error('[DEPLOY] Erro ao registrar comandos:', error);
  }
}

async function startBot() {
  console.log('='.repeat(50));
  console.log('  🤖 Bot Discord - CreatorDev');
  console.log('='.repeat(50));
  
  await loadCommands();
  await loadEvents();
  await loadSystems();
  
  client.login(config.token);
  
  client.once('ready', async () => {
    console.log(`\n✅ Bot online: ${client.user.tag}`);
    console.log(`📚 Comandos carregados: ${client.commands.size}`);
    console.log('='.repeat(50));
    
    try {
      await deployCommands();
    } catch (err) {
      console.log('[DEPLOY] Comandos já registrados ou erro:', err.message);
    }
  });
}

startBot();

const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running!\n');
});

server.listen(PORT, () => {
  console.log(`[HTTP] Server listening on port ${PORT}`);
});

process.on('unhandledRejection', (error) => {
  console.error('[ERRO] Erro não tratado:', error);
});

process.on('uncaughtException', (error) => {
  console.error('[ERRO] Exceção não捕获:', error);
  process.exit(1);
});

module.exports = client;