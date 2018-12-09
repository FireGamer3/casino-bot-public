const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    if (player.foundsecret2 == undefined) {
      player.foundsecret2 = true;
      var reward = (player.income * 0.05);
      player.income += reward;
      caller.utils.updatePlayer(player);
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 1433628,
          title: player.name + " You found a secret Command!",
          fields: [{
            name: "Thonk",
            inline: true,
            value: "I'm roasting up in this flame! You gained: " + numeral(reward).format('$0,0.00') + " income",
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
