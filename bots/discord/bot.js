const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config');
client.login(config.discordtoken);
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/data.db');
const embed = require('./embed');
const call = require('./commands/call');
const usercmd = require('./commands/user');
const secret = require('./commands/secret');
const help = require('./commands/help');
const prefix = config.discordprefix;
const ADMIN = 0;
const USER = 1;
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`${prefix}help`); 
})
client.on("message", function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const commandBody = message.content.slice(prefix.length).toLowerCase();
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    const user = "@" + message.author.username + '#' + message.author.discriminator;
    const all = { commandBody, args, command, message, user };
    db.get('SELECT permissions FROM users WHERE userid = ?', [message.author.id], (err, row) => {
      if (err) console.log(err.message);
      const ADMIN_CMD = ['user', 'calltest'];
      const USER_CMD = ['call', 'secret', 'help'];
      if(!ADMIN_CMD.includes(command) && !USER_CMD.includes(command)) {
        embed(message, 'Bad command', 15158332, "This command doesn't exist. Please ask help to an admin.", user)
      }
      if(row != undefined)  perms = row.permissions;
      else perms = null;
      if(perms != ADMIN && ADMIN_CMD.includes(command)) {
          embed(message, 'Permissions', 15158332, "You don't have the permissions to use this command. Please ask help to an admin.", user);
      } else if(perms == ADMIN && ADMIN_CMD.includes(command)) {
          usercmd(all);
          call(all);
      }
      if(perms != USER && USER_CMD.includes(command) && perms != ADMIN && command != 'secret' && command != 'help') {
          embed(message, 'Permissions', 15158332, "You don't have the permissions to use this command. Please ask help to an admin.", user);
      } else if(perms == USER || perms == ADMIN && USER_CMD.includes(command)) {
          call(all);
          secret(all);
          help(all);
      } else {
        secret(all);
        help(all);
      }
    });
});
