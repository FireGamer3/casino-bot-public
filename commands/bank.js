const numeral = require('numeral');
exports.Run = function (caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function (player) {
    const pack = caller.lang.getPack(player.prefs.lang, "casino");
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
    if (player.bank == undefined) {
      player.bank = 0;
    }
    switch (command.params[0]) {
    case "deposit":
      if (command.params[1] == 'max') {
        if (player.money < ((player.money + player.bank) / 2)) {
          var toadd = 0;
        }else {
          var toadd = ((player.money + player.bank) / 2) - player.bank;
        }
      }else var toadd = numeral(command.params[1]).value();
      if (toadd > 1) {
        if (toadd <= player.money) {
          if ((player.money - toadd) < ((player.money + player.bank) / 2)) {
            caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.bankCommand.notEnoughMoney, 16772880);
          } else {
            player.bank += toadd;
            player.money -= toadd;
            caller.utils.sendCompactEmbed(command.msg.channel, pack.common.complete, pack.bankCommand.completeDeposit[0] + numeral(toadd).format("$0,0.00") + pack.bankCommand.completeDeposit[1]);
          }
        }else {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.bankCommand.notEnoughMoney, 16772880);
        }
      }else {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.bankCommand.tooLow, 16772880);
      }
      break;
    case "withdraw":
      if (command.params[1] == 'all') {
        var toadd = numeral(player.bank).value();
      }else {
        var toadd = numeral(command.params[1]).value();
      }
      if (toadd > 1) {
        if (toadd <= player.bank) {
          player.bank -= toadd;
          player.money += toadd;
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.complete, pack.bankCommand.completeWithdraw[0] + numeral(toadd).format("$0,0.00") + pack.bankCommand.completeWithdraw[1]);
        }else {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.bankCommand.cantwithdraw, 16772880);
        }
      }else {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.bankCommand.tooLow, 16772880);
      }
      break;
    default:
      caller.utils.sendCompactEmbed(command.msg.channel, pack.bankCommand.title, pack.bankCommand.help[0] + "**" + command.prefix + pack.bankCommand.help[1] + "**" + command.prefix + pack.bankCommand.help[2]);
      break;
    }
    caller.utils.updatePlayer(player);
  }).catch(function (err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
  });
};
exports.settings = function () {
  return {
    show: true, // show in help true false
    type: "command" //command or game
  };
};
