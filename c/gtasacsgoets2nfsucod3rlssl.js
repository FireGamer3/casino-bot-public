const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    if (player.foundsecret15 == undefined) {
      player.foundsecret15 = true;
      var reward = (player.xp * 0.1);
      player.xp += reward;
      caller.utils.updatePlayer(player);
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 1433628,
          title: player.name + " You found a secret Command!",
          fields: [{
            name:  "Tyler's Favourite Games",
            inline: true,
            value:  "You have found my favourite games! You gained: " + numeral(reward).format('0,0') + " XP",
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
