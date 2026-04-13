const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-painel')
    .setDescription('Envia o painel de tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle('🎫 CENTRAL DE ATENDIMENTO')
      .setDescription('Selecione uma categoria abaixo para abrir seu ticket')
      .setColor('#000000')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: '💬 Dúvidas', value: 'Tire suas dúvidas sobre nossos serviços', inline: true },
        { name: '🤝 Parcerias', value: 'Parcerias comerciais e colaborações', inline: true },
        { name: '💰 Orçamentos', value: 'Solicite orçamentos para criação de sites, bots, etc', inline: true }
      )
      .setImage('https://media.discordapp.net/attachments/1288847445513736222/1290047719938539530/banner.png?width=1440&height=320')
      .setFooter({ text: 'Nossa equipe responderá em breve!', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_duvidas')
          .setLabel('💬 Dúvidas')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('ticket_parcerias')
          .setLabel('🤝 Parcerias')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('ticket_orcamentos')
          .setLabel('💰 Orçamentos')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({ content: '✅ Painel de tickets enviado!', ephemeral: true });
    await interaction.channel.send({ embeds: [embed], components: [buttons] });
  }
};