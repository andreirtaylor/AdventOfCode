const {count} = require('console');
const fs = require('fs');

const data = fs.readFileSync('./testInput.txt', {
  encoding: 'utf8',
  flag: 'r',
});

let [raw, pairs] = data.trim().split('\n\n');

const pairToInsert = {};
pairs = pairs.split('\n').forEach(line => {
  const [pair, insert] = line.split(' -> ');
  pairToInsert[pair] = insert;
});

let steps = 40;
let counter = {};
const letters = {};

seq = raw.split('').forEach((c, i) => {
  letters[c] = (letters[c] || 0) + 1;
  if (i === raw.length - 1) return;
  counter[`${c}${raw[i + 1]}`] = (counter[`${c}${raw[i + 1]}`] || 0) + 1;
});

// counter keeps track of the pairs of letters
// letters keeps track of the individual letter counts
while (steps--) {
  let nextCounter = {...counter};

  Object.keys(counter).forEach(c => {
    if (!counter[c]) return;
    const [a, b] = c.split('');
    let insert = pairToInsert[`${a}${b}`];

    if (insert) {
      // next counter is a copy of counter, and it contains different numbers than the
      // counter variable after each iteration
      // Its important to take the original count from the "counter"
      // and to take the values for the inserted pairs from the newCounter
      // since the number of pairs that are being processed is coming from the
      // original string... this took me a while to reason about, if only
      // javascript had a obj[key]++ type feature instead of this verbose
      // nonsense
      const count = counter[`${a}${b}`];
      nextCounter[`${a}${b}`] -= count;
      nextCounter[`${a}${insert}`] = (nextCounter[`${a}${insert}`] || 0) + count;
      nextCounter[`${insert}${b}`] = (nextCounter[`${insert}${b}`] || 0) + count;
      letters[insert] = (letters[insert] || 0) + count;
    }
  });
  counter = nextCounter;

  const mini = Math.min(...Object.values(letters));
  const maxi = Math.max(...Object.values(letters));

  console.log(maxi - mini);
}
