/* eslint-disable */
/* This entire file is making eslint scream cause using "" instead of '' */
module.exports = {
  common: {
    currency: "$",
    // way that money will be shown to user example 0,0.00 will show 1234.5432 as 1,234.54
    moneyFormat: "0,0.00",
    numberFormat: "0,0",
    errorTitle: "Error",
    complete: "Complete",
    acceptRules: [
      "Please read and accept the rules! `",
      "rules`"
    ],
    channelCheck: "Please use the <#269839796069859328> channel for this command"
  },
  timeout: {
    title: "Error",
    body: [
      ":warning: You must wait **",
      "** before playing again."
    ]
  },
  crates: [
    "Basic", "Good", "Great", "Epic", "Ultimate", "Omega"
  ],
  defaultCommand: {
    title: "Casino",
    desc: "Hello! \nCasino Bot is a Discord bot that allows users to play casino games on Discord. __**FOR AMUSEMENT ONLY**__.",
    titleCommands: ["Casino Related Commands:", "Other Commands:"],
    titleDiscord: "Discord Server",
    titleUltra: "Disnode Ultra",
    descDiscord: "**For support and more, join our [Discord](https://join.disnode.app/) server.**",
    descUltra: "**If you want to help us keep our bots up and running, please consider purchasing [Disnode Ultra](https://ultra.disnode.app/) for some sweet perks.** __Upon purchasing, run `cs/ultra` to activate it.__",
    commands: {
      rules: "*rules for Casino Bot.*",
      invite: "*invite link for Casino Bot.*",
      ultra: "*check your Ultra stats!*",
      slot: "*slots (general help).*",
      flip: "*flip a coin. Which will it be, heads or tails?*",
      wheel: "*play a nice game of roulette.*",
      help: "*this command*",
      "21": "*play a game of blackjack!* (Ultra only)",
      market: "*marketplace to buy and sell keys*",
      stats: "*bot info and stats*",
      dice: "*roll a die and see if you are lucky enough to pick the right number!*",
      bal: "*check yours or other's money or XP quickly.*",
      market: "*general help about the market.*",
      income: "*redeem your income with this command!*",
      season: "*explanation of Casino Seasons!*",
      bank: "*temporarily store your money with this command!*",
      top: "*check who's on top, and compete with your friends!*",
      betters: "*see who's recently played slots on your server.*",
      crate: "*use keys to open crates for money and XP!*",
      store: "*get more money and/or income here!*",
      jackpot: "*get quick info about the jackpot, such as the value!*",
      info: "*view info for the bot.*",
      stats: "*view your stats for the bot, such as jackpot wins, etc.*",
      transfer: "*transfer money to other players!*",
      settings: "*change your personal settings here!*",
      tower: "*climb to the top to multiply your cash!*",
      lottery: "*test your luck in the lottery!*",
      prestige: "*rise through the ranks!*",
      changelog: "*shows a log of changes made to Casino*",
      loan: "*fast cash*",
      secret: "*shows whether you found some secret commands or not*",
      vote: "*vote for the bot to get cool rewards!*"
    }
  },
  balCommand: {
    title: "Balance",
    titleMoney: "Money",
    titleBank: "Bank Amount",
    titleIncome: "Income",
    titleMaxIncome: "Max Income",
    titleXP: "XP / Next Level",
    titleLevel: "Level",
    titleKeys: "Keys",
    titleCrates: "Crates",
    titleUltra: "Ultra",
    titleTimeout: "Timeout",
    titlePrestige: "Prestige"
  },
  slotCommand: {
    info: {
      embedTitle: "Casino Slot Info",
      titleItems: "Slot Items",
      valueItems: ":cherries: - Cherries (most common)\n\n:third_place:\n\n:second_place:\n\n:first_place:\n\n:package:\n\n:100:\n\n:key: - Key (most rare)",
      titleWins: "Slot Wins and Payouts",
      valueWins: "\n:cherries::cherries::cherries: - 2x bet 10XP\n" +
        ":third_place::third_place::third_place: - 4x bet 20XP\n" +
        ":second_place::second_place::second_place: - 8x bet 40XP\n" +
        ":first_place::first_place::first_place: - 16x bet 80XP\n" +
        ":package::package::package: - 3 crates (**Minimum Jackpot bet required**)\n" +
        ":100::100::100: - JACKPOT value - 1000XP (**Minimum Jackpot bet required**)\n" +
        ":key::key::key: -  3 Keys (**Minimum Jackpot bet required**)\n" +
        "At least one :package: - 1 Crate (**Minimum Jackpot bet required**)\n" +
        "At least one :key: - 1 Key (**Minimum Jackpot bet required**)\n" +
        "At least one :cherries: - 1/2 your original bet",
      titleMinbet: "Minimum bet to win the jackpot",
      valueMinbet: [
        "Minimum bet: ",
        " (if money < 8,500 min bet = 250) else (min bet = money * 0.03 or 3%))"
      ],
      titleXP: "XP",
      valueXP: " Due to a minor change of the XP system, betting lower than $250 will no longer give you XP.",
      titleJackpot: "Jackpot",
      valueJackpot: "By default, the jackpot has a value of $100,000. The jackpot is raised by playing slots and raising your bet amount.\n**Current Jackpot Value: **",
      titleJackpotH: "Jackpot History",
      valueJackpotH: "**Last won by:** "
    },
    stats: {
      title: "Slot Item Stats",
      titlevalue: "Here are some stats about slots. There are a total of 255 items that the slot machine can pick.",
      valueCherries: "**Amount**: 70, **Chance to get at least one**: 81998/132651 or 61.81%, **Chance to get 3 in a row**: 2744/132651 or 2.07%",
      valueThird: "**Amount**: 60, **Chance to get at least one**: 2716/4913 or 55.28%, **Chance to get 3 in a row**: 64/4913 or 1.30%",
      valueSecond: "**Amount**: 50, **Chance to get at least one**: 63730/132651 or 48.04%, **Chance to get 3 in a row**: 1000/132651 or 0.75%",
      valueFirst: "**Amount**: 40, **Chance to get at least one**: 53144/132651 or 40.06%, **Chance to get 3 in a row**: 512/132651 or 0.39%",
      valueCrate: "**Amount**: 20, **Chance to get at least one**: 28828/132651 or 21.73%, **Chance to get 3 in a row**: 64/132651 or 0.048%",
      valueJP: "**Amount**: 10, **Chance to get at least one**: 15002/132651 or 11.31%, **Chance to get 3 in a row**: 8/132651 or 0.0060%",
      valueKey: "**Amount**: 5, **Chance to get at least one**: 7651/132651 or 5.77%, **Chance to get 3 in a row**: 1/132651 or 0.00075%",
    },
    help: {
      title: "Slots",
      value: "Hi, and welcome to slots! If you need any info on the slots, run the command `cs/slot info`. You can also see stats on items with `cs/slot stats`.\n\nIf you want to try the slots, then type `cs/slot [bet]`. For example, `cs/slot 100` will run the slots with $100 as the bet.",
    },
    slot: {
      title: [
        ':slot_machine: ',
        ' Slots Result :slot_machine:'
      ],
      payLine: " Pay Line",
      betTitle: "Bet",
      winningsTitle: "Winnings",
      netGainTitle: "Net Gain",
      balTitle: "Balance",
      keysTitle: "Keys",
      xpTitle: "XP",
      minjpTitle: "Minimum Jackpot Bet",
      jpTitle: "Jackpot Value"
    },
    reward: {
      ultraBonus: " **(Disnode Ultra bonus!)**",
      crateWin: "Hey, a crate! You can open these with keys! ",
      triCrateWin: "WOW! That's a lot of crates! You can open these with keys. ",
      keyWin: "Hey, a key! ",
      triKeyWin: "WOW! That's a lot of keys!",
      noWin: "Dang, better luck next time...",
      cherriesWin: "Winner",
      thirdWin: "WINNER!",
      secondWin: "WINNER, WINNER — BIG MONEY!",
      firstWin: "WINNER, WINNER — HUUUUUUUUGE MONEY!",
      jackpotWin: "JACKPOT, JACKPOT, JACKPOT!!!!!!!",
      fakeJackpot: "YOU GOT A JACKPOT! However, you didn't meet the minimum bet required to get the **JACKPOT** value, so here is 60x your bet",
      cherriesHalf: "Well, at least you didn't lose it all...",
      crateNoMin: ", the crate(s) are empty! You didn't bet your minimum jackpot bet. ",
      keyNoMin: " but the key(s) are rusted! You didn't bet your minimum bet to restore the key(s). Oh well... ",
      noXPWarn: " `You bet lower than $250. Fair warning here, you won't get any XP and you can't win the TRUE jackpot.`"
    },
    error: {
      notEnoughMoney: ":warning: You don't have that much money! You have ",
      notAnumber: ":warning: Please use a number for bet or `cs/slot` for general help",
      ultraMinBet: "Only people with Ultra can use the bet min command.",
    }
  },
  rulesCommand: {
    accept: [
      "Rules",
      "Thanks for accepting the rules, enjoy our bot!"
    ],
    rulesTitle: "Casino Rules",
    rulesValue: "Before using the bot, please read the rules.",
    altTitle: "ALTS (alternate accounts)/Banks",
    altValue: "ALTS or the use of alternate accounts are not allowed. Anyone using an ALT, will have that ALT banned; __**no exceptions**__.",
    banktitle: "Banks/Banking",
    bankValue: "Using banks or transferring money to a friend to gain an advantage will lead to a __ban__, or **reset** of the accounts involved. This includes transferring money (transfer/market command) before a prestige, then receiving the money upon reaching level 3 or higher after prestiging.",
    markTitle: "Market",
    markValue: "Any __consistent use__ of the **transfer function** to pay over the __market cap__, will result in a __**ban**__ from the bot - as we want to ensure the economy remains **balanced** and that no one has an **unfair advantage**.",
    acceptTitle: "Accept",
    acceptValue: "To accept these rules, type cs/rules accept (__read all of the rules first__).",
    macroTitle: "Bots and Macros",
    macroValue: "The use of bots and/or macros __**aren't allowed**__, and will result in a __full wipe of your account__ upon being unbanned. We have a **zero tolerance** policy for this, as we want the bot to be as balanced and fair for other users as possible.",
    cooldownTitle: "Cooldowns",
    cooldownValue: "Cooldowns are used to prevent the spam of bot commands. This __**can and will**__ increase if you spam the same command 3 times in too quick of an interval. This ties into the `Macro` rule to discourage the usage of them.",
    ultraTitle: "Ultra",
    ultraValue: "If you want to get Ultra, you can do so [here](https://ultra.disnode.app) - account resets no longer occur as you can pay when able.",
    dataTitle: "Data Collection",
    dataValue: "We, Disnode Team, only collect usernames upon the first command you issue to the bot. Currently, that is the only EUD we collect with Casino Bot.",
    tosTitle: "Discord ToS",
    tosValue: "With a new, recent revision to the Discord ToS on 8/20/2017, if you accept the rules, you hereby agree that we are allowed collect the data described above, and that you accept to the [Discord ToS](https://www.discordapp.com/developers/docs/legal) and the [Discord Privacy Policy](https://www.discordapp.com/privacy)."
  },
  ultraCommand: {
    wordUltra: "Ultra",
    titleExpire: "Expires On",
    titlePurchased: "Purchased On",
    noUltra: "You don't have Ultra!"
  },
  blackjackCommand: {
    titleBJ: "Blackjack ",
    gameCreated: "Game Created! (If you don't finish the game within 30 minutes, it will automatically end and you'll lose your wager!)",
    sessionRunning: "Can't create another game because you already have a running session!",
    bust: "Bust — thanks for playing!",
    dealerBust: "Dealer busted!",
    youWin: "You have the better hand!",
    push: "Push — wager returned!",
    dealerNBJ: "Dealer got a natural blackjack — thanks for playing!",
    dealerBJ: "Dealer got a blackjack! Thanks for playing!",
    dealerWin: "Dealer has a better hand! Thanks for playing!",
    winBlackjack: "Blackjack!",
    wager: "Wager",
    Winnings: "Winnings",
    netgain: "Net Gain",
    bal: "Balance",
    noSession: "You're not playing a game. Therefore, you can't do this yet!",
    titleTableRules: "Table Rules",
    valueTableRules: "Dealer draws up to 16, stands at 17. No insurance, no splits, no doubles.",
    titleHands: "Hands",
    hands: [
      "Dealer\'s Hand: ",
      "\n\nPlayer\'s Hand: "
    ],
    playerCardValue: "Player Cards Value",
    dealerCardValue: "Dealer Cards Value",
    notUltra: [
      ":warning: Blackjack is an Ultra exclusive command. Only Ultra members may access this game mode. To learn more about Ultra and its perks, look at the bottom of `",
      "help` Thanks for your support of our bots!"
    ],
    commands: {
      start: "21 start [bet]` - Start a game of blackjack with a wager amount",
      hit: "21 hit` - Draw a card (in-game)",
      stand: "21 stand` - End your turn and let the dealer start playing (in-game)"
    },
    noMoney: ":warning: You don't have that much money! You have "
  },
  appealCommand: {
    error: "Appeal Error",
    timeout: [
      ":warning: You must wait **",
      "** before appealing again."
    ],
    question: {
      title: "Appeal",
      desc: "Are you sure you want to appeal? You can only appeal once every 7 days.\nSend yes or no (15 seconds to answer.)",
      yesTitle: "Appealed",
      yesDesc: "Your timeout has been reset.",
      noTitle: "Not Appealed",
      noDesc: " Since you said “no,” your timeout hasn't been reset."
    },
    noTimeout: "You don't need a timeout appeal."
  },
  crateCommand: {
    invalidID: "The ID that you entered is invalid!",
    title: "Crates",
    system: "Crate System",
    open: {
      openedMulti: " Crates Opened\n",
      openMuliCase: [
        ["You got **$", "**\n"],
        ["You got **", "** XP\n"],
        ["You got **$", "** of Income Redemption\n"],
        ["You got **$", "** of Income\n"]
      ],
      noCrates: ["You don't have enough crates to open ", "\nNEED: ", "\nHAVE: "],
      noKeys: ["You don't have enough keys!\nNEED: ", "\nHAVE: "],
      opened: "Complete",
      openedCase: ["You opened the **", "** Crate and got: **", "**"],
    },
    sell: {
      success: "Success",
      sold: ["Sold ", " crate(s) for $"],
      noCrates: ["You don't have enough ", " crates to sell ", "\nYou have: "],
      list: ["--= ID: **", "** Name: **", "** - Worth: **$"],
      desc: ["Sell the crates you don't want for a fixed price.\nUse `", "crate sell [ID] [amount]` to sell your crates!"]
    },
    default: {
      list: [" --= ID: **", "** Name: **", "** Keys \n"],
      desc: ["Crates are boosts that help you keep going! Use the keys that you've found in slots to open crates.\nUse `", "crate open [ID]` to open a crate!\nUse `", "crate sell [ID]` to sell a crate!"]
    }
  },
  diceCommand: {
    title: "Dice Roll",
    desc: ["Welcome to Dice Roll! Here, you can choose how many sides you want to roll. The general command structure is `", "dice roll [sides] [your pick] [bet]` example `", "dice roll 10 4 1000`.\nYou get `x times your bet` if you pick the same number the dice lands on, where x is the number of sides the dice has."],
    result: " Dice Result :game_die:",
    rolled: ["Rolled a ", " on a ", " sided die."],
    pick: "Your Pick",
    bet: "Bet",
    winnings: "Winnings",
    net: "Net Gain",
    bal: "Balance",
    xp: "XP",
    error: {
      money: ":warning: You must enter a bet that is greater than 0, or you can't afford the bet that you want to place.",
      invalid: ":warning: You either put in an invalid bet, or you can't afford the bet you placed.",
      pickSides: ":warning: You must pick a number starting with 1, and go no higher than the number of sides on your dice.",
      pick: [":warning: You must pick a number on the dice to roll! like `", "dice roll 7 3 100`"],
      side: [":warning: The amount of sides to the dice must be between 5 and 10,000  `", "dice roll 7 3 100`"]
    }
  },
  flipCommand: {
    title: "Coin Flip",
    desc: ["Welcome to coin flip! To play, use this command: `", "flip [heads/tails]`. Here are some examples: `", "flip heads 100` and `", "flip tails 100`."],
    noMoney: ":warning: You don't have that much money! You have ",
    minBet: [" `You bet was lower than ", " fair warning here, you won't get any XP`", " `You bet lower than $250 fair warning here, you won't get any XP`"],
    win: " You Win!",
    house: " House Wins!",
    embed: {
      title: ":moneybag: Coin Flip :moneybag:",
      bet: "Bet",
      winnings: "Winnings",
      net: "Net Gain",
      bal: "Balance",
      xp: "XP"
    },
    noBet: [":warning: Please enter a bet! Example `", "flip tails 100`"]
  },
  jackpotCommand: {
    value: "JACKPOT Value",
    min: "Minimum bet to win the JACKPOT",
    historyTitle: "JACKPOT History",
    historyDesc: ["**Last won by:** ", " **Amount Won:** $"]
  },
  lotteryCommand: {
    buy: {
      error: "Lottery Buy Error",
      noMoney: ["You don't have enough money to buy ", " tickets.\nMax amount you can buy right now is ", " for "],
      bought: "Lottery Tickets Bought",
      amount: ["You bought ", " tickets for "],
      wonlast: "Due to winning the last lottery, you can't participate in this one. To be fair to other players, please wait for the next lottery — as you'll be able to participate."
    },
    price: "Next Ticket Price",
    playertickets: "Tickets You Have",
    percent: "% of total tickets",
    drawErrorTitle: "Lottery Draw Error",
    drawErrorDesc: "Heck brother, you're not an Admin on the Disnode Team server!",
    title: "Lottery Info",
    desc: ["Use `", "lottery buy [amount]` to buy a ticket.\nThe base price of a ticket is `$10,000`. Each time you buy a ticket the price increases by 5% each time \n`price += (price * 0.05)`\nThe lottery is drawn **every Friday**!"],
    amount: "Pot Amount",
    bought: "Tickets Bought",
    last: "Last Won By:"
  },
  marketCommand: {
    title: "Market List",
    lvl5: "You need to be at least level 5 to use the market.",
    noListings: "No listings found.",
    listTitle: "ID: ",
    listDesc: ["**Keys:** ", "\n**Price:** ", "\n**PPK:** "],
    sell: {
      noAmount: ["Please input an amount of keys and a price. Ex `", "market sell 1 100k`"],
      title: "Transaction ID: ",
      keys: "Keys",
      price: "Price",
      ppk: "Price Per Key (PPK)",
      problem: "There was a problem posting your transaction.",
      max: "You have reached the maximum amount of transactions, which is ",
      highppk: ["Your price must be less than ", " because the highest PPK is 500m."],
      lowPrice: "Your price must be greater than or equal to $1",
      noKeys: ["You don't have enough keys! You have ", " key(s)"],
      valid: "Please enter an amount of keys between 0 and 25."
    },
    self: {
      noListings: "You don't have any active transactions."
    },
    find: {
      nofind: "We couldn't find a transaction for that player.",
      noinput: ["Please input a user. Ex `", "market find @FireGamer3`"]
    },
    buy: {
      noid: ["Please input a transaction ID. Ex `", "market buy jf8na0x4`"],
      own: "You can't buy your own listing.",
      title: "Transaction Bought",
      desc: ["You bought ", " key(s) for "],
      nomoney: "You don't have enough money. You have ",
      notrans: "No transaction found with that ID."
    },
    cancel: {
      title: "Listing Canceled",
      desc: ["You have been returned your ", " keys."],
      noown: "This is not your transaction, therefore, you can't cancel it.",
      notrans: "No such transaction found with that ID.",
      noid: ["Please input a transaction ID. Ex `", "market cancel jf8na0x4`"],
    },
    helpTitle: "Market Commands",
    helpDesc: ["market list - Show transaction listings.\n", "market find - find transaction listings from a certain user.\n", "market sell - put your keys up for sale.\n", "market buy - buy a listing.\n", "market cancel - cancel one of your listings.\n", "market self - show all of your listings."]
  },
  topCommand: {
    page: "**Page:** ",
    order: "Order: ",
    level: " Level ",
    votes: " Votes ",
    seconds: " seconds",
    keys: " keys",
    prestige: " Prestige ",
    slots: " Slot Plays",
    jackpot: ' Jackpots ',
    title: "Top Command",
    fields: [{
      name: 'Info',
      inline: false,
      value: "The top command can be used to be who the best player is in several different fields.",
    }, {
      name: 'Commands',
      inline: false,
      value: "All commands are formatted like this: `cs/top (mode) (page)`. Page is an optional field. If you don't supply a page, the top 20 is shown for that mode.",
    }, {
      name: 'Modes',
      inline: false,
      value: "Modes:\n**income**: sorts users by income.\n**money**: sorts users by the amount of money that they have.\n**lv**: sorts users by their level.\n**timeout**: sorts users by their timeout.\n**keys**: sorts users by their keys.\n**prestige**: sorts users by their prestige.\n**slots**: sorts users by slots.\n**votes**: sorts users by votes.\n**jackpot**: sorts users by the amounts of jackpots won.",
    }]
  },
  loanCommand: {
    title: 'Commands',
    complete: "Complete",
    lvl10: "You need to be at least level 10 to use this command.",
    noLoan: "You don't have a loan currently active.",
    activeLoan: "You already have an active loan.",
    description: ['You can get a loan upwards of 10k to 100m. Interest is at 3%, and you have 24 hours until your interest kicks in.\nIf you don\'t pay within 24 hours, money will be taken off of your income to pay the loan.\nThere is a 4 day cooldown on taking out loans.', 'loan takeout [amount] - take out a loan\n', 'loan pay [amount] - pay off your loan\n', 'loan info - info of your current loan'],
    descriptionUltra: 'You can get a loan upwards of 10k to 250m. Interest is at 3%, and you have 24 hours until your interest kicks in.\nIf you don\'t pay within 24 hours, money will be taken off of your income to pay the loan.\nThere is a 4 day cooldown on taking out loans.',
    takeout: {
      noParam: ["Please input an amount of money you'd like to receive. Example `", "loan takeout 500k`"],
      highUltra: "The amount of money you can receive is between $10,000 - $250,000,000",
      high: "The amount of money you can receive is between $10,000 - $100,000,000",
      done: ["You have received a ", " loan. You have one day to pay it off before half of your income you claim goes towards paying it."]
    },
    info: {
      title: "Loan Info",
      amount: "Amount",
      interest: "Interest",
      time: "Time left",
      hours: " Hours ",
      minutes: " Minutes ",
      seconds: " Seconds ",
      payed: "Payed",
      before: "before interest kicks in and money taken from your income."
    },
    pay:{
      noParam: ["Please input an amount of money you'd like to pay. Example `", "loan pay 500k`"],
      amount: "The amount of money you can receive is between $1 - ",
      noMoney: "You don't have that much money",
      payed: ["You have payed "," towards the "," you owe."],
      full: "You have payed off your loan"
    }
  },
  bankCommand:{
    title: "Bank",
    notEnoughMoney: "You can't deposit more than half of your current balance.",
    completeDeposit: ["You completed a deposit of "," into your personal account."],
    cantwithdraw: "You can't withdraw more money than you have in your personal account.",
    completeWithdraw: ["You completed a withdrawl of "," into your balance."],
    tooLow: "Your requested amount is too low. You must use an amount greater than $1.",
    help: ["Bank allows you to store money temporarily. You are only allowed to deposit up to half of your current balance at a time. Half of the money stored also still counts to the minimum bet on all games.\n\n", "bank deposit [amount]** Allows you to depost money into your personal account.\n","bank withdraw [amount]** allows you to withdraw from your personal bank account"]
  }
};
