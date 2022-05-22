const express = require('express');
const bodyParser = require('body-parser');
const readFile = require('./helpers/readFile');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const content = await readFile('talker.json');
  res.status(200).json(JSON.parse(content));
});

app.get('/talker/:id', async (req, res) => {
  const content = await readFile('talker.json');
  const { id } = req.params;
  const talkerById = JSON.parse(content).find((talker) => talker.id === parseInt(id, 10));
  if (!talkerById) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).json(talkerById);
});

app.listen(PORT, () => {
  console.log('Online');
});
