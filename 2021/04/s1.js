const fs = require("fs");

const data = fs.readFileSync("./testInput.txt", {
  encoding: "utf8",
  flag: "r",
});

const [numbers, ...lines] = data.split("\n").filter((line) => line);

const boards = [];
let boardNum = 0;
lines.forEach((line, r) => {
  const nums = line.trim().split(/\s+/);
  r = r % 5;
  nums.forEach((num, c) => {
    (boards[boardNum] = boards[boardNum] || {})[num] = {
      r,
      c,
    };
  });
  if (r === 4) {
    boards.push({});
    boardNum += 1;
  }
});
boards.pop();

const solve = (board, called) => {
  const nums = Object.keys(board).filter((key) => {
    return !isNaN(key) && !board[key].played;
  });
  console.log(nums.reduce((p, c) => (p | 0) + (c | 0)) * called);
};

// console.log(boards, numbers)
numbers.split(",").forEach((num) => {
  boards.forEach((board, i) => {
    if (board.done) return;
    board["rows"] = board["rows"] || [0, 0, 0, 0, 0];
    board["columns"] = board["columns"] || [0, 0, 0, 0, 0];
    board["upDiag"] = board["upDiag"] || 0;
    board["downDiag"] = board["downDiag"] || 0;

    const { r, c, downDiag, upDiag } = board[num] || {};
    if (r === undefined) return;
    board[num].played = true;

    if ((board.rows[r] += 1) === 5) {
      solve(board, num);
      board.done = true;
    } else if ((board.columns[c] += 1) === 5) {
      solve(board, num);
      board.done = true;
    }
  });
});
