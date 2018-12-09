exports.Run = function(caller, command) {
  caller.DB.Find('changelog', {}).then(change => {
    var i = change[0]
    caller.bot.createMessage(command.msg.channel.id, {embed:{
      color: 3447003,
      title: 'Casino Bot - Changelog',
      fields: [{
        name: 'Version',
        value: i.v
      }, {
        name: "Changes",
        value: i.m
      }]
    }}).catch(console.error)
  })
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "command" //command or game
  };
};
