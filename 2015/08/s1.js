const fs = require('fs');

const data = fs.readFileSync('./testInput.txt', { encoding: 'utf8', flag: 'r' });

let total = 0;
data.trim().split("\n").forEach(line => {
  const startLine = line
  const start = line.length;
  let real = 0;
  console.log(line)
  line = line
    .replace(/(^\"|\"$)/g, "")

    .replace(/\\x[a-f0-9][a-f0-9]/g, "X")
    .replace(/\\"/g, "X")
    .replace(/\\\\/g, "X")
  console.log(line)
  console.log(start, line.length)
  total += start - line.length;
})

console.log(total)