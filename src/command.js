const EventEmitter = require('events').EventEmitter;
const numeral = require('numeral');
const logger = require('disnode-logger');

class CommandManager extends EventEmitter {
  constructor(caller, prefix) {
    super()
    this.seen = 0;
    this.commands = 0;
    this.caller = caller;
    this.prefix = prefix;
    this.bot = caller.bot;
    this.bot.on("messageCreate", (msg) => {
      this.seen++;
      this.parseMessage(msg);
    });
    logger.Success("Casino", "Command", "Command Manager Started!")
  }
  getStats() {
    return {
      seen: numeral(this.seen).format('0,0'),
      cmds: numeral(this.commands).format('0,0')
    };
  }
  parseMessage(msg) {
    var self = this;
    if (msg.author.bot) return;
    if (msg.content == "<@" + this.bot.user.id + ">") {
      //if (self.caller.config.PROD)
      this.emit("mention", msg);
      return;
    }

    self.checkBan(msg.author.id).then(function(check) {
      if (check) return
      self.getPrefix(msg.author.id).then(function(res) {
        self.getGuildPrefix((msg.channel.type == self.caller.channelTypes.DM) ? null : msg.channel.guild.id).then(function(gu) {
          var prefix = res;
          var gprefix = gu;
          var mainprefmsg = JSON.parse(JSON.stringify(msg.content))
          var testpref = msg.content.slice(0, prefix.length);
          var testmpref = mainprefmsg.slice(0, self.prefix.length);
          var testgpref = msg.content.slice(0, gprefix.length);
          if (testpref == prefix) {
            var params = GetParams(msg.content);
            var SpaceIndex = msg.content.length;
            if (msg.content.indexOf(" ") != -1) {
              SpaceIndex = msg.content.indexOf(" ");
            }
            var firstWord = msg.content.substring(0, SpaceIndex);
            firstWord = Sanitize(firstWord);
            if (prefix.length == 1) {
              firstWord = firstWord.substr(1);
            } else {
              firstWord = firstWord.substr(prefix.length);
            }
            firstWord = firstWord.toLowerCase();
            if (prefix.indexOf(" ") != -1) {
              firstWord = params[0].toLowerCase()
              params.shift()
            }
            var command = {
              msg: msg,
              params: params,
              command: firstWord,
              prefix: prefix
            }
            self.emit('message', command);
            self.commands++;
          } else if (testmpref == self.prefix) {
            var params = GetParams(mainprefmsg);
            var SpaceIndex = mainprefmsg.length;
            if (mainprefmsg.indexOf(" ") != -1) {
              SpaceIndex = mainprefmsg.indexOf(" ");
            }
            var firstWord = mainprefmsg.substring(0, SpaceIndex);
            firstWord = Sanitize(firstWord);
            if (self.prefix.length == 1) {
              firstWord = firstWord.substr(1);
            } else {
              firstWord = firstWord.substr(self.prefix.length);
            }
            firstWord = firstWord.toLowerCase();
            var command = {
              msg: msg,
              params: params,
              command: firstWord,
              prefix: self.prefix
            }
            self.emit('message', command);
            self.commands++;
          } else if (testgpref == gprefix) {
            var params = GetParams(msg.content);
            var SpaceIndex = msg.content.length;
            if (msg.content.indexOf(" ") != -1) {
              SpaceIndex = msg.content.indexOf(" ");
            }
            var firstWord = msg.content.substring(0, SpaceIndex);
            firstWord = Sanitize(firstWord);
            if (gprefix.length == 1) {
              firstWord = firstWord.substr(1);
            } else {
              firstWord = firstWord.substr(gprefix.length);
            }
            firstWord = firstWord.toLowerCase();
            if (gprefix.indexOf(" ") != -1) {
              firstWord = params[0].toLowerCase()
              params.shift()
            }
            var command = {
              msg: msg,
              params: params,
              command: firstWord,
              prefix: gprefix
            }
            self.emit('message', command);
            self.commands++;
          } else if (msg.content.startsWith("!casino")) {
            if (self.caller.config.PROD) {
              self.caller.bot.createMessage(msg.channel.id, "The Default prefix has changed to `cs/` Please use `cs/help` for a list of commands or mention me for help.")
            }
          }
        })
      })
    })
  }
  checkBan(id) {
    var self = this
    return new Promise(function(resolve, reject) {
      self.caller.DB.Find("blacklist", {
        "id": 'list'
      }).then(function(d) {
        var found = false
        for (var i = 0; i < d[0].list.length; i++) {
          if (d[0].list[i].id == id) found = true
        }
        resolve(found)
      })
    });
  }
  getPrefix(id) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.caller.DB.Find("players", {
        "id": id
      }).then(function(players) {
        if (!self.caller.config.PROD) {
          resolve("csd/");
          return;
        }
        if (players.length == 0) {
          resolve(self.prefix);
          return;
        }
        if (players[0].prefs != undefined && players[0].prefs.prefix != undefined) {
          resolve(players[0].prefs.prefix);
        } else resolve(self.prefix);
      })
    });
  }
  getGuildPrefix(id) {
    var self = this;
    return new Promise(function(resolve, reject) {
      if (id == null) {
        resolve(self.prefix);
        return
      }
      self.caller.DB.Find("guilds", {
        "id": id
      }).then(function(guilds) {
        if (!self.caller.config.PROD) {
          resolve("csd/");
          return;
        }
        if (guilds.length == 0) {
          resolve(self.prefix);
          return;
        }
        resolve(guilds[0].prefix)
      })
    });
  }
}


function GetParams(raw) {
  var parms = [];
  var lastSpace = -1;
  var end = false;
  while (!end) {
    var BeginSpace = raw.indexOf(" ", lastSpace);
    var EndSpace = -1;
    if (BeginSpace != -1) {
      EndSpace = raw.indexOf(" ", BeginSpace + 1);
      if (EndSpace == -1) {
        EndSpace = raw.length;
        end = true;
      }
      var param = raw.substring(BeginSpace + 1, EndSpace);
      var containsQuoteIndex = param.indexOf('"');
      var BeginQuote = -1;
      var EndQuote = -1;
      if (containsQuoteIndex != -1) {
        BeginQuote = raw.indexOf('"', BeginSpace);
        EndQuote = raw.indexOf('"', BeginQuote + 1);
        if (EndQuote != -1) {
          BeginSpace = BeginQuote;
          EndSpace = EndQuote;
          param = raw.substring(BeginSpace + 1, EndSpace);
        }
      }
      lastSpace = EndSpace;
      if (param != "") {
        parms.push(param);
      } else {}
    } else {
      end = true;
    }
  }
  return parms;
}

function Sanitize(string) {
  while (string.indexOf("../") != -1) {
    string = string.replace("../", "");
  }
  while (string.indexOf("./") != -1) {
    string = string.replace("./", "");
  }
  return string;
}
module.exports = CommandManager;
