exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    if (!player.rules) {
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.common.acceptRules[0] + command.prefix + pack.common.acceptRules[1]);
      return;
    }
    if (caller.utils.checkBan(player, command)) return;
    if (player.Admin || player.Mod) {} else {
      if (!caller.utils.doChannelCheck(command)) {
        caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
        return;
      }
    }
    switch (command.params[0]) {
      case "prefix":
        if (command.params[1]) {
          if (command.params[1].length <= 10 && command.params[1].search(/[.?[\]\\<>\-=+*^$!]/g) !== -1) {
            if (command.params[1] == 'z/') {
              caller.utils.sendCompactEmbed(command.msg.channel, "Prefix Error", "That prefix is not allowed.", 16772880);
              return;
            }
            player.prefs.prefix = command.params[1];
            caller.utils.updatePlayer(player);
            caller.utils.sendCompactEmbed(command.msg.channel, `Prefix`, `Prefix set to ${command.params[1]}`);
          } else caller.utils.sendCompactEmbed(command.msg.channel, `Prefix Error`, 'Prefix has to be between 1-10 characters and contain one of these characters, `.` `/` `?` `[` `]` `\\` `<` `>` `-` `=` `+` `*` `^` `$` `!`', 16772880);
        } else {
          player.prefs.prefix = "cs/";
          caller.utils.updatePlayer(player);
          caller.utils.sendCompactEmbed(command.msg.channel, `Prefix`, `Prefix set to ${caller.config.PREFIX}`);
        }
        break;
      case "server":
        if (command.msg.channel.type == 'dm') {
          caller.bot.createMessage(command.msg.channel.id, {
            embed: {
              description: ':warning: This command can\'t be used in DM',
              color: 0xf1e432
            }
          }).catch(console.error)
          return;
        }
        if (player.Admin || command.msg.member.permission.has('manageGuild') != false) {
          caller.DB.Find('guilds', {
            'id': command.msg.channel.guild.id
          }).then(d => {
            if (d[0] == undefined) {
              d[0] = {
                id: command.msg.channel.guild.id,
                prefix: 'cs/'
              }
              caller.DB.Insert('guilds', d[0])
            }
            if (command.params[1]) {
              if (command.params[1].length <= 10) {
                d[0].prefix = command.params[1];
                caller.DB.Update('guilds', {
                  'id': d[0].id
                }, d[0])
                caller.utils.sendCompactEmbed(command.msg.channel, `Server Prefix`, `Server prefix set to ${command.params[1]}`);
              } else caller.utils.sendCompactEmbed(command.msg.channel, `Server Prefix Error`, `The server prefix can not be longer than 10 characters.`);
            } else {
              d[0].prefix = "cs/";
              caller.DB.Update('guilds', {
                'id': d[0].id
              }, d[0])
              caller.utils.sendCompactEmbed(command.msg.channel, `Server Prefix`, `Server prefix set to ${caller.config.PREFIX}`);
            }
          })
        } else caller.utils.sendCompactEmbed(command.msg.channel, "Missing Permissions", "You need be the owner of the server or have `MANAGE_GUILD` permission to change this server's prefix.", 16772880);
        break;
      case 'delete':
        switch (player.prefs.delete) {
          case undefined:
            player.prefs.delete = true;
            caller.utils.updatePlayer(player);
            caller.utils.sendCompactEmbed(command.msg.channel, `Message Delete`, `Casino will now delete game messages after 5 seconds.`);
            break;
          case false:
            player.prefs.delete = true;
            caller.utils.updatePlayer(player);
            caller.utils.sendCompactEmbed(command.msg.channel, `Message Delete`, `Casino will now delete game messages after 5 seconds.`);
            break;
          case true:
            player.prefs.delete = false;
            caller.utils.updatePlayer(player);
            caller.utils.sendCompactEmbed(command.msg.channel, `Message Delete`, `Casino will not delete game messages.`);
            break;
        }
        break;
      default:
        caller.utils.sendCompactEmbed(command.msg.channel, "Settings",`Here you can change your settings.\n\`${command.prefix}settings prefix aPrefixHere\` allows you to change your personal prefix. this prefix takes presedence over the server prefix, but you can still use the bot and server prefixes.\n\`${command.prefix}settings server aPrefixHere\` allows you to set a server prefix.\n\`${command.prefix}settings delete\` allows casino bot to delete some message that it sends after 5 seconds`);
    }
  }).catch(function(err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
  });
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "command" //command or game
  };
};
