module.exports = async (extra) => {
  await Promise.all(Object.entries(extra.dbs.db).map(async ([i, v]) => {
    const guild = await extra.client.guilds.fetch(i);
    await Promise.all(Object.entries(v).map(async ([i1, v1]) => {
      const channel = guild.channels.resolve(i1);
      await Promise.all(Object.entries(v1).map(async ([i2]) => {
        await channel.messages.fetch(i2);
      }));
    }));
  }));
  extra.client.on('messageReactionRemoveAll', (message) => {
    const roleIds = extra.dbs.db[message.guild.id]?.
      [message.channel.id]?.
      [message.id] || '';
    if (roleIds !== '' && Object.keys(roleIds).length !== 0) {
      extra.dbs.db[message.guild.id][message.channel.id][message.id] = {};
    }
  });
  extra.client.on('messageDelete', (message) => {
    const roleIds = extra.dbs.db[message.guild.id]?.
      [message.channel.id]?.
      [message.id] || '';
    if (roleIds !== '' && Object.keys(roleIds).length !== 0) {
      extra.dbs.db[message.guild.id][message.channel.id][message.id] = {};
    }
  });
  extra.client.on('messageDeleteBulk', (messages) => {
    messages.mapValues((message) => {
      const roleIds = extra.dbs.db[message.guild.id]?.
        [message.channel.id]?.
        [message.id] || '';
      if (roleIds !== '' && Object.keys(roleIds).length !== 0) {
        extra.dbs.db[message.guild.id][message.channel.id][message.id] = {};
      }
    });
  });
  return {
    description: 'Add a reaction role listener to a message',
    helpMsg: `Copy the link of the message you want to remove the listener from, then send \`${extra.prefix}${extra.commandName} [Paste link here] [Emoji to listen for]\`

You can also use \`[ID of channel] [ID of role]\` instead of \`[Paste link here]\``,
    fn: async (argsParams, msg) => {
      const args = argsParams;
      if (!args[2]) {
        if (args.length < 1) return msg.reply(`An argument seem to be lacking. Need help? Type \`${extra.prefix}help ${extra.commandName}\``);
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
        } else if (args.length < 2) {
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
        if (!extra.dbs.db[msg.guild.id]?.[args[0]]?.[args[1]]) return msg.reply('There is no listener on this message.');
        extra.dbs.db[msg.guild.id][args[0]][args[1]] = {};
        extra.DbUtils.setAllTo(extra.dbs.db, extra.utils.lookFullyForEmpty(extra.dbs.db));
        try {
          await Promise.all((await msg.guild.channels.resolve(args[0]).messages.fetch(args[1]))
            .reactions.cache.filter((v) => v.me).map(async (v) => await v.remove()));
        } catch (err) {
          if (err.message !== 'Cannot read property \'remove\' of undefined') throw err;
        }
        return msg.reply(`Removed reaction role at message https://discordapp.com/channels/${msg.guild.id}/${args[0]}/${args[1]}`);
      }
      if (args.length < 2) return msg.reply(`An argument seem to be lacking. Need help? Type \`${extra.prefix}help ${extra.commandName}\``);
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
      } else if (args.length < 3) {
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
      if (!extra.dbs.db[msg.guild.id]?.[args[0]]?.[args[1]]?.[args[2]]) return msg.reply(`There is no listener on this message or on this emoji. Please run ${extra.prefix}list to get all listeners.`);
      extra.dbs.db[msg.guild.id][args[0]][args[1]][args[2]] = {};
      extra.DbUtils.setAllTo(extra.dbs.db, extra.utils.lookFullyForEmpty(extra.dbs.db));
      try {
        await (await msg.guild.channels.resolve(args[0]).messages.fetch(args[1]))
          .reactions.cache.find((v) => v.me && v.emoji.toString() === args[2]).remove();
      } catch (err) {
        if (err.message !== 'Cannot read property \'remove\' of undefined') throw err;
      }
      return msg.reply(`Removed reaction role at message https://discordapp.com/channels/${msg.guild.id}/${args[0]}/${args[1]} with emoji ${args[2]}`);
    },
    permissions: ['MANAGE_ROLES'],
  };
};
