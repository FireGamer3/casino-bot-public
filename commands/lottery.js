const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    if (!player.rules) {
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.common.acceptRules[0] + command.prefix + pack.common.acceptRules[1]);
      return;
    }
    var timeoutInfo = caller.utils.checkTimeout(player);
    if (!timeoutInfo.pass) {
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
      caller.utils.updatePlayer(player);
      return;
    }
    switch (command.params[0]) {
      case 'buy':
        caller.DB.Find('lottery', {
          id: 'pot'
        }).then(pot => {
          caller.DB.Find('lottery', {
            id: player.id
          }).then(d => {
            if (player.id == pot[0].winnerid) {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.lotteryCommand.buy.error, pack.lotteryCommand.buy.wonlast, 16772880);
              return
            }
            var amount = 1
            if (command.params[1]) {
              amount = (command.params[1].toLowerCase() == 'max') ? 'max' :(numeral(command.params[1]).value() == null) ? 1 : numeral(command.params[1]).value()
            }
            var price = 10000
            if (d[0] != undefined) {
              for (var i = 0; i < d.length; i++) {
                price += (price * 0.05)
              }
            }
            var bought = 1
            var last;
            while (true) {
              if (price > player.money) {
                if (amount == 'max') {
                  bought--;
                  if (bought == 0) {
                    caller.utils.sendCompactEmbed(command.msg.channel, pack.lotteryCommand.buy.error, pack.lotteryCommand.buy.noMoney[0] + 1 + pack.lotteryCommand.buy.noMoney[1] + 0 + pack.lotteryCommand.buy.noMoney[2] + numeral(parseInt(0)).format('$0,0'), 16772880);
                    return
                  }
                  price = last;
                  break;
                }
                caller.utils.sendCompactEmbed(command.msg.channel, pack.lotteryCommand.buy.error, pack.lotteryCommand.buy.noMoney[0] + amount + pack.lotteryCommand.buy.noMoney[1] + (bought - 1) + pack.lotteryCommand.buy.noMoney[2] + numeral(parseInt(last)).format('$0,0'), 16772880);
                return
              } else if (bought == amount) {
                break;
              }
              last = price
              price += (price * 0.05);
              bought++;
            }
            price = parseInt(price)
            player.money -= price
            caller.utils.updateLottery(price)
            caller.DB.InsertMany('lottery', fillArray({
              id: player.id,
              name: player.name
            }, bought))
            caller.DB.Update('players', {
              id: player.id
            }, player);
            caller.utils.sendCompactEmbed(command.msg.channel, pack.lotteryCommand.buy.bought, pack.lotteryCommand.buy.amount[0] + bought + pack.lotteryCommand.buy.amount[1] + numeral(price).format('$0,0'))
          })
        })
        break;
      case 'draw':
        if (player.Admin) {
          caller.DB.Find('lottery', {}).then(lotto => {
            var pot = lotto[0];
            var wpot = JSON.parse(JSON.stringify(lotto[0]));
            var winner = lotto[caller.utils.getRandomIntInclusive(1, lotto.length - 1)];
            caller.DB.Find('players', {
              'id': winner.id
            }).then(p => {
              p[0].money += pot.amount;
              caller.bot.createMessage(command.msg.channel.id, {
                embed: {
                  color: 3447003,
                  title: 'Lottery Draw',
                  description: `Player: ${winner.name} has won the Lottery!`,
                  fields: [{
                    name: 'Pot Amount',
                    inline: true,
                    value: numeral(pot.amount).format('$0,0')
                  }, {
                    name: 'Total Tickets Bought',
                    inline: true,
                    value: (lotto.length - 1)
                  }]
                }
              })
              caller.bot.getDMChannel(p[0].id).then(function(dmc) {
                caller.bot.createMessage(dmc.id, {
                  embed: {
                    color: 1433628,
                    title: `:confetti_ball: YOU WON :confetti_ball:`,
                    description: `You won the lottery and received ${numeral(wpot.amount).format('$0,0')}`
                  }
                })
              });
              pot.amount = 100000;
              pot.winner = `${winner.name} ~~-~~ ${numeral(wpot.amount).format('$0,0')}`
              pot.winnerid = winner.id
              caller.DB.Drop('lottery').then(res => {
                if (!res) {
                  console.error('unable to drop collection lottery')
                }
                caller.DB.Insert('lottery', pot);
                caller.DB.Update('players', {
                  id: p[0].id
                }, p[0]);
              })

            });
          });
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.lotteryCommand.drawErrorTitle, pack.lotteryCommand.drawErrorDesc, 16772880);
        }
        break;
      default:
        caller.DB.Find('lottery', {}).then(d => {
          var playertickets = 0;
          for (var i = 0; i < d.length; i++) {
            if (d[i].id == player.id) {
              playertickets++;
            }
          }
          var percent = (playertickets/(d.length - 1)) * 100;
          console.log(percent);
          var price = 10000;
          for (var i = 0; i < playertickets; i++) {
            price += (price * 0.05)
          }
          caller.utils.getLotteryPot().then(p => {
            caller.bot.createMessage(command.msg.channel.id, {
              embed: {
                color: 3447003,
                title: pack.lotteryCommand.title,
                description: pack.lotteryCommand.desc[0] + command.prefix + pack.lotteryCommand.desc[1],
                fields: [{
                  name: pack.lotteryCommand.amount,
                  inline: true,
                  value: numeral(p).format('$0,0.00')
                }, {
                  name: pack.lotteryCommand.bought,
                  inline: true,
                  value: (d.length - 1)
                }, {
                  name: pack.lotteryCommand.last,
                  inline: true,
                  value: d[0].winner
                }, {
                  name: pack.lotteryCommand.playertickets,
                  inline: true,
                  value: numeral(playertickets).format('0,0')
                }, {
                  name: pack.lotteryCommand.percent,
                  inline: true,
                  value: numeral(percent).format('0.00%')
                }, {
                  name: pack.lotteryCommand.price,
                  inline: true,
                  value: numeral(price).format('$0,0.00')
                }]
              }
            })
          })
        })
    }
  });
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "game" //command or game
  };
};

function fillArray(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}
