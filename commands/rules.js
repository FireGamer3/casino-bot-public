/* eslint-disable */
exports.Run = function(caller, command) {
  var self = this;
  switch (command.params[0]) {
    case "accept":
      caller.utils.getPlayer(command.msg.author).then(function(player) {
        var pack = caller.lang.getPack(player.prefs.lang, "casino");
        player.rules = true;
        caller.utils.updatePlayer(player);
        caller.utils.sendCompactEmbed(command.msg.channel, pack.rulesCommand.accept[0], pack.rulesCommand.accept[1]);
      }).catch(function(err) {
        console.log(err);
        caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
      });
      break;
    default:
      caller.utils.getPlayer(command.msg.author).then(function(player) {
        var pack = caller.lang.getPack(player.prefs.lang, "casino");
        caller.bot.createMessage(command.msg.channel.id, {
          embed: {
            color: 1433628,
            author: {},
            fields: [{
              name: pack.rulesCommand.rulesTitle,
              inline: false,
              value: pack.rulesCommand.rulesValue,
            }, {
              name: pack.rulesCommand.altTitle,
              inline: false,
              value: pack.rulesCommand.altValue,
            }, {
              name: pack.rulesCommand.banktitle,
              inline: false,
              value: pack.rulesCommand.bankValue,
            }, {
              name: pack.rulesCommand.markTitle,
              inline: false,
              value: pack.rulesCommand.markValue,
            }, {
              name: pack.rulesCommand.acceptTitle,
              inline: false,
              value: pack.rulesCommand.acceptValue,
            }, {
              name: pack.rulesCommand.macroTitle,
              inline: false,
              value: pack.rulesCommand.macroValue,
            }, {
              name: pack.rulesCommand.cooldownTitle,
              inline: false,
              value: pack.rulesCommand.cooldownValue,
            }, {
              name: pack.rulesCommand.ultraTitle,
              inline: false,
              value: pack.rulesCommand.ultraValue,
            }, {
              name: pack.rulesCommand.dataTitle,
              inline: false,
              value: pack.rulesCommand.dataValue,
            }, {
              name: pack.rulesCommand.tosTitle,
              inline: false,
              value: pack.rulesCommand.tosValue,
            }],
            footer: {}
          }
        })
      });
  }
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "game" //command or game
  };
};
