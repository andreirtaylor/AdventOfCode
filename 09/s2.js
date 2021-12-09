// see https://www.npmjs.com/package/datastructures-js
const {
  Stack,

  Queue,

  EnhancedSet,

  LinkedList,
  LinkedListNode,
  DoublyLinkedList,
  DoublyLinkedListNode,

  MinHeap,
  MaxHeap,
  HeapNode, // interface

  PriorityQueueOptions, // interface
  PriorityQueueItem, // interface
  MinPriorityQueue,
  MaxPriorityQueue,

  BinarySearchTree,
  BinarySearchTreeNode,
  AvlTree,
  AvlTreeNode,

  Trie,
  TrieNode,

  Graph,
  DirectedGraph,
} = require('datastructures-js');

const fs = require('fs');
const { start } = require('repl');

const data = fs.readFileSync('./testInput.txt', {encoding:'utf8', flag:'r'});

//const dirs = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1]}
const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]

const arr = data.split("\n").filter((x)=> x).map(x => x.trim().split(""));

let risk = 0;

let starts = []

for(let i = 0; i < arr.length; ++i) {
  for(let j = 0; j < arr[0].length; ++j) {
    let isLow = true;
    // console.log(i, j)
    dirs.forEach((dir) => {
      const [x,y] = dir;
      // console.log("sexy", arr[i][j], x,y, arr[i+x] !== undefined && arr[i+x][j+y])
      if(arr[i+x] !== undefined && arr[i+x][j+y] !== undefined && arr[i+x][j+y] <= arr[i][j]) {
        isLow = false
        // console.log('fufufufufs')
      }

    })
    if(isLow) {
      risk += (arr[i][j]|0) + 1
      starts.push({i,j, b:starts.length});
    }
  }
}

//coords to basin
const visited = {}

while(starts.length) {
  const {i, j, b} = starts.pop();
  const key = `${i},${j}`;
  //console.log(key, b)
  if(visited[key] !== undefined || arr[i][j] == 9) continue;
  visited[key] = b;
  dirs.forEach((dir) => {
    const [x,y] = dir;
    if(arr[i+x] !== undefined && arr[i+x][j+y] !== undefined && arr[i+x][j+y] !== 9) {
      starts.push({i: i+x, j:j+y, b})
    }
  })
}

const counter= {}

Object.values(visited).forEach((v) => counter[v] = (counter[v] || 0) + 1)

console.log(Object.values(counter).sort((a,b) => b-a).slice(0,3).reduce((p,c) => p*c, 1))