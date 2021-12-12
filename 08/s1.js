const fs = require("fs");

const data = fs.readFileSync("./testInput.txt", {
  encoding: "utf8",
  flag: "r",
});
const lines = data.split("\n");

let numbersImLookingFor = 0;
lines.forEach((line) => {
  let [_, display] = line.split("|").filter((line) => line);

  display = display
    .split(" ")
    .map((s) => s.trim().split("").sort().join(""))
    .filter((x) => x)
    .filter((digits) => {
      return (
        digits.length == 2 ||
        digits.length == 4 ||
        digits.length == 3 ||
        digits.length == 7
      );
    });
  numbersImLookingFor += display.length;
});

console.log(numbersImLookingFor);
