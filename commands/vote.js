const numeral = require('numeral');
const logger = require('disnode-logger');

exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    if (player.bank == undefined) {
      player.bank = 0;
    }
    //rewardType
    //  0 money
    //  1 xp
    //  2 income
    //  3 Level
    var rewardType = [
      "Money","XP","Income","Keys"
    ]
    var rewards = [
      {votes:1,rewardType:0,rewardAmount:0.05},{votes:2,rewardType:1,rewardAmount:0.05},
      {votes:3,rewardType:2,rewardAmount:0.05},{votes:4,rewardType:3,rewardAmount:1},
      {votes:10,rewardType:0,rewardAmount:0.1},{votes:11,rewardType:1,rewardAmount:0.1},
      {votes:12,rewardType:2,rewardAmount:0.19},{votes:13,rewardType:3,rewardAmount:1},
      {votes:20,rewardType:0,rewardAmount:0.15},{votes:21,rewardType:1,rewardAmount:0.15},
      {votes:22,rewardType:2,rewardAmount:0.15},{votes:23,rewardType:3,rewardAmount:2},
      {votes:30,rewardType:0,rewardAmount:0.25},{votes:31,rewardType:1,rewardAmount:0.25},
      {votes:32,rewardType:2,rewardAmount:0.25},{votes:33,rewardType:3,rewardAmount:2},
      {votes:40,rewardType:0,rewardAmount:0.35},{votes:41,rewardType:1,rewardAmount:0.35},
      {votes:42,rewardType:2,rewardAmount:0.35},{votes:43,rewardType:3,rewardAmount:3},
      {votes:50,rewardType:0,rewardAmount:0.50},{votes:51,rewardType:1,rewardAmount:0.50},
      {votes:52,rewardType:2,rewardAmount:0.50},{votes:53,rewardType:3,rewardAmount:4},
      {votes:60,rewardType:0,rewardAmount:0.60},{votes:61,rewardType:1,rewardAmount:0.60},
      {votes:62,rewardType:2,rewardAmount:0.60},{votes:63,rewardType:3,rewardAmount:5},
      {votes:70,rewardType:0,rewardAmount:0.75},{votes:71,rewardType:1,rewardAmount:0.75},
      {votes:72,rewardType:2,rewardAmount:0.75},{votes:73,rewardType:3,rewardAmount:10},
      {votes:80,rewardType:0,rewardAmount:1},{votes:81,rewardType:1,rewardAmount:1},
      {votes:82,rewardType:2,rewardAmount:1},{votes:83,rewardType:3,rewardAmount:20},
      {votes:90,rewardType:0,rewardAmount:1.25},{votes:91,rewardType:1,rewardAmount:1.25},
      {votes:92,rewardType:2,rewardAmount:1.25},{votes:93,rewardType:3,rewardAmount:30},
      {votes:100,rewardType:0,rewardAmount:1.50},{votes:101,rewardType:1,rewardAmount:1.20},
      {votes:102,rewardType:2,rewardAmount:1.50},{votes:103,rewardType:3,rewardAmount:60},
      {votes:110,rewardType:0,rewardAmount:1.50},{votes:111,rewardType:1,rewardAmount:1.50},
      {votes:112,rewardType:2,rewardAmount:1.50},{votes:113,rewardType:3,rewardAmount:120},
    ]
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
    var timeoutInfo = caller.utils.checkTimeout(player);
    if (!timeoutInfo.pass) {
      logger.Info("Casino", "Dice", "Player: " + player.name + " Tried the dice before their delay of: " + timeoutInfo.remain);
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
      caller.utils.updatePlayer(player);
      return;
    }
    if(player.votetier == undefined)player.votetier = -1;
    if(player.voteCount == undefined)player.voteCount = 0;
    switch (command.params[0] ) {
      case "redeem":
        var msg = "";
        var toclaim = [];
        for (var i = 0; i < rewards.length; i++) {
          if (player.voteCount >= rewards[i].votes && player.votetier < i) {
            toclaim.push(i);
          }
          if (player.voteCount < rewards[i].votes) {
            break;
          }
        }
        for (var i = 0; i < toclaim.length; i++) {
          var reward = rewards[toclaim[i]];
          switch (reward.rewardType) {
            case 0:
              var r = player.money * reward.rewardAmount
              player.money += r;
              msg += "Tier " + toclaim[i] + ", Reward " + numeral(r).format('$0,0.00') + "\n";
              break;
            case 1:
              var r = player.xp * reward.rewardAmount
              player.xp += r;
              msg += "Tier " + toclaim[i] + ", Reward " + numeral(r).format('0,0') + " XP\n";
              break;
            case 2:
              var r = player.income * reward.rewardAmount
              player.income += r;
              msg += "Tier " + toclaim[i] + ", Reward " + numeral(r).format('$0,0.00') + " Income\n";
              break;
            case 3:
              player.keys += reward.rewardAmount;
              msg += "Tier " + toclaim[i] + ", Reward " + numeral(reward.rewardAmount).format('0,0') + " Keys\n";
              break;
          }
        }
        if (toclaim.length != 0) {
          player.votetier = toclaim[toclaim.length - 1];
          caller.utils.sendCompactEmbed(command.msg.channel, "Redeemed","You have redeemed:\n" + msg);
        }else {
          caller.utils.sendCompactEmbed(command.msg.channel, "Not Redeemed","There was nothing to redeem!");
        }
        caller.utils.checkLV(player, command.msg.channel);
        caller.utils.updatePlayer(player);
        break;
      default:
        if (player.votetier == -1) {
          var current = "No Tier";
        }else {
          var current = "Tier " + player.votetier;
        }
        if (player.votetier + 1 > rewards.length - 1) {
          var next = "No Tier";
        }else {
          var next = "Tier " + (player.votetier + 1) + " with a requirement of " + rewards[player.votetier + 1].votes + " votes."
        }
        caller.bot.createMessage(command.msg.channel.id, {
          embed: {
            color: 1433628,
            title: player.name + " Vote Rewards!",
            fields: [{
              name: "Vote!",
              inline: false,
              value: "You can vote for casino bot to get some cool perks each vote gets you $100,000 * the number of times you have voted, Along with that you can also get tier rewards based on how many votes you have! Vote now! https://discordbots.org/bot/casino/vote",
            },{
              name: "Current Tier",
              inline: true,
              value: current,
            },{
              name: "Next Tier",
              inline: true,
              value: next,
            },{
              name: "Your Votes",
              inline: true,
              value: player.voteCount,
            },{
              name: "Redeem",
              inline: true,
              value: "You can redeem rewards by using `" + command.prefix + "vote redeem`",
            }]
          }
        })
        caller.utils.checkLV(player, command.msg.channel);
        caller.utils.updatePlayer(player);
    }
  });
};
exports.settings = function () {
  return {
    show: true, // show in help true false
    type: "command" //command or game
  };
};
