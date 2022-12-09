const fs = require('fs');

// if the flag -r is set use the real input
// if the flag -t is set use the test input
// otherwise use the sample input
const d = process.argv.includes('-r')
  ? fs.readFileSync('./theRealInput.txt', {
      encoding: 'utf8',
      flag: 'r',
    })
  : process.argv.includes('-t')
  ? fs.readFileSync('./testInput.txt', {
      encoding: 'utf8',
      flag: 'r',
    })
  : fs.readFileSync('./sampleInput.txt', {
      encoding: 'utf8',
      flag: 'r',
    });

const trees = d.split('\n').map(l => l.split('').map(x => x | 0));

let iterations = Math.max(trees[0].length, trees.length);
let visible = 0;
// do not do the permutations for the corners
// thats why i = 1 and j = 1 and I subtract 1 from the length
for (let i = 1; i < trees.length - 1; i++) {
  for (let j = 1; j < trees[0].length - 1; j++) {
    let up = (down = left = right = true);
    let iterate = 0;
    const height = trees[i][j];
    while (iterate++ <= iterations) {
      // kinda nie that you can use the elvis operator to check if the value is undefined
      if (up && trees[i - iterate]?.[j] >= height) {
        up = false;
      }
      if (down && trees[i + iterate]?.[j] >= height) {
        down = false;
      }
      if (left && trees[i]?.[j - iterate] >= height) {
        left = false;
      }
      if (right && trees[i]?.[j + iterate] >= height) {
        right = false;
      }
    }
    visible += up || down || left || right ? 1 : 0;
  }
}
// subtract the corners while calculating the perimiter of the forest
console.log(visible + 2 * trees[0].length + 2 * trees.length - 4);
