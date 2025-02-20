const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['api_key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: 'Доступ запрещен: неверный API-ключ' });
    }
    next();
};

module.exports = apiKeyMiddleware;
