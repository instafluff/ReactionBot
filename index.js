require('dotenv').config();

const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');
const { LocaleDb } = require('informa-db.js');

const client = new Discord.Client();
const prefix = 'r!';
const utils = require('./utils.js');

const dbs = {
  db: new LocaleDb({ path: 'db.json' }),
};

const lookForEmpty = (v) => {
  if (typeof v !== 'object') return v;
  return Object.fromEntries(
    Object.entries(v)
      .filter(([, v1]) => (typeof v1 !== 'object' || Object.keys(v1).length !== 0))
      .map(([i1, v1]) => [i1, lookForEmpty(v1)]),
  );
};

dbs.db.value = lookForEmpty(dbs.db.value);

let commands;

client.on('ready', async () => {
  commands = Object.fromEntries(await Promise.all(fs.readdirSync('commands').map(
    async (v) => {
      const required = require(path.join(__dirname, 'commands', v));
      return [v.replace('.js', ''), typeof required === 'function' ? await required({
        client, prefix, commandName: v, dbs, utils,
      }) : required];
    },
  )));

  Object.freeze(commands);
  const infringing = [
    Object.entries(commands).find(([, v]) => (v.permissions || []).some((v1) => v1 === 'SERVER_OWNER') && (v.permissions || []).length !== 1),
    Object.entries(commands).find(([, v]) => (v.permissions || []).some((v1) => v1 === 'BOT_OWNER') && (v.permissions || []).length !== 1),
  ];
  if (infringing[0]) {
    throw new Error(`Command "${prefix}${infringing[0]}" requires SERVER_OWNER in combination with another permission.`);
  }
  if (infringing[1]) {
    throw new Error(`Command "${prefix}${infringing[0]}" requires BOT_OWNER in combination with another permission.`);
  }
  console.log(commands);
  client.user.setPresence({ activity: { name: 'r!help' } });
  console.log('We\'re ready');
});

client.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) return null;
  const [commandName, ...args] = msg.content.slice(prefix.length).split(' ');
  console.log({ commandName, args });
  if (commands[commandName]) {
    const command = commands[commandName];
    if (
      (command.permissions || []).every((v) => (!['SERVER_OWNER', 'BOT_OWNER'].includes(v) ? msg.member.hasPermission(v, {
        checkOwner: true,
        checkAdmin: true,
      }) : true))
      && ((command.permissions || []).includes('SERVER_OWNER') === (msg.author.id === msg.guild.owner.id) || (msg.author.id === msg.guild.owner.id))
      && ((command.permissions || []).includes('BOT_OWNER') === (msg.author.id === (await client.fetchApplication()).owner.id) || (await client.fetchApplication()).owner.id)
    ) {
      return command.fn(args, msg, {
        client, prefix, commandName, commands, dbs, utils,
      });
    }
    return msg.reply(`Lacking permissions: \`\`\`\n${command.permissions.filter((v) => !msg.member.hasPermission(v, {
      checkOwner: true,
      checkAdmin: true,
    })).join('\n')}\n\`\`\``);
  }
  return msg.reply(`\`${prefix}${commandName}\` is not a recognised command`);
});

client.login(process.env.TOKEN);
