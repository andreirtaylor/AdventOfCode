const fs = require('fs');

//const data = fs.readFileSync('./testInput.txt',{ encoding: 'utf8', flag: 'r' }); 
const data = fs.readFileSync('./realInput.txt',{ encoding: 'utf8', flag: 'r' });

const lines = data.split('\n').filter((line) => line)

const points = {};

function gcd(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

lines.forEach((line) => {
  const [start, end] = line.split(" -> ")
  let [startX, startY] = start.split(",").map(n => n|0)
  let [endX, endY] = end.split(",").map(n => n|0)

  // uncomment this for part 1
  //if (startX !== endX && startY !== endY) return

  const deltaX = endX - startX
  const deltaY = endY - startY

  const divisor = gcd(deltaX, deltaY);
  
  const slopeX = deltaX/divisor;
  const slopeY = deltaY/divisor

  while (startX !== endX || startY !== endY)  {
    const serialized = `${startX},${startY}`
    points[serialized] = (points[serialized] || 0) + 1
    startX += slopeX;
    startY += slopeY;
  }
  const serialized = `${startX},${endY}`
  points[serialized] = (points[serialized] || 0) + 1
})

const answer = Object.values(points).filter((x) => x > 1);
console.log(answer.length)