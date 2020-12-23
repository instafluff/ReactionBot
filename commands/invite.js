module.exports = (extra) => {
  extra.client.on('guildCreate', async (guild) => {
    if (!(await guild.members.fetch(extra.client.user.id)).roles.highest.permissions.has('MANAGE_ROLES')) guild.owner.send('Not sufficent permissions, leaving.');
  });
  return {
    description: 'Lists all listeners in this server',
    helpMsg: 'Send !list to get all the listeners',
    fn: async (_, msg) => msg.channel.send(`To add ${extra.client.user.username} to your server, go to ${await extra.client.generateInvite({
      permissions: ['MANAGE_ROLES'],
    })}`),
  };
};
