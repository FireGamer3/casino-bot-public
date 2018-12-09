const dateformat = require('dateformat');
const axios = require("axios");

exports.Run = function(caller, command) {
  var ultra = axios.create({
    baseURL: 'https://api.disnode.app/ultra/user/',
    timeout: 5000
  });
  caller.utils.getPlayer(command.msg.author).then(player => {
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    switch (command.params[0]) {
      case "info":
        caller.utils.sendCompactEmbed(command.msg.channel, 'Ultra Info', '**Ultra Tier 1**:\n• Exclusive access to Blackjack. `cs/21`.\n• Items in the store are 25% off of the normal prices.\n• Access to minimum betting with slots `cs/slot min`.\n\n**Ultra Tier 2**:\n• Items in the store are 50% off of the normal prices.\n• Instead of the normal 5 second cooldown, it\'s now 3 seconds.\n• Access to The new unannounced multiplayer game for casino.\n\n**Ultra Tier 3**\n• Items in the store are 75% off of the normal prices.\n• Access to Tier Three Commands that will soon be announced in a few months.\n• All normal wins on slots (excluding single cherries and the jackpot) are doubled.\n\n[Buy](https://ultra.disnode.app)');
        break;
      default:
        ultra.get(`/${player.id}/263330369409908736/`).then((resp) => {
          var data = resp.data;
          if (data.data.enabled) {
            player.Premium = true;
            player.tier = data.data.tier;
          }else {
            player.Premium = false;
            player.tier = 0;
          }
          caller.utils.updatePlayer(player);
          if(player.Premium){
            var tier = (player.tier ? player.tier : 0);
            caller.bot.createMessage(command.msg.channel.id, {
              embed: {
                color: 1433628,
                author: {},
                fields: [{
                  name: pack.ultraCommand.wordUltra,
                  inline: true,
                  value: "" + player.Premium,
                },{
                  name: "Tier",
                  inline: true,
                  value: "" + tier,
                }, {
                  name: "Manage",
                  inline: false,
                  value: "[Manage Your Ultra](https://ultra.disnode.app/dashboard)",
                }],
                timestamp: new Date(),
              }
            })
          }else {
            caller.utils.sendCompactEmbed(command.msg.channel, 'Ultra Info', '**Ultra Tier 1**:\n• Exclusive access to Blackjack. `cs/21`.\n• Items in the store are 25% off of the normal prices.\n• Access to minimum betting with slots `cs/slot min`.\n\n**Ultra Tier 2**:\n• Items in the store are 50% off of the normal prices.\n• Instead of the normal 5 second cooldown, it\'s now 3 seconds.\n• Access to The new unannounced multiplayer game for casino.\n\n**Ultra Tier 3**\n• Items in the store are 75% off of the normal prices.\n• Access to Tier Three Commands that will soon be announced in a few months.\n• All normal wins on slots (excluding single cherries and the jackpot) are doubled.\n\n[Buy](https://ultra.disnode.app)')
          }
        }).catch(function(err) {
          console.log(err);
          
          caller.utils.sendCompactEmbed(command.msg.channel, 'Ultra Info', '**Ultra Tier 1**:\n• Exclusive access to Blackjack. `cs/21`.\n• Items in the store are 25% off of the normal prices.\n• Access to minimum betting with slots `cs/slot min`.\n\n**Ultra Tier 2**:\n• Items in the store are 50% off of the normal prices.\n• Instead of the normal 5 second cooldown, it\'s now 3 seconds.\n• Access to The new unannounced multiplayer game for casino.\n\n**Ultra Tier 3**\n• Items in the store are 75% off of the normal prices.\n• Access to Tier Three Commands that will soon be announced in a few months.\n• All normal wins on slots (excluding single cherries and the jackpot) are doubled.\n\n[Buy](https://ultra.disnode.app)', 16772880);
        });
        break;
    }
  }).catch(function(err) {
    caller.utils.sendCompactEmbed(command.msg.channel, 'Ultra Info', '**Ultra Tier 1**:\n• Exclusive access to Blackjack. `cs/21`.\n• Items in the store are 25% off of the normal prices.\n• Access to minimum betting with slots `cs/slot min`.\n\n**Ultra Tier 2**:\n• Items in the store are 50% off of the normal prices.\n• Instead of the normal 5 second cooldown, it\'s now 3 seconds.\n• Access to The new unannounced multiplayer game for casino.\n\n**Ultra Tier 3**\n• Items in the store are 75% off of the normal prices.\n• Access to Tier Three Commands that will soon be announced in a few months.\n• All normal wins on slots (excluding single cherries and the jackpot) are doubled.\n\n[Buy](https://ultra.disnode.app)', 16772880);
  })
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "command" //command or game
  };
};
