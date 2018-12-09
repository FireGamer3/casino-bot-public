const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    if (player.foundsecret12 == undefined) {
      player.foundsecret12 = true;
      var reward = (player.income * 0.05);
      player.income += reward;
      caller.utils.updatePlayer(player);
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 1433628,
          title: player.name + ", you found a secret command!",
          fields: [{
            name: "🅱",
            inline: true,
            value: "He needs a helmet! You gained: " + numeral(reward).format('$0,0.00') + " income",
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
