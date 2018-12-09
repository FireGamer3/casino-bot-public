const numeral = require('numeral');
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
    var timeoutInfo = caller.utils.checkTimeout(player);
    if (!timeoutInfo.pass) {
      logger.Info("Casino", "Flip", "Player: " + player.name + " Tried the coin flip before their delay of: " + timeoutInfo.remain);
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
      caller.utils.updatePlayer(player);
      return;
    }
    var flipinfo = {
      flip: caller.utils.getRandomIntInclusive(0, 1),
      winText: "",
      winAmount: 0,
      playerPick: 0,
      tag: ""
    }
    if (command.params[0] == "heads") {
      flipinfo.playerPick = 0;
      flipinfo.tag = "Heads";
      flipinfo.ltag = "Tails";
    } else if (command.params[0] == "tails") {
      flipinfo.playerPick = 1;
      flipinfo.tag = "Tails";
      flipinfo.ltag = "Heads";
    } else {
      caller.utils.sendCompactEmbed(command.msg.channel, pack.flipCommand.title, pack.flipCommand.desc[0] + command.prefix + pack.flipCommand.desc[1] + command.prefix + pack.flipCommand.desc[2] + command.prefix + pack.flipCommand.desc[3], 1433628);
      return;
    }
    if (command.params[1]) {
      if (command.params[1].toLowerCase() == "allin") {
        command.params[1] = player.money;
      }
    }
    if (numeral(command.params[1]).value() >= 1) {
      var bet;
      var bet = numeral(command.params[1]).value();
      var timeoutInfo = caller.utils.checkTimeout(player, 5);
      if (player.Premium) timeoutInfo = caller.utils.checkTimeout(player, 2);
      if (player.Admin) timeoutInfo = caller.utils.checkTimeout(player, 0);
      if (!timeoutInfo.pass) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
        return;
      }
      if (bet > player.money) { // Checks to see if player has enough money for their bet
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.flipCommand.noMoney + numeral(player.money).format('$0,0.00'), 16772880);
        return;
      } else {
        var minbet = (player.money + (player.bank / 2)) * 0.015;
        player.money -= bet;
        player.money = Number(parseFloat(player.money).toFixed(2));
      }
      player.stats.coinPlays++;
      if (flipinfo.flip == flipinfo.playerPick) {
        player.stats.coinWins++;
        if (flipinfo.playerPick == 0) {
          player.stats.coinHeads++;
        } else player.stats.coinTails++;
        flipinfo.winText = flipinfo.tag + pack.flipCommand.win
        flipinfo.winAmount = Number(parseFloat((bet * 1.5) * player.prestige.payoutMult).toFixed(2));
        player.money += Number(parseFloat(flipinfo.winAmount).toFixed(2));
        player.money = Number(parseFloat(player.money).toFixed(2));
        if (bet >= minbet) {
          player.xp += 5;
        } else {
          flipinfo.winText += pack.flipCommand.minBet[0] + numeral(minbet).format('$0,0.00') + pack.flipCommand.minBet[1]
        }
        logger.Info("Casino", "CoinFlip", "Player: " + player.name + " Has Won Coin Flip Winnings: " + flipinfo.winAmount + " original bet: " + bet);
        caller.utils.updateLastSeen(player);
        minbet = (player.money + (player.bank / 2)) * 0.015;
        caller.bot.createMessage(command.msg.channel.id, {
          embed: {
            color: 3447003,
            author: {},
            fields: [{
              name: pack.flipCommand.embed.title,
              inline: false,
              value: flipinfo.winText,
            }, {
              name: pack.flipCommand.embed.bet,
              inline: true,
              value: numeral(bet).format('$0,0.00'),
            }, {
              name: pack.flipCommand.embed.winnings,
              inline: true,
              value: numeral(flipinfo.winAmount).format('$0,0.00'),
            }, {
              name: pack.flipCommand.embed.net,
              inline: true,
              value: numeral(flipinfo.winAmount - bet).format('$0,0.00'),
            }, {
              name: pack.flipCommand.embed.bal,
              inline: true,
              value: numeral(player.money).format('$0,0.00'),
            }, {
              name: pack.flipCommand.embed.xp,
              inline: true,
              value: numeral(player.xp).format('0,0'),
            }],
            footer: {}
          }
        }).then((message) => {
          if (player.prefs.delete != undefined && player.prefs.delete != false) {
            setTimeout(function() {
              message.delete();
            }, 5000);
          }
        });
        caller.utils.updatePlayerLastMessage(player);
        caller.utils.updateLastSeen(player);
        caller.utils.checkLV(player, command.msg.channel);
      } else {
        flipinfo.winText = flipinfo.ltag + pack.flipCommand.house;
        if (bet >= 250) {} else {
          flipinfo.winText += pack.flipCommand.minBet[2]
        }
        if (flipinfo.playerPick == 0) {
          player.stats.coinTails++;
        } else player.stats.coinHeads++;
        logger.Info("Casino", "CoinFlip", "Player: " + player.name + " Has Lost Coin Flip Winnings: " + flipinfo.winAmount + "original bet: " + bet);
        caller.utils.updateLastSeen(player);
        caller.bot.createMessage(command.msg.channel.id, {
          embed: {
            color: 3447003,
            author: {},
            fields: [{
              name: pack.flipCommand.embed.title,
              inline: false,
              value: flipinfo.winText,
            }, {
              name: pack.flipCommand.embed.bet,
              inline: true,
              value: numeral(bet).format('$0,0.00'),
            }, {
              name: pack.flipCommand.embed.winnings,
              inline: true,
              value: numeral(flipinfo.winAmount).format('$0,0.00'),
            }, {
              name: pack.flipCommand.embed.net,
              inline: true,
              value: numeral(flipinfo.winAmount - bet).format('$0,0.00'),
            }, {
              name: pack.flipCommand.embed.bal,
              inline: true,
              value: numeral(player.money).format('$0,0.00'),
            }, {
              name: pack.flipCommand.embed.xp,
              inline: true,
              value: numeral(player.xp).format('0,0'),
            }],
            footer: {}
          }
        })
        caller.utils.updatePlayerLastMessage(player);
        caller.utils.updateLastSeen(player);
        caller.utils.checkLV(player, command.msg.channel);
      }
      caller.utils.updatePlayer(player);

    } else {
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.flipCommand.noBet[0] + command.prefix + pack.flipCommand.noBet[1], 16772880);
    }
  }).catch(function(err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
  });
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "game" //command or game
  };
};
