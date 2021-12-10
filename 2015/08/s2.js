const fs = require('fs');

const data = fs.readFileSync('./testInput.txt', { encoding: 'utf8', flag: 'r' });

let total = 0;
data.trim().split("\n").forEach(line => {
  const startLine = line
  const start = line.length;
  let real = 0;
  let encoded = 0;

  console.log(line)
  line = line
    .replace(/(^\"|\"$)/g, "")

    .replace(/\\x[a-f0-9][a-f0-9]/g, "X")
    .replace(/\\"/g, "X")
    .replace(/\\\\/g, "X")

  // let encoded = 0;
  encoded += 2;
  startLine.split("").forEach((c) => {
    if (c === "\"" || c === "\\") encoded += 2
    else encoded += 1
  })
  console.log(encoded, start)
  total += (encoded - start);
})

console.log('djadjdj')
console.log(total)