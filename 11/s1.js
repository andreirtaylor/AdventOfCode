const fs = require('fs');
  
const data = fs.readFileSync('./testInput.txt', {encoding:'utf8', flag:'r'});

const matrix = data.split("\n").map(line => line.trim().split("").map(x => x|0))

let lightUps = 0;
let flashed = new Set();
const lightUp = (x, y) => {
  const key = `${x},${y}`
  if(flashed.has(key)) return
  lightUps += 1
  flashed.add(key)
  for(let i = -1; i <= 1; ++i) {
    for(let j = -1; j <= 1; ++j) {
      if(matrix[x+i] === undefined || matrix[x+i][y+j] === undefined && (i !== 0 || j !== 0)) continue
      const val = matrix[x+i][y+j] + 1
      if (val === 10) lightUp(x+i,y+j)
      matrix[x+i][y+j] += 1
    }
  }
}

let steps = 1;
while(steps--) {
  for(let i =0; i < matrix.length; ++i) {
    for(let j = 0; j < matrix[0].length; ++j) {
      matrix[i][j] += 1;
      if(matrix[i][j] === 10) lightUp(i,j)
    }
  }
  flashed = new Set()
  for(let i =0; i < matrix.length; ++i) {
    for(let j = 0; j < matrix[0].length; ++j) {
      if(matrix[i][j] >= 10) matrix[i][j] = 0;
    }
  }
  console.log(matrix)
}


console.log(lightUps)