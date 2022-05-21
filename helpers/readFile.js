const fs = require('fs').promises;

const readFile = async (file) => {
    const content = await fs.readFile(file, 'utf-8');
    return content;
};

module.exports = readFile;
