const InstaBot = require('../bot/instabot'); 
const { AutoAccount } = require('../models/autoaccount');

let bots = {}; 

// Function to start a bot for a specific AutoAccount
const startBot = async (accountId) => {
  try {
    const account = await AutoAccount.findByPk(accountId);
    if (!account) throw new Error('Account not found');

    if (bots[accountId]) {
      throw new Error('Bot already running for this account');
    }

    const bot = new InstaBot(
      account.platformUser,
      account.platformPass,
      1000, 
      10,  
      [account.targetUser, account.targetUser2, account.targetUser3],
      5,    
      0     
    );

    bots[accountId] = bot;

    // Start the bot's autoMod loop
    await bot.autoMod(); 

    return bot;
  } catch (error) {
    throw new Error(`Error starting bot: ${error.message}`);
  }
};

// Function to stop a bot for a specific AutoAccount
const stopBot = async (accountId) => {
  try {
    if (bots[accountId]) {
      await bots[accountId].stop(); // Ensure stop is an async function if needed
      delete bots[accountId];
    } else {
      throw new Error('No bot running for this account');
    }
  } catch (error) {
    throw new Error(`Error stopping bot: ${error.message}`);
  }
};

module.exports = {
  startBot,
  stopBot
};
