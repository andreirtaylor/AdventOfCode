const fs = require("fs");

const data = fs.readFileSync("./testInput.txt", {
  encoding: "utf8",
  flag: "r",
});

const openers = ["{", "[", "(", "<"];
const closers = ["}", "]", ")", ">"];
const values = [3, 2, 1, 4];

const scores = [];
data.split("\n").forEach((line) => {
  const stack = [];
  const chars = line.trim().split("");
  let broken = false;
  for (let i = 0; i < chars.length; ++i) {
    const char = chars[i];
    if (openers.includes(char)) {
      stack.push(char);
    } else {
      const index = closers.indexOf(char);
      if (stack[stack.length - 1] === openers[index]) {
        stack.pop();
      } else {
        broken = true;
        break;
      }
    }
  }
  if (!broken) {
    let errorScore = stack.reverse().reduce((p, c) => {
      return p * 5 + (values[openers.indexOf(c)] | 0);
    }, 0);
    scores.push(errorScore);
  }
});

console.log(scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]);
