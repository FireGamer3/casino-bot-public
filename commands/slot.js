const numeral = require('numeral');
const cs = require('../casinoStuff');
var logger = require("disnode-logger");

exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
  if (player.bank == undefined) {
    player.bank = 0;
  }
    caller.utils.getCasinoObj().then(function(casinoObj) {
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
      switch (command.params[0]) {
        case "info":
          if (player.tower != undefined) {
            if ((player.money + (player.bank / 2) + player.tower.bet) > 8500) {
              var minJackpotBet = ((player.money + (player.bank /2) + player.tower.bet) * 0.03);
            } else var minJackpotBet = 250;
          }else {
            if ((player.money + (player.bank / 2)) > 8500) {
              var minJackpotBet = ((player.money + (player.bank /2)) * 0.03);
            } else var minJackpotBet = 250;
          }
          caller.bot.createMessage(command.msg.channel.id, {
            embed: {
              color: 1433628,
              author: {},
              title: pack.slotCommand.info.embedTitle,
              fields: [{
                name: pack.slotCommand.info.titleItems,
                inline: false,
                value: pack.slotCommand.info.valueItems,
              }, {
                name: pack.slotCommand.info.titleWins,
                inline: false,
                value: pack.slotCommand.info.valueWins,
              }, {
                name: pack.slotCommand.info.titleMinbet,
                inline: false,
                value: pack.slotCommand.info.valueMinbet[0] + pack.common.currency + "**" + numeral(minJackpotBet).format(pack.common.moneyFormat) + "**" + pack.slotCommand.info.valueMinbet[1]
              }, {
                name: pack.slotCommand.info.titleXP,
                inline: false,
                value: pack.slotCommand.info.valueXP,
              }, {
                name: pack.slotCommand.info.titleJackpot,
                inline: false,
                value: pack.slotCommand.info.valueJackpot + pack.common.currency + numeral(casinoObj.jackpotValue).format(pack.common.moneyFormat),
              }, {
                name: pack.slotCommand.info.titleJackpotH,
                inline: true,
                value: pack.slotCommand.info.valueJackpotH + casinoObj.jackpotstat.lastWon,
              }],
              footer: {}
            }
          });
          break;
        case "stats":
          caller.bot.createMessage(command.msg.channel.id, {
            embed: {
              color: 1433628,
              author: {},
              fields: [{
                name: pack.slotCommand.stats.title,
                inline: false,
                value: pack.slotCommand.stats.titlevalue,
              }, {
                name: ":cherries:",
                inline: false,
                value: pack.slotCommand.stats.valueCherries,
              }, {
                name: ':third_place:',
                inline: false,
                value: pack.slotCommand.stats.valueThird,
              }, {
                name: ':second_place:',
                inline: false,
                value: pack.slotCommand.stats.valueSecond,
              }, {
                name: ':first_place:',
                inline: false,
                value: pack.slotCommand.stats.valueFirst,
              }, {
                name: ':package:',
                inline: false,
                value: pack.slotCommand.stats.valueCrate,
              }, {
                name: ':100:',
                inline: false,
                value: pack.slotCommand.stats.valueJP,
              }, {
                name: ':key:',
                inline: false,
                value: pack.slotCommand.stats.valueKey,
              }],
              footer: {}
            }
          });
          break;
        case undefined:
          caller.utils.sendCompactEmbed(command.msg.channel, pack.slotCommand.help.title, pack.slotCommand.help.value);
          break;
        default:
          if (player.tower != undefined) {
            if ((player.money + (player.bank / 2) + player.tower.bet) > 8500) {
              var minJackpotBet = ((player.money + (player.bank /2) + player.tower.bet) * 0.03);
            } else var minJackpotBet = 250;
          }else {
            if ((player.money + (player.bank / 2)) > 8500) {
              var minJackpotBet = ((player.money + (player.bank /2)) * 0.03);
            } else var minJackpotBet = 250;
          }
          minJackpotBet = parseFloat(minJackpotBet.toFixed(2));
          if (command.params[0]) {
            if (command.params[0].toLowerCase() == "allin") {
              command.params[0] = player.money;
            } else if (command.params[0].toLowerCase() == "min") {
              if (player.Premium) {
                command.params[0] = minJackpotBet;
              } else {
                caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.slotCommand.error.ultraMinBet, 16772880)
                return
              }
            }
            var bet = numeral(command.params[0]).value();
            var timeoutInfo = caller.utils.checkTimeout(player);
            if (!timeoutInfo.pass) {
              logger.Info("Casino", "Slot", "Player: " + player.name + " Tried the Slots before their delay of: " + timeoutInfo.remain);
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
              caller.utils.updatePlayer(player);
              return;
            }
            if (bet > 0.01) {
              if (bet > player.money | bet == NaN | bet == "NaN") { // Checks to see if player has enough money for their bet
                caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.slotCommand.error.notEnoughMoney + pack.common.currency + numeral(player.money).format('0,0.00'), 16772880);
                return;
              } else {
                player.money -= parseFloat(bet);
                casinoObj.jackpotValue += parseFloat(bet);
                player.money = parseFloat(player.money.toFixed(2));
                casinoObj.jackpotValue = parseFloat(casinoObj.jackpotValue.toFixed(2));
              }
              var slotInfo = {
                bet: bet,
                player: player,
                casinoObj: casinoObj,
                pack: pack,
                winText: "",
                winAmount: 0,
                reel1: cs.slotItems[caller.utils.getRandomIntInclusive(0, (cs.slotItems.length - 1))].item,
                reel2: cs.slotItems[caller.utils.getRandomIntInclusive(0, (cs.slotItems.length - 1))].item,
                reel3: cs.slotItems[caller.utils.getRandomIntInclusive(0, (cs.slotItems.length - 1))].item,
                fake1: cs.slotItems[caller.utils.getRandomIntInclusive(0, (cs.slotItems.length - 1))].item,
                fake2: cs.slotItems[caller.utils.getRandomIntInclusive(0, (cs.slotItems.length - 1))].item,
                fake3: cs.slotItems[caller.utils.getRandomIntInclusive(0, (cs.slotItems.length - 1))].item,
                fake4: cs.slotItems[caller.utils.getRandomIntInclusive(0, (cs.slotItems.length - 1))].item,
                fake5: cs.slotItems[caller.utils.getRandomIntInclusive(0, (cs.slotItems.length - 1))].item,
                fake6: cs.slotItems[caller.utils.getRandomIntInclusive(0, (cs.slotItems.length - 1))].item
              }
              caller.utils.slotWin(slotInfo);
              if (timeoutInfo.remain) {
                logger.Info("Casino", "Slot", "Player: " + player.name + " Slot Winnings: " + slotInfo.winAmount + " original bet: " + bet + " Time since they could use this command again: " + timeoutInfo.remain);
              } else {
                logger.Info("Casino", "Slot", "Player: " + player.name + " Slot Winnings: " + slotInfo.winAmount + " original bet: " + bet);
              }
              player.money = parseFloat(player.money.toFixed(2));
              casinoObj.jackpotValue = parseFloat(casinoObj.jackpotValue.toFixed(2));
              caller.utils.updateLastSeen(player);
              caller.utils.checkLV(player, command.msg.channel);
              if (player.tower != undefined) {
                if ((player.money + (player.bank / 2) + player.tower.bet) > 8500) {
                  var minJackpotBet = ((player.money + (player.bank /2) + player.tower.bet) * 0.03);
                } else var minJackpotBet = 250;
              }else {
                if ((player.money + (player.bank / 2)) > 8500) {
                  var minJackpotBet = ((player.money + (player.bank /2)) * 0.03);
                } else var minJackpotBet = 250;
              }
              caller.bot.createMessage(command.msg.channel.id, {
                embed: {
                  color: 1433628,
                  author: {},
                  fields: [{
                    name: pack.slotCommand.slot.title[0] + player.name + pack.slotCommand.slot.title[0],
                    inline: false,
                    value: "| " + slotInfo.fake1 + slotInfo.fake2 + slotInfo.fake3 + " |\n**>**" + slotInfo.reel1 + slotInfo.reel2 + slotInfo.reel3 + "**<**" + pack.slotCommand.slot.payLine + "\n| " + slotInfo.fake4 + slotInfo.fake5 + slotInfo.fake6 + " |\n\n" + slotInfo.winText,
                  }, {
                    name: pack.slotCommand.slot.betTitle,
                    inline: true,
                    value: pack.common.currency + numeral(bet).format(pack.common.moneyFormat),
                  }, {
                    name: pack.slotCommand.slot.winningsTitle,
                    inline: true,
                    value: pack.common.currency + numeral(slotInfo.winAmount).format(pack.common.moneyFormat),
                  }, {
                    name: pack.slotCommand.slot.netGainTitle,
                    inline: true,
                    value: pack.common.currency + numeral(slotInfo.winAmount - bet).format(pack.common.moneyFormat),
                  }, {
                    name: pack.slotCommand.slot.balTitle,
                    inline: true,
                    value: pack.common.currency + numeral(player.money).format(pack.common.moneyFormat),
                  }, {
                    name: pack.slotCommand.slot.keysTitle,
                    inline: true,
                    value: numeral(player.keys).format(pack.common.numberFormat)
                  }, {
                    name: pack.slotCommand.slot.xpTitle,
                    inline: true,
                    value: numeral(player.xp).format(pack.common.numberFormat) + '/' + numeral(player.nextlv).format(pack.common.numberFormat),
                  }, {
                    name: pack.slotCommand.slot.minjpTitle,
                    inline: true,
                    value: pack.common.currency + numeral(minJackpotBet).format(pack.common.moneyFormat),
                  }, {
                    name: pack.slotCommand.slot.jpTitle,
                    inline: true,
                    value: pack.common.currency + numeral(casinoObj.jackpotValue).format(pack.common.moneyFormat),
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
              caller.utils.updatePlayer(player);
              caller.utils.updateCasinoObj(casinoObj);
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.slotCommand.error.notAnumber, 16772880)
            }
          }
      }
    }).catch(function(err) {
      console.log(err);
      caller.utils.sendCompactEmbed(command.msg.channel, "Error cobj", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
    });
  }).catch(function(err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.\n" + err, 16772880);
  });
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "game" //command or game
  };
};
