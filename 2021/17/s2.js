//const area = [20, -10, 30, -5];
// fuck parsing 4 numbers, hard code that
const area = [79, -176, 137, -117];
var [minX, minY, maxX, maxY] = area;

// I dont think you need a set here but it said unique so whatever.
let hits = new Set();
// I think you could prune this using the min and max numbers but who cares.
for (let x = 0; x < 300; ++x) {
  for (let y = -200; y < 300; ++y) {
    let height = 0;
    let dist = 0;

    let velX = x;
    let vel = y;
    let missed = true;
    // if either the height or the distance traveled exceeds the target you
    // have gone too far
    while (height >= minY && dist <= maxX) {
      velX = velX ? velX - 1 : 0;
      vel -= 1;
      height += vel;
      dist += velX;
      // if the x and y is within the correct area then count it as a hit
      if (height <= maxY && height >= minY && dist >= minX && dist <= maxX) {
        missed = false;
      }
    }
    if (!missed) {
      hits.add(`${x},${y}`);
    }
  }
}

console.log(hits.size);
