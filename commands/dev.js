const exec = require('child_process').exec;
const table = require('text-table');
const snekfetch = require('snekfetch');
const numeral = require('numeral');
exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    var pack = caller.lang.getPack(player.prefs.lang, "casino");
    if (!player.rules) {
      caller.utils.sendCompactEmbed(command.msg.channel, pack.common.errorTitle, pack.common.acceptRules[0] + command.prefix + pack.common.acceptRules[1]);
      return;
    }
    if (caller.utils.checkBan(player, command)) return;
    if (player.Admin) {} else {
      caller.utils.sendCompactEmbed(command.msg.channel, "Error", ":warning: YOU SHALL NOT PASS! (**You are not an Admin in the Disnode Official Discord Server**)", 16772880);
      return;
    }
    switch (command.params[0]) {
      case "restart":
        caller.bot.createMessage(command.msg.channel.id, ":white_check_mark: Restarting all shards");
        exec('sudo pm2 restart CasinoBot', (error, stdout, stderr) => {});
        break;
      case "reset":
        if (command.params[1]) {
          caller.utils.findPlayer(command.params[1]).then(function(res) {
            if (res.found) {
              var newPlayer = {
                name: res.p.name,
                id: res.p.id,
                money: 10000,
                income: 1000,
                maxIncome: 1000,
                xp: 0,
                lv: 1,
                nextlv: 500,
                bank: 0,
                Premium: false,
                Admin: false,
                Mod: false,
                banned: false,
                banreason: "",
                tower: null,
                stats: {
                  slotPlays: 0,
                  coinPlays: 0,
                  slotWins: 0,
                  coinWins: 0,
                  slotSingleC: 0,
                  slotTripleC: 0,
                  slot3s: 0,
                  slot2s: 0,
                  slot1s: 0,
                  slotJackpots: 0,
                  coinHeads: 0,
                  coinTails: 0,
                  wheelPlays: 0,
                  wheelWins: 0,
                  wheel0: 0,
                  wheelNumber: 0,
                  wheelsections: 0,
                  wheellowhigh: 0,
                  wheelevenodd: 0,
                  wheelcolor: 0,
                  wheelLanded0: 0,
                  wheelLandedNumber: 0,
                  wheelLandedsections: 0,
                  wheelLandedlowhigh: 0,
                  wheelLandedevenodd: 0,
                  wheelLandedcolor: 0
                },
                keys: 0,
                created: res.p.created,
                lastIncome: parseInt(new Date().getTime()),
                lastSeen: parseInt(new Date().getTime()),
                crates: [0, 0, 0, 0, 0, 0],
                prefs: {
                  lang: "en",
                  embed: true
                },
                prestige: {
                  lv: 0,
                  incomeMult: 1,
                  payoutMult: 1,
                  last: null,
                  tokens: 0
                }
              }
              caller.utils.updatePlayer(newPlayer);
              caller.utils.sendCompactEmbed(command.msg.channel, "Action Complete", ":white_check_mark: Player: " + res.p.name + " Is now reset", 3447003);
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
            }
          });
        }
        break;
      case "dbpurge":
        caller.utils.DB.Find('players',{}).then(function(players){
          var now = new Date().getTime();
          var rem = [];
          for (var i = 0; i < players.length; i++) {
            if(((now - players[i].lastSeen) >= 2592000000) && (!players[i].banned)){
              rem.push(players[i].id);
            }
          }
          for (var i = 0; i < rem.length; i++) {
            caller.utils.DB.Delete('players',{id:rem[i]});
          }
          caller.utils.sendCompactEmbed(command.msg.channel, "Complete", "Removed " + rem.length + " inactive users from DB.");
        });
        break;
      case "ban":
        if (command.params[1]) {
          caller.utils.findPlayer(command.params[1]).then(function(res) {
            if (res.found) {
              if (!res.p.banned) {
                res.p.money = 0;
                res.p.income = 0;
                res.p.xp = 0;
                res.p.keys = 0;
                res.p.lv = 0;
                res.p.banned = true;
                res.p.maxIncome = 1000;
                if (command.params[2]) {
                  res.p.banreason = command.params[2]
                } else {
                  res.p.banreason = "You have been banned! The admin that banned you didn't provide a reason."
                }
                caller.utils.sendCompactEmbed(command.msg.channel, "Action Complete", ":white_check_mark: Player: " + res.p.name + " Is now Banned", 3447003);
                caller.utils.updatePlayer(res.p)
              } else {
                res.p.money = 10000;
                res.p.income = 1000;
                res.p.xp = 0;
                res.p.keys = 0;
                res.p.lv = 1;
                res.p.nextlv = 500;
                res.p.banned = false;
                res.p.banreason = "";
                res.p.maxIncome = 1000;
                caller.utils.sendCompactEmbed(command.msg.channel, "Action Complete", ":white_check_mark: Player: " + res.p.name + " Is now Un Banned", 3447003);
                caller.utils.updatePlayer(res.p)
              }
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
            }
          });
        }
        break;
      case "softban":
        if (command.params[1]) {
          caller.utils.findPlayer(command.params[1]).then(function(res) {
            if (res.found) {
              if (!res.p.banned) {
                res.p.banned = true;
                if (command.params[2]) {
                  res.p.banreason = command.params[2]
                } else {
                  res.p.banreason = "You have been banned! The admin that banned you didn't provide a reason."
                }
                caller.utils.sendCompactEmbed(command.msg.channel, "Action Complete", ":white_check_mark: Player: " + res.p.name + " Is now Soft Banned", 3447003);
                caller.utils.updatePlayer(res.p)
              } else {
                res.p.banned = false;
                res.p.banreason = "";
                caller.utils.sendCompactEmbed(command.msg.channel, "Action Complete", ":white_check_mark: Player: " + res.p.name + " Is now Un Soft Banned", 3447003);
                caller.utils.updatePlayer(res.p)
              }
            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
            }
          });
        }
        break;
      case "timeout":
        if (command.params[1]) {
          caller.utils.findPlayer(command.params[1]).then(function(res) {
            if (res.found) {
              switch (res.p.timeout) {
                case undefined:
                case false:
                  res.p.timeout = true;
                  res.p.timeoutCount = 0;
                  res.p.check = {
                    last: 0,
                    lastFull: 0,
                    count: 0,
                    lastTrigger: 0,
                    time: new Date().getTime()
                  }
                  caller.utils.updatePlayer(res.p)
                  caller.bot.createMessage(command.msg.channel.id, {
                    embed: {
                      color: 3447003,
                      title: "Action Complete",
                      description: ":white_check_mark: Player: " + res.p.name + " is now being watched"
                    }
                  })
                  break;
                case true:
                  res.p.timeout = false;
                  res.p.timeoutCount = 0;
                  caller.utils.updatePlayer(res.p)
                  caller.bot.createMessage(command.msg.channel.id, {
                    embed: {
                      color: 3447003,
                      title: "Action Complete",
                      description: ":white_check_mark: Player: " + res.p.name + " is not being watched anymore"
                    }
                  })
                  break;
              }

            } else {
              caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
            }
          });
        }
        break;
      case "player":
        switch (command.params[1]) {
          case "get":
            caller.utils.findPlayer(command.params[2]).then(function(res) {
              if (res.found) {
                var text = JSON.stringify(res.p, false, 2);
                caller.utils.txtup.post(`/upload`,{data: text}).then((data) => {
                    caller.bot.createMessage(command.msg.channel.id, data.data.url)
                  })
                  .catch(err => console.log(err));
              } else {
                caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
              }
            });
            break;
          case "set":
            switch (command.params[2]) {
              case "money":
                caller.utils.findPlayer(command.params[3]).then(function(res) {
                  if (res.found) {
                    var setTo = numeral(command.params[4]).value();
                    if (setTo >= 0) res.p.money = setTo;
                    caller.utils.updatePlayer(res.p)
                    caller.utils.sendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Money set to: $" + setTo, 3447003);
                  } else {
                    caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                  }
                });
                break;
                case "tier":
                  caller.utils.findPlayer(command.params[3]).then(function(res) {
                    if (res.found) {
                      var setTo = numeral(command.params[4]).value();
                      if (setTo >= 0) res.p.tier = setTo;
                      caller.utils.updatePlayer(res.p)
                      caller.utils.sendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Ultra Tier set to: " + setTo, 3447003);
                    } else {
                      caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                    }
                  });
                  break;
                  case "ultra":
                    caller.utils.findPlayer(command.params[3]).then(function(res) {
                      if (res.found) {
                        if (command.params[4] == "true") {
                          res.p.Premium = true;
                        }else {
                          res.p.Premium = false;
                        }
                        caller.utils.updatePlayer(res.p)
                        caller.utils.sendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Ultra set to: " + command.params[4], 3447003);
                      } else {
                        caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                      }
                    });
                    break;
              case "income":
                caller.utils.findPlayer(command.params[3]).then(function(res) {
                  if (res.found) {
                    var setTo = numeral(command.params[4]).value();
                    if (setTo >= 0) res.p.income = setTo;
                    caller.utils.updatePlayer(res.p)
                    caller.utils.sendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Income set to: $" + setTo, 3447003);
                  } else {
                    caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                  }
                });
                break;
              case "xp":
                caller.utils.findPlayer(command.params[3]).then(function(res) {
                  if (res.found) {
                    var setTo = numeral(command.params[4]).value();
                    if (setTo >= 0) res.p.xp = setTo;
                    caller.utils.updatePlayer(res.p)
                    caller.utils.sendCompactEmbed(command.msg.channel, "Complete", res.p.name + " XP set to: " + setTo, 3447003);
                  } else {
                    caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                  }
                });
                break;
              case "name":
                caller.utils.findPlayer(command.params[3]).then(function(res) {
                  if (res.found) {
                    var setTo = command.params[4];
                    var oldname = res.p.name;
                    res.p.name = setTo;
                    caller.utils.updatePlayer(res.p)
                    caller.utils.sendCompactEmbed(command.msg.channel, "Complete", oldname + " Name set to: " + setTo, 3447003);
                  } else {
                    caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                  }
                });
                break;
              case "lv":
                caller.utils.findPlayer(command.params[3]).then(function(res) {
                  if (res.found) {
                    var setTo = numeral(command.params[4]).value();
                    if (setTo >= 0) res.p.lv = setTo;
                    caller.utils.updatePlayer(res.p)
                    caller.utils.sendCompactEmbed(command.msg.channel, "Complete", res.p.name + " LV set to: " + setTo, 3447003);
                  } else {
                    caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                  }
                });
                break;
              case "seconds":
                caller.utils.findPlayer(command.params[3]).then(function(res) {
                  if (res.found) {
                    var setTo = numeral(command.params[4]).value();
                    if (setTo >= 0) res.p.seconds = setTo;
                    caller.utils.updatePlayer(res.p)
                    caller.utils.sendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Seconds set to: " + setTo, 3447003);
                  } else {
                    caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                  }
                });
                break;
              case "maxincome":
                caller.utils.findPlayer(command.params[3]).then(function(res) {
                  if (res.found) {
                    var setTo = numeral(command.params[4]).value();
                    if (setTo >= 0) res.p.maxIncome = setTo;
                    caller.utils.updatePlayer(res.p)
                    caller.utils.sendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Max Income set to: $" + setTo, 3447003);
                  } else {
                    caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                  }
                });
                break;
              case "keys":
                caller.utils.findPlayer(command.params[3]).then(function(res) {
                  if (res.found) {
                    var setTo = numeral(command.params[4]).value();
                    if (setTo >= 0) res.p.keys = setTo;
                    caller.utils.updatePlayer(res.p)
                    caller.utils.sendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Keys set to: " + setTo, 3447003);
                  } else {
                    caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                  }
                });
                break;
              case "admin":
                caller.utils.findPlayer(command.params[3]).then(function(res) {
                  if (res.found) {
                    if (command.params[4] == "true") res.p.Admin = true;
                    if (command.params[4] == "false") res.p.Admin = false;
                    caller.utils.updatePlayer(res.p)
                    caller.utils.sendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Admin set to: " + command.params[4], 3447003);
                  } else {
                    caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                  }
                });
                break;
              case "mod":
                caller.utils.findPlayer(command.params[3]).then(function(res) {
                  if (res.found) {
                    if (command.params[4] == "true") res.p.Mod = true;
                    if (command.params[4] == "false") res.p.Mod = false;
                    caller.utils.updatePlayer(res.p)
                    caller.utils.sendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Mod set to: " + command.params[4], 3447003);
                  } else {
                    caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
                  }
                });
                break;
              default:

            }
            break;
          default:

        }
        break;
      case "prem":
        caller.utils.findPlayer(command.params[1]).then(function(res) {
          if (res.found) {
            if (command.params[2] == "true") {
              res.p.Premium = true;
              res.p.money += 25000;
              res.p.xp += 2000;
            } else if (command.params[2] == "false") {
              res.p.Premium = false;
            }
            caller.utils.updatePlayer(res.p)
            caller.utils.sendCompactEmbed(command.msg.channel, "Complete", res.p.name + " Premium set to: " + res.p.Premium, 3447003);
          } else {
            caller.utils.sendCompactEmbed(command.msg.channel, "Error", res.msg, 16772880);
          }
        });
        break;
      case "eval":
        command.params.splice(0, 1);
        var code = command.params.join(" ");
        console.log(code);
        try {
          var evaled = eval(code);
          if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
          caller.bot.createMessage(command.msg.channel.id, "```\n" + evaled + "\n```");
        } catch (e) {
          caller.bot.createMessage(command.msg.channel.id, "```\n" + e + "\n```");
        }
        break;
      case "listprem":
        caller.DB.Find("players", {}).then(function(players) {
          var msg = "";
          for (var i = 0; i < players.length; i++) {
            if (players[i].Premium) {
              caller.utils.ultraCheck(players[i]).then(function(data) {

              });
              msg += players[i].name + "\n";
            }
          }
          caller.utils.sendCompactEmbed(command.msg.channel, "Premium Users", msg, 3447003);
        });
        break;
      case 'update':
        exec('git pull', (error, stdout, stderr) => {
          if (error) {
            caller.bot.createMessage(command.msg.channel.id, {
              embed: {
                title: 'Pull Error',
                color: 0xb31414,
                description: `\`\`\`\n${error}\n\`\`\``
              }
            })
            return;
          }
          caller.bot.createMessage(command.msg.channel.id, {
            embed: {
              title: 'Pulled',
              color: 3733340,
              fields: [{
                name: 'Output',
                value: `\`\`\`bash\n${stdout}\n\`\`\``
              }]
            }
          })
        });
        break;
      case 'ur':
        exec('git pull', (error, stdout, stderr) => {
          if (error) {
            caller.bot.createMessage(command.msg.channel.id, {
              embed: {
                title: 'Pull Error',
                color: 0xb31414,
                description: `\`\`\`\n${error}\n\`\`\``
              }
            })
            return;
          }
          caller.bot.createMessage(command.msg.channel.id, {
            embed: {
              title: 'Pulled and Now Restarting',
              color: 3733340,
              fields: [{
                name: 'Output',
                value: `\`\`\`bash\n${stdout}\n\`\`\``
              }]
            }
          })
          exec('pm2 restart CasinoBot', (error, stdout, stderr) => {})
        });
        break;
      case 'guilds':
        var sortTypes = {
          'bots': function(a, b) {
            return b[4] - a[4];
          },
          'users': function(a, b) {
            return b[3] - a[3];
          },
          'per': function(a, b) {
            return b[5] - a[5];
          },
          undefined: function(a, b) {
            return b[2] - a[2];
          }
        };
        caller.bot.shard.broadcastEval('var arr = [];var guilds = this.guilds.filterArray((g) => g.memberCount >= 1000);for (var i = 0; i < guilds.length; i++) {;var tarr = [];var bots = guilds[i].members.filterArray(m => m.user.bot).length;tarr.push(guilds[i].id);tarr.push(guilds[i].name);tarr.push(guilds[i].memberCount);tarr.push((guilds[i].memberCount - bots));tarr.push(bots);tarr.push((bots/(guilds[i].memberCount)*100).toFixed(2));arr.push(tarr)};arr').then(servers1000 => {
          var count1000 = []
          for (var i = 0; i < servers1000.length; i++) {
            count1000 = count1000.concat(servers1000[i])
          }
          caller.bot.shard.broadcastEval('var arr = [];var guilds = this.guilds.filterArray((g) => g.memberCount >= 500 && g.memberCount <= 999);for (var i = 0; i < guilds.length; i++) {;var tarr = [];var bots = guilds[i].members.filterArray(m => m.user.bot).length;tarr.push(guilds[i].id);tarr.push(guilds[i].name);tarr.push(guilds[i].memberCount);tarr.push((guilds[i].memberCount - bots));tarr.push(bots);tarr.push((bots/(guilds[i].memberCount)*100).toFixed(2));arr.push(tarr)};arr').then(servers500 => {
            var count500 = []
            for (var i = 0; i < servers500.length; i++) {
              count500 = count500.concat(servers500[i])
            }
            caller.bot.shard.broadcastEval('var arr = [];var guilds = this.guilds.filterArray((g) => g.memberCount >= 250 && g.memberCount <= 499);for (var i = 0; i < guilds.length; i++) {;var tarr = [];var bots = guilds[i].members.filterArray(m => m.user.bot).length;tarr.push(guilds[i].id);tarr.push(guilds[i].name);tarr.push(guilds[i].memberCount);tarr.push((guilds[i].memberCount - bots));tarr.push(bots);tarr.push((bots/(guilds[i].memberCount)*100).toFixed(2));arr.push(tarr)};arr').then(servers250 => {
              var count250 = []
              for (var i = 0; i < servers250.length; i++) {
                count250 = count250.concat(servers250[i])
              }
              caller.bot.shard.broadcastEval('var arr = [];var guilds = this.guilds.filterArray((g) => g.memberCount >= 100 && g.memberCount <= 249);for (var i = 0; i < guilds.length; i++) {;var tarr = [];var bots = guilds[i].members.filterArray(m => m.user.bot).length;tarr.push(guilds[i].id);tarr.push(guilds[i].name);tarr.push(guilds[i].memberCount);tarr.push((guilds[i].memberCount - bots));tarr.push(bots);tarr.push((bots/(guilds[i].memberCount)*100).toFixed(2));arr.push(tarr)};arr').then(servers100 => {
                var count100 = []
                for (var i = 0; i < servers100.length; i++) {
                  count100 = count100.concat(servers100[i])
                }
                caller.bot.shard.broadcastEval('var arr = [];var guilds = this.guilds.filterArray((g) => g.memberCount <= 99);for (var i = 0; i < guilds.length; i++) {;var tarr = [];var bots = guilds[i].members.filterArray(m => m.user.bot).length;tarr.push(guilds[i].id);tarr.push(guilds[i].name);tarr.push(guilds[i].memberCount);tarr.push((guilds[i].memberCount - bots));tarr.push(bots);tarr.push((bots/(guilds[i].memberCount)*100).toFixed(2));arr.push(tarr)};arr').then(servers0 => {
                  var count0 = []
                  for (var i = 0; i < servers0.length; i++) {
                    count0 = count0.concat(servers0[i])
                  }
                  caller.bot.shard.broadcastEval('var arr = [];var guilds = this.guilds.filterArray((g) => g.memberCount > 0);for (var i = 0; i < guilds.length; i++) {;var tarr = [];var bots = guilds[i].members.filterArray(m => m.user.bot).length;tarr.push(guilds[i].id);tarr.push(guilds[i].name);tarr.push(guilds[i].memberCount);tarr.push((guilds[i].memberCount - bots));tarr.push(bots);tarr.push((bots/(guilds[i].memberCount)*100).toFixed(2));arr.push(tarr)};arr').then(total => {
                    var ttotal = []
                    for (var i = 0; i < total.length; i++) {
                      ttotal = ttotal.concat(total[i])
                    }
                    switch (command.params[1]) {
                      case 'massive':
                        var tarr = [
                          ['ID', 'Name', 'Count', 'Users', 'Bots', 'Bot %'],
                          ['', '', '', '', '', '']
                        ];
                        count1000 = count1000.sort(sortTypes[command.params[2]])
                        tarr = tarr.concat(count1000)
                        var t = table(tarr);
                        if (t.length >= 1900) {
                          snekfetch.post(`https://stuff.zira.pw/text`)
                            .send({
                              data: t
                            })
                            .then((data) => {
                              caller.bot.createMessage(command.msg.channel.id, data.body.data.url)
                            })
                            .catch(err => console.error(`Whoops something went wrong: ${err}`));
                        } else caller.bot.createMessage(command.msg.channel.id, `\`\`\`\n${t}\n\`\`\``)
                        break;
                      case 'large':
                        var tarr = [
                          ['ID', 'Name', 'Count', 'Users', 'Bots', 'Bot %'],
                          ['', '', '', '', '', '']
                        ];
                        count500 = count500.sort(sortTypes[command.params[2]])
                        tarr = tarr.concat(count500)
                        var t = table(tarr);
                        if (t.length >= 1900) {
                          snekfetch.post(`https://stuff.zira.pw/text`)
                            .send({
                              data: t
                            })
                            .then((data) => {
                              caller.bot.createMessage(command.msg.channel.id, data.body.data.url)
                            })
                            .catch(err => console.error(`Whoops something went wrong: ${err}`));
                        } else caller.bot.createMessage(command.msg.channel.id, `\`\`\`\n${t}\n\`\`\``)
                        break;
                      case 'big':
                        var tarr = [
                          ['ID', 'Name', 'Count', 'Users', 'Bots', 'Bot %'],
                          ['', '', '', '', '', '']
                        ];
                        count250 = count250.sort(sortTypes[command.params[2]])
                        tarr = tarr.concat(count250)
                        var t = table(tarr);
                        if (t.length >= 1900) {
                          snekfetch.post(`https://stuff.zira.pw/text`)
                            .send({
                              data: t
                            })
                            .then((data) => {
                              caller.bot.createMessage(command.msg.channel.id, data.body.data.url)
                            })
                            .catch(err => console.error(`Whoops something went wrong: ${err}`));
                        } else caller.bot.createMessage(command.msg.channel.id, `\`\`\`\n${t}\n\`\`\``)
                        break;
                      case 'normal':
                        var tarr = [
                          ['ID', 'Name', 'Count', 'Users', 'Bots', 'Bot %'],
                          ['', '', '', '', '', '']
                        ];
                        count100 = count100.sort(sortTypes[command.params[2]])
                        tarr = tarr.concat(count100)
                        var t = table(tarr);
                        if (t.length >= 1900) {
                          snekfetch.post(`https://stuff.zira.pw/text`)
                            .send({
                              data: t
                            })
                            .then((data) => {
                              caller.bot.createMessage(command.msg.channel.id, data.body.data.url)
                            })
                            .catch(err => console.error(`Whoops something went wrong: ${err}`));
                        } else caller.bot.createMessage(command.msg.channel.id, `\`\`\`\n${t}\n\`\`\``)
                        break;
                      case 'small':
                        var tarr = [
                          ['ID', 'Name', 'Count', 'Users', 'Bots', 'Bot %'],
                          ['', '', '', '', '', '']
                        ];
                        count0 = count0.sort(sortTypes[command.params[2]])
                        tarr = tarr.concat(count0)
                        var t = table(tarr);
                        if (t.length >= 1900) {
                          snekfetch.post(`https://stuff.zira.pw/text`)
                            .send({
                              data: t
                            })
                            .then((data) => {
                              caller.bot.createMessage(command.msg.channel.id, data.body.data.url)
                            })
                            .catch(err => console.error(`Whoops something went wrong: ${err}`));
                        } else caller.bot.createMessage(command.msg.channel.id, `\`\`\`\n${t}\n\`\`\``)
                        break;
                      case 'total':
                        var tarr = [
                          ['ID', 'Name', 'Count', 'Users', 'Bots', 'Bot %'],
                          ['', '', '', '', '', '']
                        ];
                        ttotal = ttotal.sort(sortTypes[command.params[2]])
                        tarr = tarr.concat(ttotal)
                        var t = table(tarr);
                        if (t.length >= 1900) {
                          snekfetch.post(`https://stuff.zira.pw/text`)
                            .send({
                              data: t
                            })
                            .then((data) => {
                              caller.bot.createMessage(command.msg.channel.id, data.body.data.url)
                            })
                            .catch(err => console.error(`Whoops something went wrong: ${err}`));
                        } else caller.bot.createMessage(command.msg.channel.id, `\`\`\`\n${t}\n\`\`\``)
                        break;

                      default:
                        var t = table([
                          ['Type', 'Count'],
                          ['', ''],
                          ['Massive (1000+)', count1000.length],
                          ['Large (500+)', count500.length],
                          ['Big (250+)', count250.length],
                          ['Normal (100+)', count100.length],
                          ['Small', count0.length],
                          ['Total', total.length]
                        ]);
                        caller.bot.createMessage(command.msg.channel.id, `\`\`\`\n${t}\n\`\`\``);
                    }
                  })
                })
              })
            })
          })
        })
        break;
      case 'leave':
        caller.bot.shard.broadcastEval(`var g=this.guilds.get('${command.params[1]}');if(g!=undefined){g.leave()}`).then(console.log).catch(console.error)
        break;
      case 'blacklist':
        switch (command.params[1]) {
          case 'add':
            var guild = caller.bot.guilds.get(command.params[2]);
            if (guild != undefined) {
              var owner = caller.bot.users.get(guild.ownerID);
              if (owner != undefined) {
                owner.getDMChannel().then(function(dmc) {
                  caller.bot.createMessage(dmc.id, "Your Guild: " + guild.name + " was blacklisted from the bot.")
                })
              }
              caller.bot.leaveGuild(guild.id);
              caller.DB.Find("guildBL", {id: guild.id}).then(function(blg) {
                if (blg.length > 0) {
                  caller.bot.createMessage(command.msg.channel.id, "Guild: " + guild.name + " was already blacklisted from the bot.")
                }else{
                  caller.DB.Insert("guildBL", {id: guild.id});
                  caller.bot.createMessage(command.msg.channel.id, "Guild: " + guild.name + " was blacklisted from the bot.")
                }
              });
            }else{
              caller.DB.Find("guildBL", {id: command.params[2]}).then(function(blg) {
                if (blg.length > 0) {
                  caller.bot.createMessage(command.msg.channel.id, "Guild: " + command.params[2] + " was already blacklisted from the bot.")
                }else{
                  caller.DB.Insert("guildBL", {id: command.params[2]});
                  caller.bot.createMessage(command.msg.channel.id, "Guild: " + command.params[2] + " was blacklisted from the bot.")
                }
              });
            }
            break;
          case 'remove':
            caller.DB.Find("guildBL", {id: command.params[2]}).then(function(blg) {
              if (blg.length > 0) {
                caller.DB.Delete("guildBL",{id: command.params[2]});
                caller.bot.createMessage(command.msg.channel.id, "Guild: " + command.params[2] + " is no longer blacklisted.")
              }else{
                caller.bot.createMessage(command.msg.channel.id, "Guild: " + command.params[2] + " is not blacklisted from the bot.")
              }
            });
            break;
        }
        break;
      case 'guild':
        var guild = caller.bot.guilds.get(command.params[1]);
        if (guild == undefined) {
          caller.bot.createMessage(command.msg.channel.id, "Guild not found",)
        }else{
          var res = JSON.stringify(guild, null, 4)
          if (res.length >= 2000) {
            caller.utils.txtup.post(`/upload`,{data: res}).then((data) => {
              caller.bot.createMessage(command.msg.channel.id, data.data.url)
            })
            .catch(err => console.log(err));
          } else caller.bot.createMessage(command.msg.channel.id, "```json\n" + res + "\n```",)
        }
        break;
      case 'guildmem':
        var guild = caller.bot.guilds.get(command.params[1]);
        if (guild == undefined) {
          caller.bot.createMessage(command.msg.channel.id, "Guild not found",)
        }else{
          var final = {res:[]};
          guild.members.forEach(function(value, key) {
            final.res.push({
              id: key,
              username: value.username,
              nick: value.nick
            })
          })
          var res = JSON.stringify(final, null, 4)
          if (res.length >= 2000) {
            caller.utils.txtup.post(`/upload`,{data: res}).then((data) => {
              caller.bot.createMessage(command.msg.channel.id, data.data.url)
            })
            .catch(err => console.log(err));
          } else caller.bot.createMessage(command.msg.channel.id, "```json\n" + res + "\n```",)
        }
        break;
      case 'user':
        var final = {res:[]};
        caller.bot.guilds.forEach(function(value, key) {
          if (value.members.has(command.params[1])) {
            final.res.push({
              name: value.name,
              serverID: key,
              ownerID: value.ownerID,
              created: new Date(value.createdAt),
              members: value.memberCount
            });
          }
        })
        var res = JSON.stringify(final, null, 4)
        if (res.length >= 2000) {
          caller.utils.txtup.post(`/upload`,{data: res}).then((data) => {
            caller.bot.createMessage(command.msg.channel.id, data.data.url)
          })
          .catch(err => console.log(err));
        } else caller.bot.createMessage(command.msg.channel.id, "```json\n" + res + "\n```",)
        break;
      default:

    }
  }).catch(function(err) {
    console.log(err);
    caller.utils.sendCompactEmbed(command.msg.channel, "Error", "Oh, no! The API is down. Please try again in 5 minutes. If it's still down, yell at FireGamer3.", 16772880);
  });
};
exports.settings = function() {
  return {
    show: false, // show in help true false
    type: "command" //command or game
  };
};
