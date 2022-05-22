const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const readFile = require('./helpers/readFile');
const validateLogin = require('./middlewares/validateLogin');
const writeFile = require('./helpers/writeFile');
const authMiddleware = require('./middlewares/authMiddleware');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateRate = require('./middlewares/validateRate');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const FILE = 'talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/search', authMiddleware, async (req, res) => {
  const content = await readFile(FILE);
  const { q } = req.query;
  if (!q) return res.status(200).json(JSON.parse(content));
  const talkerByNameSearch = JSON.parse(content).filter((talker) => talker.name.includes(q));
  res.status(200).json(talkerByNameSearch);
});

app.get('/talker', async (_req, res) => {
  const content = await readFile(FILE);
  res.status(200).json(JSON.parse(content));
});

app.get('/talker/:id', async (req, res) => {
  const content = await readFile(FILE);
  const { id } = req.params;
  const talkerById = JSON.parse(content).find((talker) => talker.id === parseInt(id, 10));
  if (!talkerById) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).json(talkerById);
});

app.post('/talker', 
  authMiddleware,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const content = JSON.parse(await readFile(FILE));
    const id = content.length + 1;
    const talkerInfo = req.body;
    const newTalker = { id, ...talkerInfo };
    content.push(newTalker);
    await writeFile(FILE, JSON.stringify(content));
    res.status(201).json(newTalker);
});

app.put('/talker/:id',
  authMiddleware,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
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

app.delete('/talker/:id', authMiddleware, async (req, res) => {
  const content = JSON.parse(await readFile(FILE));
  const { id } = req.params;
  const talkerIndex = content.findIndex((talker) => talker.id === parseInt(id, 10));
  content.splice(talkerIndex, 1);
  await writeFile(FILE, JSON.stringify(content));
  res.status(204).end();
});

app.post('/login', validateLogin, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
