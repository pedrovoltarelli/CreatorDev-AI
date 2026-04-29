const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  once: false,

  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error('Erro ao executar comando:', error);
        await interaction.reply({ content: '❌ Erro ao executar o comando!', ephemeral: true });
      }
      return;
    }

    if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

    if (interaction.isButton()) {
      await handleButtons(interaction, client);
    }
    
    if (interaction.isStringSelectMenu()) {
      await handleSelectMenus(interaction, client);
    }
  }
};

async function handleButtons(interaction, client) {
  const { customId, user, channel, message } = interaction;

  if (customId === 'ticket_duvidas') {
    await createTicket(interaction, client, 'duvidas', '💬 Dúvidas');
    return;
  }

  if (customId === 'ticket_parcerias') {
    await createTicket(interaction, client, 'parcerias', '🤝 Parcerias');
    return;
  }

  if (customId === 'ticket_orcamentos') {
    await createTicket(interaction, client, 'orcamentos', '💰 Orçamentos');
    return;
  }

  if (customId === 'open_ticket') {
    await handleOpenTicket(interaction, client);
    return;
  }

  if (customId === 'accept_rules') {
    await handleAcceptRules(interaction, client);
    return;
  }

  if (customId === 'select_category') {
    await handleSelectCategory(interaction, client);
    return;
  }

  if (customId === 'confirm_close') {
    await handleConfirmClose(interaction, client);
    return;
  }

  if (customId === 'cancel_close') {
    await interaction.message.delete().catch(() => {});
    await channel.send('❌ Fechamento cancelado.').then(msg => setTimeout(() => msg.delete().catch(() => {}), 3000));
    return;
  }

  if (customId === 'ticket_close') {
    await handleTicketCloseButton(interaction, client);
    return;
  }

  if (customId === 'ticket_add_user') {
    await handleTicketAddUser(interaction, client);
    return;
  }

  if (customId === 'ticket_remove_user') {
    await handleTicketRemoveUser(interaction, client);
    return;
  }
}

async function handleSelectMenus(interaction, client) {
  const { customId } = interaction;
  
  if (customId === 'ticket_category_select') {
    await handleCategorySelect(interaction, client);
  }
}

async function createTicket(interaction, client, category, categoryLabel) {
  const user = interaction.user;
  const guild = interaction.guild;
  
  const categories = {
    'duvidas': client.config.ticket?.categories?.duvidas,
    'parcerias': client.config.ticket?.categories?.parcerias,
    'orcamentos': client.config.ticket?.categories?.orcamentos
  };
  
  const categoryId = categories[category];
  
  const existingTickets = guild.channels.cache.filter(ch => 
    ch.name.startsWith(`ticket-${user.username.toLowerCase()}`) || 
    ch.name.includes(user.id)
  );

  const maxTickets = client.config.ticket?.maxTicketsPerUser || 3;
  
  if (existingTickets.size >= maxTickets) {
    return interaction.reply({ 
      content: `❌ Você já tem ${existingTickets.size} tickets abertos. Limite: ${maxTickets}`, 
      ephemeral: true 
    });
  }

  const ticketId = Math.floor(Math.random() * 9000) + 1000;
  const channelName = `ticket-${category}-${user.username.toLowerCase()}-${ticketId}`;

  const staffRoles = client.config.roles?.staff || [];

  try {
    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: 0,
      parent: categoryId,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        },
        ...staffRoles.map(roleId => ({
          id: roleId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        }))
      ]
    });

    const embed = new EmbedBuilder()
      .setTitle(`🎫 Ticket #${ticketId} - ${categoryLabel}`)
      .setDescription(`**Categoria:** ${categoryLabel}\n\n📝 Olá ${user}! Descreva seu problema com detalhes.\nNossa equipe responderá em breve!`)
      .setColor('#000000')
      .setFooter({ text: 'CreatorDev Bot', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    const ticketButtons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_close')
          .setLabel('Fechar Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔒'),
        new ButtonBuilder()
          .setCustomId('ticket_add_user')
          .setLabel('Adicionar Usuário')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('➕'),
        new ButtonBuilder()
          .setCustomId('ticket_remove_user')
          .setLabel('Remover Usuário')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('➖')
      );

    await ticketChannel.send({
      content: `${user} | ${client.config.roles?.staff?.map(r => `<@&${r}>`).join(' ')}`,
      embeds: [embed],
      components: [ticketButtons]
    });

    const successEmbed = new EmbedBuilder()
      .setTitle('✅ Ticket Criado!')
      .setDescription(`Seu ticket foi criado com sucesso!\n\n📍 Canal: ${ticketChannel}\n🎫 Ticket: #${ticketId}\n📂 Categoria: ${categoryLabel}`)
      .setColor('#00FF00');

    await interaction.reply({ embeds: [successEmbed], ephemeral: true });

    if (!client.tickets) client.tickets = new Map();
    client.tickets.set(ticketChannel.id, {
      userId: user.id,
      ticketId: ticketId,
      category: category,
      createdAt: Date.now()
    });

  } catch (err) {
    console.error('Erro ao criar ticket:', err);
    await interaction.reply({ content: '❌ Erro ao criar ticket!', ephemeral: true });
  }
}

