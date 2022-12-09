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
let bestTree = 0;
for (let i = 1; i < trees.length - 1; i++) {
  for (let j = 1; j < trees[0].length - 1; j++) {
    let up = (down = left = right = true);
    let upCount = (downCount = leftCount = rightCount = 0);
    let iterate = 0;
    const height = trees[i][j];
    // short circuit the while loop if all directions are false
    while (iterate++ <= iterations && (up || down || left || right)) {
      // for each of the directions
      // first check if you are still in the forest
      // Then check if the tree is higher than the current tree
      // and if its not and you can still go in that direction then add 1 to the count
      if (trees[i - iterate]?.[j] === undefined) {
        up = false;
      } else if (up && trees[i - iterate]?.[j] >= height) {
        up = false;
        upCount++;
      } else if (up) {
        upCount++;
      }
      if (trees[i + iterate]?.[j] === undefined) {
        down = false;
      } else if (down && trees[i + iterate]?.[j] >= height) {
        down = false;
        downCount++;
      } else if (down) {
        downCount++;
      }

      if (trees[i]?.[j - iterate] === undefined) {
        left = false;
      } else if (left && trees[i]?.[j - iterate] >= height) {
        left = false;
        leftCount++;
      } else if (left) {
        leftCount++;
      }
      if (trees[i]?.[j + iterate] === undefined) {
        right = false;
      } else if (right && trees[i]?.[j + iterate] >= height) {
        right = false;
        rightCount++;
      } else if (right) {
        rightCount++;
      }
    }
    bestTree = Math.max(bestTree, upCount * downCount * leftCount * rightCount);
  }
}

console.log(bestTree);
