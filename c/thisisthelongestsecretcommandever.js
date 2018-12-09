const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    if (player.foundsecret4 == undefined) {
      player.foundsecret4 = true;
      var reward = (player.money * 0.1);
      player.money += reward;
      caller.utils.updatePlayer(player);
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 1433628,
          title: player.name + " You found a secret Command!",
          fields: [{
            name: "long",
            inline: true,
            value: "thisisthelongestsecretcommandeveristhebestsecretcommandthereis. You gained: " + numeral(reward).format('$0,0.00'),
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
