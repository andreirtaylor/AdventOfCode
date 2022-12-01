const {count} = require('console');
const fs = require('fs');
// see https://www.npmjs.com/package/datastructures-js
const {MinPriorityQueue} = require('datastructures-js');
const data = fs.readFileSync('./testInput.txt', {
  encoding: 'utf8',
  flag: 'r',
});

let cave = data
  .split('\n')
  // risk to move here is infinite for all of the places to start, this will be updated
  // in the BFS below
  .map(l => l.split('').map(risk => ({riskToMoveHere: Number.MAX_SAFE_INTEGER, risk: risk | 0})));

// extend each row with the incremented version along the x axis
cave.forEach((row, r) => {
  const tmpRow = [...row];
  for (let i = 1; i < 5; ++i) {
    tmpRow.push(
      ...row.map(cell => {
        let tmp = {...cell};
        tmp.risk = (cell.risk + i) % 9 || 9;
        return tmp;
      })
    );
  }
  cave[r] = tmpRow;
});

/// extend each row to a new row on the y axis
const cpy = [...cave];
for (let i = 1; i < 5; ++i) {
  cave.forEach(row => {
    cpy.push(
      row.map(cell => {
        let tmp = {...cell};
        tmp.risk = (cell.risk + i) % 9 || 9;
        return tmp;
      })
    );
  });
}
cave = cpy;
cave[0][0] = 0;

let endX = cave.length - 1;
let endY = cave[0].length - 1;

const q = new MinPriorityQueue({
  compare: (a, b) => {
    if (a.risk < b.risk) return -1; // do not swap
    if (a.risk > b.risk) return 1; // swap

    // salaries are the same, compare rank
    return a.risk > b.risk ? 1 : -1;
  },
});

// the 0,0 spot doesnt really matter so I just skip it,
// I assume you could also set its risk to 0 since its
// unlikely that you would ever get back around to it.
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

// do a broke version of a* that has a heuristic that the lowest risk
// spot to go to is best.
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
      y,
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
