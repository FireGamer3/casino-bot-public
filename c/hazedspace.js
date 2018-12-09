const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    if (player.foundsecret3 == undefined) {
      player.foundsecret3 = true;
      var reward = (player.xp * 0.05);
      player.xp += reward;
      caller.utils.checkLV(player, command.msg.channel);
      caller.utils.updatePlayer(player);
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 1433628,
          title: player.name + " You found a secret Command!",
          fields: [{
            name: "Thonk",
            inline: true,
            value: "GOTTA GO TO SPPPPPPAAAAAAAAACCCCCCCCCEEEEEEEEEE. You gained: " + numeral(reward).format('0,0') + " xp",
          }]
        }
      })
      command.msg.delete().catch(console.error);
    }
  });
};
exports.settings = function () {
  return {
    show: false, // show in help true false
    type: "command" //command or game
  };
};
