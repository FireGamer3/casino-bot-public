const table = require('text-table');
const numeral = require('numeral');
const cs = require('../casinoStuff');

exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    var discount = 1;
    switch (player.tier) {
      case 0:
        discount = 1;
        break;
      case 1:
        discount = 0.75;
        break;
      case 2:
        discount = 0.50;
        break;
      case 3:
        discount = 0.25;
        break;
      default:
        discount = 1;
    }
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
    switch (command.params[0]) {
      case "list":
        var arr = [];
        arr.push(["ID", "ITEM", "COST"]);
        for (var i = 0; i < cs.store.length; i++) {
          var cost;
          if (player.Admin || (player.Premium )) {
            cost = (cs.store[i].cost * discount)
          } else cost = cs.store[i].cost;
          switch (cs.store[i].type) {
            case 0:
              arr.push([i, `Instant $${numeral(cs.store[i].amount).format('0,0.00')}`, `${numeral(cost).format('0,0.00')} XP`])
              break;
            case 1:
              arr.push([i, `$${numeral(cs.store[i].amount).format('0,0.00')} Added To Your Income`, `$${numeral(cost).format('0,0.00')}`])
              break;
            default:
              break;
          }
        }
        var msg = table(arr, { align: ['l', 'c', 'r'] });
        var title;
        if (player.Admin || player.Premium) {
          title = "Ultra Store List";
        } else title = "Store List";
        caller.bot.createMessage(command.msg.channel.id,`\`\`\`prolog\n${title}\n${msg}\n\`\`\``);
        break;
      case "buy":
        if (command.params[1] && (command.params[1] >= 0 && command.params[1] <= (cs.store.length - 1))) {
          var ID = parseInt(command.params[1]);
          var quantity = 0;
          if (command.params[2] == "max") {
            if (player.Admin || player.Premium) {
              if (cs.store[ID].type == 0) {
                quantity = Math.floor((player.xp / (cs.store[ID].cost / 2)));
              } else {
                var cost = (cs.store[ID].cost * discount);
                quantity = Math.min(Math.floor(player.money / cost), Math.floor((player.maxIncome - player.income) / cs.store[ID].amount));
              }
            } else {
              var cost = (cs.store[ID].cost);
              quantity = Math.min(Math.floor(player.money / cost), Math.floor((player.maxIncome - player.income) / cs.store[ID].amount));
            }
          }else {
          quantity = numeral(command.params[2]).value();
        }
        if (quantity < 1) {
          quantity = 1;
        }
        if (cs.store[ID].type == 1) {
          var remainMax = player.maxIncome - player.income;
          if (((cs.store[ID].amount * quantity)) > remainMax) {
            caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: Such transaction will exceed your Max Income of: $" + numeral(player.maxIncome).format('0,00.00') + "\nLevel up to increase this max.", 16772880);
            return;
          }
        }
        var cost;
        if (player.Admin || player.Premium) {
          cost = (cs.store[ID].cost * discount) * quantity;
        } else cost = cs.store[ID].cost * quantity;
        var costString;
        if (cs.store[ID].type == 1) {
          costString = "$" + cost;
          if (player.money < cost) {
            caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: You dont have that much Money!\nNeed: $" + cost + "\nYou have: $" + player.money, 16772880);
            return;
          }
        } else {
          costString = cost + " XP"
          if (player.xp < cost) {
            caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: You dont have that much XP!\nNeed: " + cost + "XP\nYou have: " + player.xp, 16772880);
            return;
          }
        }
        switch (cs.store[ID].type) {
          case 0:
            player.xp -= cost;
            player.money += (cs.store[ID].amount * quantity);
            break;
          case 1:
            player.money -= cost;
            player.income += (cs.store[ID].amount * quantity);
            break;
          default:
            break;
        }
        var item;
        switch (cs.store[ID].type) {
          case 0:
            item = `Instant $${numeral(cs.store[ID].amount).format('0,0.00')}`
            break;
          case 1:
            item = `$${numeral(cs.store[ID].amount).format('0,0.00')} Added To Your Income`
            break;
          default:

        }
        caller.bot.createMessage(command.msg.channel.id, {
          embed: {
            color: 1433628,
            author: {},
            fields: [{
              name: "Store",
              inline: false,
              value: ":white_check_mark: Your purchase of `" + quantity + "x " + item + "` was successful! Thank you for your business!",
            }, {
              name: 'Money',
              inline: true,
              value: "$" + numeral(player.money).format('0,0.00'),
            }, {
              name: 'Income / 30min.',
              inline: true,
              value: "$" + numeral(player.income).format('0,0.00'),
            }, {
              name: 'XP',
              inline: true,
              value: numeral(player.xp).format('0,0'),
            }],
            footer: {}
          }
        })
        caller.utils.updateLastSeen(player);
        caller.utils.updatePlayer(player);

        break;
      }else {
        caller.utils.sendCompactEmbed(command.msg.channel, "Error", "You must use a valid store item 0-4", 16772880);
      }
      default:
        caller.utils.sendCompactEmbed(command.msg.channel, "Store", "Welcome to the store! To see a list of items, use `cs/store list`. When buying, use the ID of that item; for example: `cs/store buy 0`. If you want to purchase one or more of the item, use `cs/store buy 0 10`. To buy as much as you can, use `cs/store buy 0 max`.");
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
