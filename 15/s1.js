const {count} = require('console');
const fs = require('fs');
// see https://www.npmjs.com/package/datastructures-js
const {MinPriorityQueue} = require('datastructures-js');
const data = fs.readFileSync('./testInput.txt', {
  encoding: 'utf8',
  flag: 'r',
});

const cave = data
  .split('\n')
  .map(l => l.split('').map(risk => ({riskToMoveHere: Number.MAX_SAFE_INTEGER, risk: risk | 0})));

let endX = cave.length - 1;
let endY = cave[0].length - 1;

const q = new MinPriorityQueue({
  compare: (a, b) => {
    if (a.risk < b.risk) return -1; // do not swap
    if (a.risk > b.risk) return 1; // swap

    return a.risk > b.risk ? 1 : -1;
  },
});

q.enqueue({
  risk: 0,
  x: 0,
  y: 1,
});
q.enqueue({
  risk: 0,
  x: 1,
  y: 0,
});

while (!q.isEmpty()) {
  let {risk, x, y} = q.dequeue();
  if (x < 0) continue;
  if (y < 0) continue;
  if (y > endY) continue;
  if (x > endX) continue;
  if (x === endX && y === endY) {
    console.log(risk + cave[x][y].risk);
    break;
  }

  risk = risk + cave[x][y].risk;
  if (cave[x][y].riskToMoveHere > risk) {
    cave[x][y].riskToMoveHere = risk;
    q.enqueue({
      risk,
      x: x + 1,
      y,
    });
    q.enqueue({
      risk,
      x: x - 1,
      y: 0,
    });
    q.enqueue({
      risk,
      x,
      y: y + 1,
    });
    q.enqueue({
      risk,
      x,
      y: y - 1,
    });
  }
}
