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

const sum = d
  .split('\n')
  .map(l => {
    const leftSet = new EnhancedSet(l.slice(0, l.length / 2));
    const rightSet = new EnhancedSet(l.slice(l.length / 2));
    return Array.from(leftSet.intersect(rightSet))
      .map(
        c =>
          1 + c.charCodeAt(0) - (c.toUpperCase() === c ? 'A'.charCodeAt(0) - 26 : 'a'.charCodeAt(0))
      )
      .reduce((a, c) => a + c, 0);
  })
  .reduce((a, c) => a + c, 0);

console.log(sum);
