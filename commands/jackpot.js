const numeral = require('numeral');

exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    caller.utils.getCasinoObj().then(function(casinoObj) {
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
      if (player.tower != undefined) {
        if ((player.money + (player.bank / 2) + player.tower.bet) > 8500) {
          var minJackpotBet = ((player.money + (player.bank /2) + player.tower.bet) * 0.03);
        } else var minJackpotBet = 250;
      }else {
        if ((player.money + (player.bank / 2)) > 8500) {
          var minJackpotBet = ((player.money + (player.bank /2)) * 0.03);
        } else var minJackpotBet = 250;
      }
      caller.bot.createMessage(command.msg.channel.id, {embed:{
        color: 1433628,
        author: {},
        fields: [{
          name: pack.jackpotCommand.value,
          inline: true,
          value: "$" + numeral(casinoObj.jackpotValue).format('0,0.00'),
        }, {
          name: pack.jackpotCommand.min,
          inline: false,
          value: "$" + numeral(minJackpotBet).format('0,0.00')
        }, {
          name: pack.jackpotCommand.historyTitle,
          inline: false,
          value: pack.jackpotCommand.historyDesc[0] + casinoObj.jackpotstat.lastWon +  pack.jackpotCommand.historyDesc[1] + numeral(casinoObj.jackpotstat.LatestWin).format('0,0.00'),
        }],
        footer: {}
      }})
    }).catch(function(err) {
      console.log(err);
      caller.utils.sendCompactEmbed(command.msg.channel, "Error cobj", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
    });
  }).catch(function(err) {
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
