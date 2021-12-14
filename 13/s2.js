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
  // where = x or y
  // val = number where the fold happens
  return {where, val: val | 0};
});

// take each one of the folds and then get all of the points that
// have a x or y coordinate that is larger.
// using the fact that the inverse x/y coordinate is found by
// val - ((x|y) - val)
// add all of the created points to a set, and remove duplicates
// the set really isnt necessary since duplicate points wont actually
// slow this down that much but its nice to have
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

// this is to minimize the space that this prints to you could also set this arbitrarily
// to something like 50x50 but think of the wasted space in the console!
let maxX = Math.max(...Array.from(points).map(l => l.split(',')[0]));
let maxY = Math.max(...Array.from(points).map(l => l.split(',')[1]));

for (let j = 0; j <= maxY; ++j) {
  let line = '';
  for (let i = 0; i <= maxX; ++i) {
    line += points.has(`${i},${j}`) ? 'XX' : '  ';
  }
  console.log(line);
}