async function handleOpenTicket(interaction, client) {
  const user = interaction.user;
  const guild = interaction.guild;
  
  const existingTickets = guild.channels.cache.filter(ch => 
    ch.name.startsWith(`ticket-${user.username.toLowerCase()}`) || 
    ch.name.includes(user.id)
  );

  const maxTickets = client.config.ticket?.maxTicketsPerUser || 3;
  
  if (existingTickets.size >= maxTickets) {
    return interaction.reply({ 
      content: `❌ Você já tem ${existingTickets.size} tickets abertos. Limite: ${maxTickets}`, 
      ephemeral: true 
    });
  }

  const ticketId = Math.floor(Math.random() * 9000) + 1000;

  const selectMenu = new ActionRowBuilder()
    .addComponents(
      new (require('discord.js').StringSelectMenuBuilder)()
        .setCustomId('ticket_category_select')
        .setPlaceholder('Selecione a categoria do ticket')
        .addOptions([
          { label: '💬 Suporte', value: 'suporte', description: 'Precisa de ajuda técnica' },
          { label: '🛒 Compras', value: 'compras', description: 'Dúvidas sobre produtos/compras' },
          { label: '❓ Dúvidas', value: 'duvidas', description: 'Perguntas gerais' },
          { label: '💡 Sugestões', value: 'sugestoes', description: 'Deixe sua sugestão' }
        ])
    );

  const embed = new EmbedBuilder()
    .setTitle('🎫 Abrir Ticket')
    .setDescription(`Olá ${user}! Selecione a categoria do seu ticket:`)
    .setColor(client.config.colors.info);

  await interaction.reply({ embeds: [embed], components: [selectMenu], ephemeral: true });
}

async function handleCategorySelect(interaction, client) {
  const user = interaction.user;
  const guild = interaction.guild;
  const categoryValue = interaction.values[0];
  
  const categories = {
    'suporte': client.config.ticket?.categories?.suporte,
    'compras': client.config.ticket?.categories?.compras,
    'duvidas': client.config.ticket?.categories?.duvidas,
    'sugestoes': client.config.ticket?.categories?.suporte
  };
  
  const categoryId = categories[categoryValue] || client.config.channels?.tickets;
  
  const ticketId = Math.floor(Math.random() * 9000) + 1000;
  const channelName = `ticket-${user.username.toLowerCase()}-${ticketId}`;

  const staffRoles = client.config.roles?.staff || [];
  const staffPermissions = {};
  
  staffRoles.forEach(roleId => {
    staffPermissions[roleId] = {
      ViewChannel: true,
      SendMessages: true,
      ManageMessages: true,
      ReadMessageHistory: true
    };
  });

  try {
    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: 0,
      parent: categoryId,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        },
        ...staffRoles.map(roleId => ({
          id: roleId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        }))
      ]
    });

    const categoryLabel = {
      'suporte': '💬 Suporte',
      'compras': '🛒 Compras',
      'duvidas': '❓ Dúvidas',
      'sugestoes': '💡 Sugestões'
    }[categoryValue];

    const embed = new EmbedBuilder()
      .setTitle(`🎫 Ticket #${ticketId}`)
      .setDescription(`**Categoria:** ${categoryLabel}\n\n📝 Descreva seu problema com detalhes.\nA equipe responderá em breve!`)
      .setColor(client.config.colors.info)
      .setFooter({ text: 'CreatorDev Bot', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    const ticketButtons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_close')
          .setLabel('Fechar Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔒'),
        new ButtonBuilder()
          .setCustomId('ticket_add_user')
          .setLabel('Adicionar Usuário')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('➕'),
        new ButtonBuilder()
          .setCustomId('ticket_remove_user')
          .setLabel('Remover Usuário')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('➖')
      );

    await ticketChannel.send({
      content: `${user} | ${client.config.roles?.staff?.map(r => `<@&${r}>`).join(' ')}`,
      embeds: [embed],
      components: [ticketButtons]
    });

    await interaction.update({ 
      content: `✅ Ticket criado! Acesse: ${ticketChannel}`, 
      components: [],
      embeds: []
    });

    if (!client.tickets) client.tickets = new Map();
    client.tickets.set(ticketChannel.id, {
      userId: user.id,
      ticketId: ticketId,
      category: categoryValue,
      createdAt: Date.now()
    });

  } catch (err) {
    console.error('Erro ao criar ticket:', err);
    await interaction.reply({ content: '❌ Erro ao criar ticket!', ephemeral: true });
  }
}

