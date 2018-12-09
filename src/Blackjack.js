const Session = require('./Session');
const numeral = require('numeral');
const logger = require('disnode-logger');
const CARD_CLUBS = 0;
const CARD_DIAMONDS = 1;
const CARD_SPADES = 2;
const CARD_HEARTS = 3;

class Blackjack {
  constructor(caller) {
    this.sessions = [];
    this.caller = caller;
    this.cards = [
      { card: 0, type: 0, disp: "[ :clubs: :regional_indicator_a: ]" },
      { card: 0, type: 1, disp: "[ :diamonds:  :regional_indicator_a: ]" },
      { card: 0, type: 2, disp: "[ :spades:  :regional_indicator_a: ]" },
      { card: 0, type: 3, disp: "[ :hearts:  :regional_indicator_a: ]" },
      { card: 2, type: 0, disp: "[ :clubs: :two: ]" },
      { card: 2, type: 1, disp: "[ :diamonds: :two: ]" },
      { card: 2, type: 2, disp: "[ :spades: :two: ]" },
      { card: 2, type: 3, disp: "[ :hearts: :two: ]" },
      { card: 3, type: 0, disp: "[ :clubs: :three: ]" },
      { card: 3, type: 1, disp: "[ :diamonds: :three: ]" },
      { card: 3, type: 2, disp: "[ :spades: :three: ]" },
      { card: 3, type: 3, disp: "[ :hearts: :three: ]" },
      { card: 4, type: 0, disp: "[ :clubs: :four: ]" },
      { card: 4, type: 1, disp: "[ :diamonds: :four: ]" },
      { card: 4, type: 2, disp: "[ :spades: :four: ]" },
      { card: 4, type: 3, disp: "[ :hearts: :four: ]" },
      { card: 5, type: 0, disp: "[ :clubs: :five: ]" },
      { card: 5, type: 1, disp: "[ :diamonds: :five: ]" },
      { card: 5, type: 2, disp: "[ :spades: :five: ]" },
      { card: 5, type: 3, disp: "[ :hearts: :five: ]" },
      { card: 6, type: 0, disp: "[ :clubs: :six: ]" },
      { card: 6, type: 1, disp: "[ :diamonds: :six: ]" },
      { card: 6, type: 2, disp: "[ :spades: :six: ]" },
      { card: 6, type: 3, disp: "[ :hearts: :six: ]" },
      { card: 7, type: 0, disp: "[ :clubs: :seven: ]" },
      { card: 7, type: 1, disp: "[ :diamonds: :seven: ]" },
      { card: 7, type: 2, disp: "[ :spades: :seven: ]" },
      { card: 7, type: 3, disp: "[ :hearts: :seven: ]" },
      { card: 8, type: 0, disp: "[ :clubs: :eight: ]" },
      { card: 8, type: 1, disp: "[ :diamonds: :eight: ]" },
      { card: 8, type: 2, disp: "[ :spades: :eight: ]" },
      { card: 8, type: 3, disp: "[ :hearts: :eight: ]" },
      { card: 9, type: 0, disp: "[ :clubs: :nine: ]" },
      { card: 9, type: 1, disp: "[ :diamonds: :nine: ]" },
      { card: 9, type: 2, disp: "[ :spades: :nine: ]" },
      { card: 9, type: 3, disp: "[ :hearts: :nine: ]" },
      { card: 10, type: 0, disp: "[ :clubs: :keycap_ten: ]" },
      { card: 10, type: 1, disp: "[ :diamonds: :keycap_ten: ]" },
      { card: 10, type: 2, disp: "[ :spades: :keycap_ten: ]" },
      { card: 10, type: 3, disp: "[ :hearts: :keycap_ten: ]" },
      { card: 10, type: 0, disp: "[ :clubs: :regional_indicator_k: ]" },
      { card: 10, type: 1, disp: "[ :diamonds: :regional_indicator_k: ]" },
      { card: 10, type: 2, disp: "[ :spades: :regional_indicator_k: ]" },
      { card: 10, type: 3, disp: "[ :hearts: :regional_indicator_k: ]" },
      { card: 10, type: 0, disp: "[ :clubs: :regional_indicator_q: ]" },
      { card: 10, type: 1, disp: "[ :diamonds: :regional_indicator_q: ]" },
      { card: 10, type: 2, disp: "[ :spades: :regional_indicator_q: ]" },
      { card: 10, type: 3, disp: "[ :hearts: :regional_indicator_q: ]" },
      { card: 10, type: 0, disp: "[ :clubs: :regional_indicator_j: ]" },
      { card: 10, type: 1, disp: "[ :diamonds: :regional_indicator_j: ]" },
      { card: 10, type: 2, disp: "[ :spades: :regional_indicator_j: ]" },
      { card: 10, type: 3, disp: "[ :hearts: :regional_indicator_j: ]" },
    ]
    logger.Success("Casino","Blackjack","Blackjack Loaded!")
  }
  newDeck() {
    return JSON.parse(JSON.stringify(this.cards));
  }
  hasGame(player){
    var self = this;
    var session = self.getSession(player.id);
    if (session == false) {
      return false;
    }else {
      return true;
    }
  }
  newGame(player, wager, channel) {
    var self = this;
    var pack = self.caller.lang.getPack(player.prefs.lang, "casino");
    var session = self.getSession(player.id);
    var deck = self.newDeck();
    if (session == false) {
      var game = {
        id: player.id,
        deck: deck,
        wager: wager,
        playerHand: {
          high: 0,
          low: 0,
          cards: []
        },
        dealerHand: {
          high: 0,
          low: 0,
          cards: []
        }
      }
      var newSession = new Session(player.id, game);
      newSession.createTimeout(function() {
        self.endSession(player, channel);
      }, (30 * 60000));
      self.drawCard(newSession.game.deck, newSession.game.playerHand);
      self.drawCard(newSession.game.deck, newSession.game.dealerHand);
      self.drawCard(newSession.game.deck, newSession.game.playerHand);
      self.sessions.push(newSession);
      if (newSession.game.playerHand.high == 21) {
        var Winnings = newSession.game.wager * 2.5
        player.money += (Winnings * player.prestige.payoutMult);
        self.showGameStatus(newSession.game, channel, player);
        self.caller.bot.createMessage(channel.id, {
          embed: {
            color: 3447003,
            author: {},
            fields: [{
              name: 'Blackjack ' + player.name,
              inline: false,
              value: "Natural Blackjack!",
            }, {
              name: 'Wager',
              inline: true,
              value: "$" + numeral(newSession.game.wager).format('0,0.00'),
            }, {
              name: 'Winnings',
              inline: true,
              value: "$" + numeral(Winnings).format('0,0.00'),
            }, {
              name: 'Net Gain',
              inline: true,
              value: "$" + numeral(Winnings - newSession.game.wager).format('0,0.00'),
            }, {
              name: 'Balance',
              inline: true,
              value: "$" + numeral(player.money).format('0,0.00'),
            }],
            footer: {}
          }
        })
        self.endSession(player, channel);
        return;
      }
      self.caller.utils.sendCompactEmbed(channel, pack.blackjackCommand.titleBJ + player.name, pack.blackjackCommand.gameCreated);
      self.showGameStatus(newSession.game, channel, player);
    } else {
      self.caller.utils.sendCompactEmbed(channel, pack.blackjackCommand.titleBJ + player.name, pack.blackjackCommand.sessionRunning);
    }
  }
  hit(player, channel) {
    var self = this;
    var pack = self.caller.lang.getPack(player.prefs.lang, "casino");
    var session = self.getSession(player.id);
    if (session != false) {
      self.drawCard(session.game.deck, session.game.playerHand);
      if (session.game.playerHand.high > 21) {
        self.showGameStatus(session.game, channel, player);
        self.caller.utils.sendCompactEmbed(channel, pack.blackjackCommand.titleBJ + player.name, pack.blackjackCommand.bust);
        self.endSession(player, channel);
        return;
      } else if (session.game.playerHand.high == 21) {
        var Winnings = ((session.game.wager * 2) * player.prestige.payoutMult)
        player.money += Winnings;
        self.showGameStatus(session.game, channel, player);
        self.caller.bot.createMessage(channel.id, {
          embed: {
            color: 3447003,
            author: {},
            fields: [{
              name: pack.blackjackCommand.titleBJ + player.name,
              inline: false,
              value: pack.blackjackCommand.winBlackjack,
            }, {
              name: pack.blackjackCommand.wager,
              inline: true,
              value: "$" + numeral(session.game.wager).format('0,0.00'),
            }, {
              name: pack.blackjackCommand.Winnings,
              inline: true,
              value: "$" + numeral(Winnings).format('0,0.00'),
            }, {
              name: pack.blackjackCommand.netgain,
              inline: true,
              value: "$" + numeral(Winnings - session.game.wager).format('0,0.00'),
            }, {
              name: pack.blackjackCommand.bal,
              inline: true,
              value: "$" + numeral(player.money).format('0,0.00'),
            }],
            footer: {}
          }
        })
        self.endSession(player, channel);
        return;
      }
      self.showGameStatus(session.game, channel, player);
    } else {
      self.caller.utils.sendCompactEmbed(channel, pack.blackjackCommand.titleBJ + player.name, pack.blackjackCommand.noSession);
    }
  }
  stand(player, channel) {
    var self = this;
    var pack = self.caller.lang.getPack(player.prefs.lang, "casino");
    var session = self.getSession(player.id);
    if (session != false) {
      while (session.game.dealerHand.high <= 16 || (session.game.dealerHand.low != 0 && session.game.dealerHand.low <= 16)) {
        self.drawCard(session.game.deck, session.game.dealerHand);
      }
      if (session.game.dealerHand.high > 21) {
        var Winnings = ((session.game.wager * 2) * player.prestige.payoutMult)
        player.money += Winnings;
        self.showGameStatus(session.game, channel, player);
        self.caller.bot.createMessage(channel.id, {
          embed: {
            color: 3447003,
            author: {},
            fields: [{
              name: pack.blackjackCommand.titleBJ + player.name,
              inline: false,
              value: pack.blackjackCommand.dealerBust,
            }, {
              name: pack.blackjackCommand.wager,
              inline: true,
              value: "$" + numeral(session.game.wager).format('0,0.00'),
            }, {
              name: pack.blackjackCommand.Winnings,
              inline: true,
              value: "$" + numeral(Winnings).format('0,0.00'),
            }, {
              name: pack.blackjackCommand.netgain,
              inline: true,
              value: "$" + numeral(Winnings - session.game.wager).format('0,0.00'),
            }, {
              name: pack.blackjackCommand.bal,
              inline: true,
              value: "$" + numeral(player.money).format('0,0.00'),
            }],
            footer: {}
          }
        })
        self.endSession(player, channel);
      } else if (session.game.dealerHand.high < session.game.playerHand.high) {
        var Winnings = ((session.game.wager * 2) * player.prestige.payoutMult)
        player.money += Winnings;
        self.showGameStatus(session.game, channel, player);
        self.caller.bot.createMessage(channel.id, {
          embed: {
            color: 3447003,
            author: {},
            fields: [{
              name: pack.blackjackCommand.titleBJ + player.name,
              inline: false,
              value: pack.blackjackCommand.youWin,
            }, {
              name: pack.blackjackCommand.wager,
              inline: true,
              value: "$" + numeral(session.game.wager).format('0,0.00'),
            }, {
              name: pack.blackjackCommand.Winnings,
              inline: true,
              value: "$" + numeral(Winnings).format('0,0.00'),
            }, {
              name: pack.blackjackCommand.netgain,
              inline: true,
              value: "$" + numeral(Winnings - session.game.wager).format('0,0.00'),
            }, {
              name: pack.blackjackCommand.bal,
              inline: true,
              value: "$" + numeral(player.money).format('0,0.00'),
            }],
            footer: {}
          }
        })
        self.endSession(player, channel);
      } else if (session.game.dealerHand.high == session.game.playerHand.high) {
        self.showGameStatus(session.game, channel, player);
        if (session.game.dealerHand.high == 21 && session.game.dealerHand.cards.length == 2) {
          self.caller.utils.sendCompactEmbed(channel, pack.blackjackCommand.titleBJ + player.name, pack.blackjackCommand.dealerNBJ);
          self.endSession(player, channel);
          return;
        }
        var Winnings = ((session.game.wager * 1) * player.prestige.payoutMult)
        player.money += Winnings;
        self.caller.bot.createMessage(channel.id, {
          embed: {
            color: 3447003,
            author: {},
            fields: [{
              name: pack.blackjackCommand.titleBJ + player.name,
              inline: false,
              value: pack.blackjackCommand.push,
            }, {
              name: pack.blackjackCommand.wager,
              inline: true,
              value: "$" + numeral(session.game.wager).format('0,0.00'),
            }, {
              name: pack.blackjackCommand.Winnings,
              inline: true,
              value: "$" + numeral(Winnings).format('0,0.00'),
            }, {
              name: pack.blackjackCommand.netgain,
              inline: true,
              value: "$" + numeral(Winnings - session.game.wager).format('0,0.00'),
            }, {
              name: pack.blackjackCommand.bal,
              inline: true,
              value: "$" + numeral(player.money).format('0,0.00'),
            }],
            footer: {}
          }
        })
        self.endSession(player, channel);
      } else if (session.game.dealerHand.high == 21 || session.game.dealerHand.low == 21) {
        self.showGameStatus(session.game, channel, player);
        self.caller.utils.sendCompactEmbed(channel, pack.blackjackCommand.titleBJ + player.name, pack.blackjackCommand.dealerBJ);
        self.endSession(player, channel);
      } else if (session.game.dealerHand.high > session.game.playerHand.high) {
        self.showGameStatus(session.game, channel, player);
        self.caller.utils.sendCompactEmbed(channel, pack.blackjackCommand.titleBJ + player.name, pack.blackjackCommand.dealerWin);
        self.endSession(player, channel);
      }
    } else {
      self.caller.utils.sendCompactEmbed(channel, pack.blackjackCommand.titleBJ + player.name, pack.blackjackCommand.noSession);
    }
  }
  showGameStatus(game, channel, player) {
    var self = this;
    var pack = self.caller.lang.getPack(player.prefs.lang, "casino");
    var playerCards = "";
    var playerPoints = "";
    var dealerCards = "";
    var dealerPoints = "";
    for (var i = 0; i < game.playerHand.cards.length; i++) {
      playerCards += game.playerHand.cards[i].disp + " ";
    }
    for (var i = 0; i < game.dealerHand.cards.length; i++) {
      dealerCards += game.dealerHand.cards[i].disp + " ";
    }
    if (game.dealerHand.low > 0) {
      dealerPoints = game.dealerHand.high + "/" + game.dealerHand.low;
    } else dealerPoints = game.dealerHand.high;
    if (game.playerHand.low > 0) {
      playerPoints = game.playerHand.high + "/" + game.playerHand.low;
    } else playerPoints = game.playerHand.high;
    self.caller.bot.createMessage(channel.id, {
      embed: {
        color: 3447003,
        author: {},
        title: pack.blackjackCommand.titleBJ + player.name,
        fields: [{
          name: pack.blackjackCommand.titleTableRules,
          inline: false,
          value: pack.blackjackCommand.valueTableRules,
        }, {
          name: pack.blackjackCommand.titleHands,
          inline: false,
          value: pack.blackjackCommand.hands[0] + dealerCards + pack.blackjackCommand.hands[1] + playerCards,
        }, {
          name: pack.blackjackCommand.playerCardValue,
          inline: true,
          value: playerPoints,
        }, {
          name: pack.blackjackCommand.dealerCardValue,
          inline: true,
          value: dealerPoints,
        }, {
          name: pack.blackjackCommand.wager,
          inline: true,
          value: "$" + numeral(game.wager).format('0,0.00'),
        }],
        footer: {}
      }
    });
  }
  drawCard(deck, person) {
    var self = this;
    var cardID = self.getRandomIntInclusive(0, deck.length - 1);
    var card = deck[cardID];
    deck.splice(cardID, 1);
    person.cards.push(card);
    switch (card.card) {
      case 0:
        if (person.high + 11 > 21) {
          person.high += 1;
          if (person.low != 0) {
            person.low += 1;
          }
        } else {
          person.low = person.high + 1;
          person.high += 11;
        }
        break;
      default:
        person.high += card.card;
        if (person.low > 0) {
          person.low += card.card;
          if (person.high > 21) {
            person.high = person.low;
            person.low = 0;
          }
        }
    }
  }
  endSession(player, channel) {
    var self = this;
    for (var i = 0; i < self.sessions.length; i++) {
      if (self.sessions[i].id == player.id) {
        self.sessions[i].cleanup();
        self.sessions.splice(i, 1);
        //self.disnode.bot.SendCompactEmbed(channel, "Blackjack - test", "Session ended Thanks for playing!");
        break;
      }
    }
  }
  getSession(id) {
    for (var i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].id == id) return this.sessions[i];
    }
    return false;
  }
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
module.exports = Blackjack;
