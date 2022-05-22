const express = require('express');
const readFile = require('../helpers/readFile');
const writeFile = require('../helpers/writeFile');
const authMiddleware = require('../middlewares/authMiddleware');
const validateName = require('../middlewares/validateName');
const validateAge = require('../middlewares/validateAge');
const validateTalk = require('../middlewares/validateTalk');
const validateWatchedAt = require('../middlewares/validateWatchedAt');
const validateRate = require('../middlewares/validateRate');

const router = express.Router();

const FILE = 'talker.json';

router.get('/', async (_req, res) => {
    const content = await readFile(FILE);
    res.status(200).json(JSON.parse(content));
});

router.get('/search', authMiddleware, async (req, res) => {
    const content = await readFile(FILE);
    const { q } = req.query;
    if (!q) return res.status(200).json(JSON.parse(content));
    const talkerByNameSearch = JSON.parse(content).filter((talker) => talker.name.includes(q));
    res.status(200).json(talkerByNameSearch);
});

router.get('/:id', async (req, res) => {
    const content = await readFile(FILE);
    const { id } = req.params;
    const talkerById = JSON.parse(content).find((talker) => talker.id === parseInt(id, 10));
    if (!talkerById) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    res.status(200).json(talkerById);
});

router.use(authMiddleware);

router.delete('/:id', async (req, res) => {
    const content = JSON.parse(await readFile(FILE));
    const { id } = req.params;
    const talkerIndex = content.findIndex((talker) => talker.id === parseInt(id, 10));
    content.splice(talkerIndex, 1);
    await writeFile(FILE, JSON.stringify(content));
    res.status(204).end();
});

router.use(validateName, validateAge, validateTalk, validateWatchedAt, validateRate);

router.post('/', async (req, res) => {
    const content = JSON.parse(await readFile(FILE));
    const talkerInfo = req.body;
    const id = content.length + 1;
    const newTalker = { id, ...talkerInfo };
    content.push(newTalker);
    await writeFile(FILE, JSON.stringify(content));
    res.status(201).json(newTalker);
});

router.put('/:id', async (req, res) => {
    const content = JSON.parse(await readFile(FILE));
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    const newTalkerInfo = req.body;
    const talkerIndex = content.findIndex((talker) => talker.id === parsedId);
    const updatedTalker = { id: parsedId, ...newTalkerInfo };
    content[talkerIndex] = updatedTalker;
    await writeFile(FILE, JSON.stringify(content));
    res.status(200).json(updatedTalker);
});

module.exports = router;
