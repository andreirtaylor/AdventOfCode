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
  .map(l => l.split('').map(risk => ({riskToMoveHere: Number.MAX_SAFE_INTEGER, risk: risk | 0})));

for (let i = 0; i < cave.length; ++i) {
  let line = '';
  for (let j = 0; j < cave[0].length; ++j) {
    line += cave[i][j].risk;
  }
  console.log(line);
}
console.log('');

cave.forEach((row, r) => {
  const tmpRow = [...row];
  for (let i = 1; i < 5; ++i) {
    tmpRow.push(
      ...row.map(cell => {
        let tmp = {...cell};
        tmp.risk = (cell.risk + i) % 9 || 9;
        // if (i === 4) console.log(tmp.risk, cell.risk + i, (cell.risk + i) % 10 || 1);

        return tmp;
      })
    );
  }
  cave[r] = tmpRow;
});

for (let i = 0; i < cave.length; ++i) {
  let line = '';
  for (let j = 0; j < cave[0].length; ++j) {
    line += cave[i][j].risk;
  }
  //console.log(line);
}

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

for (let i = 0; i < cave.length; ++i) {
  let line = '';
  for (let j = 0; j < cave[0].length; ++j) {
    line += cave[i][j].risk;
  }
  console.log(line);
}

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

//console.log(cave);

while (!q.isEmpty()) {
  //console.log(q.toArray());
  let {risk, x, y} = q.dequeue();
  if (x < 0) continue;
  if (y < 0) continue;
  if (y > endY) continue;
  if (x > endX) continue;
  if (x === endX && y === endY) {
    console.log(risk + cave[x][y].risk);
    continue;
  }
  //console.log(risk, x, y, cave[x][y]);
  if (!cave[x][y]) console.log(x, y);
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
