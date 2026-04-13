const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

const rulesText = `**━━※❰━━━☆━━━❱※━━**
**1 REGRAS:** Em call, não imponha sua voz acima da voz de outros na mesma call, respeite o espaço de todos.

**2 REGRAS:** Sem discriminação, não é tolerado qualquer forma de preconcebao, intolerância, difamação, toxicidade.

**3 REGRAS:** Sem conteúdo inapropriado, isso inclui mas não se limita a mídia NSFW, humor pesado, conteúdo adulto.

**4 REGRAS:** Sem flood demasiado de um conteúdo repetitivo que incomode ou denigra uma pessoa.

**5 REGRAS:** Ameaçar a existência do servidor, como dizer que irá derrubá-lo ou membros da equipe.

**6 REGRAS:** Vazamento de dados pessoais como: CPF, RG, Nome completo, CEP, Fotos, Telefone, etc.

**7 REGRAS:** Promover atentados contra a vida ou pedir ações negativas contra a saúde de alguém.
**━━※❰━━━☆━━━❱※━━**

**✦ OBSERVAÇÕES:** Em caso de quebra de regras, terá advertência. Dependendo da gravidade, poderá causar expulsão ou ban.

Por favor, seja educado para que seja um ótimo servidor de interação entre os membros!`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('regras')
    .setDescription('Envia o painel de regras do servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle('📜 TERMOS - Diretrizes da CreatorDev')
      .setDescription('Seja bem-vindo(a) ao canal de diretrizes da CreatorDev! Abaixo você confere as regras do nosso Discord.')
      .setColor('#5865F2')
      .addFields(
        { name: '📋 Regras do Servidor', value: rulesText }
      )
      .setFooter({ text: 'CreatorDev Bot', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ content: '✅ Painel de regras enviado!', ephemeral: true });
    await interaction.channel.send({ embeds: [embed] });
  }
};