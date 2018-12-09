const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    if (player.foundsecret14 == undefined) {
      player.foundsecret14 = true;
      player.keys += 50;
      caller.utils.updatePlayer(player);
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 1433628,
          title: player.name + " You found a secret Command!",
          fields: [{
            name: "UwU",
            inline: true,
            value: "Wow you know Fire's favorite games.\nFarming Simulator Series\nPinball Arcade\nBattlefront 2 (2005)\nCiv V\nKerbal Space Program\n Roller Coaster Tycoon 3 and 1 deluxe\nZoo Tycoon Deluxe\nBeam NG Drive. \nYou gained: " + numeral(50).format('0,0') + " keys",
          }]
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
