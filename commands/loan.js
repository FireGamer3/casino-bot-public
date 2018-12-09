/* eslint-disable */
const numeral = require('numeral');
exports.Run = function (caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function (player) {
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
    switch (command.params[0]) {
    case 'takeout':
      if (player.lv < 10) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.loanCommand.lvl10, 16772880);
        return
      }
      if (!command.params[1]) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.loanCommand.takeout.noParam[0] + command.prefix + pack.loanCommand.takeout.noParam[1], 16772880);
        return
      }
      if (player.loan) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.loanCommand.activeLoan, 16772880);
        return
      }
      var timeoutInfo = caller.utils.checkLoan(player);
      if (!timeoutInfo.pass) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, 'You can take out another loan in ' + timeoutInfo.remain, 16772880);
        return;
      }
      var amount = numeral(command.params[1]).value()
      if (player.Premium) {
        if (amount < 10000 || amount > 250000000) {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.loanCommand.takeout.highUltra, 16772880);
          return
        }
      } else if (amount < 10000 || amount > 100000000) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.loanCommand.takeout.high, 16772880);
        return
      }
      player.loan = {
        amount,
        due: new Date().getTime() + 86400000,
        payed: 0,
        interest: false
      }
      player.lastLoan = new Date().getTime()
      player.money += amount;
      caller.utils.updatePlayer(player)
      caller.utils.sendCompactEmbed(command.msg.channel, pack.loanCommand.complete, pack.loanCommand.takeout.done[0] + numeral(amount).format('$0,0') + pack.loanCommand.takeout.done[1]);
      break;
    case 'pay':
      if (player.lv < 10) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.loanCommand.lvl10, 16772880);
        return
      }
      if (!player.loan) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.loanCommand.noLoan, 16772880);
        return
      }
      if (!command.params[1]) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.loanCommand.pay.noParam[0] + command.prefix + pack.loanCommand.pay.noParam[1], 16772880);
        return
      }
      var amount = Math.floor((player.loan.interest) ? (player.loan.amount * 1.03) - player.loan.payed : player.loan.amount - player.loan.payed)
      if (command.params[1].toLowerCase() === 'max') {
        var pay = (player.money > amount) ? amount : player.money;
      } else {
        var pay = numeral(command.params[1]).value();
      }
      if (amount < 1) { //if loan is already payed
        player.loan = null; // some reason i couldnt do 'delete player.loan'
        caller.utils.sendCompactEmbed(command.msg.channel, pack.loanCommand.complete, pack.loanCommand.pay.full);
        return;
      }
      if (pay < 1 || pay > amount) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.loanCommand.pay.amount + numeral(amount).format('$0,0'), 16772880);
        return
      }
      if (pay > player.money) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.loanCommand.pay.noMoney, 16772880);
        return
      }
      player.money -= pay
      player.loan.payed += pay
      if (player.loan.payed == Math.floor((player.loan.interest) ? (player.loan.amount * 1.03) : player.loan.amount)) {
        player.loan = null // some reason i couldnt do 'delete player.loan'
        caller.utils.sendCompactEmbed(command.msg.channel, pack.loanCommand.complete, pack.loanCommand.pay.full);
      } else {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.loanCommand.complete, pack.loanCommand.pay.payed[0] + numeral(pay).format('$0,0') + pack.loanCommand.pay.payed[1] + numeral(amount).format('$0,0') + pack.loanCommand.pay.payed[2]);
      }
      caller.utils.updatePlayer(player)
      break;
    case 'info':
      if (player.lv < 10) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.loanCommand.lvl10, 16772880);
        return
      }
      if (!player.loan) {
        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.loanCommand.noLoan, 16772880);
        return
      }
      var ms = player.loan.due - new Date().getTime()
      if (ms < 0) {
        ms = 0
        player.loan.interest = true
        caller.utils.updatePlayer(player)
      }
      var time = caller.utils.getElapsedTime(ms)
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 3447003,
          title: pack.loanCommand.info.title,
          fields: [{
            name: pack.loanCommand.info.amount,
            inline: true,
            value: (player.loan.interest) ? numeral(player.loan.amount + (player.loan.amount * 0.03)).format('$0,0') : numeral(player.loan.amount).format('$0,0')
          }, {
            name: pack.loanCommand.info.interest,
            inline: true,
            value: (player.loan.interest) ? numeral(player.loan.amount * 0.03).format('$0,0') : '$0'
          }, {
            name: pack.loanCommand.info.payed,
            inline: true,
            value: numeral(player.loan.payed).format('$0,0')
          }, {
            name: pack.loanCommand.info.time,
            value: time.hours + pack.loanCommand.info.hours + time.minutes + pack.loanCommand.info.minutes + time.seconds + pack.loanCommand.info.seconds + pack.loanCommand.info.before
          }]
        }
      }).catch(console.error)
      break;
    default:
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 3447003,
          description: (player.Premium) ? pack.loanCommand.descriptionUltra : pack.loanCommand.description[0],
          fields: [{
            name: pack.loanCommand.title,
            value: command.prefix + pack.loanCommand.description[1] + command.prefix + pack.loanCommand.description[2] + command.prefix + pack.loanCommand.description[3]
          }]
        }
      })
    }
  }).catch(function (err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.\n" + err, 16772880);
  });
};
exports.settings = function () {
  return {
    show: true, // show in help true false
    type: "command" //command or game
  };
};
