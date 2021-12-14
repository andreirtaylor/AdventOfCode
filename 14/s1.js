const {count} = require('console');
const fs = require('fs');

const data = fs.readFileSync('./testInput.txt', {
  encoding: 'utf8',
  flag: 'r',
});

let [seq, pairs] = data.trim().split('\n\n');

seq = seq.split('');
const pairToInsert = {};
pairs = pairs.split('\n').forEach(line => {
  const [pair, insert] = line.split(' -> ');
  pairToInsert[pair] = insert;
});

let steps = 10;

// actually generate the sequence
while (steps--) {
  nextSeq = [];
  seq.forEach((c, i) => {
    if (i === seq.length - 1) return;
    nextSeq.push(c);
    let insert = pairToInsert[`${c}${seq[i + 1]}`];
    if (insert) nextSeq.push(insert);
  });
  nextSeq.push(seq[seq.length - 1]);
  seq = nextSeq;
}

const counter = {};
seq.forEach(c => {
  counter[c] = (counter[c] || 0) + 1;
});

const mini = Math.min(...Object.values(counter));
const maxi = Math.max(...Object.values(counter));

console.log(maxi - mini);
