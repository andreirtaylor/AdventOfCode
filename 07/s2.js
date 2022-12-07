const fs = require('fs');

// if the flag -r is set use the real input
// if the flag -t is set use the test input
// otherwise use the sample input
const d = process.argv.includes('-r')
  ? fs.readFileSync('./theRealInput.txt', {
      encoding: 'utf8',
      flag: 'r',
    })
  : process.argv.includes('-t')
  ? fs.readFileSync('./testInput.txt', {
      encoding: 'utf8',
      flag: 'r',
    })
  : fs.readFileSync('./sampleInput.txt', {
      encoding: 'utf8',
      flag: 'r',
    });

const root = {name: '/', children: [], size: 0};

let curr = root;
d.split('\n').forEach(command => {
  const [cmdOrSize, fileOrCMD, directory] = command.split(' ');
  //console.log(console.log(JSON.stringify(root, null, 3)), 'in directory ' + curr.parent);
  // console.log(cmdOrSize, fileOrCMD, directory);

  switch (cmdOrSize) {
    case '$':
      if (fileOrCMD === 'ls') {
        break;
      } else if (fileOrCMD === 'cd') {
        if (directory === '/') {
          curr = root;
        } else if (directory === '..') {
          curr = curr.parent || curr;
        } else {
          curr = curr.children.find(child => child.name === directory);
        }
      } else {
        console.error('unknown command', fileOrCMD);
      }
      break;
    default:
      if (cmdOrSize === 'dir') {
        curr.children.push({name: fileOrCMD, children: [], size: 0, parent: curr});
      } else {
        curr.children.push({name: fileOrCMD, children: [], size: parseInt(cmdOrSize)});
      }
      break;
  }
});

const sizes = [];
const dfsSetSize = (node, depth = 0) => {
  if (node.children.length === 0) {
    return node.size;
  } else {
    const size = (node.size = node.children.reduce(
      (acc, child) => acc + dfsSetSize(child, depth + 1),
      0
    ));
    sizes.push(size);
    return size;
  }
};
dfsSetSize(root);

sizes.sort((a, b) => a - b);
let i = 0;
const spaceNeeded = root.size - 40000000;
while (i < sizes.length) {
  if (sizes[i] > spaceNeeded) {
    console.log(sizes[i]);
    break;
  }
  ++i;
}
