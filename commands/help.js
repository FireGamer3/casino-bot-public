const fs = require('fs');
const logger = require('disnode-logger');

exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    var help = {
      command: [],
      game: []
    }
    fs.readdir("./commands", function(err, items) {
      for (var i = 0; i < items.length; i++) {
        var ext = items[i].split(".")
        if (ext[1] == "js") {
          try {
            let commandFile = require(`./${items[i]}`);
            var settings = commandFile.settings();
            if (settings.show) help[settings.type].push(ext[0])
          } catch (err) {} finally {
            delete require.cache[require.resolve(`./${items[i]}`)];
          }
        }
      }
      var pack = caller.lang.getPack(player.prefs.lang, "casino");
      var games = "";
      var commands = "";
      for (var i = 0; i < help.game.length; i++) {
        games += command.prefix + help.game[i] + " - " + pack.defaultCommand.commands[help.game[i]] + "\n"
      }
      if (games == "") games = "There are no commands in games yet!";
      for (var i = 0; i < help.command.length; i++) {
        commands += command.prefix + help.command[i] + " - " + pack.defaultCommand.commands[help.command[i]] + "\n"
      }
      if (commands == "") commands = "There are no commands in here yet!";
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 3447003,
          author: {},
          fields: [{
            name: pack.defaultCommand.title,
            inline: true,
            value: pack.defaultCommand.desc,
          }, {
            name: pack.defaultCommand.titleCommands[0],
            inline: true,
            value: games,
          }, {
            name: pack.defaultCommand.titleCommands[1],
            inline: true,
            value: commands,
          }, {
            name: pack.defaultCommand.titleDiscord,
            inline: false,
            value: pack.defaultCommand.descDiscord,
          }, {
            name: pack.defaultCommand.titleUltra,
            inline: false,
            value: pack.defaultCommand.descUltra,
          }],
          footer: {}
        }
      })
    });
  }).catch(function(err) {
    var help = {
      command: [],
      game: []
    }
    fs.readdir("./commands", function(err, items) {
      for (var i = 0; i < items.length; i++) {
        var ext = items[i].split(".")
        if (ext[1] == "js") {
          try {
            let commandFile = require(`./${items[i]}`);
            var settings = commandFile.settings();
            if (settings.show) help[settings.type].push(ext[0])
          } catch (err) {} finally {
            delete require.cache[require.resolve(`./${items[i]}`)];
          }
        }
      }
      var pack = caller.lang.getPack("en", "casino");
      var games = "";
      var commands = "";
      for (var i = 0; i < help.game.length; i++) {
        games += command.prefix + help.game[i] + " - " + pack.defaultCommand.commands[help.game[i]] + "\n"
      }
      if (games == "") games = "There are no commands in games yet!";
      for (var i = 0; i < help.command.length; i++) {
        commands += command.prefix + help.command[i] + " - " + pack.defaultCommand.commands[help.command[i]] + "\n"
      }
      if (commands == "") commands = "There are no commands in here yet!";
      caller.bot.createMessage(command.msg.channel.id, {
        embed: {
          color: 3447003,
          author: {},
          fields: [{
            name: pack.defaultCommand.title,
            inline: true,
            value: pack.defaultCommand.desc,
          }, {
            name: pack.defaultCommand.titleCommands[0],
            inline: true,
            value: games,
          }, {
            name: pack.defaultCommand.titleCommands[1],
            inline: true,
            value: commands,
          }, {
            name: pack.defaultCommand.titleDiscord,
            inline: false,
            value: pack.defaultCommand.descDiscord,
          }, {
            name: pack.defaultCommand.titleUltra,
            inline: false,
            value: pack.defaultCommand.descUltra,
          }],
          footer: {}
        }
      })
    });
  }).catch(function(err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
  });
};
exports.RunDM = function(caller, dmChannel) {
  caller.utils.getPlayer(dmChannel.recipient).then(function(player) {
    var help = {
      command: [],
      game: []
    }
    fs.readdir("./commands", function(err, items) {
      for (var i = 0; i < items.length; i++) {
        var ext = items[i].split(".")
        if (ext[1] == "js") {
          try {
            let commandFile = require(`./${items[i]}`);
            var settings = commandFile.settings();
            if (settings.show) help[settings.type].push(ext[0])
          } catch (err) {
            console.log(err);
          } finally {
            delete require.cache[require.resolve(`./${items[i]}`)];
          }
        }
      }
      var pack = caller.lang.getPack(player.prefs.lang, "casino");
      var games = "";
      var commands = "";
      for (var i = 0; i < help.game.length; i++) {
        games += "cs/" + help.game[i] + " - " + pack.defaultCommand.commands[help.game[i]] + "\n"
      }
      if (games == "") games = "There are no commands in games yet!";
      for (var i = 0; i < help.command.length; i++) {
        commands += "cs/" + help.command[i] + " - " + pack.defaultCommand.commands[help.command[i]] + "\n"
      }
      if (commands == "") commands = "There are no commands in here yet!";
      caller.bot.createMessage(dmChannel.id, {
        embed: {
          color: 3447003,
          author: {},
          fields: [{
            name: pack.defaultCommand.title,
            inline: true,
            value: pack.defaultCommand.desc,
          }, {
            name: pack.defaultCommand.titleCommands[0],
            inline: true,
            value: games,
          }, {
            name: pack.defaultCommand.titleCommands[1],
            inline: true,
            value: commands,
          }, {
            name: pack.defaultCommand.titleDiscord,
            inline: false,
            value: pack.defaultCommand.descDiscord,
          }, {
            name: pack.defaultCommand.titleUltra,
            inline: false,
            value: pack.defaultCommand.descUltra,
          }],
          footer: {}
        }
      })
    });
  }).catch(function(err) {
    var help = {
      command: [],
      game: []
    }
    fs.readdir("./commands", function(err, items) {
      for (var i = 0; i < items.length; i++) {
        var ext = items[i].split(".")
        if (ext[1] == "js") {
          try {
            let commandFile = require(`./${items[i]}`);
            var settings = commandFile.settings();
            if (settings.show) help[settings.type].push(ext[0])
          } catch (err) {} finally {
            delete require.cache[require.resolve(`./${items[i]}`)];
          }
        }
      }
      var pack = caller.lang.getPack("en", "casino");
      var games = "";
      var commands = "";
      for (var i = 0; i < help.game.length; i++) {
        games += command.prefix + help.game[i] + " - " + pack.defaultCommand.commands[help.game[i]] + "\n"
      }
      if (games == "") games = "There are no commands in games yet!";
      for (var i = 0; i < help.command.length; i++) {
        commands += command.prefix + help.command[i] + " - " + pack.defaultCommand.commands[help.command[i]] + "\n"
      }
      if (commands == "") commands = "There are no commands in here yet!";
      dmChannel.send({
        embed: {
          color: 3447003,
          author: {},
          fields: [{
            name: pack.defaultCommand.title,
            inline: true,
            value: pack.defaultCommand.desc,
          }, {
            name: pack.defaultCommand.titleCommands[0],
            inline: true,
            value: games,
          }, {
            name: pack.defaultCommand.titleCommands[1],
            inline: true,
            value: commands,
          }, {
            name: pack.defaultCommand.titleDiscord,
            inline: false,
            value: pack.defaultCommand.descDiscord,
          }, {
            name: pack.defaultCommand.titleUltra,
            inline: false,
            value: pack.defaultCommand.descUltra,
          }],
          footer: {}
        }
      })
    });
  }).catch(function(err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
  });
};
exports.settings = function() {
  return {
    show: true, // show in help true false
    type: "command" //command or game
  };
};
