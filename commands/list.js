module.exports = {
  description: 'Lists all listeners in this server',
  helpMsg: 'Send !list to get all the listeners',
  fn: async (_, msg, extra) => msg.channel.send({
    embeds: [{
      title: 'List of all the listeners',
      color: extra.utils.hslToDec(Math.floor(Math.random() * 360), 82, 60),
      timestamp: Date.now(),
      footer: {
        text: 'ReactionRole - by Informa',
      },
      fields: Object.entries(extra.dbs.db.value[msg.guild.id]).map(([i, v]) => ({
        name: msg.guild.channels.resolve(i).toString(),
        value: Object.entries(v).map(([i1, v1]) => `__([See message])[https://discordapp.com/channels/${msg.guild.id}/${i}/${i1}]__\n${
          Object.entries(v1).map(([i2, v2]) => `${i2} => ${msg.guild.roles.cache.find((v3) => v3.id === v2).toString()}`).join('\n')
        }`).join('\n\n'),
      })),
    }],
  }),
  permissions: ['MANAGE_ROLES'],
};
