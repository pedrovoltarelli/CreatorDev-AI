const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remover-usuario')
    .setDescription('Remove um usuário do ticket')
    .addUserOption(option => 
      option.setName('usuario')
        .setDescription('Usuário a ser removido')
        .setRequired(true)),

  async execute(interaction, client) {
    const channel = interaction.channel;
    const user = interaction.options.getUser('usuario');
    
    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ Este comando só pode ser usado em tickets!', ephemeral: true });
    }

    try {
      const channelPerms = channel.permissionOverwrites;
      await channelPerms.delete(user.id);

      const embed = new EmbedBuilder()
        .setTitle('✅ Usuário Removido')
        .setDescription(`O usuário ${user.tag} foi removido do ticket.`)
        .setColor(client.config.colors.success);

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      await interaction.reply({ content: '❌ Erro ao remover usuário!', ephemeral: true });
    }
  }
};