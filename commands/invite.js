exports.Run = function(caller, command) {
  caller.bot.createMessage(command.msg.channel.id, "Bot Invite: https://discordapp.com/oauth2/authorize?client_id="+caller.bot.user.id+"&scope=bot&permissions=19456")
};
exports.settings = function () {
  return {
    show: true, // show in help true false
    type: "command" //command or game
  };
};
