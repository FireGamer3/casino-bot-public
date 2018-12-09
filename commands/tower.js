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
        caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
        return;
      }
    }
    var timeoutInfo = caller.utils.checkTimeout(player);
    if (!timeoutInfo.pass) {
      logger.Info("Casino", "tower", "Player: " + player.name + " Tried the tower before their delay of: " + timeoutInfo.remain);
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
      caller.utils.updatePlayer(player);
      return;
    }
    switch (command.params[0]) {
      case 'start':
        if (command.params[1] == undefined) {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, `Please input a bet. Ex \`${command.prefix}tower start 100k\``, 16772880);
          return
        }
        if (command.params[1].toLowerCase() == 'allin') {
          var bet = player.money
        } else {
          var bet = numeral(command.params[1]).value();
        }
        if (bet > 0) {
          if (player.money >= bet) {
            if (player.tower == undefined) {
              player.tower = {
                mult: 1,
                bet: bet,
                floor: 0,
                end: false
              }
              player.money -= bet;
              caller.utils.updatePlayerLastMessage(player);
              caller.utils.updatePlayer(player);
              caller.utils.sendCompactEmbed(command.msg.channel, 'Tower Game Started', `You have placed a bet of ${numeral(bet).format('$0,00.00')}\nYou mult is 1x\nYou are on floor 0 of 10\nAdvance by picking a floor with \`${command.prefix}tower left\` or \`${command.prefix}tower right\`\nYou can walk and claim your ${numeral((player.tower.bet * player.tower.mult)).format('$0,0.00')} with \`${command.prefix}tower walk\``)
            } else if (player.tower.end) {
              player.tower = {
                mult: 1,
                bet: bet,
                floor: 0,
                end: false
              }
              player.money -= bet;
              caller.utils.updatePlayerLastMessage(player);
              caller.utils.updatePlayer(player);
              caller.utils.sendCompactEmbed(command.msg.channel, 'Tower Game Started', `You have placed a bet of ${numeral(bet).format('$0,00.00')}\nYou mult is 1x\nYou are on floor 0 of 10\nAdvance by picking a floor with \`${command.prefix}tower left\` or \`${command.prefix}tower right\`\nYou can walk and claim your ${numeral((player.tower.bet * player.tower.mult)).format('$0,0.00')} with \`${command.prefix}tower walk\``)
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, `You currently have a tower game with a bet of ${numeral(player.tower.bet).format('$0,00.00')} on floor ${player.tower.floor} with a mult of ${parseFloat(player.tower.mult).toFixed(2)}x`, 16772880);
              return;
            }
          } else {
            caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, "You don't have that much Money! You have " + numeral(player.money).format('$0,00.00'), 16772880);
            return;
          }
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, "Your bet must be greater than $0", 16772880);
          return;
        }
        break;
      case 'left':
        if (player.tower != undefined) {
          if (!player.tower.end) {
            var number = caller.utils.getRandomIntInclusive(0, 11);
            if (number >= 6) {
              if (player.tower.floor < 10) {
                player.tower.floor++;
                player.tower.mult += (0.3 * player.tower.floor);
                player.xp += 2;
                caller.utils.updatePlayerLastMessage(player);
                caller.utils.updatePlayer(player);
                caller.utils.sendCompactEmbed(command.msg.channel, 'Correct Floor', `You picked the correct floor and as a result your mult has increased to ${parseFloat(player.tower.mult).toFixed(2)}x\nYou are on floor ${player.tower.floor} of 10\nAdvance by picking a floor with \`${command.prefix}tower left\` or \`${command.prefix}tower right\`\nYou can walk and claim your ${numeral((player.tower.bet * player.tower.mult)).format('$0,0.00')} with \`${command.prefix}tower walk\``, 1433628)
              } else if (player.tower.floor == 10) {
                player.tower.mult += (0.3 * player.tower.floor);
                player.tower.end = true;
                var winnings = ((player.tower.bet * player.tower.mult) * player.prestige.payoutMult);
                player.money += winnings;
                player.xp += 5;
                caller.utils.updatePlayerLastMessage(player);
                caller.utils.updatePlayer(player);
                caller.utils.sendCompactEmbed(command.msg.channel, 'Tower Game Ended', `You've correctly guess all 10 floors. You've won ${numeral(winnings).format('$0,0.00')}`, 1433628)
              }
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, 'Tower Game Ended', `The correct floor was on the right side. You lost your bet of ${numeral(player.tower.bet).format('$0,00.00')}`, 16772880)
              player.tower = null;
              player.xp++;
              caller.utils.updatePlayerLastMessage(player);
              caller.utils.updatePlayer(player);            }
          } else {
            caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, "You don't have an active game of tower", 16772880);
            return;
          }
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, "You don't have an active game of tower", 16772880);
          return;
        }
        break;
      case 'right':
        if (player.tower != undefined) {
          if (!player.tower.end) {
            var number = caller.utils.getRandomIntInclusive(0, 11);
            if (number >= 6) {
              if (player.tower.floor < 10) {
                player.tower.floor++;
                player.tower.mult += (0.3 * player.tower.floor);
                player.xp += 2;
                caller.utils.updatePlayerLastMessage(player);
                caller.utils.updatePlayer(player);
                caller.utils.sendCompactEmbed(command.msg.channel, 'Correct Floor', `You picked the correct floor and as a result your mult has increased to ${parseFloat(player.tower.mult).toFixed(2)}x\nYou are on floor ${player.tower.floor} of 10\nAdvance by picking a floor with \`${command.prefix}tower left\` or \`${command.prefix}tower right\`\nYou can walk and claim your ${numeral((player.tower.bet * player.tower.mult)).format('$0,0.00')} with \`${command.prefix}tower walk\``, 1433628)
              } else if (player.tower.floor == 10) {
                player.tower.mult += (0.3 * player.tower.floor);
                player.tower.end = true;
                var winnings = ((player.tower.bet * player.tower.mult) * player.prestige.payoutMult);
                player.money += winnings;
                player.xp += 5;
                caller.utils.updatePlayerLastMessage(player);
                caller.utils.updatePlayer(player);
                caller.utils.sendCompactEmbed(command.msg.channel, 'Tower Game Ended', `You've correctly guess all 10 floors. You've won ${numeral(winnings).format('$0,0.00')}`, 1433628)
              }
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, 'Tower Game Ended', `The correct floor was on the left side. You lost your bet of ${numeral(player.tower.bet).format('$0,00.00')}`, 16772880)
              player.tower = null;
              player.xp++;
              caller.utils.updatePlayerLastMessage(player);
              caller.utils.updatePlayer(player);
            }
          } else {
            caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, "You don't have an active game of tower", 16772880);
            return;
          }
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, "You don't have an active game of tower", 16772880);
          return;
        }
        break;
      case 'walk':
        if (player.tower != undefined) {
          if (!player.tower.end) {
            player.tower.end = true;
            var winnings = ((player.tower.bet * player.tower.mult) * player.prestige.payoutMult);
            player.money += winnings;
            player.xp += 2;
            player.tower.bet = 0
            caller.utils.updatePlayerLastMessage(player);
            caller.utils.updatePlayer(player);
            caller.utils.sendCompactEmbed(command.msg.channel, 'Tower Game Ended', `You walked away from your tower game with ${numeral(winnings).format('$0,0.00')}`, 1433628)
          } else {
            caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, "You don't have an active game of tower", 16772880);
            return;
          }
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, "You don't have an active game of tower", 16772880);
          return;
        }
        break;
      default:
        caller.utils.sendCompactEmbed(command.msg.channel, 'Tower', `${command.prefix}tower start - Start a game of Tower.\n${command.prefix}tower left - Pick the left floor.\n${command.prefix}tower right - Pick the right floor.\n${command.prefix}tower walk - Walk away with your money.`)
    }
  });
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "game" //command or game
  };
};
