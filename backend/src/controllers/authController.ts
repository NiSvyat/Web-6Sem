const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const Event = db.Event;
const RefreshToken = db.RefreshToken;

const { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = process.env;

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

  await RefreshToken.create({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    userId: user.id
  });

  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = await User.create({ email, password, username });
    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(201).json({
      user: { id: user.id, email: user.email, username: user.username },
      tokens: { accessToken, refreshToken }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.json({
      user: { id: user.id, email: user.email, username: user.username },
      tokens: { accessToken, refreshToken }
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const tokenData = await RefreshToken.findOne({
      where: { token: refreshToken },
      include: [User]
    });

    if (!tokenData || new Date(tokenData.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(tokenData.User);

    // Remove the old refresh token
    await tokenData.destroy();

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await RefreshToken.destroy({ where: { token: refreshToken } });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};