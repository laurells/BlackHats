const { AutoAccount, User } = require('../models');

const PLAN_LIMITS = {
  planA: 15,
  planB: 30,
  planC: 50
};

// Function to create a new AutoAccount
exports.createAutoAccount = async (req, res, next) => {
  try {
    const {
      platform,
      platformUser,
      platformPass,
      comment,
      comment_2,
      comment_3,
      comment_4,
      comment_5,
      targetUser,
      targetUser2,
      targetUser3
    } = req.body;
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's info

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPlan = user.plan;
    const platformLimit = PLAN_LIMITS[userPlan];

    const existingAccountsCount = await AutoAccount.count({
      where: { userId, platform }
    });

    if (existingAccountsCount >= platformLimit) {
      return res.status(403).json({ error: `Limit of ${platformLimit} accounts per platform reached for your plan` });
    }

    const autoAccount = await AutoAccount.create({
      userId,
      platform,
      platformUser,
      platformPass,
      comment,
      comment_2,
      comment_3,
      comment_4,
      comment_5,
      targetUser,
      targetUser2,
      targetUser3
    });

    res.status(201).json(autoAccount);
  } catch (error) {
    next(error);
  }
};

// Function to retrieve all AutoAccounts for a user
exports.getAutoAccounts = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's info

    const autoAccounts = await AutoAccount.findAll({ where: { userId } });

    res.status(200).json(autoAccounts);
  } catch (error) {
    next(error);
  }
};
