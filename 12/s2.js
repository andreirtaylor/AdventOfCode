const fs = require('fs');
const {start} = require('repl');
const {pathToFileURL} = require('url');

const data = fs.readFileSync('./testInput.txt', {
  encoding: 'utf8',
  flag: 'r',
});
const graph = {};

// create a undirected graph from the input
data
  .trim()
  .split('\n')
  .forEach(line => {
    const [start, end] = line.split('-');
    graph[start] = graph[start] || [];
    graph[end] = graph[end] || [];
    graph[start].push(end);
    graph[end].push(start);
  });

let pathNum = 1;
const q = [{node: 'start', path: 1}];
const completed = new Set();
const paths = {};

// simulate a queue with a growing array and a index counter
let idx = 0;
// do a BFS
while (idx < q.length) {
  const {node, path, smallCaveVisited} = q[idx++];
  const currentPath = paths[path] || [];
  // keep track of a small Cave that was visited, if the last cave that was
  // visited is the small cave, assume that this was just set, and allow
  // the cave to be revisited.
  if (
    node === node.toLowerCase() &&
    currentPath.includes(node) &&
    (!smallCaveVisited || smallCaveVisited === currentPath[currentPath.length - 1])
  )
    continue;
  paths[path] = paths[path] || [];
  paths[path].push(node);
  if (node === 'end') {
    completed.add(path);
    continue;
  }

  graph[node].forEach((n, i) => {
    if (n === 'start') return;
    // If we have not visited a small cave twice yet, then
    // we should add this small cave that has already been visited
    // to the queue
    if (n === n.toLowerCase() && (paths[path] || []).includes(n)) {
      if (!smallCaveVisited) {
        ++pathNum;
        paths[pathNum] = [...(paths[path] || [])];
        q.push({node: n, path: pathNum, smallCaveVisited: n});
      }
      return;
    }
    if (i > 0) {
      ++pathNum;
      paths[pathNum] = [...(paths[path] || [])];
      q.push({node: n, path: pathNum, smallCaveVisited});
    } else {
      q.push({node: n, path, smallCaveVisited});
    }
  });
}

console.log(completed.size);
