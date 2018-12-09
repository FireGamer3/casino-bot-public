const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    if (player.foundsecret10 == undefined) {
      player.foundsecret10 = true;
      var reward = (player.money * 0.1);
      player.money += reward;
      caller.utils.updatePlayer(player);
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 1433628,
          title: player.name + ", you found a secret command!",
          fields: [{
            name: "🍰🎉",
            inline: true,
            value: "Casino is almost 2 years old! You gained: " + numeral(reward).format('$0,0.00'),
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
