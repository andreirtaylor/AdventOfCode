const fs = require('fs');
const {EnhancedSet} = require('datastructures-js');

const data = fs.readFileSync('./testInput.txt', {
  encoding: 'utf8',
  flag: 'r',
});

let [points, folds] = data.trim().split('\n\n');

points = points.split('\n');
folds = folds.split('\n').map(line => {
  const [where, val] = line.split(' ')[2].split('=');
  return {where, val: val | 0};
});

folds.forEach(({where, val}) => {
  points = new Set(
    Array.from(points).map(p => {
      let [x, y] = p.split(',').map(x => x | 0);
      if (where === 'y') {
        /// simplified from val - (y - val)
        return y >= val ? `${x},${2 * val - y}` : p;
      } else {
        return x >= val ? `${2 * val - x},${y}` : p;
      }
    })
  );
});

let maxX = Math.max(...Array.from(points).map(l => l.split(',')[0]));
let maxY = Math.max(...Array.from(points).map(l => l.split(',')[1]));

for (let j = 0; j <= maxY; ++j) {
  let line = '';
  for (let i = 0; i <= maxX; ++i) {
    line += points.has(`${i},${j}`) ? 'XX' : '  ';
  }
  console.log(line);
}
