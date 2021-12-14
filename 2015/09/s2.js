const fs = require("fs");
const { features } = require("process");

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

edges.sort(({ cost: a }, { cost: b }) => b - a);

//console.log(edges, places)
let maxCost = 0;
Array.from(places).forEach((p) => {
  const edg = [...edges];
  let test = 10000;

  while (test--) {
    let rand1 = Math.floor(Math.random() * edg.length);
    let rand2 = Math.floor(Math.random() * edg.length);
    let tmp = edg[rand1];
    edg[rand1] = edg[rand2];
    edg[rand1] = tmp;
    let currCost = 0;
    let last = p;

    const seen = new Set([p]);

    while (seen.size < places.size) {
      for (let i = 0; i < edg.length; ++i) {
        const { start, end, cost } = edg[i];
        //console.log(start, end, cost)

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
      }
    }
    maxCost = Math.max(currCost, maxCost);
  }
});

console.log(maxCost);
