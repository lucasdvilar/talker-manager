const fs = require('fs').promises;

const writeFile = async (file, content) => {
    await fs.writeFile(file, content);
};

module.exports = writeFile;
