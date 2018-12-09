const numeral = require('numeral');

exports.Run = function(caller, command) {
  var cmdstat = caller.cmdmngr.getStats();
  var response = new Date().getTime()  - command.msg.timestamp;
  caller.utils.sendCompactEmbed(command.msg.channel, "Pong!","Message Delay: **" + response + "ms**\n");
};
exports.settings = function () {
  return {
    show: false,
    type: "command" //command or game
  };
};
