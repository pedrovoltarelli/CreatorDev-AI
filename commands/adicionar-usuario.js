const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adicionar-usuario')
    .setDescription('Adiciona um usuário ao ticket')
    .addUserOption(option => 
      option.setName('usuario')
        .setDescription('Usuário a ser adicionado')
        .setRequired(true)),

  async execute(interaction, client) {
    const channel = interaction.channel;
    const user = interaction.options.getUser('usuario');
    
    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ Este comando só pode ser usado em tickets!', ephemeral: true });
    }

    try {
      const channelPerms = channel.permissionOverwrites;
      await channelPerms.edit(user.id, {
        ViewChannel: true,
        SendMessages: true,
        AttachFiles: true,
        ReadMessageHistory: true
      });

      const embed = new EmbedBuilder()
        .setTitle('✅ Usuário Adicionado')
        .setDescription(`O usuário ${user.tag} foi adicionado ao ticket.`)
        .setColor(client.config.colors.success);

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      await interaction.reply({ content: '❌ Erro ao adicionar usuário!', ephemeral: true });
    }
  }
};