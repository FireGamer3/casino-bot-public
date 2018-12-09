const numeral = require('numeral');

exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(player => {
  if (player.bank == undefined) {
    player.bank = 0;
  }
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    if(!player.rules){
      caller.utils.sendCompactEmbed(command.msg.channel,pack.common.errorTitle, pack.common.acceptRules[0] + command.prefix + pack.common.acceptRules[1]);
      return;
    }
    if (!player.Premium) {
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.blackjackCommand.notUltra[0] + command.prefix + pack.blackjackCommand.notUltra[1], 16772880);
      return;
    }
    var timeoutInfo = caller.utils.checkTimeout(player);
    if (!timeoutInfo.pass) {
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
      caller.utils.updatePlayer(player);
      return;
    }
    switch (command.params[0]) {
      case "start":
        if(command.params[1]){
          var wager;
          if (command.params[1].toLowerCase() == "allin") {
            wager = numeral(player.money).value();
          } else {
            wager = numeral(command.params[1]).value();
          }
          if (wager > 0) {
            if (player.money >= wager) {
              if (!caller.blackjack.hasGame(player)) {
                player.money -= wager;
              }
              caller.blackjack.newGame(player, wager, command.msg.channel);
            }else {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.blackjackCommand.noMoney + pack.common.currency + numeral(player.money).format(pack.common.moneyFormat), 16772880)
            }
          }
        }
        break;
      case "hit":
        caller.blackjack.hit(player, command.msg.channel);
        break;
      case "stand":
        caller.blackjack.stand(player, command.msg.channel);
        break;
      default:
        caller.utils.sendCompactEmbed(command.msg.channel, pack.blackjackCommand.titleBJ, "`" + command.prefix + pack.blackjackCommand.commands.start + "\n`" + command.prefix + pack.blackjackCommand.commands.hit + "\n`" + command.prefix + pack.blackjackCommand.commands.stand)
    }
    caller.utils.updateLastSeen(player);
    caller.utils.checkLV(player, command.msg.channel);
    caller.utils.updatePlayerLastMessage(player);
    caller.utils.updatePlayer(player);
  }).catch(function(err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
  });
};
exports.settings = function () {
  return {
    show: true, // show in help true false
    type: "game" //command or game
  };
};
