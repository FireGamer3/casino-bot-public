const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.DB.Find('changelog', {}).then(change => {
    var totalPeeps = numeral(caller.bot.users.filter(u => !u.bot).length).format('0,0');
    var totalBoats = numeral(caller.bot.users.filter(u => u.bot).length).format('0,0');
    var totalGuilds = numeral(caller.bot.guilds.size).format('0,0');
    var totalMems = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
    var uptime = caller.utils.getTime(caller.bot.startTime);
    var totalCommands = numeral(caller.cmdmngr.commands).format('0,0');
    var totalMessages = numeral(caller.cmdmngr.seen).format('0,0');
    const {
      table
    } = require('table')
    var arr = [
      ['Shards', 'Cmds', 'Msgs', 'Guilds', 'Users', 'Bots', 'Memory', 'Uptime']
    ]
    arr.push([caller.shards,totalCommands,totalMessages,totalGuilds,totalPeeps,totalBoats,totalMems,uptime])
    caller.bot.createMessage(command.msg.channel.id, '```' + table(arr) + '\nCasino Bot Version '+change[0].v+' Made with Eris\nDevelopers\n\tLead/Main: FireGamer3\n\tDeveloper: None\n\tAbout Hazed: It\'s with heavy hearts that we bid farewell to one of our devlopers, Hazed. In early 2017, he went from a programming newbie, to a great developer, under the mentorship of FireGamer3. When it comes to Casino, market and lottery are a few of those contributions. He also created and developed Zira, which garnered 14k guilds at its peak, before he ceased development due to lack of motivation. Thanks for all that you have done. -Disnode```').catch(console.error)
  }).catch(console.error)
};
exports.settings = function() {
  return {
    show: true,
    type: "command" //command or game
  };
};
