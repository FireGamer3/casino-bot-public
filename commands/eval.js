exports.Run = function(caller, command) {
  if (caller.config.eval.indexOf(command.msg.author.id) == -1) return;
  var code = command.params.join(" ");
  try {
    var evaled = eval(code);
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    if (evaled.length > 1960) {
      caller.bot.createMessage(command.msg.channel.id, `\`\`\`Result longer then 2000 characters so it was logged to console.\`\`\``);
      console.log(evaled);
    } else if (evaled == undefined) {
      caller.bot.createMessage(command.msg.channel.id, `\`\`\`json\n${evaled}\n\`\`\``);
    } else {
      caller.bot.createMessage(command.msg.channel.id, `\`\`\`json\n${evaled}\n\`\`\``);
    }
  } catch (e) {
    caller.bot.createMessage(command.msg.channel.id, `\`\`\`json\n${e}\n\`\`\``);
  }
};
exports.settings = function () {
  return {
    show: false,
    type: "command" //command or game
  };
};
