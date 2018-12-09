exports.Run = function(caller, command) {
  caller.utils.getPlayer(command.msg.author).then(function(player) {
    var msg = "Secret Command / Difficulty / Found? / Small Hint\n\n";
    var msg2 = "Secret Command / Difficulty / Found? / Small Hint\n\n";
    if (player.foundsecret1) {
      msg += "Secret 1 / hard / FOUND!\n"
    }else {
      msg += "Secret 1 / hard / Still Hidden! / :thinking:\n"
    }
    if (player.foundsecret2) {
      msg += "Secret 2 / easy / FOUND!\n"
    }else {
      msg += "Secret 2 / easy / Still Hidden! / Dev.\n"
    }
    if (player.foundsecret3) {
      msg += "Secret 3 / easy / FOUND!\n"
    }else {
      msg += "Secret 3 / easy / Still Hidden! / Former dev.\n"
    }
    if (player.foundsecret4) {
      msg += "Secret 4 / very hard / FOUND!\n"
    }else {
      msg += "Secret 4 / very hard / Still Hidden! / `this*************************ever`\n"
    }
    if (player.foundsecret5) {
      msg += "Secret 5 / hard / FOUND!\n"
    }else {
      msg += "Secret 5 / hard / Still Hidden! / Some API that we almost implemented into Casino at one point.\n"
    }
    if (player.foundsecret6) {
      msg += "Secret 6 / very hard / FOUND!\n"
    }else {
      msg += "Secret 6 / very hard / Still Hidden! / One of our lovely mods.\n"
    }
    if (player.foundsecret7) {
      msg += "Secret 7 / easy / FOUND!\n"
    }else {
      msg += "Secret 7 / easy / Still Hidden! / Food & CTRL+V.\n"
    }
    if (player.foundsecret8) {
      msg += "Secret 8 / easy / FOUND!\n"
    }else {
      msg += "Secret 8 / easy / Still Hidden! / Ban.\n"
    }
    if (player.foundsecret9) {
      msg += "Secret 9 / easy / FOUND!\n"
    }else {
      msg += "Secret 9 / easy / Still Hidden! / Fire's Pastime\n"
    }
    if (player.foundsecret10) {
      msg += "Secret 10 / medium / FOUND!\n"
    }else {
      msg += "Secret 10 / medium / Still Hidden! / <@263330369409908736>\'s birthday!\n"
    }
    if (player.foundsecret11) {
      msg += "Secret 11 / easy / FOUND!\n"
    }else {
      msg += "Secret 11 / easy / Still Hidden! / A founding member of Disnode!\n"
    }
    if (player.foundsecret12) {
      msg += "Secret 12 / medium / FOUND!\n"
    }else {
      msg += "Secret 12 / medium / Still Hidden! / Our mod Tyler!\n"
    }
    if (player.foundsecret13) {
      msg += "Secret 13 / medium / FOUND!\n"
    }else {
      msg += "Secret 13 / medium / Still Hidden! / I am a robot!\n"
    }
    if (player.foundsecret14) {
      msg2 += "Secret 14 / super insane / FOUND!\n"
    }else {
      msg2 += "Secret 14 / super insane / Still Hidden! / Fires's favorite **games**. 9 in total, all names abbreviated. I'm a simulator kind of guy!\n"
    }
    if (player.foundsecret15) {
      msg2 += "Secret 15 / super insane / FOUND!\n"
    }else {
      msg2 += "Secret 15 / super insane / Still Hidden! / Tyler's favourite **games**. 7 in total, all abbreviated.\n"
    }
    if (player.foundsecret16) {
      msg2 += "Secret 16 / medium / FOUND!\n"
    }else {
      msg2 += "Secret 16 / medium / Our podcast!\n"
    }
    if (player.foundsecret17) {
      msg2 += "Secret 17 / very hard / FOUND!\n"
    }else {
      msg2 += "Secret 17 / very hard / Definitely not allowed! (DM Avox#1337 when you get it to get 200 ultra credits)\n"
    }
    caller.bot.createMessage(command.msg.channel.id, {
      embed: {
        color: 1433628,
        title: player.name,
        fields: [{
          name: "Secrets",
          inline: true,
          value: msg,
        },{
          name: "Secrets",
          inline: true,
          value: msg2,
        }]
      }
    })
  });
};
exports.settings = function () {
  return {
    show: true, // show in help true false
    type: "command" //command or game
  };
};
