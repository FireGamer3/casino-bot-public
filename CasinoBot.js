if (process.env.INST == 'DEV') {
  console.log("DEV");
  var inst = "DEV";
  var shards = 1;
  var config = require('./config-dev');
}else {
  var inst = "PROD";
  console.log("PROD");
  var shards = 6;
  var config = require('./config-prod');
}
const discord = require('eris');
const command = require('./src/command');
const blackjack = require('./src/Blackjack');
const logger = require('disnode-logger');
const DB = require('./src/DB');
const utils = require('./src/utils');
const Lang = require('disnode-lang');
const fs = require('fs');
const botlists = require('disnode-extra').botlists;
const DBL = require('dblapi.js');
const dbl = new DBL(config.dblauth);

var bot = new discord(config.TOKEN, {
  maxShards: shards,
  disableEvents: [
    "TYPING_START",
    "VOICE_STATE_UPDATE",
    "USER_NOTE_UPDATE",
    "MESSAGE_REACTION_REMOVE_ALL",
    "MESSAGE_REACTION_REMOVE",
    "MESSAGE_REACTION_ADD",
    "CHANNEL_PINS_UPDATE",
    "GUILD_ROLE_CREATE",
    "GUILD_ROLE_DELETE",
    "GUILD_ROLE_UPDATE"
  ]
});
var cmdmngr;

if (config.db != undefined) {
  DB.Connect(config.db);
}
this.loaded = false;
bot.on("ready", () => {
  if (config.PROD) {
    bot.editStatus("online",{name:"cs/help or @me",type:0});
  }else {
    bot.editStatus("online",{name:"VictoryForPhil is a meme. DEV BUILDS Woot!",type:0});
  }
  if(this.loaded)return;
  logger.Success("Casino", "Start", "Ready!");
  this.bot = bot;
  this.loaded = true;
  this.DB = DB;
  this.shards = shards
  this.discord = discord;
  this.config = config;
  this.snowflake = snowflake;
  this.blackjack = new blackjack(this);
  this.utils = new utils(this.bot, config, this.DB);
  this.lang = new Lang(__dirname);
  this.channelTypes = {
    GuildText: 0,
    DM: 1,
    GuildVoice: 2,
    GroupDM: 3,
    GuildCat: 4
  }
  cmdmngr = new command(this, config.PREFIX);
  this.cmdmngr = cmdmngr;
  this.Webhookcslog = Webhookcslog;
  this.webShard = webShard;
  bot.stuff = this;
  this.bl = new botlists(this.config.botlistconfig);
  this.dbl = dbl;
  bindEvents(this);
  if (config.PROD) {
    post(this);
  }
})

function post(caller) {
  setInterval(function (ca) {
    ca.bl.postServerCount(ca.bot.guilds.size).catch(console.error)
    ca.dbl.postStats(ca.bot.guilds.size);
  }, (1000 * 600), caller);
}
function snowflake(resourceID) {
  return new Date(parseInt(resourceID) / 4194304 + 1420070400000);
}
bot.on("shardReady", (id) =>{
  logger.Success("Casino", "Start", "Shard " + id + " Ready!");
})

bot.on("connect",(shard) =>{
  webShard({
    embeds: [{
      color: 0x00d62e,
      title: 'Connect ' + inst,
      description: `**Shard:** ${shard}\n**Connected!**`
    }],
  })
})
bot.on("shardDisconnect",(message, shard) =>{
  webShard({
    embeds: [{
      color: 11730944,
      title: 'Disconnect ' + inst,
      description: `**Shard:** ${shard}\n**Disconnected: **${message}`
    }],
  })
})
bot.on("shardReady", (shard) =>{
  webShard({
    embeds: [{
      color: 0x00d62e,
      title: 'Ready ' + inst,
      description: `**Shard:** ${shard}\n**Ready!**`
    }],
  })
})
function bindEvents(caller) {
  cmdmngr.on("message", (command) => {
    if(testAlts(command))return;
    try {
      var found;
      if (fs.existsSync(`./commands/${command.command}.js`)) {
        logger.Info(bot.user.username, "Command", "Command: " + command.command + " User: " + command.msg.author.username + " ( " + command.msg.author.id + " )");
        found = true;
        let commandFile = require(`./commands/${command.command}.js`);
        commandFile.Run(caller, command);
      } else logger.Info(bot.user.username, "Unknown Command", "Command: " + command.command + " User: " + command.msg.author.username + " (" + command.msg.author.id + ")");
    } catch (err) {
      console.log(err);
    } finally {
      if (found) {
        delete require.cache[require.resolve(`./commands/${command.command}.js`)];
      }
    }
  });
  cmdmngr.on("mention", (msg) => {
    // when a message is just a mention to the bot
    bot.getDMChannel(msg.author.id).then(function(dmc) {
      try {
        let commandFile = require(`./commands/help.js`);
        commandFile.RunDM(caller, dmc);
        logger.Info("Casino", "Command", "Command: helpDM User: " + msg.author.username + " (" + msg.author.id + ")");
      } catch (err) {
        console.log('Caught exception: ' + err);
      } finally {
        delete require.cache[require.resolve(`./commands/help.js`)];
      }
    }).catch(function() {

    });
    bot.createMessage(command.msg.channel.id, "<@" + msg.author.id + ">, Check your DM's!")
  })
}

bot.on('guildCreate', (guild) => {
  var self = this;
  var owner = bot.users.find(function(a) {
    return a.id == guild.ownerID
  });
  var bots = guild.members.filter(m => m.user.bot).length
  Webhookguild({
    embeds: [{
      color: 0x00d62e,
      title: 'Joined Server',
      description: `**Name:** ${guild.name}\n**ID:** ${guild.id}\n**Owner:** ${owner.username+'#'+owner.discriminator+' ('+guild.ownerID+')'}\n**Count:** ${guild.memberCount}\n**Users:** ${(guild.memberCount - bots)}\n**Bots:** ${bots}\n**Percent:** ${(bots/(guild.memberCount)*100).toFixed(2)} %\n**Created:** ${new Date(parseInt(guild.id) / 4194304 + 1420070400000)}`,
      thumbnail: {
        url: guild.iconURL
      }
    }],
  });
  this.utils.guildCheck(guild);
})
bot.on('guildDelete', (guild) => {
  var self = this;
  Webhookguild({
    embeds: [{
      color: 0xb31414,
      title: 'Left Server',
      description: `**Name:** ${guild.name}\n**ID:** ${guild.id}`,
      thumbnail: {
        url: guild.iconURL
      }
    }],
  });
});
function testAlts(command) {
  var date = snowflake(command.msg.author.id);
  if(getDays(date)){
    bot.createMessage(command.msg.channel.id, "Your Discord account must be at least 90 days old. This is to help discourage the use of alts.")
    return true;
  }else return false;
}
function getDays(time) {
  var currentDate = new Date();
  var elapsed = currentDate - time;
  var days = parseInt(elapsed / 86400000);
  if(days < 90)return true;
  return false;
}
//test
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

var restify = require('restify');

var server = restify.createServer();
server.get('/', function(req, res, next) {
  res.send('Casino Bot - OK');
  next();
});

server.listen(5000, function() {
  console.log('Status server listening at %s', server.url);
});

bot.connect();
