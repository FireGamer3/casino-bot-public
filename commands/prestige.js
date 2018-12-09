const date = require('dateformat');
const table = require('text-table');
const numeral = require('numeral');
const cs = require('../casinoStuff');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    if(!player.rules){
      caller.utils.sendCompactEmbed(command.msg.channel,pack.common.errorTitle, pack.common.acceptRules[0] + command.prefix + pack.common.acceptRules[1]);
      return;
    }
    if (caller.utils.checkBan(player, command)) return;
    if (player.Admin || player.Mod) {} else {
      if (!caller.utils.doChannelCheck(command)) {
        caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Please use the <#269839796069859328> channel for this command", 16772880);
        return;
      }
    }
    if (!player.prestige) {
      player.prestige = {
        lv: 0,
        incomeMult: 1,
        payoutMult: 1,
        last: null,
        tokens: 0
      }
      caller.DB.Update('players', {
        id: player.id
      }, player);
    }
    switch (command.params[0]) {
      case 'info':
      if (command.params[1]) {
        caller.utils.findPlayer(command.params[1]).then(function(res) {
          if (res.found) {
            caller.bot.createMessage(command.msg.channel.id, {
              embed: {
                color: 3447003,
                title: res.p.name + `'s Prestige Info`,
                fields: [{
                  name: 'Prestige',
                  inline: true,
                  value: res.p.prestige.lv
                }, {
                  name: 'Tokens',
                  inline: true,
                  value: res.p.prestige.tokens
                }, {
                  name: 'Last Prestige',
                  inline: true,
                  value: (res.p.prestige.last == null) ? 'Never' : date(new Date(res.p.prestige.last), "mmmm dS, yyyy")
                }, {
                  name: 'Income Multiplier',
                  inline: true,
                  value: `x ${res.p.prestige.incomeMult.toFixed(2)}`
                }, {
                  name: 'Payout Multiplier',
                  inline: true,
                  value: `x ${res.p.prestige.payoutMult.toFixed(2)}`
                }]
              }
            })
          } else {
            caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
          }
        })
      } else {
        caller.bot.createMessage(command.msg.channel.id, {
          embed: {
            color: 3447003,
            title: player.name + `'s Prestige Info`,
            fields: [{
              name: 'Prestige',
              inline: true,
              value: player.prestige.lv
            }, {
              name: 'Tokens',
              inline: true,
              value: player.prestige.tokens
            }, {
              name: 'Last Prestige',
              inline: true,
              value: (player.prestige.last == null) ? 'Never' : date(new Date(player.prestige.last), "mmmm dS, yyyy")
            }, {
              name: 'Income Multiplier',
              inline: true,
              value: `x ${player.prestige.incomeMult.toFixed(2)}`
            }, {
              name: 'Payout Multiplier',
              inline: true,
              value: `x ${player.prestige.payoutMult.toFixed(2)}`
            }]
          }
        })
      }
        break;
      case 'advance':
        if (player.lv >= 100) {
          var tokens = (Math.round(player.lv * 0.2) + Math.round(player.xp / 250000) + Math.round(Math.pow(player.income, 1/8)));
          caller.bot.createMessage(command.msg.channel.id, {
            embed: {
              color: 16772880,
              title: 'Prestige',
              description: 'Are you sure that you want to prestige?\nIf so: your money, income, XP, crates, keys, and level will be reset but receive '+tokens+' tokens.\nIn order to do so, type `yes` or `no` within 15 seconds.'
            }
          }).catch(console.error)
          let timer;
          const handler = (message) => {
            if (message.author.id == player.id && message.channel.id == command.msg.channel.id) {
              if (message.content == 'yes') {
                player.money = 10000;
                player.income = 1000;
                player.maxIncome = 1000;
                player.xp = 0;
                player.lv = 1;
                player.nextlv = 500;
                player.keys = 0;
                player.bank = 0;
                player.crates = [0, 0, 0, 0, 0, 0];
                player.prestige.lv++;
                player.prestige.last = new Date().getTime();
                player.prestige.tokens += tokens;
                caller.utils.updateLastSeen(player);
                caller.utils.updatePlayer(player)
                caller.bot.createMessage(command.msg.channel.id, {
                  embed: {
                    color: 1433628,
                    title: 'Prestige',
                    description: `You have prestiged to prestige ${player.prestige.lv}!`,
                    fields: [{
                      name: 'Tokens Received',
                      inline: true,
                      value: tokens
                    }, {
                      name: 'Total Tokens',
                      inline: true,
                      value: player.prestige.tokens
                    }]
                  }
                });
                caller.bot.removeListener('messageCreate', handler);
                clearTimeout(timer);
              }else {
                caller.utils.sendCompactEmbed(command.msg.channel, `Nothing Changed`, `You didn't prestige.`);
                caller.bot.removeListener('messageCreate', handler);
                clearTimeout(timer);
              }
            }
          };
          caller.bot.on('messageCreate', handler);
          timer = setTimeout(() => {
          caller.bot.removeListener('messageCreate', handler);
          }, 60000);
        } else caller.utils.sendCompactEmbed(command.msg.channel, "Can't prestige", "You must be atleast level 100 before you can prestige.", 16772880);
        break;
      case 'store':
        switch (command.params[1]) {
          case "list":
            var arr = [];
            arr.push(["ID", "ITEM", "COST"]);
            for (var i = 0; i < cs.prestigeStore.length; i++) {
              var cost = cs.prestigeStore[i].cost
              switch (cs.prestigeStore[i].type) {
                case 0:
                  arr.push([i, `Add ${cs.prestigeStore[i].amount} To Your Income Multiplier`, `${cost} Tokens`])
                  break;
                case 1:
                  arr.push([i, `Add ${cs.prestigeStore[i].amount} To Your Payout Multiplier`, `${cost} Tokens`])
                  break;
                default:
                  break;
              }
            }
            var msg = table(arr, {
              align: ['l', 'c', 'r']
            });
            caller.bot.createMessage(command.msg.channel.id,`\`\`\`prolog\nPrestige Store List\n${msg}\n\`\`\``);
            break;
          case 'buy':
            if (command.params[2] && (command.params[2] >= 0 && command.params[2] <= (cs.prestigeStore.length - 1))) {
              var ID = parseInt(command.params[2]);
              var quantity = 0;
              var cost = 0;
              if (command.params[3] == 'max') {
                quantity = Math.floor((player.prestige.tokens / cs.prestigeStore[ID].cost))
              } else quantity = numeral(command.params[3]).value()
              if (quantity < 1) {
                quantity = 1
              }
              cost = Math.floor((cs.prestigeStore[ID].cost * quantity))
              if (cost > player.prestige.tokens) {
                caller.utils.sendCompactEmbed(command.msg.channel, "Not Enough Tokens", `You can't buy ${quantity} as you don't have ${cost} tokens, you have ${player.prestige.tokens} tokens.`, 16772880);
                return;
              }
              switch (cs.prestigeStore[ID].type) {
                case 0:
                  player.prestige.incomeMult += (cs.prestigeStore[ID].amount * quantity)
                  player.prestige.tokens -= cost
                  caller.utils.sendCompactEmbed(command.msg.channel, 'Item Bought', `You added ${(cs.prestigeStore[ID].amount * quantity).toFixed(2)} to you income multiplier.`)
                  break;
                case 1:
                  player.prestige.payoutMult += (cs.prestigeStore[ID].amount * quantity)
                  player.prestige.tokens -= cost
                  caller.utils.sendCompactEmbed(command.msg.channel, 'Item Bought', `You added ${(cs.prestigeStore[ID].amount * quantity).toFixed(2)} to you payout multiplier.`)
              }
              caller.utils.updateLastSeen(player);
              caller.utils.updatePlayer(player);
            }
            break;
          default:
            caller.utils.sendCompactEmbed(command.msg.channel, 'Prestige Store', `Welcome to the prestige store! To see a list of items, use \`${command.prefix}prestige store list\`. When buying, use the ID of that item; for example: \`${command.prefix}prestige store buy 0\`. If you want to purchase one or more of the item, use \`${command.prefix}prestige store buy 0 10\`. To buy as much as you can, use \`${command.prefix}prestige store buy 0 max\`.`)
        }
        break;
      default:
      caller.utils.sendCompactEmbed(command.msg.channel, 'Prestige', `${command.prefix}prestige info - Show your prestige info.\n${command.prefix}prestige advance - Actually prestige\n${command.prefix}prestige store - Buy stuff with your tokens.`)
    }
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
