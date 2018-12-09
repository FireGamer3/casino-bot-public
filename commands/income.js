const numeral = require('numeral');

exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(player => {
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
    caller.utils.csAPI.get("/income/" + player.id).then(function(resp) {
      if (resp.data.complete) {
        console.log(resp.data);
        if (resp.data.given > 1000000000000000000000) {
          var givenFormat = '0,0.0a'
        }else var givenFormat = pack.common.moneyFormat
        if (resp.data.bal > 1000000000000000000000) {
          var balFormat = '0,0.0a'
        }else var balFormat = pack.common.moneyFormat
        var fields = [{
          name: 'Income',
          inline: false,
          value: "You got Income!",
        }, {
          name: 'Given',
          inline: true,
          value: "$" + numeral(resp.data.given).format(givenFormat),
        }, {
          name: '% of income',
          inline: true,
          value: numeral(resp.data.mult * 100).format('0,0.00') + "%",
        }, {
          name: 'Balance',
          inline: true,
          value: "$" + numeral(resp.data.bal).format(balFormat),
        }, {
          name: 'Time since last Income recieved',
          inline: false,
          value: resp.data.time,
        }]
        if (resp.data.loan) {
          fields.push({
            name: "Payed to Loan",
            value: numeral(resp.data.loanamount).format('$0,0')
          })
        }
        caller.bot.createMessage(command.msg.channel.id, {
          embed: {
            color: 3447003,
            fields,
          }
        })
      } else {
        caller.utils.sendCompactEmbed(command.msg.channel, "Invalid", resp.data.msg, 16772880);
      }
    }).catch(function(err) {
      caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
    });
  }).catch(function(err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
  });
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "command" //command or game
  };
};
