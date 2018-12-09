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
        caller.utils.sendCompactEmbed(command.msg.channel,  pack.common.errorTitle, pack.common.channelCheck, 16772880);
        return;
      }
    }
    switch (command.params[0]) {
      case "open":
        var timeoutInfo = caller.utils.checkTimeout(player);
        if (!timeoutInfo.pass) {
          logger.Info("Casino", "Crate", "Player: " + player.name + " Tried the Crate before their delay of: " + timeoutInfo.remain);
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.timeout.body[0] + timeoutInfo.remain + pack.timeout.body[1] + timeoutInfo.tw, 16772880);
          caller.utils.updatePlayer(player);
          return;
        }
        var CrateID = numeral(command.params[1]).value();
        if (CrateID >= 0 && CrateID < cs.cratesys.crates.length) {
          var Crate = cs.cratesys.crates[CrateID];
          if (Crate == undefined) {
            caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.crateCommand.invalidID, 16772880);
            return;
          }
          if (command.params[2]) {
            var quantity = numeral(command.params[2]).value();
            if (quantity == 0) quantity = 1;
            if (player.keys >= (Crate.cost * quantity)) {
              if (player.crates[CrateID] >= quantity) {
                player.keys -= (Crate.cost * quantity);
                player.crates[CrateID] -= quantity;
                var amountWon = [0, 0, 0, 0];
                for (var i = 0; i < quantity; i++) {
                  var Item = Crate.items[caller.utils.getRandomIntInclusive(0, (Crate.items.length - 1))];
                  switch (Item.type) {
                    case 0:
                      player.money += Item.amount;
                      amountWon[0] += Item.amount;
                      break;
                    case 1:
                      player.xp += Item.amount;
                      amountWon[1] += Item.amount;
                      break;
                    case 2:
                      player.money += player.income * Item.amount;
                      amountWon[2] += player.income * Item.amount;
                      break;
                    case 3:
                      player.income += (player.income * Item.amount);
                      amountWon[3] += (player.income * Item.amount);
                      break;
                  }
                }
                var msg = quantity + " " + Crate.name + pack.crateCommand.open.openedMulti;
                for (var i = 0; i < amountWon.length; i++) {
                  if (amountWon[i] == 0) continue;
                  switch (i) {
                    case 0:
                      msg += pack.crateCommand.open.openMuliCase[0][0] + numeral(amountWon[i]).format('0,0.00') + pack.crateCommand.open.openMuliCase[0][1];
                      break;
                    case 1:
                      msg += pack.crateCommand.open.openMuliCase[1][0] + numeral(amountWon[i]).format('0,0') + pack.crateCommand.open.openMuliCase[1][1];
                      break;
                    case 2:
                      msg += pack.crateCommand.open.openMuliCase[2][0] + numeral(amountWon[i]).format('0,0.00') + pack.crateCommand.open.openMuliCase[2][1];
                      break;
                    case 3:
                      msg += pack.crateCommand.open.openMuliCase[3][0] + numeral(amountWon[i]).format('0,0.00') + pack.crateCommand.open.openMuliCase[3][1];
                      break;
                  }
                }
                caller.utils.sendCompactEmbed(command.msg.channel, pack.crateCommand.title, msg, 3447003);
                caller.utils.updatePlayerLastMessage(player);
                caller.utils.updateLastSeen(player);
                caller.utils.checkLV(player, command.msg.channel);
                caller.utils.updatePlayer(player)
              } else {
                caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.crateCommand.open.noCrates[0] + Crate.name + pack.crateCommand.open.noCrates[1] + quantity + pack.crateCommand.open.noCrates[2] + player.crates[CrateID], 16772880);
              }
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.crateCommand.open.noKeys[0] + (Crate.cost * quantity) + pack.crateCommand.open.noKeys[1] + player.keys, 16772880);
            }
          } else {
            if (player.keys >= Crate.cost) {
              if (player.crates[CrateID] >= 1) {
                player.keys -= Crate.cost;
                player.crates[CrateID]--;
                var Item = Crate.items[caller.utils.getRandomIntInclusive(0, (Crate.items.length - 1))];
                switch (Item.type) {
                  case 0:
                    player.money += Item.amount;
                    caller.utils.sendCompactEmbed(command.msg.channel, pack.crateCommand.open.opened, pack.crateCommand.open.openedCase[0] + Crate.name + pack.crateCommand.open.openedCase[1] + Item.item + pack.crateCommand.open.openedCase[2], 3447003);
                    break;
                  case 1:
                    player.xp += Item.amount;
                    caller.utils.sendCompactEmbed(command.msg.channel, pack.crateCommand.opened, pack.crateCommand.open.openedCase[0] + Crate.name + pack.crateCommand.open.openedCase[1] + Item.item + pack.crateCommand.open.openedCase[2], 3447003);
                    break;
                  case 2:
                    player.money += player.income * Item.amount;
                    caller.utils.sendCompactEmbed(command.msg.channel, "Complete", "You Opened the **" + Crate.name + "** Crate and got: **" + Item.item + "**", 3447003);
                    break;
                  case 3:
                    player.income += (player.income * Item.amount);
                    caller.utils.sendCompactEmbed(command.msg.channel, pack.crateCommand.opened, pack.crateCommand.open.openedCase[0] + Crate.name + pack.crateCommand.open.openedCase[1] + Item.item + pack.crateCommand.open.openedCase[2], 3447003);
                    break;
                }
                caller.utils.updatePlayerLastMessage(player);
                caller.utils.updateLastSeen(player);
                caller.utils.checkLV(player, command.msg.channel);
                caller.utils.updatePlayer(player);
              } else {
                caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.crateCommand.open.noCrates[0] + Crate.name, 16772880);
              }
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.crateCommand.open.noKeys[0] + Crate.cost + pack.crateCommand.open.noKeys[1] + player.keys, 16772880);
            }
          }
        } else {
          caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.crateCommand.invalidID, 16772880);
        }
        break;
      case "sell":
        if (command.params[1]) {
          var CrateID = numeral(command.params[1]).value();
          if (CrateID >= 0 && CrateID < cs.cratesys.crates.length) {
            var Crate = cs.cratesys.crates[CrateID];
            if (Crate == undefined) {
              caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.crateCommand.invalidID, 16772880);
              return;
            }
            var quantity = 1
            if (command.params[2]) {
              quantity = numeral(command.params[2]).value();
              if (quantity == 0) quantity = 1;
            }
            if (quantity <= player.crates[CrateID]) {
              player.crates[CrateID] -= quantity;
              player.money += (Crate.sellPrice * quantity);
              caller.utils.checkLV(player, command.msg.channel);
              caller.utils.updatePlayer(player);
              caller.utils.sendCompactEmbed(command.msg.channel, pack.crateCommand.sell.success, pack.crateCommand.sell.sold[0] + quantity + " " + Crate.name + pack.crateCommand.sell.sold[1] + numeral((Crate.sellPrice * quantity)).format('0,0.00'))
            } else caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.crateCommand.sell.noCrates[0] + Crate.name + pack.crateCommand.sell.noCrates[1] + quantity + pack.crateCommand.sell.noCrates[2] + player.crates[CrateID], 16772880);
          } else caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.crateCommand.invalidID, 16772880);
        } else {
          var crates = "";
          for (var i = 0; i < cs.cratesys.crates.length; i++) {
            crates += pack.crateCommand.sell.list[0] + i + pack.crateCommand.sell.list[1] + cs.cratesys.crates[i].name + pack.crateCommand.sell.list[2] + numeral(cs.cratesys.crates[i].sellPrice).format('0,0.00') + "**\n";
          }
          caller.bot.createMessage(command.msg.channel.id, {embed:{
            color: 3447003,
            author: {},
            fields: [{
              name: pack.crateCommand.system,
              inline: true,
              value: "Sell the crates you don't want for a fixed price.\nUse `"+command.prefix+"crate sell ID Amount` to sell your crates!",
              value: pack.crateCommand.sell.desc[0] + command.prefix + pack.crateCommand.sell.desc[1],
            }, {
              name: pack.crateCommand.title,
              inline: false,
              value: crates
            }],
            footer: {}
          }})
        }
        break;
      default:
        var crates = "";
        for (var i = 0; i < cs.cratesys.crates.length; i++) {
          crates += pack.crateCommand.default.list[0] + i + pack.crateCommand.default.list[1] + cs.cratesys.crates[i].name + "** / **" + cs.cratesys.crates[i].cost + pack.crateCommand.default.list[2];
          for (var l = 0; l < cs.cratesys.crates[i].items.length; l++) {
            crates += " # **" + cs.cratesys.crates[i].items[l].item + "**\n";
          }
        }
        caller.bot.createMessage(command.msg.channel.id, {embed: {
          color: 3447003,
          author: {},
          fields: [{
            name: pack.crateCommand.system,
            inline: true,
            value: pack.crateCommand.default.desc[0] + command.prefix + pack.crateCommand.default.desc[1] + command.prefix + pack.crateCommand.default.desc[2],
          }, {
            name: pack.crateCommand.title,
            inline: false,
            value: crates
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
