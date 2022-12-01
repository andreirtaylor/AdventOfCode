const fs = require("fs");

const data = fs.readFileSync("./testInput.txt", {
  encoding: "utf8",
  flag: "r",
});

const dirs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const arr = data
  .split("\n")
  .filter((x) => x)
  .map((x) => x.trim().split(""));

let risk = 0;

let starts = [];

for (let i = 0; i < arr.length; ++i) {
  for (let j = 0; j < arr[0].length; ++j) {
    let isLow = true;
    dirs.forEach((dir) => {
      const [x, y] = dir;
      if (
        arr[i + x] !== undefined &&
        arr[i + x][j + y] !== undefined &&
        arr[i + x][j + y] <= arr[i][j]
      ) {
        isLow = false;
      }
    });
    if (isLow) {
      risk += (arr[i][j] | 0) + 1;
      starts.push({ i, j, b: starts.length });
    }
  }
}

console.log(risk);
