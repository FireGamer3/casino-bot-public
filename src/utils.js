const numeral = require('numeral');
const logger = require('disnode-logger');
const axios = require("axios");
const snekfetch = require('snekfetch');
//const discord = require('../discord.js');

class Utils {
  constructor(bot, config, DB) {
    var self = this;
    this.DB = DB;
    this.bot = bot;
    this.config = config;
    logger.Success("Utils", "Start", "Utils Started!");
  }
  sendCompactEmbed(channel, title, msg, color = 3447003) {
    var self = this;
    self.bot.createMessage(channel.id,{
      embed: {
        color: color,
        title: title,
        description: msg
      }
    });
  }
  getElapsedTime(ms) {
    var days = 0;
    var hours = 0;
    var minutes = 0;
    var seconds = parseInt(ms / 1000);
    var miliseconds = ms % 1000;
    while (seconds >= 60) {
      minutes++;
      seconds -= 60;
      if (minutes == 60) {
        hours++;
        minutes = 0;
      }
      if (hours == 24) {
        days++
        hours = 0;
      }
    }
    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      miliseconds: miliseconds
    }
  }
  getTime(time) {
    var currentTime = new Date();
    var elapsed = currentTime - time;
    var weeks = 0;
    var days = 0;
    var hours = 0;
    var minutes = 0;
    var seconds = parseInt(elapsed / 1000);
    while (seconds >= 60) {
      minutes++;
      seconds -= 60;
      if (minutes == 60) {
        hours++;
        minutes = 0;
      }
      if (hours == 24) {
        days++
        hours = 0;
      }
      if (days >= 7) {
        weeks++;
        days = 0;
      }
    }
    if (weeks > 0) {
      return weeks + "w " + days + " d " + hours + " h " + minutes + " m " + seconds + " s";
    } else if (days > 0) {
      return days + " d " + hours + " h " + minutes + " m " + seconds + " s";
    } else if (hours > 0) {
      return hours + " h " + minutes + " m " + seconds + " s";
    } else if (minutes > 0) {
      return minutes + " m " + seconds + " s";
    } else {
      return seconds + " s";
    }
  }
  getPlayer(user) {
    var self = this;
    var players = [];
    return new Promise(function(resolve, reject) {
      self.csAPI.get("/player/" + user.id).then(function(resp) {
        resolve(resp.data);
      }).catch(function(err) {
        if (err.response != undefined) {
          if (err.response.status == 404) {
            console.log(`Adding ${user.username} to DB`);
            var newPlayer = {
              name: user.username,
              id: user.id,
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
              created: parseInt(new Date().getTime()),
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
            self.updatePlayer(newPlayer);
            self.csAPI.post("/player/new" + newPlayer.id, newPlayer).then(function(resp) {}).catch(function(err) {
              reject(err);
            });
            resolve(newPlayer);
          }
        } else if (err.status == 404) {
          console.log(`Adding ${user.username} to DB`);
          var newPlayer = {
            name: user.username,
            id: user.id,
            money: 10000,
            income: 1000,
            maxIncome: 1000,
            xp: 0,
            lv: 1,
            nextlv: 500,
            Premium: false,
            Admin: false,
            Mod: false,
            banned: false,
            banreason: "",
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
            created: parseInt(new Date().getTime()),
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
          self.updatePlayer(newPlayer);
          self.csAPI.post("/player/new" + newPlayer.id, newPlayer).then(function(resp) {}).catch(function(err) {
            reject(err);
          });
          resolve(newPlayer);

        } else {
          reject(err);
        }
      });
    });
  }
  findPlayer(info) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.csAPI.get("/players/" + info).then(function(resp) {
        resolve(resp.data);
      }).catch(function(err) {
        reject(err);
      });
    });
  }
  checkBan(player, command) {
    var self = this;
    if (player.banned) {
      logger.Warning("Command", "Ban", "Player: " + player.name + " tried using " + command.command + " when they are banned!");
      self.bot.createMessage(command.msg.channel.id,{
        embed: {
          color: 16711680,
          author: {},
          fields: [{
            name: "You have been banned!",
            inline: false,
            value: ":octagonal_sign: You are banned! heres why: ``` " + player.banreason + "```",
          }, {
            name: 'Ban Appeal',
            inline: false,
            value: "**If you wish to appeal your ban you will have to do so in this discord channel: ** https://join.disnode.app",
          }],
          footer: {}
        }
      });
      return true;
    } else if (player.timeout) {
      if ((new Date().getTime() - player.check.time) < 30000) {
        self.Webhooktimeout({
          embeds: [{
            color: 16772880,
            title: 'User in Timeout',
            description: `**Time Left:** ${(30000-(new Date().getTime() - player.check.time))}ms\n**Name:** ${player.name}\n**ID:** ${player.id}\n**Command:** ${command.command}`,
            timestamp: new Date()
          }]
        })
        logger.Warning("Command", "Timeout Check", "Player: " + player.name + " tried using " + command.command + " while they are in a timeout!");
        self.bot.createMessage(command.msg.channel.id,{
          embed: {
            color: 16772880,
            fields: [{
              name: 'Random User Check',
              inline: false,
              value: 'Stop doing commands. You will be able to return to playing in 30 seconds.',
            }],
          }
        });
        player.timeoutCount++
          if (player.timeoutCount >= 4) {
            player.banned = true;
            player.banreason = "You have been automatically banned for macros/botting."
            self.Webhooktimeout({
              embeds: [{
                color: 0xb31414,
                title: 'User Banned in Timeout',
                description: `**Name:** ${player.name}\n**ID:** ${player.id}\n**Command:** ${command.command}`,
                timestamp: new Date()
              }]
            })
          }
        self.updatePlayer(player)
        return true;
      } else {
        player.timeout = false
        self.Webhooktimeout({
          embeds: [{
            color: 3447003,
            title: 'User Removed from Timeout',
            description: `**Name:** ${player.name}\n**ID:** ${player.id}\n**Command:** ${command.command}`,
            timestamp: new Date()
          }]
        })
        self.updatePlayer(player)
        return false;
      }

    } else {
      return false;
    }
  }
  doChannelCheck(command) {
    if (command.msg.channel.guild == undefined) return true;
    if (command.msg.channel.guild.id == '236338097955143680') {
      let allowed = false;
      switch (command.msg.channel.id) {
        case '269892884688404482':
          allowed = true;
          break;
        case '298617222765608963':
          allowed = true;
          break;
        case '428011794523488267':
          allowed = true;
          break;
        case '269839796069859328':
          allowed = true;
          break;
        case '409813144983306241':
          allowed = true;
          break;
        case '440601051893071913':
          allowed = true;
          break;
      }
      return allowed;
    } else return true;
  }
  getCasinoObj() {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.csAPI.get("/cobj").then(function(resp) {
        resolve(resp.data);
      }).catch(function(err) {
        reject(err);
      });
    });
  }
  updateCasinoObj(cobj) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.csAPI.post("/cobj", cobj).then(function(resp) {
        if (resp.status == 200) {
          resolve();
        } else {
          console.log(resp.data);
          reject(resp.data.error);
        }
      });
    });
  }
  updatePlayer(player) {
    var self = this;
    self.csAPI.post("/players/" + player.id, player).then(function(resp) {});
  }
  checkTimeout(player) {
    var self = this;
    var currentDate = new Date().getTime();
    if (player.seconds == undefined) {
      player.seconds = 5;
    }
    var seconds = JSON.parse(JSON.stringify(player.seconds));
    if (player.Premium && player.tier >= 2) seconds -= 2;
    if (player.Admin) seconds = 0;
    if (player.timerwarn == undefined) {
      player.timerwarn = 0;
    }
    if (player.lastMessage == null) {
      player.timerwarn = 0;
      return {
        pass: true
      };
    }
    var targetMS = player.lastMessage + (seconds * 1000);
    var remainingMS = currentDate - targetMS;
    if (remainingMS >= 0) {
      var elapsedObj = self.getElapsedTime(remainingMS);
      player.timerwarn = 0;
      if (!player.Admin) {
        if (player.check == undefined) {
          player.check = {
            last: remainingMS,
            lastFull: 0,
            count: 0,
            lastTrigger: 0,
            time: null
          }
        } else {
          var timeCheck = player.check.last - remainingMS
          if (timeCheck <= 25 && timeCheck >= -25) {
            if ((currentDate - player.check.lastFull) >= (3000 + (seconds * 1000))) { // 5 seconds after timeout taking into account of the actual timeout
              player.check.count = 0
            }
            player.check.count++;
            player.check.lastTrigger = new Date().getTime()
            if (player.check.count >= 5) {
              player.check.count = 0
              player.check.time = new Date().getTime()
              self.Webhooktimeout({
                embeds: [{
                  color: 16772880,
                  title: 'User Reached Threshold',
                  description: `**Name:** ${player.name}\n**ID:** ${player.id}`,
                  timestamp: new Date()
                }]
              })
            }
          }
          player.check.last = remainingMS
          player.check.lastFull = new Date().getTime()
        }
      }

      return {
        pass: true,
        remain: elapsedObj.days + " Day " + elapsedObj.hours + " Hours " + elapsedObj.minutes + " Minutes " + elapsedObj.seconds + " Seconds " + elapsedObj.miliseconds + " Miliseconds"
      };
    } else {
      remainingMS = -remainingMS;
      player.timerwarn++;
      var timerwarn = '';
      if (player.timerwarn >= 3) {
        player.seconds++;
        player.timerwarn = 0;
        timerwarn = '\n\nBecause you keep spamming commands you are now forced to wait one second longer each timer interval.\nYou can appeal this timer by using `cs/appeal`.'
      }
      var elapsedObj = self.getElapsedTime(remainingMS);
      return {
        pass: false,
        remain: elapsedObj.minutes + " M, " + elapsedObj.seconds + " S",
        tw: timerwarn
      };
    }
  }
  checkAppeal(player) {
    var self = this;
    var currentDate = new Date().getTime();
    if (player.lastAppeal == null) {
      return {
        pass: true
      };
    }
    var targetMS = player.lastAppeal + 604800000;
    var remainingMS = currentDate - targetMS;
    if (remainingMS >= 0) {
      var elapsedObj = self.getElapsedTime(remainingMS);
      return {
        pass: true,
        remain: elapsedObj.days + " Days" + elapsedObj.hours + " Hours " + elapsedObj.minutes + " Minutes " + elapsedObj.seconds + " Seconds " + elapsedObj.miliseconds + " Miliseconds"
      };
    } else {
      remainingMS = -remainingMS;
      var elapsedObj = self.getElapsedTime(remainingMS);
      return {
        pass: false,
        remain: elapsedObj.days + " Days, " + elapsedObj.hours + " Hours, " + elapsedObj.minutes + " Minutes, " + elapsedObj.seconds + " Seconds"
      };
    }
  }
  checkLoan(player) {
    var self = this;
    var currentDate = new Date().getTime();
    if (!player.lastLoan) {
      return {
        pass: true
      };
    }
    var targetMS = player.lastLoan + 345600000;
    var remainingMS = currentDate - targetMS;
    if (remainingMS >= 0) {
      var elapsedObj = self.getElapsedTime(remainingMS);
      return {
        pass: true,
        remain: elapsedObj.days + " Days" + elapsedObj.hours + " Hours " + elapsedObj.minutes + " Minutes " + elapsedObj.seconds + " Seconds " + elapsedObj.miliseconds + " Miliseconds"
      };
    } else {
      remainingMS = -remainingMS;
      var elapsedObj = self.getElapsedTime(remainingMS);
      return {
        pass: false,
        remain: elapsedObj.days + " Days, " + elapsedObj.hours + " Hours, " + elapsedObj.minutes + " Minutes, " + elapsedObj.seconds + " Seconds"
      };
    }
  }
  slotWin(slot) {
    var self = this;
    if (slot.player.tower != undefined) {
      if ((slot.player.money + (slot.player.bank / 2) + slot.player.tower.bet) > 8500) {
        var minJackpotBet = ((slot.player.money + (slot.player.bank /2) + slot.player.tower.bet) * 0.03);
      } else var minJackpotBet = 250;
    }else {
      if ((slot.player.money + (slot.player.bank / 2)) > 8500) {
        var minJackpotBet = ((slot.player.money + (slot.player.bank /2)) * 0.03);
      } else var minJackpotBet = 250;
    }
    minJackpotBet = parseFloat(minJackpotBet.toFixed(2));
    slot.player.stats.slotPlays++;
    if ((slot.reel1 == ":100:") && (slot.reel2 == ":100:") && (slot.reel3 == ":100:")) {
      if (slot.bet < minJackpotBet) {
        slot.winAmount = parseFloat((slot.bet * 60).toFixed(2));
        slot.winText = slot.pack.slotCommand.reward.fakeJackpot;
      } else {
        slot.winAmount = parseFloat(slot.casinoObj.jackpotValue);
        slot.casinoObj.jackpotValue = 100000;
        slot.winText = slot.pack.slotCommand.reward.jackpotWin;
        slot.casinoObj.jackpotstat.lastWon = slot.player.name;
        slot.casinoObj.jackpotstat.LatestWin = slot.winAmount;
      }
      slot.player.stats.slotJackpots++;
      slot.player.stats.slotWins++;
      slot.winAmount *= slot.player.prestige.payoutMult
      slot.player.money += parseFloat(slot.winAmount);
      slot.player.xp += 1000;
      return;
    }
    if ((slot.reel1 == ":first_place:") && (slot.reel2 == ":first_place:") && (slot.reel3 == ":first_place:")) {
      slot.winAmount = parseFloat((slot.bet * 16).toFixed(2));
      slot.winText = slot.pack.slotCommand.reward.firstWin;
      if ((slot.player.Premium && slot.player.tier == 3 ) || slot.player.Admin) {
        slot.winText += slot.pack.slotCommand.reward.ultraBonus;
        slot.winAmount += parseFloat(slot.winAmount);
      }
      slot.player.stats.slot1s++;
      slot.player.stats.slotWins++;
      slot.winAmount *= slot.player.prestige.payoutMult
      slot.player.money += parseFloat(slot.winAmount);
      if (slot.bet >= 250) {
        slot.player.xp += 80;
      } else {
        slot.winText += slot.pack.slotCommand.reward.noXPWarn
      }
      return;
    }
    if ((slot.reel1 == ":second_place:") && (slot.reel2 == ":second_place:") && (slot.reel3 == ":second_place:")) {
      slot.winAmount = parseFloat((slot.bet * 8).toFixed(2));
      slot.winText = slot.pack.slotCommand.reward.secondWin;
      if ((slot.player.Premium && slot.player.tier == 3 ) || slot.player.Admin) {
        slot.winText += slot.pack.slotCommand.reward.ultraBonus;
        slot.winAmount += parseFloat(slot.winAmount);
      }
      slot.player.stats.slot2s++;
      slot.player.stats.slotWins++;
      slot.winAmount *= slot.player.prestige.payoutMult
      slot.player.money += parseFloat(slot.winAmount);
      if (slot.bet >= 250) {
        slot.player.xp += 40;
      } else {
        slot.winText += slot.pack.slotCommand.reward.noXPWarn
      }
      return;
    }
    if ((slot.reel1 == ":third_place:") && (slot.reel2 == ":third_place:") && (slot.reel3 == ":third_place:")) {
      slot.winAmount = parseFloat((slot.bet * 4).toFixed(2));
      slot.winText = slot.pack.slotCommand.reward.thirdWin;
      if ((slot.player.Premium && slot.player.tier == 3 ) || slot.player.Admin) {
        slot.winText += slot.pack.slotCommand.reward.ultraBonus;
        slot.winAmount += parseFloat(slot.winAmount);
      }
      slot.player.stats.slot3s++;
      slot.player.stats.slotWins++;
      slot.winAmount *= slot.player.prestige.payoutMult
      slot.player.money += parseFloat(slot.winAmount);
      if (slot.bet >= 250) {
        slot.player.xp += 20;
      } else {
        slot.winText += slot.pack.slotCommand.reward.noXPWarn
      }
      return;
    }
    if ((slot.reel1 == ":cherries:") && (slot.reel2 == ":cherries:") && (slot.reel3 == ":cherries:")) {
      slot.winAmount = parseFloat((slot.bet * 2).toFixed(2));
      slot.winText = slot.pack.slotCommand.reward.cherriesWin;
      if ((slot.player.Premium && slot.player.tier == 3 ) || slot.player.Admin) {
        slot.winText += slot.pack.slotCommand.reward.ultraBonus;
        slot.winAmount += parseFloat(slot.winAmount);
      }
      slot.player.stats.slotTripleC++;
      slot.player.stats.slotWins++;
      slot.winAmount *= slot.player.prestige.payoutMult
      slot.player.money += parseFloat(slot.winAmount);
      if (slot.bet >= 250) {
        slot.player.xp += 10;
      } else {
        slot.winText += slot.pack.slotCommand.reward.noXPWarn
      }
      return;
    }
    if ((slot.reel1 == ":key:") && (slot.reel2 == ":key:") && (slot.reel3 == ":key:")) {
      if (slot.bet < minJackpotBet) {
        slot.winText = slot.pack.slotCommand.reward.triKeyWin + slot.pack.slotCommand.reward.keyNoMin;
        return;
      }
      slot.winText = slot.pack.slotCommand.reward.triKeyWin;
      slot.player.keys += 3;
      return;
    }
    if ((slot.reel1 == ":package:") && (slot.reel2 == ":package:") && (slot.reel3 == ":package:")) {
      if (slot.bet < minJackpotBet) {
        slot.winText = slot.pack.slotCommand.reward.triCrateWin + slot.pack.slotCommand.reward.crateNoMin;
        return;
      } else {
        slot.winText = slot.pack.slotCommand.reward.triCrateWin;
        for (var i = 0; i < 4; i++) {
          slot.player.crates[self.getRandomIntInclusive(0, 5)]++;
        }
        return;
      }
    }
    if ((slot.reel1 == ":package:") || (slot.reel2 == ":package:") || (slot.reel3 == ":package:")) {
      if (slot.bet < minJackpotBet) {
        slot.winText = slot.pack.slotCommand.reward.crateWin + slot.pack.slotCommand.reward.crateNoMin;
      } else {
        slot.winText = slot.pack.slotCommand.reward.crateWin;
        slot.player.crates[self.getRandomIntInclusive(0, 5)]++;
      }
    }
    if ((slot.reel1 == ":key:") || (slot.reel2 == ":key:") || (slot.reel3 == ":key:")) {
      if (slot.bet < minJackpotBet) {
        slot.winText += slot.pack.slotCommand.reward.keyWin + slot.pack.slotCommand.reward.keyNoMin;
      } else {
        slot.winText += slot.pack.slotCommand.reward.keyWin;
        slot.player.keys++;
      }
    }
    if ((slot.reel1 == ":cherries:") || (slot.reel2 == ":cherries:") || (slot.reel3 == ":cherries:")) {
      slot.winAmount = parseFloat((slot.bet / 2).toFixed(2));
      slot.winText += slot.pack.slotCommand.reward.cherriesHalf;
      slot.player.stats.slotSingleC++;
      slot.player.stats.slotWins++;
      slot.winAmount *= slot.player.prestige.payoutMult
      slot.player.money += parseFloat(slot.winAmount);
      if (slot.bet >= 250) {
        slot.player.xp += 5;
      } else {
        slot.winText += slot.pack.slotCommand.reward.noXPWarn;
      }
      return;
    }
    slot.winAmount = 0;
    slot.winText += slot.pack.slotCommand.reward.noWin;
    if (slot.bet >= 250) {
      slot.player.xp += 1;
    } else {
      slot.winText += slot.pack.slotCommand.reward.noXPWarn;
    }
  }
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  updateLastSeen(player) {
    var date = new Date().getTime();
    player.lastSeen = parseInt(date);
  }
  checkLV(player, channel) {
    var self = this;
    var lvup = false;
    while (player.xp >= (player.nextlv)) {
      player.lv++;
      player.maxIncome = player.maxIncome * 1.05;
      player.nextlv += (200 * player.lv);
      lvup = true;
    }
    if (lvup) self.sendCompactEmbed(channel, player.name + " Level Up!", "**You are now a Lv:** " + player.lv + "\n**Your max income has been increased to:** $" + numeral(player.maxIncome).format('0,0.00'), 1433628);
  }
  updatePlayerLastMessage(player) {
    var currentDate = new Date().getTime();
    player.lastMessage = parseInt(currentDate);
  }
  getPlatformUser(UserID) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.disnodeAPI.get("/user/" + UserID).then((res) => {
        if (res.data.type == "ERR") {
          reject(res.data.data);
          return;
        }
        resolve(res.data.data);
      }).catch((err) => {
        reject(err.message)
      });
    });
  }
  getUltraUsers() {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.disnodeAPI.get("/user/ultra").then((res) => {
        if (res.data.type == "ERR") {
          reject(res.data.data);
          return;
        }
        resolve(res.data.data);
      }).catch((err) => {
        reject(err.message)
      });
    });
  }
  updateUltraUsers() {
    var self = this;
    var currentUltras = [];
    var ultras = [];
    var apiUltra = [];
    var newUltra = [];
    var notInApi = [];
    self.DB.Find("players", {}).then(function(players) {
      for (var i = 0; i < players.length; i++) {
        if (players[i].Premium) {
          currentUltras.push(players[i]);
        }
      }
      self.getUltraUsers().then(function(apiUltra) {
        ultras = JSON.parse(JSON.stringify(apiUltra));
        for (var i = 0; i < currentUltras.length; i++) {
          var found = false;
          for (var j = 0; j < ultras.length; j++) {
            if (currentUltras[i].id == ultras[j].id) {
              found = true;
              break;
            }
          }
          if (!found) {
            notInApi.push(currentUltras[i]);
          }
        }
        for (var i = 0; i < ultras.length; i++) {
          var found = false;
          for (var j = 0; j < currentUltras.length; j++) {
            if (currentUltras[j].id == ultras[i].id) {
              found = true;
              break;
            }
          }
          if (!found) {
            newUltra.push(ultras[i]);
          }
        }
        for (var i = 0; i < newUltra.length; i++) {
          console.log(newUltra);
          self.DB.Find("players", {
            "id": newUltra[i].id
          }).then((data) => {
            console.log(data);
            if (data[0] != undefined) {
              var p = data[0];
              if (p["_id"]) delete p["_id"];
              p.Premium = true;
              self.DB.Update("players", {
                "id": p.id
              }, p);
            }
          });
        }
        for (var i = 0; i < notInApi.length; i++) {
          self.DB.Find("players", {
            "id": notInApi[i].id
          }).then((data) => {
            if (data != undefined) {
              var p = data[0];
              if (p["_id"]) delete p["_id"];
              p.Premium = false;
              self.DB.Update("players", {
                "id": p.id
              }, p);
            }
          });
        }
      });
    });
  }
  orgArray(array, orgMember) {
    var temp = [];
    for (var i = 0; i < array.length; i++) {
      var placed = false;
      for (var x = 0; x < temp.length; x++) {
        if (array[i][orgMember] > temp[x][orgMember]) {
          temp.splice(x, 0, array[i]);
          placed = true;
          break;
        }
      }
      if (!placed) {
        temp.push(array[i]);
      }
    }
    return temp;
  }
  pageArray(array, page = 1, maxElements = 10) {
    var temp = [];
    if (page == 1) {
      page = 1;
      var startindex = 0
      var maxindex = maxElements;
    } else {
      var maxindex = (page * maxElements);
      var startindex = maxindex - maxElements;
    }
    for (var i = startindex; i < array.length; i++) {
      if (i == maxindex) break;
      temp.push(array[i]);
    }
    return temp;
  }
  calculateWheelWins(wheelInfo) {
    if (wheelInfo.wheelNumber >= 25 && wheelInfo.wheelNumber <= 36) { //WIN 3rd
      wheelInfo.player.stats.wheelLandedsections++;
    } else if (wheelInfo.wheelNumber >= 13 & wheelInfo.wheelNumber <= 24) { //WIN 2nd
      wheelInfo.player.stats.wheelLandedsections++;
    } else if (wheelInfo.wheelNumber >= 1 & wheelInfo.wheelNumber <= 12) { //WIN 1st
      wheelInfo.player.stats.wheelLandedsections++;
    }
    if ((wheelInfo.wheelNumber % 2) != 0) { //WIN Odd
      wheelInfo.player.stats.wheelLandedevenodd++;
    } else if ((wheelInfo.wheelNumber % 2) == 0) { //WIN Even
      wheelInfo.player.stats.wheelLandedevenodd++;
    }
    if (wheelInfo.ball.type == 2) { //WIN Black
      wheelInfo.player.stats.wheelLandedcolor++;
    } else if (wheelInfo.ball.type == 1) { //WIN Red
      wheelInfo.player.stats.wheelLandedcolor++;
    }
    if (wheelInfo.wheelNumber >= 1 && wheelInfo.wheelNumber <= 18) { //WIN Low
      wheelInfo.player.stats.wheelLandedlowhigh++;
    } else if (wheelInfo.wheelNumber >= 19 && wheelInfo.wheelNumber <= 36) { //WIN high
      wheelInfo.player.stats.wheelLandedlowhigh++;
    }
    if (wheelInfo.wheelNumber == 0) { //WIN 0
      wheelInfo.player.stats.wheelLanded0++;
    } else {
      wheelInfo.player.stats.wheelLandedNumber++;
    }
    for (var i = 0; i < wheelInfo.winspots.length; i++) {
      if ((wheelInfo.wheelNumber % 2) == 0) { //WIN Even
        if (wheelInfo.winspots[i] == "even" && wheelInfo.winspots.indexOf("odd") == -1) {
          if (wheelInfo.wheelNumber != 0) {
            wheelInfo.player.stats.wheelevenodd++;
            wheelInfo.winAmount += (wheelInfo.betperspot * 2);
            wheelInfo.xpAward += 5;
            continue;
          }
        }else if (wheelInfo.winspots[i] == "even") {
          if (wheelInfo.wheelNumber != 0) {
            wheelInfo.player.stats.wheelevenodd++;
            wheelInfo.winAmount += (wheelInfo.betperspot * 2);
            continue;
          }
        }
      }
      if ((wheelInfo.wheelNumber % 2) != 0) { //WIN Odd
        if (wheelInfo.winspots[i] == "odd" && wheelInfo.winspots.indexOf("even") == -1) {
          if (wheelInfo.wheelNumber != 0) {
            wheelInfo.player.stats.wheelevenodd++;
            wheelInfo.winAmount += (wheelInfo.betperspot * 2);
            wheelInfo.xpAward += 5;
            continue;
          }
        }else if (wheelInfo.winspots[i] == "odd") {
          if (wheelInfo.wheelNumber != 0) {
            wheelInfo.player.stats.wheelevenodd++;
            wheelInfo.winAmount += (wheelInfo.betperspot * 2);
            continue;
          }
        }
      }
      if (wheelInfo.ball.type == 1) { //WIN Red
        if (wheelInfo.winspots[i] == "red" && wheelInfo.winspots.indexOf("black") == -1) {
          wheelInfo.player.stats.wheelcolor++;
          wheelInfo.winAmount += (wheelInfo.betperspot * 2);
          wheelInfo.xpAward += 5;
          continue;
        }else if (wheelInfo.winspots[i] == "red") {
          wheelInfo.player.stats.wheelcolor++;
          wheelInfo.winAmount += (wheelInfo.betperspot * 2);
          continue;
        }
      }
      if (wheelInfo.ball.type == 2) { //WIN Black
        if (wheelInfo.winspots[i] == "black" && wheelInfo.winspots.indexOf("red") == -1) {
          wheelInfo.player.stats.wheelcolor++;
          wheelInfo.winAmount += (wheelInfo.betperspot * 2);
          wheelInfo.xpAward += 5;
          continue;
        }else if (wheelInfo.winspots[i] == "black") {
          wheelInfo.player.stats.wheelcolor++;
          wheelInfo.winAmount += (wheelInfo.betperspot * 2);
          continue;
        }
      }
      if (wheelInfo.wheelNumber >= 1 && wheelInfo.wheelNumber <= 18) { //WIN Low
        if (wheelInfo.winspots[i] == "low") {
          wheelInfo.player.stats.wheellowhigh++;
          wheelInfo.winAmount += (wheelInfo.betperspot * 2);
          wheelInfo.xpAward += 10;
          continue;
        }
      }
      if (wheelInfo.wheelNumber >= 19 && wheelInfo.wheelNumber <= 36) { //WIN high
        if (wheelInfo.winspots[i] == "high") {
          wheelInfo.player.stats.wheellowhigh++;
          wheelInfo.winAmount += (wheelInfo.betperspot * 2);
          wheelInfo.xpAward += 10;
          continue;
        }
      }
      if (wheelInfo.wheelNumber >= 1 & wheelInfo.wheelNumber <= 12) { //WIN 1st
        if (wheelInfo.winspots[i] == "1st") {
          if (wheelInfo.whatcontains.has1st && wheelInfo.whatcontains.has2nd && wheelInfo.whatcontains.has3rd) {
            wheelInfo.player.stats.wheelsections++;
            wheelInfo.winAmount += (wheelInfo.betperspot * 2);
            wheelInfo.xpAward += 25;
            continue;
          } else {
            wheelInfo.player.stats.wheelsections++;
            wheelInfo.winAmount += (wheelInfo.betperspot * 3);
            wheelInfo.xpAward += 25;
            continue;
          }
        }
      }
      if (wheelInfo.wheelNumber >= 13 & wheelInfo.wheelNumber <= 24) { //WIN 2nd
        if (wheelInfo.winspots[i] == "2nd") {
          if (wheelInfo.whatcontains.has1st && wheelInfo.whatcontains.has2nd && wheelInfo.whatcontains.has3rd) {
            wheelInfo.player.stats.wheelsections++;
            wheelInfo.winAmount += (wheelInfo.betperspot * 2);
            wheelInfo.xpAward += 25;
            continue;
          } else {
            wheelInfo.player.stats.wheelsections++;
            wheelInfo.winAmount += (wheelInfo.betperspot * 3);
            wheelInfo.xpAward += 25;
            continue;
          }
        }
      }
      if (wheelInfo.wheelNumber >= 25 && wheelInfo.wheelNumber <= 36) { //WIN 3rd
        if (wheelInfo.winspots[i] == "3rd") {
          if (wheelInfo.whatcontains.has1st && wheelInfo.whatcontains.has2nd && wheelInfo.whatcontains.has3rd) {
            wheelInfo.player.stats.wheelsections++;
            wheelInfo.winAmount += (wheelInfo.betperspot * 2);
            wheelInfo.xpAward += 25;
            continue;
          } else {
            wheelInfo.player.stats.wheelsections++;
            wheelInfo.winAmount += (wheelInfo.betperspot * 3);
            wheelInfo.xpAward += 25;
            continue;
          }
        }
      }
      if (wheelInfo.wheelNumber == 0) { //WIN 0
        if (numeral(wheelInfo.winspots[i]).value() == 0) {
          wheelInfo.player.stats.wheel0++;
          wheelInfo.winAmount += (wheelInfo.betperspot * 37);
          wheelInfo.xpAward += 100;
          continue;
        }
      } else { //WIN OTHERNUM
        if (wheelInfo.winspots[i] != "1st" && wheelInfo.winspots[i] != "2nd" && wheelInfo.winspots[i] != "3rd") {
          if (numeral(wheelInfo.winspots[i]).value() == wheelInfo.wheelNumber) {
            wheelInfo.player.stats.wheelNumber++;
            wheelInfo.winAmount += (wheelInfo.betperspot * 36);
            wheelInfo.xpAward += 75;
            continue;
          }
        }
      }
    }
  }
  checkValidWheel(bet) {
    if (bet.toLowerCase() == "black") {
      return true;
    }
    if (bet.toLowerCase() == "red") {
      return true;
    }
    if (bet.toLowerCase() == "even") {
      return true;
    }
    if (bet.toLowerCase() == "odd") {
      return true;
    }
    if (bet.toLowerCase() == "low") {
      return true;
    }
    if (bet.toLowerCase() == "high") {
      return true;
    }
    if (bet.toLowerCase() == "1st") {
      return true;
    }
    if (bet.toLowerCase() == "2nd") {
      return true;
    }
    if (bet.toLowerCase() == "3rd") {
      return true;
    }
    if (bet.toLowerCase() == "0") {
      return true;
    }
    if (parseInt(bet) >= 0 && parseInt(bet) <= 36 && parseInt(bet) == bet) {
      return true;
    }
    return false;
  }

  playerTransactionCount(command) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.DB.Find("market", {
        'pid': command.msg.author.id
      }).then(function(trans) {
        resolve(trans.length);
      });
    });
  }

  parseMention(dataString) {
    var self = this;
    var returnV = dataString;
    returnV = returnV.replace(/\D/g, '');
    return returnV;
  }

  guildCheck(guild) {
    var self = this;
    self.DB.Find("guildBL", {id:guild.id}).then(function(blg) {
      if (blg.length > 0) {
        var owner = self.bot.users.get(guild.ownerID);
        if (owner != undefined) {
          owner.getDMChannel().then(function(dmc) {
            self.bot.createMessage(dmc.id, "Your Guild: " + guild.name + " was blacklisted from the bot.")
          })
        }
        self.bot.leaveGuild(guild.id);
      }
    })
  }
  getLotteryPot() {
    var self = this
    return new Promise(function(resolve, reject) {
      self.DB.Find('lottery', {
        id: 'pot'
      }).then(d => resolve(d[0].amount))
    });
  }

  updateLottery(price) {
    var self = this
    self.DB.Find('lottery', {
      id: 'pot'
    }).then(d => {
      d[0].amount += price;
      self.DB.Update('lottery', {
        'id': 'pot'
      }, d[0])
    })
  }
}
module.exports = Utils;
