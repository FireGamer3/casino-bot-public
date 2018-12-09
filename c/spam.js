const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    if (player.foundsecret7 == undefined) {
      player.foundsecret7 = true;
      var reward = (player.xp * 0.05);
      caller.utils.checkLV(player, command.msg.channel);
      player.xp += reward;
      caller.utils.updatePlayer(player);
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 1433628,
          title: player.name + " You found a secret Command!",
          fields: [{
            name: "Thonk",
            inline: true,
            value: "Something you should not do. but you can eat! You gained: " + numeral(reward).format('0,0') + " xp",
          }],
          image: {
            url: 'https://stuff.zira.pw/files/1524967971580.jpg'
          }
        }
      })
      command.msg.delete().catch(console.error);
    }
  });
};
exports.settings = function() {
  return {
    show: false, // show in help true false
    type: "command" //command or game
  };
};
