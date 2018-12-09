const uniqid = require('uniqid');
const numeral = require('numeral');
const snekfetch = require('snekfetch');
const logger = require('disnode-logger');

exports.Run = function(caller, command) {
  var self = this;
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    if (!player.rules) {
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.common.acceptRules[0] + command.prefix + pack.common.acceptRules[1]);
      return;
    }
    if (caller.utils.checkBan(player, command)) return;
    if (player.Admin || player.Mod) {} else {
      if (command.msg.channel.id === '455214682232586240' && command.params[0] === 'self') {} else {
        if (!caller.utils.doChannelCheck(command)) {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.common.channelCheck, 16772880);
          return;
        }
      }
    }
    var timeoutInfo = caller.utils.checkTimeout(player);
    if (!timeoutInfo.pass) {
      logger.Info("Casino", "Market", "Player: " + player.name + " Tried the market before their delay of: " + timeoutInfo.remain);
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
      caller.utils.updatePlayer(player);
      return;
    }
    if (player.lv < 5) {
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.lvl5, 16772880);
      return
    }
    switch (command.params[0]) {
      case 'sell':
        if (command.params[1] == undefined || command.params[2] == undefined) {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.sell.noAmount[0] + command.prefix + pack.marketCommand.sell.noAmount[1], 16772880);
          return
        }
        var numKeys = numeral(command.params[1]).value();
        var price = numeral(command.params[2]).value();
        numKeys = Math.ceil(numKeys)
        //key validator
        if (numKeys > 0) {
          if (numKeys <= 25) {
            if (player.keys >= numKeys) {
              //price validator
              if (price >= 1) {
                var ppk = numeral(price / numKeys).value();
                if (ppk <= 500000000) {
                  //all good as far as params
                  caller.utils.playerTransactionCount(command).then(function(count) {
                    var MAXCount = (player.Premium) ? 6 : 3
                    if (count < MAXCount) {
                      //player has more space.
                      player.keys -= parseInt(numKeys);
                      var prepobj = {
                        pid: player.id,
                        amount: parseInt(numKeys),
                        id: uniqid.time(),
                        price: price,
                        ppk: ppk
                      };
                      caller.DB.Insert('market', prepobj).then(function() {
                        //transaction posted.
                        caller.utils.updatePlayerLastMessage(player);
                        caller.utils.updatePlayer(player);
                        caller.bot.createMessage(command.msg.channel.id, {
                          embed: {
                            color: 1433628,
                            title: pack.marketCommand.sell.title + prepobj.id,
                            fields: [{
                              name: pack.marketCommand.sell.keys,
                              inline: true,
                              value: numeral(numKeys).format('0,0'),
                            }, {
                              name: pack.marketCommand.sell.price,
                              inline: true,
                              value: numeral(price).format('$0,0.00'),
                            }, {
                              name: pack.marketCommand.sell.ppk,
                              inline: true,
                              value: numeral(ppk).format('$0,0.00'),
                            }]
                          }
                        });
                        caller.Webhookcslog({
                          embeds: [{
                            color: 1433628,
                            title: numKeys + ' Keys Listed',
                            description: `ID: ${prepobj.id}`,
                            fields: [{
                              name: "Price",
                              value: numeral(price).format('$0,0.00')
                            }, {
                              name: "PPK",
                              value: numeral(ppk).format('$0,0.00')
                            }, {
                              name: "Seller: " + player.name,
                              value: `**Keys Left:** ${player.keys}\n**Money:** ${numeral(player.money).format('$0,0.00')}`
                            }],
                            timestamp: new Date()
                          }]
                        })
                      }).catch(function() {
                        caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.sell.problem, 16772880);
                        return;
                      });
                    } else {
                      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.sell.max + MAXCount, 16772880);
                      return;
                    }
                  });
                } else {
                  caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.sell.highppk[0] + numeral((numKeys * 500000000)).format('$0,0.00') + pack.marketCommand.sell.highppk[1], 16772880);
                  return;
                }
              } else {
                caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.sell.lowPrice, 16772880);
                return;
              }
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.sell.noKeys[0] + player.keys + pack.marketCommand.sell.noKeys[1], 16772880);
              return;
            }
          } else {
            caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.sell.valid, 16772880);
            return;
          }
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.sell.valid, 16772880);
          return;
        }
        break;
      case "self":
        var pid = player.id;
        caller.DB.Find("market", {
          'pid': pid
        }).then(function(trans) {
          if (trans.length == 0) {
            caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.self.noListings, 16772880);
            return;
          } else {
            var page = (command.params[2] == undefined) ? 1 : numeral(command.params[2]).value()
            var results = caller.utils.pageArray(trans, page, 9);
            if (results.length != 0) {
              var fields = [];
              for (var i = 0; i < results.length; i++) {
                fields.push({
                  name: pack.marketCommand.listTitle + results[i].id,
                  inline: true,
                  value: pack.marketCommand.listDesc[0] + results[i].amount + pack.marketCommand.listDesc[1] + numeral(results[i].price).format('$0,0.00') + pack.marketCommand.listDesc[2] + numeral(results[i].ppk).format('$0,0.00')
                })
              }
              caller.bot.createMessage(command.msg.channel.id, {
                embed: {
                  color: 1433628,
                  title: pack.marketCommand.title,
                  fields: fields
                }
              })
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.noListings, 16772880);
              return;
            }
          }
        });
        break;
      case 'find':
        if (command.params[1] != undefined) {
          var pid = caller.utils.parseMention(command.params[1]);
          caller.DB.Find("market", {
            'pid': pid
          }).then(function(trans) {
            if (trans.length == 0) {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.find.nofind, 16772880);
              return;
            } else {
              var page = (command.params[2] == undefined) ? 1 : numeral(command.params[2]).value()
              var results = caller.utils.pageArray(trans, page, 9);
              if (results.length != 0) {
                var fields = [];
                for (var i = 0; i < results.length; i++) {
                  fields.push({
                    name: pack.marketCommand.listTitle + results[i].id,
                    inline: true,
                    value: pack.marketCommand.listDesc[0] + results[i].amount + pack.marketCommand.listDesc[1] + numeral(results[i].price).format('$0,0.00') + pack.marketCommand.listDesc[2] + numeral(results[i].ppk).format('$0,0.00')
                  })
                }
                caller.bot.createMessage(command.msg.channel.id, {
                  embed: {
                    color: 1433628,
                    title: pack.marketCommand.title,
                    fields: fields
                  }
                })
              } else {
                caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.noListings, 16772880);
                return;
              }
            }
          });
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.find.noinput[0] + command.prefix + pack.marketCommand.find.noinput[1], 16772880);
          return;
        }
        break;
      case "list":
        caller.DB.FindSort("market", {}, {
          ppk: +1
        }).then(function(trans) {
          var page = (command.params[1] == undefined) ? 1 : numeral(command.params[1]).value();
          var results = caller.utils.pageArray(trans, page, 9);
          if (results.length != 0) {
            var fields = [];
            for (var i = 0; i < results.length; i++) {
              fields.push({
                name: pack.marketCommand.listTitle + results[i].id,
                inline: true,
                value: pack.marketCommand.listDesc[0] + results[i].amount + pack.marketCommand.listDesc[1] + numeral(results[i].price).format('$0,0.00') + pack.marketCommand.listDesc[2] + numeral(results[i].ppk).format('$0,0.00')
              })
            }
            caller.bot.createMessage(command.msg.channel.id, {
              embed: {
                color: 1433628,
                title: pack.marketCommand.title,
                fields: fields
              }
            })
          } else {
            caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.noListings, 16772880);
            return;
          }
        });
        break;
      case "buy":
        if (command.params[1] == undefined) {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.buy.noid[0] + command.prefix + pack.marketCommand.buy.noid[1], 16772880);
          return
        }
        var transid = command.params[1];
        caller.DB.Find("market", {
          id: transid
        }).then(function(trans) {
          if (trans[0] != undefined) {
            var t = trans[0];
            if (t.pid == player.id) {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.buy.own, 16772880);
              return;
            } else {
              if (player.money >= t.price) {
                caller.utils.findPlayer(t.pid).then(function(res) {
                  if (res.found) {
                    var tp = res.p;
                    player.money -= t.price;
                    tp.money += t.price;
                    player.keys += t.amount;
                    caller.DB.Delete('market', {
                      id: t.id
                    });
                    var user = caller.bot.users.find(function(a) {
                      return a.id == tp.id;
                    });
                    
                    caller.utils.sendCompactEmbed(command.msg.channel, pack.marketCommand.buy.title, pack.marketCommand.buy.desc[0] + t.amount + pack.marketCommand.buy.desc[1] + numeral(t.price).format('$0,0.00'));
                    caller.utils.updatePlayerLastMessage(player);
                    caller.utils.updatePlayer(player);
                    caller.utils.updatePlayer(tp);
                    caller.Webhookcslog({
                      embeds: [{
                        color: 1433628,
                        title: t.amount + ' Keys Bought',
                        description: `ID: ${t.id}`,
                        fields: [{
                          name: "Price",
                          value: numeral(t.price).format('$0,0.00')
                        }, {
                          name: "PPK",
                          value: numeral(t.ppk).format('$0,0.00')
                        }, {
                          name: "Buyer: " + player.name,
                          value: `**Keys:** ${player.keys}\n**Money:** ${numeral(player.money).format('$0,0.00')}`
                        }, {
                          name: "Seller: " + tp.name,
                          value: `**Keys:** ${tp.keys}\n**Money:** ${numeral(tp.money).format('$0,0.00')}`
                        }],
                        timestamp: new Date()
                      }]
                    })
                    caller.bot.getDMChannel(tp.id).then(function(dmc) {
                      caller.utils.sendCompactEmbed(dmc, `Bought by: ${player.name}`, `Your transaction ${t.id} has been bought! You received ${numeral(t.price).format('$0,0.00')}`);
                    }).catch(function() {

                    });
                  }
                });
              } else {
                caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.buy.nomoney + numeral(player.money).format('0,0.00'), 16772880);
                return;
              }
            }
          } else {
            caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.buy.notrans, 16772880);
            return;
          }
        });
        break;
      case "cancel":
        if (command.params[1] != undefined) {
          caller.DB.Find('market', {
            id: command.params[1]
          }).then((trans) => {
            if (trans[0] != undefined) {
              var transobj = trans[0];
              if (transobj.pid == command.msg.author.id) {
                player.keys += transobj.amount;
                caller.utils.updatePlayerLastMessage(player);
                caller.utils.updatePlayer(player);
                caller.DB.Delete('market', {
                  id: command.params[1]
                })
                caller.bot.createMessage(command.msg.channel.id, {
                  embed: {
                    color: 1433628,
                    title: pack.marketCommand.cancel.title,
                    description: pack.marketCommand.cancel.desc[0] + transobj.amount + pack.marketCommand.cancel.desc[1]
                  }
                })
              } else {
                caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.cancel.noown, 16772880);
                return;
              }
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.cancel.notrans, 16772880);
              return;
            }
          })
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.marketCommand.buy.noid[0] + command.prefix + pack.marketCommand.buy.noid[1], 16772880);
          return;
        }
        break;
      default:
        caller.bot.createMessage(command.msg.channel.id, {
          embed: {
            color: 3447003,
            title: pack.marketCommand.helpTitle,
            description: command.prefix + pack.marketCommand.helpDesc[0] + command.prefix + pack.marketCommand.helpDesc[1] + command.prefix + pack.marketCommand.helpDesc[2] + command.prefix + pack.marketCommand.helpDesc[3] + command.prefix + pack.marketCommand.helpDesc[4] + command.prefix + pack.marketCommand.helpDesc[5]
          }
        })
    }
  });
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "command" //command or game
  };
};
