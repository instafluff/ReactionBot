module.exports = (extra) => ({
  description: 'Shows a list of all the commands',
  helpMsg: `Send \`${extra.prefix}help\` to get help of all the commands.
Send \`${extra.prefix}help [command]\` to get more information on this command`,
  fn: async (args, msg, { commands }) => {
    if (args.length > 1) return msg.reply('The help command can only handle 1 argument. Please try again with only 1 argument.');
    if (!args[0]) {
      return msg.channel.send({
        embed: {
          title: 'All the commands',
          description: `List of all the commands
\`${extra.prefix}help [command]\` to get information on how to use the command`,
          color: extra.utils.hslToDec(Math.floor(Math.random() * 360), 82, 60),
          timestamp: Date.now(),
          footer: {
            text: 'ReactionRole - by Informa',
          },
          fields: Object.entries(commands).map(([i, v]) => ({
            name: i,
            value: v.description,
          })),
        },
      });
    }
    args[0] = args[0].replace(extra.prefix, '');
    if (!extra.commands[args[0]]) return msg.reply(`Command \`${args[0]}\` not found`);
    return msg.channel.send({
      embeds: [{
        title: `${extra.prefix}${args[0]}`,
        description: extra.commands[args[0]].description,
        color: extra.utils.hslToDec(Math.floor(Math.random() * 360), 82, 60),
        timestamp: Date.now(),
        footer: {
          text: 'ReactionRole - by Informa',
        },
        fields: [
          {
            name: 'How to use',
            value: extra.commands[args[0]].helpMsg,
          },
          {
            name: 'Permissions required',
            value: `\`\`\`\n${extra.commands[args[0]].permissions.join('\n')}\n\`\`\``,
          },
        ],
      }],
    });
  },
});
