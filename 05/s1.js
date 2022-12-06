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

let [stacks, instructions] = d.split('\n\n');

const stks = {};
const len = stacks.split('\n').at(-1).trim().split(/\s+/).length;
for (let i = 0; i < len; ++i) stks[i + 1] = [];
stacks
  .split('\n')
  .reverse()
  .splice(1)
  .forEach(l => {
    for (let i = 0; i < len; i++) {
      if (l[1 + i * 4] != ' ') stks[i + 1].push(l[1 + i * 4]);
    }
  });
console.log(instructions);
instructions
  .trim()
  .split('\n')
  .forEach(l => {
    let [trash, amount, trash2, from, trash3, to] = l.split(' ');
    console.log(l.split(' '), amount, from, to);
    amount = amount | 0;
    while (amount--) {
      stks[to].push(stks[from].pop());
    }
  });

let ans = '';
for (let i = 0; i < len; ++i) ans += stks[i + 1].at(-1);
console.log(ans);
