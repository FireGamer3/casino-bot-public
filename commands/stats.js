exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    if(!player.rules){
      caller.utils.sendCompactEmbed(pack.common.errorTitle, pack.common.acceptRules[0] + command.prefix + pack.common.acceptRules[1]);
      return;
    }
    if (caller.utils.checkBan(player, command)) return;
    if (player.Admin || player.Mod) {} else {
      if (!caller.utils.doChannelCheck(command)) {
        caller.utils.sendCompactEmbed(command.msg.channel,command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
        return;
      }
    }
    if(command.params[0]){
      caller.utils.findPlayer(command.params[0]).then(function(res) {
        if(res.found){
        var slotstats = "**Slot -=- Wins / Plays**:\t  " + res.p.stats.slotWins + " / " + res.p.stats.slotPlays + "\n" +
          "**Slot Wins**:\n " +
          ":cherries: **Single cherries**: " + res.p.stats.slotSingleC + "\n" +
          ":cherries: :cherries: :cherries: **Triple cherries**: " + res.p.stats.slotTripleC + "\n" +
          ":third_place: :third_place: :third_place: **Triple 3\'s**: " + res.p.stats.slot3s + "\n" +
          ":second_place: :second_place: :second_place: **Triple 2\'s**: " + res.p.stats.slot2s + "\n" +
          ":first_place: :first_place: :first_place: **Triple 1\'s**: " + res.p.stats.slot1s + "\n" +
          ":100: :100: :100: **JACKPOTS**: " + res.p.stats.slotJackpots + "\n\n";
        var coinstats = "**Coin Flip -=- Wins / Plays**:\t  " + res.p.stats.coinWins + " / " + res.p.stats.coinPlays + "\n\n" +
          "**Coin Landed on Heads**: " + res.p.stats.coinHeads + "\n" +
          "**Coin Landed on Tails**: " + res.p.stats.coinTails;
        var wheelStats = "**The Wheel -=- Plays / Wins**:\t" + res.p.stats.wheelPlays + " / " + +res.p.stats.wheelWins + "\n\n" +
          "**General Wheel Stats -=- Won with / Landed On**\n" +
          "**0**: " + res.p.stats.wheel0 + " / " + res.p.stats.wheelLanded0 + "\n" +
          "**Number other than 0**: " + res.p.stats.wheelNumber + " / " + res.p.stats.wheelLandedNumber + "\n" +
          "**1st, 2nd, 3rd**: " + res.p.stats.wheelsections + " / " + res.p.stats.wheelLandedsections + "\n" +
          "**High, Low**: " + res.p.stats.wheellowhigh + " / " + res.p.stats.wheelLandedlowhigh + "\n" +
          "**Even, Odd**: " + res.p.stats.wheelevenodd + " / " + res.p.stats.wheelLandedevenodd + "\n" +
          "**Red, Black**: " + res.p.stats.wheelcolor + " / " + res.p.stats.wheelLandedcolor;
          caller.bot.createMessage(command.msg.channel.id, {embed:{
            color: 1433628,
            author: {},
            title: res.p.name + " Stats",
            fields: [{
              name: 'Slots',
              inline: true,
              value: slotstats,
            }, {
              name: 'Wheel',
              inline: true,
              value: wheelStats,
            }, {
              name: 'Coin Flip',
              inline: true,
              value: coinstats,
            }],
            footer: {}
          }})
        }else {
          caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: Player card Not Found Please @mention the user you are trying to send to or make sure you have the correct name if not using a @mention! Also make sure they have a account on the game!\n\n" + res.msg, 16772880);
        }
      });
    }else {
    var slotstats = "**Slot -=- Wins / Plays**:\t  " + player.stats.slotWins + " / " + player.stats.slotPlays + "\n" +
      "**Slot Wins**:\n " +
      ":cherries: **Single cherries**: " + player.stats.slotSingleC + "\n" +
      ":cherries: :cherries: :cherries: **Triple cherries**: " + player.stats.slotTripleC + "\n" +
      ":third_place: :third_place: :third_place: **Triple 3\'s**: " + player.stats.slot3s + "\n" +
      ":second_place: :second_place: :second_place: **Triple 2\'s**: " + player.stats.slot2s + "\n" +
      ":first_place: :first_place: :first_place: **Triple 1\'s**: " + player.stats.slot1s + "\n" +
      ":100: :100: :100: **JACKPOTS**: " + player.stats.slotJackpots + "\n\n";
    var coinstats = "**Coin Flip -=- Wins / Plays**:\t  " + player.stats.coinWins + " / " + player.stats.coinPlays + "\n\n" +
      "**Coin Landed on Heads**: " + player.stats.coinHeads + "\n" +
      "**Coin Landed on Tails**: " + player.stats.coinTails;
    var wheelStats = "**The Wheel -=- Plays / Wins**:\t" + player.stats.wheelPlays + " / " + +player.stats.wheelWins + "\n\n" +
      "**General Wheel Stats -=- Won with / Landed On**\n" +
      "**0**: " + player.stats.wheel0 + " / " + player.stats.wheelLanded0 + "\n" +
      "**Number other than 0**: " + player.stats.wheelNumber + " / " + player.stats.wheelLandedNumber + "\n" +
      "**1st, 2nd, 3rd**: " + player.stats.wheelsections + " / " + player.stats.wheelLandedsections + "\n" +
      "**High, Low**: " + player.stats.wheellowhigh + " / " + player.stats.wheelLandedlowhigh + "\n" +
      "**Even, Odd**: " + player.stats.wheelevenodd + " / " + player.stats.wheelLandedevenodd + "\n" +
      "**Red, Black**: " + player.stats.wheelcolor + " / " + player.stats.wheelLandedcolor;
      caller.bot.createMessage(command.msg.channel.id, {embed:{
        color: 1433628,
        author: {},
        fields: [{
          name: 'Slots',
          inline: true,
          value: slotstats,
        }, {
          name: 'Wheel',
          inline: true,
          value: wheelStats,
        }, {
          name: 'Coin Flip',
          inline: true,
          value: coinstats,
        }],
        footer: {}
      }})
    }
  }).catch(function(err) {
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
