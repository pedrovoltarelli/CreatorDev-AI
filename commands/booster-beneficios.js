const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('booster-beneficios')
    .setDescription('Envia o painel de benefícios para boosters')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle('⭐ BENEFÍCIOS DE SER BOOSTER NA CREATORDEV')
      .setDescription('🎉 **Obrigado por apoiar o servidor!**\n\nAo se tornar um booster, você não apenas nos ajuda a manter o servidor, mas também ganha acesso exclusivo a benefícios únicos que和非boosters não têm acesso.\n\n')
      .setColor('#F47FFF')
      .setThumbnail('https://media.discordapp.net/attachments/1288847445513736222/1290309199176884244/boost.png?width=300&height=300')
      .addFields(
        {
          name: '💬 ━━━━━━━━━━━━━━━━━━━━ Chat Privado ━━━━━━━━━━━━━━━━━━━━',
          value: 'Tenha acesso a um chat exclusivo onde você pode interagir diretamente com a equipe e outros boosters. Um espaço reservado para discussões privilegiadas e networking com pessoas que compartilham os mesmos interesses.\n\n'
        },
        {
          name: '🎙️ ━━━━━━━━━━━━━━━━━━━━ Calls Personalizadas ━━━━━━━━━━━━━━━━━━━━',
          value: 'Direito de criar suas próprias calls no servidor! Ideal para reuniões privadas, lives exclusivas ou encontros com outros membros da comunidade. Traga sua equipe ou faça networking de forma organizada.\n\n'
        },
        {
          name: '📝 ━━━━━━━━━━━━━━━━━━━━ Tópicos Privados ━━━━━━━━━━━━━━━━━━━━',
          value: 'Tenha a permissão para criar tópicos privados em nossa área de discussões. Perfeito para compartilhar projetos, ideias ou criar grupos de trabalho sem precisar dividir com todo o servidor.\n\n'
        },
        {
          name: '📚 ━━━━━━━━━━━━━━━━━━━━ Conteúdo Exclusivo sobre o Mercado Digital ━━━━━━━━━━━━━━━━━━━━',
          value: 'Acesso prioritário a materiais, vídeos, aulas e tutoriais exclusivos sobre o mercado digital. Aprenda estratégias avançadas, tacticas de marketing, tráfego pago e muito mais!\n\n'
        },
        {
          name: '🤝 ━━━━━━━━━━━━━━━━━━━━ Oportunidade de Entrar em Operações ━━━━━━━━━━━━━━━━━━━━',
          value: '多多机会 de participar de nossas operações exclusivas no mercado digital. Trabalhe ao lado da equipe, aprenda na prática como funcionam nossos projetos epotencie seus resultados.\n\n'
        },
        {
          name: '🎨 ━━━━━━━━━━━━━━━━━━━━ Cargo Especial ━━━━━━━━━━━━━━━━━━━━',
          value: 'Receba um cargo exclusivo de booster comtagem visível no servidor, mostrando seu apoio especial à comunidade. Seja reconhecido por contribuir para o crescimento do servidor!\n\n'
        },
        {
          name: '🎁 ━━━━━━━━━━━━━━━━━━━━ Prioridade no Suporte ━━━━━━━━━━━━━━━━━━━━',
          value: 'Tenha prioridade no atendimento e suporte. Tickets respondidos mais rápido, ajuda prioritária em dúvidas e suporte diferenciado para garantir a melhor experiência possível.\n\n'
        },
        {
          name: '🔓 ━━━━━━━━━━━━━━━━━━━━ Canais Exclusivos ━━━━━━━━━━━━━━━━━━━━',
          value: 'Acesso a canais privados não disponíveis para membros normais. Conteúdo premium, canais de networking e muito mais recursos exclusivos esperando por você!\n\n'
        },
        {
          name: '✨ ━━━━━━━━━━━━━━━━━━━━ E muito mais! ━━━━━━━━━━━━━━━━━━━━',
          value: 'Estamos sempre trabalhando para trazer novos benefícios e vantagens para nossos boosters. Sua contribuição nos ajuda a melhorar continuamente o servidor para todos!'
        }
      )
      .setImage('https://media.discordapp.net/attachments/1288847445513736222/1290047719938539530/banner.png?width=1440&height=320')
      .setFooter({ text: 'Obrigado pelo seu apoio! ❤️ | CreatorDev', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ content: '✅ Painel de benefícios enviado!', ephemeral: true });
    await interaction.channel.send({ embeds: [embed] });
  }
};