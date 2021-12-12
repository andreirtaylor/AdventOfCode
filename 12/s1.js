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
  const {node, path} = q[idx++];
  // ignore any nodes that are lower case and are already in your path
  if (node === node.toLowerCase() && (paths[path] || []).includes(node)) continue;
  paths[path] = paths[path] || [];
  paths[path].push(node);
  if (node === 'end') {
    completed.add(path);
    continue;
  }

  graph[node].forEach((n, i) => {
    if (n === 'start' || (n === n.toLowerCase() && (paths[path] || []).includes(n))) return;
    // if there are more than one paths leading out of a node
    // then start a new path for this node, and copy the
    // existing path over to this new path
    if (i > 0) {
      ++pathNum;
      paths[pathNum] = [...(paths[path] || [])];
      q.push({node: n, path: pathNum});
    } else {
      q.push({node: n, path});
    }
  });
}

console.log(completed.size);
