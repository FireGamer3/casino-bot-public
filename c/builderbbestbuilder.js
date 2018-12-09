const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    if (player.foundsecret6 == undefined) {
      player.foundsecret6 = true;
      var reward = (player.income * 0.05);
      player.income += reward;
      caller.utils.updatePlayer(player);
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 1433628,
          title: player.name + ", you found a secret command!",
          fields: [{
            name: ":b:uilder",
            inline: true,
            value: "May xXBuilderBXx be the only builder we'll ever need! You gained: " + numeral(reward).format('$0,0.00') + " income",
          }],
          image: {
            url: 'https://stuff.zira.pw/files/1526613446980.jpg'
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
