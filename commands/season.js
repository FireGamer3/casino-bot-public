exports.Run = function(caller, command) {
  caller.bot.createMessage(command.msg.channel.id, {
    embed: {
      color: 1433628,
      author: {},
      fields: [{
        name: "Casino Bot Seasons!",
        inline: true,
        value: "Unlike the old way, Seasons are how Casino now functions! Players compete to be at the top of the leaderboards for Ultra credits.",
      },{
        name: "Season 1 'Ultra'",
        inline: true,
        value: "COMPLETE - [Results](https://stuff.zira.pw/1538366952184.txt)",
      }, {
        name: "Season 2 'Holiday'",
        inline: true,
        value: "October 1, 2018 to January 1, 2019",
      }, {
        name: "Season 3 'New Years'",
        inline: true,
        value: "January 1, 2019 to March 1, 2019",
      }],
      timestamp: new Date(),
    }
  })
};
exports.settings = function () {
  return {
    show: true, // show in help true false
    type: "game" //command or game
  };
};
