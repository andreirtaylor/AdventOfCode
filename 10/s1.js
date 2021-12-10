const fs = require('fs');
  
const data = fs.readFileSync('./testInput.txt', {encoding:'utf8', flag:'r'});

const openers = ['{', '[', "(", "<"];
const closers = ['}', ']', ')', ">"]
const values = [1197,57,3,25137]

let errorScore = 0;
data.split("\n").forEach(line => {
  const stack = []
  const chars = line.trim().split("")
  for(let i =0; i < chars.length; ++i) {
    const char = chars[i];
    if(openers.includes(char)){
      stack.push(char)
    } else {
      const index = closers.indexOf(char);
      if(stack[stack.length - 1] === openers[index]) {
        stack.pop()
      } else {
        errorScore += values[index]
        break;
      }
    }
  }
})

console.log(errorScore)