async function handleAcceptRules(interaction, client) {
  const user = interaction.user;
  const guild = interaction.guild;
  const roleId = client.config.rules?.acceptRole;

  if (!roleId) {
    return interaction.reply({ content: '❌ Cargo não configurado!', ephemeral: true });
  }

  try {
    const role = guild.roles.cache.get(roleId);
    if (!role) {
      return interaction.reply({ content: '❌ Cargo não encontrado!', ephemeral: true });
    }

    const member = guild.members.cache.get(user.id) || await guild.members.fetch(user.id);
    await member.roles.add(role);

    const embed = new EmbedBuilder()
      .setTitle('✅ Regras Aceitas')
      .setDescription(`Bem-vindo(a) ${user}!\n\nVocê recebeu o cargo <@&${roleId}> e agora é um membro oficial do servidor!`)
      .setColor(client.config.colors.success)
      .setThumbnail(user.displayAvatarURL());

    await interaction.reply({ embeds: [embed], ephemeral: true });

  } catch (err) {
    console.error('Erro ao adicionar cargo:', err);
    await interaction.reply({ content: '❌ Erro ao adicionar cargo!', ephemeral: true });
  }
}

async function handleConfirmClose(interaction, client) {
  const channel = interaction.channel;
  
  if (!channel.name.startsWith('ticket-')) {
    return interaction.reply({ content: '❌ Este comando só pode ser usado em tickets!', ephemeral: true });
  }

  const ticketData = client.tickets?.get(channel.id);
  const userId = ticketData?.userId;
  const user = userId ? (await client.users.fetch(userId).catch(() => null)) : null;

  await interaction.deferUpdate();

  try {
    const messages = await channel.messages.fetch({ limit: 100 });
    const sortedMessages = [...messages.values()].reverse();
    
    let transcript = `📋 **LOG DO TICKET #${ticketData?.ticketId || 'N/A'}**\n`;
    transcript += `👤 Usuário: ${user ? user.tag : 'N/A'}\n`;
    transcript += `📅 Criado em: ${ticketData ? new Date(ticketData.createdAt).toLocaleString() : 'N/A'}\n`;
    transcript += `🔒 Fechado em: ${new Date().toLocaleString()}\n`;
    transcript += `${'─'.repeat(40)}\n\n`;

    for (const msg of sortedMessages) {
      if (msg.author.bot && msg.content.includes('Ticket #')) continue;
      const time = msg.createdAt.toLocaleString();
      transcript += `**[${time}]** ${msg.author.tag}: ${msg.content || '[Mensagem sem texto]'}\n`;
    }

    const logChannel = client.channels.cache.get(client.config.channels?.logs);
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setTitle('📋 Ticket Fechado')
        .setDescription(`**Ticket:** ${channel.name}\n**Usuário:** ${user ? user.tag : 'N/A'}`)
        .setColor('#FF0000')
        .setTimestamp();

      await logChannel.send({ embeds: [logEmbed] });
      
      if (transcript.length > 2000) {
        await logChannel.send({ content: `\`\`\`\n${transcript.slice(0, 1990)}...\n\`\`\`` });
      } else {
        await logChannel.send({ content: `\`\`\`\n${transcript}\n\`\`\`` });
      }
    }

    await channel.delete();

  } catch (err) {
    console.error('Erro ao fechar ticket:', err);
    await interaction.reply({ content: '❌ Erro ao fechar ticket!', ephemeral: true });
  }
}

async function handleTicketCloseButton(interaction, client) {
  const channel = interaction.channel;
  
  if (!channel.name.startsWith('ticket-')) {
    return interaction.reply({ content: '❌ Este comando só pode ser usado em tickets!', ephemeral: true });
  }

  const confirmRow = new ActionRowBuilder()
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

  await interaction.reply({ embeds: [embed], components: [confirmRow] });
}

async function handleTicketAddUser(interaction, client) {
  const channel = interaction.channel;
  
  if (!channel.name.startsWith('ticket-')) {
    return interaction.reply({ content: '❌ Este comando só pode ser usado em tickets!', ephemeral: true });
  }

  const embed = new EmbedBuilder()
    .setTitle('➕ Adicionar Usuário')
    .setDescription('Para adicionar um usuário ao ticket, use o comando:\n`/adicionar-usuario @usuario`')
    .setColor(client.config.colors.info);

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleTicketRemoveUser(interaction, client) {
  const channel = interaction.channel;
  
  if (!channel.name.startsWith('ticket-')) {
    return interaction.reply({ content: '❌ Este comando só pode ser usado em tickets!', ephemeral: true });
  }

  const embed = new EmbedBuilder()
    .setTitle('➖ Remover Usuário')
    .setDescription('Para remover um usuário do ticket, use o comando:\n`/remover-usuario @usuario`')
    .setColor(client.config.colors.info);

  await interaction.reply({ embeds: [embed], ephemeral: true });
}