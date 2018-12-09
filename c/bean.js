const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    if (player.foundsecret8 == undefined) {
      player.foundsecret8 = true;
      player.banned = true;
      player.banreason = 'Get beaned kiddo ;) (for 2 minutes)';
      caller.utils.updatePlayer(player);
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 1433628,
          title: player.name + ", you found a secret command!",
          fields: [{
            name: "Get BEANED",
            inline: true,
            value: "YOU HAVE BEEN BEANED *teehee*",
          }],
        }
      })
      command.msg.delete().catch(console.error);
      setTimeout(function (p, c) {
        caller.utils.getPlayer(command.msg.author).then((d) => {
          d.banned = false
          c.utils.updatePlayer(d);
        });
      }, 120000, player, caller);
    }
  });
};
exports.settings = function() {
  return {
    show: false, // show in help true false
    type: "command" //command or game
  };
};
