const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-info')
    .setDescription('Mostra informações do servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),

  async execute(interaction, client) {
    const guild = interaction.guild;
    const owner = await guild.fetchOwner();

    const createdAt = guild.createdAt;
    const createdDate = `${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`;

    const embed = new EmbedBuilder()
      .setTitle('📊 Informações do Servidor')
      .setColor('#5865F2')
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: '📌 Nome:', value: `**${guild.name}**`, inline: true },
        { name: '🏷️ ID:', value: `\`${guild.id}\``, inline: true },
        { name: '👥 Membros:', value: `**${guild.memberCount}**`, inline: true },
        { name: '👑 Dono:', value: owner.user.tag, inline: true },
        { name: '📅 Criado em:', value: createdDate, inline: true },
        { name: '🔗 Canais:', value: `📁 ${guild.channels.cache.size} | 🎤 ${guild.voiceStates.cache.size}`, inline: true },
        { name: '🎭 Cargos:', value: `**${guild.roles.cache.size}** cargos`, inline: true },
        { name: '🌍 Região:', value: guild.preferredLocale || 'Não definida', inline: true }
      )
      .setFooter({ text: 'CreatorDev Bot', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};