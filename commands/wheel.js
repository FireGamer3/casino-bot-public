const numeral = require('numeral');
const cs = require('../casinoStuff');
const logger = require('disnode-logger');

exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
  if (player.bank == undefined) {
    player.bank = 0;
  }
    var wheelInfo;
    var winspots = [];
    var whatcontains = {
      has1st: false,
      has2nd: false,
      has3rd: false
    }
    var invalidbets = [];
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    if(!player.rules){
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
      logger.Info("Casino", "Wheel", "Player: " + player.name + " Tried the Wheel before their delay of: " + timeoutInfo.remain);
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
      caller.utils.updatePlayer(player);
      return;
    }
    switch (command.params[0]) {
      case "spin":
        if (command.params[1] == "allin") {
          var bet = numeral(player.money).value();
        } else {
          var bet = numeral(command.params[1]).value();
        }
        if (bet > 0) {
          var timeoutInfo = caller.utils.checkTimeout(player, 5);
          if (player.Premium) timeoutInfo = caller.utils.checkTimeout(player, 2);
          if (player.Admin) timeoutInfo = caller.utils.checkTimeout(player, 0);
          if (!timeoutInfo.pass) {
            caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: You must wait **" + timeoutInfo.remain + "** before playing again.", 16772880);
            return;
          }
          if (command.params.length > 4) {
            caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: You can only put a maximum of 2 Bet Types!", 16772880);
            return;
          }
          for (var i = 2; i < command.params.length; i++) {
            if (command.params[i] == undefined) break;
            if (caller.utils.checkValidWheel(command.params[i])) {
              if (command.params[i].toLowerCase() == "1st") {
                whatcontains.has1st = true;
              }
              if (command.params[i].toLowerCase() == "2nd") {
                whatcontains.has2nd = true;
              }
              if (command.params[i].toLowerCase() == "3rd") {
                whatcontains.has3rd = true;
              }
              if (winspots.indexOf(command.params[i].toLowerCase()) == -1) {
                winspots.push(command.params[i].toLowerCase());
              }else {
                invalidbets.push(command.params[i]);
              }
            } else {
              invalidbets.push(command.params[i]);
            }
          }
          if (winspots.length == 0) {
            if (invalidbets.length > 0) {
              var msg = "";
              for (var i = 0; i < invalidbets.length; i++) {
                msg += invalidbets[i] + " ";
              }
              caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: Please Enter valid bet types! Invalid: " + msg, 16772880);
              return;
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: Please Enter valid bet types!", 16772880);
              return;
            }
          }
          if (bet > player.money) { // Checks to see if player has enough money for their bet
            caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: You dont have that much Money! You have $" + numeral(player.money).format('0,0.00'), 16772880);
            return;
          } else {
            var warn = "";
            player.money -= bet;
            player.money = numeral(player.money).value();
          }
          if (player.tower != undefined) {
            if ((player.money + (player.bank / 2) + player.tower.bet) > 8500) {
              var minJackpotBet = ((player.money + (player.bank /2) + player.tower.bet) * 0.03);
            } else var minJackpotBet = 250;
          }else {
            if ((player.money + (player.bank / 2)) > 8500) {
              var minJackpotBet = ((player.money + (player.bank /2)) * 0.03);
            } else var minJackpotBet = 250;
          }
          var wheelInfo = {
            bet: bet,
            betperspot: (bet / winspots.length),
            player: player,
            winAmount: 0,
            xpAward: 0,
            wheelNumber: caller.utils.getRandomIntInclusive(0, (cs.wheelItems.length - 1)),
            winspots: winspots,
            ball: 0,
            whatcontains: whatcontains
          }
          wheelInfo.ball = cs.wheelItems[wheelInfo.wheelNumber];
          caller.utils.calculateWheelWins(wheelInfo);
          player.stats.wheelPlays++;
          if (wheelInfo.winAmount > 0){
            player.stats.wheelWins++;
            player.money += (wheelInfo.winAmount);
          }
          if (bet < minJackpotBet) {
            warn = "\n`You didn't bet your Minimum bet to get XP, please note the amount you need to bet below`"
          } else {
            if (wheelInfo.whatcontains.has1st && wheelInfo.whatcontains.has2nd && wheelInfo.whatcontains.has3rd) {} else {
              player.xp += wheelInfo.xpAward;
            }
          }
          
          if (player.tower != undefined) {
            if ((player.money + (player.bank / 2) + player.tower.bet) > 8500) {
              var minJackpotBet = ((player.money + (player.bank /2) + player.tower.bet) * 0.03);
            } else var minJackpotBet = 250;
          }else {
            if ((player.money + (player.bank / 2)) > 8500) {
              var minJackpotBet = ((player.money + (player.bank /2)) * 0.03);
            } else var minJackpotBet = 250;
          }
          logger.Info("Casino", "Wheel", "Wheel Player: " + player.name + " bet: " + bet + " Win: " + wheelInfo.winAmount);
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: Please use a number for your bet!", 16772880);
          return;
        }
        caller.bot.createMessage(command.msg.channel.id, {embed:{
          color: 1433628,
          author: {},
          fields: [{
            name: ':money_with_wings: The Wheel :money_with_wings:',
            inline: false,
            value: wheelInfo.ball.display + warn,
          }, {
            name: 'Bet',
            inline: true,
            value: "$" + numeral(bet).format('0,0.00'),
          }, {
            name: 'bet per Type',
            inline: false,
            value: "$" + numeral(wheelInfo.betperspot).format('0,0.00'),
          }, {
            name: 'Winnings',
            inline: true,
            value: "$" + numeral(wheelInfo.winAmount).format('0,0.00'),
          }, {
            name: 'Net Gain',
            inline: true,
            value: "$" + numeral(wheelInfo.winAmount - bet).format('0,0.00'),
          }, {
            name: 'Balance',
            inline: true,
            value: "$" + numeral(player.money).format('0,0.00'),
          }, {
            name: 'Min Bet',
            inline: true,
            value: "$" + numeral(minJackpotBet).format('0,0.00'),
          }, {
            name: 'XP',
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
        break;
      case "info":
        caller.bot.createMessage(command.msg.channel.id, {embed:{
          color: 3447003,
          author: {},
          fields: [{
            name: ':money_with_wings: The Wheel :money_with_wings:',
            inline: false,
            value: "The wheel acts much like a game of roulette, however, it has a differing rule set to roulette.",
          }, {
            name: 'Playing The Wheel',
            inline: false,
            value: "To play the wheel, you can type `cs/wheel spin [bet] [Bet Type] [Bet Type]...` Example: `cs/wheel spin 100 black`",
          }, {
            name: 'Bet Types',
            inline: true,
            value: "As shown, bet types can be one of the following: `[black/red, 0-36, even/odd, 1st/2nd/3rd, and low/high]`\n`Black/Red` - Number must match the colour to win.\n`Even/Odd` - Depending on what number you choose, if that number is even or odd, you win.\n`1st/2nd/3rd` - 1st consists of numbers 1-12, 2nd consists of numbers 13-24, and 3rd consists of numbers 25-36.\n`Low/High` - Low consists of numbers 1-18, and High consists of numbers 19-36.",
          }, {
            name: 'Winnings',
            inline: true,
            value: "0 - Upon winning 0, you get 37 times the amount you bet as your win.\nAny other number (1-36) - Upon winning, you get 36 times the amount you bet as your win.\n1st/2nd/3rd - Upon winning any of these bet types, you get 3 times the amount you bet as your win.\nEven/Odd, Black/Red, Low and High - Upon winning any of these bet types, you get 2 times the amount you bet as your win.",
          }, {
            name: 'Numbers',
            inline: true,
            value: ":white_circle: # ~ 0\n:red_circle: # ~ 1, 2, 5, 6, 9, 10, 13, 14, 17, 18, 21, 22, 25, 26, 29, 30, 33, 34\n:black_circle:  # ~ 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 27, 28, 31, 32, 35, 36,"
          }],
          footer: {}
        }})
        break;
      default:
        caller.bot.createMessage(command.msg.channel.id, {embed:{
          color: 3447003,
          author: {},
          fields: [{
            name: "The Wheel (Roulette)",
            inline: false,
            value: "Welcome to the wheel! To play, use this command: `cs/wheel spin 100 black`. For more info on what the win types are, and how the game is played out, use `cs/wheel info`.",
          }],
          footer: {}
        }})
    }
  });
};
exports.settings = function () {
  return {
    show: true, // show in help true false
    type: "game" //command or game
  };
};
