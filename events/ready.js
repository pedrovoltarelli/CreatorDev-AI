module.exports = {
  name: 'clientReady',
  once: true,

  async execute(client) {
    console.log('═'.repeat(50));
    console.log(`✅ Bot online: ${client.user.tag}`);
    console.log(`📊 Servidores: ${client.guilds.cache.size}`);
    console.log(`📚 Comandos: ${client.commands?.size || 0}`);
    console.log('═'.repeat(50));
    
    client.user.setActivity('🎫 Tickets | /help', { type: 'PLAYING' });
  }
};