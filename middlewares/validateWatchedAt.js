const checkDateFormat = (date) => {
    const test = date.split('/');
    return test.length === 3
        && test[0].length === 2
        && test[1].length === 2
        && test[2].length === 4;
};

const validateWatchedAt = (req, res, next) => {
    const { talk: { watchedAt } } = req.body;
    if (!watchedAt) {
        return res.status(400).json({
            message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
        });
    }
    if (!checkDateFormat(watchedAt)) {
        return res.status(400).json({
            message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
    }
    next();
};

module.exports = validateWatchedAt;
