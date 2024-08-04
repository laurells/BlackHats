const { startBot, stopBot } = require('../services/instabotService');

// Function to start a bot
exports.startInstaBot = async (req, res, next) => {
  try {
    const accountId = req.params.id;
    await startBot(accountId);
    res.status(200).json({ message: 'Bot started successfully' });
  } catch (error) {
    next(error);
  }
};

// Function to stop a bot
exports.stopInstaBot = async (req, res, next) => {
  try {
    const accountId = req.params.id;
    stopBot(accountId);
    res.status(200).json({ message: 'Bot stopped successfully' });
  } catch (error) {
    next(error);
  }
};

