module.exports = (extra) => ({
  description: 'Lists all listeners in this server',
  helpMsg: `Send ${extra.prefix}${extra.commandName} to get all the listeners`,
  fn: async (_, msg) => {
    extra.dbs.db.value = extra.utils.lookFullyForEmpty(extra.dbs.db.value);
    const description = Object.entries(extra.dbs.db.value[msg.guild.id] ?? {})
      .map(([i, v]) => (`__**Channel: ${msg.guild.channels.resolve(i).toString()}**__\n${
        Object.entries(v).map(([i1, v1]) => (`Message: [[See message]](https://discordapp.com/channels/${msg.guild.id}/${i}/${i1})\n${
          Object.entries(v1).map(([i2, v2]) => (`${i2} => ${
            msg.guild.roles.cache.find((v3) => v3.id === v2).toString()
          }`)).join('\n')
        }`)).join('\n\n')
      }`)).join('\n\n');
    msg.channel.send({
      embed: {
        title: 'List of all the listeners',
        description: description === '' ? `No listeners found.\n\n\`${extra.prefix}help listen\` to get started.` : description,
        color: extra.utils.hslToDec(Math.floor(Math.random() * 360), 82, 60),
        timestamp: Date.now(),
        footer: {
          text: 'ReactionRole - by Informa',
        },
      },
    });
  },
  permissions: ['MANAGE_ROLES'],
});
