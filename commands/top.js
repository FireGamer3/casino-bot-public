const numeral = require('numeral');
const logger = require('disnode-logger');

exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    var pid = player.id;
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
    var idinfo;
    if (player.Mod || player.Admin) {
      idinfo = true;
    }else idinfo = false;
    var timeoutInfo = caller.utils.checkTimeout(player);
    if (!timeoutInfo.pass) {
      logger.Info("Casino", "Top", "Player: " + player.name + " Tried the Top command before their delay of: " + timeoutInfo.remain);
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
      caller.utils.updatePlayer(player);
      return;
    }
    var mode = "";
    if (command.params[0] == undefined) {} else {
      mode = command.params[0].toLowerCase();
    }
    switch (mode) {
      case "income":
        caller.DB.FindSort("players", {banned: false}, {
          income: -1
        }).then(function(players) {
          var page = 1;
          if (command.params[1] && numeral(command.params[1]).value() > 0) {
            var ordered = caller.utils.pageArray(players, numeral(command.params[1]).value(), 20);
            page = numeral(command.params[1]).value();
          } else {
            ordered = caller.utils.pageArray(players, 1, 20);
          }
          var msg = pack.topCommand.page + page + "\n";
          for (var i = 0; i < ordered.length; i++) {
            var player = ordered[i];
            if (page > 1) {
              if (idinfo) {
                msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** ( " + player.id + " ) -=- $" + numeral(player.income).format('0,0.00') + "\n";
              }else msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** -=- $" + numeral(player.income).format('0,0.00') + "\n";
            } else {
              if (idinfo) {
                msg += "" + (i + 1) + ". **" + player.name + "** ( " + player.id + " ) -=- $" + numeral(player.income).format('0,0.00') + "\n";
              }else msg += "" + (i + 1) + ". **" + player.name + "** -=- $" + numeral(player.income).format('0,0.00') + "\n";
            }
          }
          caller.utils.sendCompactEmbed(command.msg.channel, pack.topCommand.order + mode, msg);
        });
        break;
      case "money":
        caller.DB.FindSort("players", {banned: false}, {
          money: -1
        }).then(function(players) {
          var page = 1;
          if (command.params[1] && numeral(command.params[1]).value() > 0) {
            var ordered = caller.utils.pageArray(players, numeral(command.params[1]).value(), 20);
            page = numeral(command.params[1]).value();
          } else {
            ordered = caller.utils.pageArray(players, 1, 20);
          }
          var msg = pack.topCommand.page + page + "\n";
          for (var i = 0; i < ordered.length; i++) {
            var player = ordered[i];
            if (page > 1) {
              if (idinfo) {
                msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** ( " + player.id + " ) -=- $" + numeral(player.money).format('0,0.00') + "\n"
              }else msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** -=- $" + numeral(player.money).format('0,0.00') + "\n";
            } else {
              if (idinfo) {
                msg += "" + (i + 1) + ". **" + player.name + "** ( " + player.id + " ) -=- $" + numeral(player.money).format('0,0.00') + "\n";
              }else msg += "" + (i + 1) + ". **" + player.name + "** -=- $" + numeral(player.money).format('0,0.00') + "\n";
            }
          }
          caller.utils.sendCompactEmbed(command.msg.channel, pack.topCommand.order + mode, msg);
        });
        break;
      case "lv":
        caller.DB.FindSort("players", {banned: false}, {
          lv: -1
        }).then(function(players) {
          var page = 1;
          if (command.params[1] && numeral(command.params[1]).value() > 0) {
            var ordered = caller.utils.pageArray(players, numeral(command.params[1]).value(), 20);
            page = numeral(command.params[1]).value();
          } else {
            ordered = caller.utils.pageArray(players, 1, 20);
          }
          var msg = pack.topCommand.page + page + "\n";
          for (var i = 0; i < ordered.length; i++) {
            var player = ordered[i];
            if (page > 1) {
              if (idinfo) {
                msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** ( " + player.id + " ) -=-" + pack.topCommand.level + player.lv + "\n";
              }else msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** -=-" + pack.topCommand.level + player.lv + "\n";
            } else {
              if (idinfo) {
                msg += "" + (i + 1) + ". **" + player.name + "** ( " + player.id + " ) -=-" + pack.topCommand.level + player.lv + "\n";
              }else msg += "" + (i + 1) + ". **" + player.name + "** -=-" + pack.topCommand.level + player.lv + "\n";
            }
          }
          caller.utils.sendCompactEmbed(command.msg.channel, pack.topCommand.order + mode, msg);
        });
        break;
      case "jackpot":
        caller.DB.FindSort("players", {banned: false}, {
          'stats.slotJackpots': -1
        }).then(function(players) {
          var page = 1;
          if (command.params[1] && numeral(command.params[1]).value() > 0) {
            var ordered = caller.utils.pageArray(players, numeral(command.params[1]).value(), 20);
            page = numeral(command.params[1]).value();
          } else {
            ordered = caller.utils.pageArray(players, 1, 20);
          }
          var msg = pack.topCommand.page + page + "\n";
          for (var i = 0; i < ordered.length; i++) {
            var player = ordered[i];
            if (page > 1) {
              if (idinfo) {
                msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** ( " + player.id + " ) -=-" + player.stats.slotJackpots + pack.topCommand.jackpot + "\n";
              } else msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** -=-" + player.stats.slotJackpots + pack.topCommand.jackpot + "\n";
            } else {
              if (idinfo) {
                msg += "" + (i + 1) + ". **" + player.name + "** ( " + player.id + " ) -=-" + player.stats.slotJackpots + pack.topCommand.jackpot + "\n";
              } else msg += "" + (i + 1) + ". **" + player.name + "** -=-" + player.stats.slotJackpots + pack.topCommand.jackpot + "\n";
            }
          }
          caller.utils.sendCompactEmbed(command.msg.channel, pack.topCommand.order + mode, msg);
        });
        break;
      case "timeout":
        caller.DB.FindSort("players", {banned: false}, {
          seconds: -1
        }).then(function(players) {
          var page = 1;
          if (command.params[1] && numeral(command.params[1]).value() > 0) {
            var ordered = caller.utils.pageArray(players, numeral(command.params[1]).value(), 20);
            page = numeral(command.params[1]).value();
          } else {
            ordered = caller.utils.pageArray(players, 1, 20);
          }
          var msg = pack.topCommand.page + page + "\n";
          for (var i = 0; i < ordered.length; i++) {
            var player = ordered[i];
            if (page > 1) {
              if (idinfo) {
                msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** ( " + player.id + " )  -=- " + player.seconds + pack.topCommand.seconds + "\n";
              }else msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** -=- " + player.seconds + pack.topCommand.seconds + "\n";
            } else {
              if (idinfo) {
                msg += "" + (i + 1) + ". **" + player.name + "** ( " + player.id + " ) -=- " + player.seconds + pack.topCommand.seconds + "\n";
              }else msg += "" + (i + 1) + ". **" + player.name + "** -=- " + player.seconds + pack.topCommand.seconds + "\n";
            }
          }
          caller.utils.sendCompactEmbed(command.msg.channel, pack.topCommand.order + mode, msg);
        });
        break;
      case "keys":
        caller.DB.FindSort("players", {banned: false}, {
          keys: -1
        }).then(function(players) {
          var page = 1;
          if (command.params[1] && numeral(command.params[1]).value() > 0) {
            var ordered = caller.utils.pageArray(players, numeral(command.params[1]).value(), 20);
            page = numeral(command.params[1]).value();
          } else {
            ordered = caller.utils.pageArray(players, 1, 20);
          }
          var msg = pack.topCommand.page + page + "\n";
          for (var i = 0; i < ordered.length; i++) {
            var player = ordered[i];
            if (page > 1) {
              if (idinfo) {
                msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** ( " + player.id + " ) -=- " + player.keys + pack.topCommand.keys + "\n";
              }else msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** -=- " + player.keys + pack.topCommand.keys + "\n";
            } else {
              if (idinfo) {
                msg += "" + (i + 1) + ". **" + player.name + "** ( " + player.id + " ) -=- " + player.keys + pack.topCommand.keys + "\n";
              }else msg += "" + (i + 1) + ". **" + player.name + "** -=- " + player.keys + pack.topCommand.keys + "\n";
            }
          }
          caller.utils.sendCompactEmbed(command.msg.channel, pack.topCommand.order + mode, msg);
        });
        break;
      case "prestige":
        caller.DB.FindSort("players", {banned: false}, {
          "prestige.lv": -1
        }).then(function(players) {
          var page = 1;
          if (command.params[1] && numeral(command.params[1]).value() > 0) {
            var ordered = caller.utils.pageArray(players, numeral(command.params[1]).value(), 20);
            page = numeral(command.params[1]).value();
          } else {
            ordered = caller.utils.pageArray(players, 1, 20);
          }
          var msg = pack.topCommand.page + page + "\n";
          for (var i = 0; i < ordered.length; i++) {
            var player = ordered[i];
            if (page > 1) {
              if (idinfo) {
                msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** ( " + player.id + " ) -=-" + pack.topCommand.prestige + player.prestige.lv + "\n";
              }else msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** -=-" + pack.topCommand.prestige + player.prestige.lv + "\n";
            } else {
              if (idinfo) {
                msg += "" + (i + 1) + ". **" + player.name + "** ( " + player.id + " ) -=-" + pack.topCommand.prestige + player.prestige.lv + "\n";
              }else msg += "" + (i + 1) + ". **" + player.name + "** -=-" + pack.topCommand.prestige + player.prestige.lv + "\n";
            }
          }
          caller.utils.sendCompactEmbed(command.msg.channel, pack.topCommand.order + mode, msg);
        });
        break;
      case "slots":
        caller.DB.FindSort("players", {banned: false}, {
          "stats.slotPlays": -1
        }).then(function(players) {
          var page = 1;
          if (command.params[1] && numeral(command.params[1]).value() > 0) {
            var ordered = caller.utils.pageArray(players, numeral(command.params[1]).value(), 20);
            page = numeral(command.params[1]).value();
          } else {
            ordered = caller.utils.pageArray(players, 1, 20);
          }
          var msg = pack.topCommand.page + page + "\n";
          for (var i = 0; i < ordered.length; i++) {
            var player = ordered[i];
            if (page > 1) {
              if (idinfo) {
                msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** ( " + player.id + " ) -=-" + numeral(player.stats.slotPlays).format('0,0') + pack.topCommand.slots + "\n";
              }else msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** -=-" + numeral(player.stats.slotPlays).format('0,0') + pack.topCommand.slots + "\n";
            } else {
              if (idinfo) {
                msg += "" + (i + 1) + ". **" + player.name + "** ( " + player.id + " ) -=-" + numeral(player.stats.slotPlays).format('0,0') + pack.topCommand.slots + "\n";
              }else msg += "" + (i + 1) + ". **" + player.name + "** -=-" + numeral(player.stats.slotPlays).format('0,0') + pack.topCommand.slots + "\n";
            }
          }
          caller.utils.sendCompactEmbed(command.msg.channel, pack.topCommand.order + mode, msg);
        });
        break;
      case "votes":
        caller.DB.FindSort("players", {banned: false}, {
          voteCount: -1
        }).then(function(players) {
          var page = 1;
          if (command.params[1] && numeral(command.params[1]).value() > 0) {
            var ordered = caller.utils.pageArray(players, numeral(command.params[1]).value(), 20);
            page = numeral(command.params[1]).value();
          } else {
            ordered = caller.utils.pageArray(players, 1, 20);
          }
          var msg = pack.topCommand.page + page + "\n";
          for (var i = 0; i < ordered.length; i++) {
            var player = ordered[i];
            if (page > 1) {
              if (idinfo) {
                msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** ( " + player.id + " ) -=-" + player.voteCount + pack.topCommand.votes + "\n";
              }else msg += "" + (i + ((page * 20) - 19)) + ". **" + player.name + "** -=-" + player.voteCount + pack.topCommand.votes + "\n";
            } else {
              if (idinfo) {
                msg += "" + (i + 1) + ". **" + player.name + "** ( " + player.id + " ) -=-" + player.voteCount + pack.topCommand.votes + "\n";
              }else msg += "" + (i + 1) + ". **" + player.name + "** -=-" + player.voteCount + pack.topCommand.votes + "\n";
            }
          }
          caller.utils.sendCompactEmbed(command.msg.channel, pack.topCommand.order + mode, msg);
        });
        break;
      default:
        caller.bot.createMessage(command.msg.channel.id, {
          embed: {
            color: 1433628,
            title: 'Top Command',
            fields: pack.topCommand.fields
          }
        })
        return;
    }
  }).catch(function(err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
  });
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "game" //command or game
  };
};
