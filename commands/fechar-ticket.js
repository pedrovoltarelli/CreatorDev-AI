const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fechar-ticket')
    .setDescription('Fecha o ticket atual'),

  async execute(interaction, client) {
    const channel = interaction.channel;
    
    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ Este comando só pode ser usado em tickets!', ephemeral: true });
    }

    const confirmButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('confirm_close')
          .setLabel('Confirmar')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('✅'),
        new ButtonBuilder()
          .setCustomId('cancel_close')
          .setLabel('Cancelar')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('❌')
      );

    const embed = new EmbedBuilder()
      .setTitle('⚠️ Confirmar Fechamento')
      .setDescription('Tem certeza que deseja fechar este ticket?\n\n📝 O log será salvo e enviado no canal de logs.')
      .setColor('#FFA500');

    await interaction.reply({ embeds: [embed], components: [confirmButton] });
  }
};