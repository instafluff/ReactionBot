module.exports = async (extra) => {
  // Put messages in cache
  await Promise.all(Object.entries(extra.dbs.db).map(async ([i, v]) => {
    const guild = await extra.client.guilds.fetch(i);
    await Promise.all(Object.entries(v).map(async ([i1, v1]) => {
      const channel = guild.channels.resolve(i1);
      await Promise.all(Object.entries(v1).map(async ([i2]) => {
        await channel.messages.fetch(i2);
      }));
    }));
  }));
  // Listen for reactions
  extra.client.on('messageReactionAdd', async (reaction, user) => {
    const roleId = extra.dbs.db[reaction.message.guild.id]?.
      [reaction.message.channel.id]?.
      [reaction.message.id]?.
      [reaction.emoji.toString()];
    if (
      roleId
    ) {
      try {
        (await reaction.message.guild.members.fetch(user.id)).roles.add(roleId);
      } catch (err) {
        if (err.message === 'Missing Permissions') user.send('Some permissions are out of my reach. Please notify this to the server staff.');
      }
    }
  });
  extra.client.on('messageReactionRemove', async (reaction, user) => {
    const roleId = extra.dbs.db[reaction.message.guild.id]?.
      [reaction.message.channel.id]?.
      [reaction.message.id]?.
      [reaction.emoji.toString()];
    if (
      roleId
    ) {
      try {
        (await reaction.message.guild.members.fetch(user.id)).roles.remove(roleId);
      } catch (err) {
        if (err.message === 'Missing Permissions') user.send('Some permissions are out of my reach. Please notify this to the server staff.');
      }
    }
  });
  return {
    description: 'Add a reaction role listener to a message',
    helpMsg: `Copy the link of the message you want to listen to, then send \`${extra.prefix}${extra.commandName} [Paste link here] [Emoji to listen for] [Mention of the role to give]\`

You can also use \`[ID of channel] [ID of role]\` instead of \`[Paste link here]\` and \`[Role ID]\` instead of \`[Mention of the role to give]\``,
    fn: async (argsParams, msg) => {
      const args = argsParams;
      if (args.length < 3) return msg.reply(`An argument seem to be lacking. Need help? Type \`${extra.prefix}help ${extra.commandName}\``);
      if (args[0].length !== 18) {
        let url;
        try {
          url = new URL(args[0]);
          Object.freeze(url);
          const path = args[0].split('/');
          args.splice(0, 1, path[path.length - 2], path[path.length - 1]);
        } catch (err) {
          if (err.message === `Invalid URL: ${args[0]}`) return msg.reply('Your URL seem to be invalid');
        }
      } else if (args.length < 4) {
        return msg.reply(`An argument seem to be lacking. Need help? Type \`${extra.prefix}help ${extra.commandName}\``);
      } else if (msg.mentions.channels.size > 0) {
        if (args[0] === msg.mentions.channels.first().toString()) {
          args[0] = msg.mentions.channels.first().id.toString();
        } else {
          return msg.reply(`Your input is not correctly formatted. Please reformat your input. Need help? Type \`${extra.prefix}help ${extra.commandName}\``);
        }
      }
      if (
        args[0].length !== 18 || Number.isNaN(+args[0])
        || args[1].length !== 18 || Number.isNaN(+args[1])
      ) {
        return msg.reply(`Your input is not correctly formatted. Please reformat your input. Need help? Type \`${extra.prefix}help ${extra.commandName}\``);
      }
      if (msg.mentions.roles.first().toString() === args[3]) {
        args[3] = msg.mentions.roles.first().id.toString();
      }
      try {
        console.log(args[3]);
        const role = msg.guild.roles.cache.find((v) => v.id === args[3]);
        if (!role) throw new Error('Unknown role');
        if (role.position > (await msg.guild.members.fetch(extra.client.user.id)).roles.highest.position) throw new Error('Role too high');
        await (await msg.guild.channels.resolve(args[0]).messages.fetch(args[1])).react(args[2]);
      } catch (err) {
        console.log(err.message);
        if (err.message === 'Cannot read property \'messages\' of null') return msg.reply(`The channel ID is incorrect. Please check your channel ID / pasted link. Need help? Type \`${extra.prefix}help ${extra.commandName}\``);
        if (err.message === 'Unknown message') return msg.reply(`The message ID is incorrect. Please check your message ID / pasted link. Need help? Type \`${extra.prefix}help ${extra.commandName}\``);
        if (err.message === 'Unknown emoji') return msg.reply(`\`${args[2]}\` is not a valid emoji, please make sure it is included in this server or that it is a valid Unicode emoji. Need help? Type \`${extra.prefix}help ${extra.commandName}\``);
        if (err.message === 'Unknown role') return msg.reply(`The role ID is incorrect. Please check your role ID / mention. Need help? Type \`${extra.prefix}help ${extra.commandName}\``);
        if (err.message === 'Role too high') return msg.reply(`The role is higher than the bot's highest role, please set it higher. Need help? Type \`${extra.prefix}help ${extra.commandName}\``);
        const owner = (await extra.client.fetchApplication()).owner;
        return msg.reply(`Unlucky you, there was an error. However, you can run that command again to see if it works on a second and third try. If it doesn't work after 3 tries, please contact \`${owner.username}#${owner.discriminator}\`${/[^\u0020-\u00ff]/.test(owner.username) ? ' (Please copy paste, contains special characters)' : ''}`);
      }
      if (!extra.dbs.db[msg.guild.id]) {
        extra.dbs.db[msg.guild.id] = {};
      }
      if (!extra.dbs.db[msg.guild.id][args[0]]) {
        extra.dbs.db[msg.guild.id][args[0]] = {};
      }
      if (!extra.dbs.db[msg.guild.id][args[0]][args[1]]) {
        extra.dbs.db[msg.guild.id][args[0]][args[1]] = {};
      }
      extra.dbs.db[msg.guild.id][args[0]][args[1]][args[2]] = args[3];
      return msg.reply(`Added reaction role at message https://discordapp.com/channels/${msg.guild.id}/${args[0]}/${args[1]} with emoji ${args[2]} to \`${msg.mentions.roles.first().name}\``);
    },
    permissions: ['MANAGE_ROLES'],
  };
};
