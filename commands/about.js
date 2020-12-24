module.exports = (extra) => ({
  description: 'Explains what this bot is about',
  helpMsg: `Send ${extra.prefix}${extra.commandName} to get an invite for this bot`,
  fn: async (_, msg) => msg.channel.send(`To add ${extra.client.user.username} to your server, go to ${await extra.client.generateInvite({
    permissions: ['MANAGE_ROLES'],
  })}`),
});
