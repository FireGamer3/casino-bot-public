const numeral = require('numeral');
const logger = require('disnode-logger');

exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
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
      logger.Info("Casino", "Transfer", "Player: " + player.name + " Tried the Transfer Command before their delay of: " + timeoutInfo.remain);
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
      caller.utils.updatePlayer(player);
      return;
    }
    if (command.params[0]) {
      caller.utils.findPlayer(command.params[0]).then(function(res) {
        if (res.found) {
          var transferPlayer = res.p;
          var toTransfer = numeral(command.params[1]).value();
          if (transferPlayer.id == player.id) {
            caller.utils.sendCompactEmbed(command.msg.channel, "Error", "You cant transfer to yourself!", 16772880);
            return;
          } else if (transferPlayer.lv < 3) {
            caller.utils.sendCompactEmbed(command.msg.channel, "Error", "You cant transfer to a player whos level is less than 3!", 16772880);
            return;
          }
          if (toTransfer > 0) {
            if (toTransfer > player.money) {
              caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: You dont have that much Money! You have $" + numeral(player.money).format('0,0.00'), 16772880);
              return;
            } else {
              var pbalbef = player.money
              var sbalbef = transferPlayer.money
              player.money -= toTransfer;
              transferPlayer.money += toTransfer
              player.money = Number(parseFloat(player.money).toFixed(2));
              player.lastTransferID = transferPlayer.id;
              transferPlayer.lastTransferID = player.id;
              transferPlayer.money = Number(parseFloat(transferPlayer.money).toFixed(2));
              caller.bot.createMessage(command.msg.channel.id, {
                embed: {
                  color: 3447003,
                  author: {},
                  fields: [{
                    name: 'From',
                    inline: false,
                    value: player.name + "\nBalance Prior: $" + numeral(pbalbef).format('0,0.00') + "\nBalance After: $" + numeral(player.money).format('0,0.00'),
                  }, {
                    name: 'To',
                    inline: false,
                    value: transferPlayer.name + "\nBalance Prior: $" + numeral(sbalbef).format('0,0.00') + "\nBalance After: $" + numeral(transferPlayer.money).format('0,0.00'),
                  }, {
                    name: 'Amount',
                    inline: true,
                    value: "$ " + numeral(toTransfer).format('0,0.00'),
                  }, {
                    name: "Status",
                    inline: false,
                    value: ":white_check_mark: Transfer complete!",
                  }],
                  footer: {}
                }
              });
              caller.utils.updatePlayer(transferPlayer);
              caller.utils.updatePlayerLastMessage(player);
              caller.utils.updatePlayer(player);
              caller.Webhookcslog({
                embeds: [{
                  color: 1433628,
                  title: 'Money Transfer',
                  fields: [{
                    name: "Amount",
                    value: numeral(toTransfer).format('$0,0.00')
                  }, {
                    name: "Giver: " + player.name + " " + player.id,
                    value: `**Before:** ${numeral(pbalbef).format('$0,0.00')}\n**After:** ${numeral(player.money).format('$0,0.00')}`
                  }, {
                    name: "Receiver: " + transferPlayer.name + " " + transferPlayer.id,
                    value: `**Before:** ${numeral(sbalbef).format('$0,0.00')}\n**After:** ${numeral(transferPlayer.money).format('$0,0.00')}`
                  }],
                  timestamp: new Date()
                }]
              })
              return;
            }
          } else {
            caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: Please enter a number for the transfer amount! example `cs/transfer FireGamer3 100`", 16772880);
          }
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
        }
      }).catch(function(err) {
        console.log(err);
        caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.\n" + err, 16772880);
      });
    } else {
      caller.utils.sendCompactEmbed(command.msg.channel, "transfer", "This command allows you to transfer money from one person to another as long as the other person is lv 3. Example `cs/transfer FireGamer3 100`");
    }
  }).catch(function(err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.\n" + err, 16772880);
  });
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "command" //command or game
  };
};
