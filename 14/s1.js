const {count} = require('console');
const fs = require('fs');

const data = fs.readFileSync('./testInput.txt', {
  encoding: 'utf8',
  flag: 'r',
});
