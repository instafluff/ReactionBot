module.exports = {
  description: 'Template command',
  helpMsg: 'This command has a static object',
  fn: async (args, msg, extra) => {
    console.log('Do your stuff here!', args, msg, extra);
  },
};

module.exports = (extra) => ({
  description: 'Shows a list of all the commands',
  helpMsg: `Send \`${extra.prefix}help\` to get help of all the commands.
Send \`${extra.prefix}help [command]\` to get more information on this command`,
  fn: async (args, msg, { commands }) => {
    console.log('Do your stuff here!', args, msg, { ...extra, commands });
  },
});
