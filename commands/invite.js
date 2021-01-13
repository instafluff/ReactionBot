module.exports = (extra) => {
  extra.client.on('guildCreate', async (guild) => {
    if (!(await guild.members.fetch(extra.client.user.id)).roles.highest.permissions.has('MANAGE_ROLES')) guild.owner.send('Not sufficent permissions, leaving.');
  });
  return {
    description: 'Sends an invite to invite this bot in another server',
    helpMsg: `Send ${extra.prefix}${extra.commandName} to get an invite for this bot`,
    fn: async (_, msg) => msg.channel.send(`To add ${extra.client.user.username} to your server, go to ${await extra.client.generateInvite({
      permissions: ['MANAGE_ROLES'],
    })}`),
  };
};
