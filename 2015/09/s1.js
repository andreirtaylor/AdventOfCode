const fs = require("fs");

const data = fs.readFileSync("./testInput.txt", {
  encoding: "utf8",
  flag: "r",
});

let total = 0;

const start = [];
const places = new Set();
const edges = [];
data.split("\n").forEach((line) => {
  const [start, end, cost] = line.split(" ");
  places.add(start);
  places.add(end);
  edges.push({ start, end, cost: cost | 0 });
});

edges.sort(({ cost: a }, { cost: b }) => a - b);

let minCost = Number.MAX_VALUE;
Array.from(places).forEach((p) => {
  let currCost = 0;
  let last = p;
  const edg = [...edges];
  const seen = new Set([p]);

  while (seen.size < places.size) {
    console.log(p, seen);
    for (let i = 0; i < edg.length; ++i) {
      const { start, end, cost } = edg[i];
      console.log(start, end, cost);

      if (start === last && !seen.has(end)) {
        currCost += cost;
        last = end;
        seen.add(end);
        break;
      } else if (end === last && !seen.has(start)) {
        currCost += cost;
        last = start;
        seen.add(start);
        break;
      }
      console.log(seen, currCost);
    }
  }
  minCost = Math.min(currCost, minCost);
  console.log();
});

console.log(minCost);
