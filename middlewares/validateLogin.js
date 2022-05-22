const validateEmail = (email) => {
    if (!email) return { message: 'O campo "email" é obrigatório' };
    if (!(email.includes('@') && email.includes('.com'))) {
        return { message: 'O "email" deve ter o formato "email@email.com"' };
    }
};

const validatePassword = (pw) => {
    if (!pw) return { message: 'O campo "password" é obrigatório' };
    if (pw.length < 6) return { message: 'O "password" deve ter pelo menos 6 caracteres' };
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (validateEmail(email)) return res.status(400).json(validateEmail(email));
    if (validatePassword(password)) return res.status(400).json(validatePassword(password));
    next();
};

module.exports = validateLogin;
