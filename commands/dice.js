const numeral = require('numeral');
const logger = require('disnode-logger');

exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
  if (player.bank == undefined) {
    player.bank = 0;
  }
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    if(!player.rules){
      caller.utils.sendCompactEmbed(command.msg.channel,pack.common.errorTitle, pack.common.acceptRules[0] + command.prefix + pack.common.acceptRules[1]);
      return;
    }
    if (caller.utils.checkBan(player, command)) return;
    if (player.Admin || player.Mod) {} else {
      if (!caller.utils.doChannelCheck(command)) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.common.channelCheck, 16772880);
        return;
      }
    }
    var timeoutInfo = caller.utils.checkTimeout(player);
    if (!timeoutInfo.pass) {
      logger.Info("Casino", "Dice", "Player: " + player.name + " Tried the dice before their delay of: " + timeoutInfo.remain);
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
      caller.utils.updatePlayer(player);
      return;
    }
    switch (command.params[0]) {
      case "roll":
        if (command.params[1]) {
          var dicenum = numeral(command.params[1]).value();
          if (dicenum >= 5 && dicenum <= 10000) {
            if (command.params[2]) {
              var pick = numeral(command.params[2]).value();
              if (pick >= 1 && pick <= dicenum) {
                if (command.params[3]) {
                  if (command.params[3].toLowerCase() == "allin") {
                    command.params[3] = player.money;
                  }
                  var bet = numeral(command.params[3]).value();
                  if (bet > 0 && player.money >= bet) {
                    player.money -= bet;
                    var rolled = caller.utils.getRandomIntInclusive(1, dicenum);
                    var winnings = 0;
                    if (rolled == pick) {
                      winnings = ((bet * dicenum) * player.prestige.payoutMult);
                      player.money += winnings;
                      var xpmult = Math.floor((dicenum / 10));
                      if (xpmult <= 0) xpmult = 1;
                      player.xp += 10 * xpmult;
                    }
                    caller.bot.createMessage(command.msg.channel.id, {embed:{
                      color: 1433628,
                      author: {},
                      fields: [{
                        name: ':game_die: ' + player.name + pack.diceCommand.result,
                        inline: false,
                        value: pack.diceCommand.rolled[0] + rolled + pack.diceCommand.rolled[1] + dicenum + pack.diceCommand.rolled[2],
                      }, {
                        name: pack.diceCommand.pick,
                        inline: true,
                        value: "" + pick,
                      }, {
                        name: pack.diceCommand.bet,
                        inline: true,
                        value: numeral(bet).format('$0,0.00'),
                      }, {
                        name: pack.diceCommand.winnings,
                        inline: true,
                        value: numeral(winnings).format('$0,0.00'),
                      }, {
                        name: pack.diceCommand.net,
                        inline: true,
                        value: numeral(winnings - bet).format('$0,0.00'),
                      }, {
                        name: pack.diceCommand.bal,
                        inline: true,
                        value: numeral(player.money).format('$0,0.00'),
                      }, {
                        name: pack.diceCommand.xp,
                        inline: true,
                        value: numeral(player.xp).format('0,0'),
                      }],
                      footer: {}
                    }}).then((message) => {
                      if (player.prefs.delete != undefined && player.prefs.delete != false) {
                        setTimeout(function() {
                          message.delete();
                        }, 5000);
                      }
                    });
                    caller.utils.updatePlayerLastMessage(player);
                    caller.utils.updateLastSeen(player);
                    caller.utils.checkLV(player, command.msg.channel);
                    caller.utils.updatePlayer(player);

                  } else {
                    caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.diceCommand.error.money, 16772880);
                  }
                } else {
                  caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.diceCommand.error.invalid, 16772880);
                }
              } else {
                caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.diceCommand.error.pickSides, 16772880);
              }
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.diceCommand.error.pick[0] + command.prefix + pack.diceCommand.error.pick[1], 16772880);
            }
          } else {
            caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.diceCommand.error.side[0] + command.prefix + pack.diceCommand.error.side[1], 16772880);
          }
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle,  pack.diceCommand.error.side[0] + command.prefix + pack.diceCommand.error.side[1], 16772880);
        }
        break;
      default:
        caller.utils.sendCompactEmbed(command.msg.channel, pack.diceCommand.title, pack.diceCommand.desc[0] + command.prefix + pack.diceCommand.desc[1] + command.prefix + pack.diceCommand.desc[2]);
        break;
    }
  }).catch(function(err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
  });
};
exports.settings = function () {
  return {
    show: true, // show in help true false
    type: "game" //command or game
  };
};
