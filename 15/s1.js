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

// const q = new MinPriorityQueue({
//   compare: (a, b) => {
//     if (a.risk < b.risk) return -1; // do not swap
//     if (a.risk > b.risk) return 1; // swap

//     // salaries are the same, compare rank
//     return a.risk < b.risk ? 1 : -1;
//   },
// });

const q = new MinPriorityQueue({
  compare: (a, b) => {
    a.d = dist(a.x, a.y, endX, endY);
    b.d = dist(b.x, b.y, endX, endY);
    if (a.d < b.d) return -1; // do not swap
    if (a.d > b.d) return 1; // swap
    return a.d < b.d ? 1 : -1;
  },
});

const dist = (x, y, x2, y2) => {
  return Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
};

q.enqueue({
  risk: 0,
  x: 0,
  y: 0,
  d: dist(0, 0, endX, endY),
});

while (!q.isEmpty()) {
  //console.log(q.toArray());
  let {risk, x, y} = q.dequeue();
  if (x < 0) continue;
  if (y < 0) continue;
  if (y > endY) continue;
  if (x > endX) continue;
  if (x === endX && y === endY) {
    console.log(risk + cave[x][y].risk);
    break;
  }
  //console.log(risk, x, y, cave[x][y]);

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

//console.log(JSON.stringify(cave, undefined, 3));
