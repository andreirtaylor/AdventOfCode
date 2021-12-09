const fs = require('fs');
const data = fs.readFileSync('./testInput.txt', {encoding:'utf8', flag:'r'});

const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]

const arr = data.split("\n").filter((x)=> x).map(x => x.trim().split(""));

let stack = []

for(let i = 0; i < arr.length; ++i) {
  for(let j = 0; j < arr[0].length; ++j) {
    let isLow = true;
    dirs.forEach((dir) => {
      const [x,y] = dir;
      if(arr[i+x] !== undefined && arr[i+x][j+y] !== undefined && arr[i+x][j+y] <= arr[i][j]) {
        isLow = false
      }

    })
    if(isLow) {
      stack.push({i,j, b:stack.length});
    }
  }
}

// coords to basin i.e. 20,6 -> 4, the basin is defined by the starting points
// determined in the first part, its just the index in the stack, nothing special
const visited = {}

// do a DFS search of all of the lowest points and stop the search when you hit a 9
// you know that because there is no limit to how far the basin can fill other 
// than reaching the top.
// 
// the reason for this is the fact that the walls count as stopping points
// so each basin will fill all the way to the top every time, if this wasnt the case this
// problem gets a LOT harder.
// see https://leetcode.com/problems/trapping-rain-water-ii/
//
// DFS works easier than BFS because you dont want to accidentally count the same basin
// twice, by using the stack you exhaust all parts of one basin even if it overlaps 
// with a second basin

while(stack.length) {
  const {i, j, b} = stack.pop();
  const key = `${i},${j}`;
  //console.log(key, b)
  if(visited[key] !== undefined || arr[i][j] == 9) continue;
  visited[key] = b;
  dirs.forEach((dir) => {
    const [x,y] = dir;
    if(arr[i+x] !== undefined && arr[i+x][j+y] !== undefined && arr[i+x][j+y] !== 9) {
      stack.push({i: i+x, j:j+y, b})
    }
  })
}

// since we not have a list of coordinates and which basin they belong to
// we can now count and sort the largest basins
const counter= {}

Object.values(visited).forEach((v) => counter[v] = (counter[v] || 0) + 1)
console.log(Object.values(counter).sort((a,b) => b-a).slice(0,3).reduce((p,c) => p*c, 1))