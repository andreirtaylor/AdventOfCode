const fs = require("fs");

const data = fs.readFileSync("./testInput.txt", {
  encoding: "utf8",
  flag: "r",
});
const lines = data.split("\n");

let total = 0;
lines.forEach((line) => {
  let [signals, display] = line.split("|").filter((line) => line);

  let counts = signals
    .split(" ")
    .join("")
    .split("")
    .reduce((p, l) => (p[l] = (p[l] || 0) + 1) && p, {});

  let invertCounts = {};
  Object.keys(counts).forEach((k) => {
    invertCounts[counts[k]] = [...(invertCounts[counts[k]] || []), k];
  });

  signals = signals
    .split(" ")
    .map((s) => s.trim())
    .filter((x) => x)
    .sort((a, b) => a.length - b.length);
  display = display
    .split(" ")
    .map((s) => s.trim())
    .filter((x) => x);

  const nums = [
    "abcefg",
    "cf",
    "acdeg",
    "acdfg",
    "bcdf",
    "abdfg",
    "abdefg",
    "acf",
    "abcdefg",
    "abcdfg",
  ];
  const translate = { a: "", b: "", c: "", d: "", e: "", f: "", g: "" };

  // I thought of this as a matrix
  //    a b c  d e f g
  // 1      x      x    2 lines
  // 7 |x   x      x    3 lines
  // 4    x x |x   x    4 lines
  // 3 |x   x |x   x x  5 lines
  // 5 |x x   |x   x x  5 lines
  // 2 |x   x |x x   x  5 lines
  // 0 |x x x    x x x  5 lines
  // 6 |x x    x x x x  6 lines
  // 9 |x x x  x   x x  6 lines
  // 8 |x x x  x x x x  8 lines
  //    8 6 8  7 4 9 7  <- TOTALS
  // using this matrix the below logic follows
  // e will be the one with a count of 4
  // f will be the one with a count of 9
  // b will be the one with a count of 6
  // 4, 3, 5 and 2 all have d which has a count of 7
  // the other 7 is g
  // 7, 3, 5, 2, 0, 6, 9, 8 all have a which has a count of 8
  // the other 8 is c

  // there is only ever one for these 3 counts
  translate.e = invertCounts[4][0];
  translate.f = invertCounts[9][0];
  translate.b = invertCounts[6][0];

  // the common element between 4, 3, 5 and 2 is the d panel
  let possibilities = signals[4].split("");
  signals
    .filter((s) => s.length === 5 || s.length === 4)
    .forEach((s) => {
      possibilities = possibilities.filter((p) => s.split("").includes(p));
    });
  translate.d = possibilities[0];
  // the only other possible 7 count is g
  translate.g = invertCounts[7].filter((x) => x != translate.d)[0];

  // find the only common element between 7, 3, 5, 2, 0, 6, 9, 8
  possibilities = signals[5].split("");
  signals
    .filter((s) => s.length >= 5 || s.length === 3)
    .forEach((s) => {
      possibilities = possibilities.filter((p) => s.split("").includes(p));
    });

  translate.a = possibilities[0];
  translate.c = invertCounts[8].filter((x) => x !== translate.a)[0];

  // translate currently is "expectedLetter => jumbledLetter"
  // we want "jumbledLetter => expectedLetter"
  let invertTranslate = {};
  Object.keys(counts).forEach((k) => {
    invertTranslate[translate[k]] = [
      ...(invertTranslate[translate[k]] || []),
      k,
    ];
  });

  let disp = display
    .map((num) => {
      num = num
        .split("")
        .map((d) => {
          return invertTranslate[d];
        })
        .sort()
        .join("");
      return nums.indexOf(num);
    })
    .join("");

  total += disp | 0;
});

console.log(total);
