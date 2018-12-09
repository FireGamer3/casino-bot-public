const numeral = require('numeral');
const cs = require('../casinoStuff');
const date = require('dateformat')
exports.Run = function(caller, command) {
  if (command.params[0] != undefined) {
    caller.utils.getPlayer(command.msg.author).then(function(player) {
      if (player.bank == undefined) {
        player.bank = 0;
        caller.utils.updatePlayer(player);
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
      caller.utils.findPlayer(command.params[0]).then(function(res) {
        if (res.found) {
          if (res.p.bank == undefined) {
            res.p.bank = 0;
            caller.utils.updatePlayer(res.p);
          }
          if (res.p.money > 1000000000000000000000) {
            var moneyFormat = '0,0.0a'
          }else var moneyFormat = pack.common.moneyFormat
          if (res.p.income > 1000000000000000000000) {
            var incomeFormat = '0,0.0a'
          }else var incomeFormat = pack.common.moneyFormat
          if (res.p.maxIncome > 1000000000000000000000) {
            var maxincFormat = '0,0.0a'
          }else var maxincFormat = pack.common.moneyFormat
          caller.bot.createMessage(command.msg.channel.id, {
            embed: {
              color: 1433628,
              author: {},
              title: res.p.name + " " + pack.balCommand.title,
              fields: [{
                name: pack.balCommand.titleMoney,
                inline: true,
                value: pack.common.currency + numeral(res.p.money).format(moneyFormat),
              }, {
                name: pack.balCommand.titleIncome,
                inline: true,
                value: pack.common.currency + numeral(res.p.income).format(incomeFormat),
              }, {
                name: pack.balCommand.titleMaxIncome,
                inline: true,
                value: pack.common.currency + numeral(res.p.maxIncome).format(maxincFormat),
              }, {
                name: pack.balCommand.titleXP,
                inline: true,
                value: numeral(res.p.xp).format(pack.common.numberFormat) + " / " + numeral(res.p.nextlv).format(pack.common.numberFormat),
              }, {
                name: pack.balCommand.titleLevel,
                inline: true,
                value: res.p.lv,
              }, {
                name: pack.balCommand.titleKeys,
                inline: true,
                value: res.p.keys,
              }, {
                name: pack.balCommand.titleCrates,
                inline: true,
                value: pack.crates[0] + ": " + res.p.crates[0] + "\n" + pack.crates[1] + ": " + res.p.crates[1] + "\n" + pack.crates[2] + ": " + res.p.crates[2] + "\n" + pack.crates[3] + ": " + res.p.crates[3] + "\n" + pack.crates[4] + ": " + res.p.crates[4] + "\n" + pack.crates[5] + ": " + res.p.crates[5],
              }, {
                name: pack.balCommand.titleUltra,
                inline: true,
                value: res.p.Premium,
              },{
                name: pack.balCommand.titlePrestige,
                inline: true,
                value: res.p.prestige.lv,
              },{
                name: pack.balCommand.titleBank,
                inline: true,
                value: numeral(res.p.bank).format("$0,0.00"),
              }],
              footer: {text:(player.Admin == true) ? date(caller.snowflake(res.p.id), "mmmm dS, yyyy") : ''}
            }
          })
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
        }
      });
    }).catch(function(err) {
      console.log(err);
      caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.\n" + err, 16772880);
    });
  } else {
    caller.utils.getPlayer(command.msg.author).then(function(player) {
      var pack = caller.lang.getPack(player.prefs.lang, "casino");
      if (!player.rules) {
        caller.utils.sendCompactEmbed(command.msg.channel,pack.common.errorTitle, pack.common.acceptRules[0] + command.prefix + pack.common.acceptRules[1]);
        return;
      }
      if (caller.utils.checkBan(player, command)) return;
      if (player.Admin || player.Mod) {} else {
        if (!caller.utils.doChannelCheck(command)) {
          caller.utils.sendCompactEmbed(command.msg.channel,  pack.common.errorTitle, pack.common.channelCheck, 16772880);
          return;
        }
      }
      if (player.money > 1000000000000000000000) {
        var moneyFormat = '0,0.0a'
      }else var moneyFormat = pack.common.moneyFormat
      if (player.income > 1000000000000000000000) {
        var incomeFormat = '0,0.0a'
      }else var incomeFormat = pack.common.moneyFormat
      if (player.maxIncome > 1000000000000000000000) {
        var maxincFormat = '0,0.0a'
      }else var maxincFormat = pack.common.moneyFormat
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 1433628,
          author: {},
          title: player.name + " " + pack.balCommand.title,
          fields: [{
            name: pack.balCommand.titleMoney,
            inline: true,
            value: pack.common.currency + numeral(player.money).format(moneyFormat),
          }, {
            name: pack.balCommand.titleIncome,
            inline: true,
            value: pack.common.currency + numeral(player.income).format(incomeFormat),
          }, {
            name: pack.balCommand.titleMaxIncome,
            inline: true,
            value: pack.common.currency + numeral(player.maxIncome).format(maxincFormat),
          }, {
            name: pack.balCommand.titleXP,
            inline: true,
            value: numeral(player.xp).format(pack.common.numberFormat) + " / " + numeral(player.nextlv).format(pack.common.numberFormat),
          }, {
            name: pack.balCommand.titleLevel,
            inline: true,
            value: player.lv,
          }, {
            name: pack.balCommand.titleKeys,
            inline: true,
            value: player.keys,
          }, {
            name: pack.balCommand.titleCrates,
            inline: true,
            value: pack.crates[0] + ": " + player.crates[0] + "\n" + pack.crates[1] + ": " + player.crates[1] + "\n" + pack.crates[2] + ": " + player.crates[2] + "\n" + pack.crates[3] + ": " + player.crates[3] + "\n" + pack.crates[4] + ": " + player.crates[4] + "\n" + pack.crates[5] + ": " + player.crates[5],
          }, {
            name: pack.balCommand.titleTimeout,
            inline: true,
            value: `${(player.seconds == undefined) ? 5 : (player.Premium) ? (player.seconds - 2) : player.seconds} seconds`
          }, {
            name: pack.balCommand.titleUltra,
            inline: true,
            value: player.Premium,
          }, {
            name: pack.balCommand.titlePrestige,
            inline: true,
            value: player.prestige.lv,
          }, {
            name: pack.balCommand.titleBank,
            inline: true,
            value: numeral(player.bank).format("$0,0.00"),
          }],
          footer: {}
        }
      })
    }).catch(function(err) {
      console.log(err);
      caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
    });
  }
  return;
};
exports.settings = function() {
  return {
    show: true,
    type: "game" //command or game
  };
};
