const logger = require('disnode-logger');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
  if (player.bank == undefined) {
    player.bank = 0;
  }
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    if (!player.rules) {
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.common.acceptRules[0] + command.prefix + pack.common.acceptRules[1]);
      return;
    }
    if (caller.utils.checkBan(player, command)) return;
    if (player.Admin || player.Mod) {} else {
      if (!caller.utils.doChannelCheck(command)) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.common.channelCheck, 16772880);
        return;
      }
    }
    var timeoutInfo = caller.utils.checkAppeal(player);
    if (!timeoutInfo.pass) {
      logger.Info("Casino", "Appeal", "Player: " + player.name + " Tried the Appeal before their delay of: " + timeoutInfo.remain);
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.appealCommand.timeout[0] + timeoutInfo.remain + pack.appealCommand.timeout[1], 16772880);
      caller.utils.updatePlayer(player);
      return;
    }
      if (player.seconds > 5) {
        caller.bot.createMessage(command.msg.channel.id, {
          embed: {
            color: 3447003,
            title: pack.appealCommand.question.title,
            description: pack.appealCommand.question.desc
          }
        }).catch(console.error)
        let timer;
        const handler = (message) => {
          if (message.author.id == player.id && message.channel.id == command.msg.channel.id) {
            if (message.content == 'yes') {
              player.appeal = true;
              player.seconds = 5;
              player.lastAppeal = new Date().getTime()
              caller.utils.updatePlayer(player);
              caller.utils.sendCompactEmbed(command.msg.channel, pack.appealCommand.question.yesTitle,  pack.appealCommand.question.yesDesc);
              caller.bot.removeListener('messageCreate', handler);
              clearTimeout(timer);
            }else {
              caller.utils.sendCompactEmbed(command.msg.channel, `Nothing Changed`, `You didn't appeal.`);
              caller.bot.removeListener('messageCreate', handler);
              clearTimeout(timer);
            }
          }
        };
        caller.bot.on('messageCreate', handler);
        timer = setTimeout(() => {
        caller.bot.removeListener('messageCreate', handler);
        }, 60000);
      } else {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.appealCommand.error, pack.appealCommand.noTimeout, 16772880);
      }
  }).catch(function(err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
  });
};
exports.settings = function() {
  return {
    show: false, // show in help true false
    type: "command" //command or game
  };
};
