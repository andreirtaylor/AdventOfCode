const fs = require('fs');

const data = fs.readFileSync('./testInput.txt', { encoding: 'utf8', flag: 'r' });

data.split("\n").forEach(()=> {
  const [start, end, dist] = line.split(/(to|=)/).map(x => x.trim())
  console.log(start, end, dist)
})

