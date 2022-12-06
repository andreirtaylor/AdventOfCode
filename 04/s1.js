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

const s = d
  .split('\n')
  .map(l => {
    const [start1, end1, start2, end2] = l.split(/,|\-/).map(n => n | 0);
    // if the two start at the same place then they overlap
    if (start1 == start2) {
      return 1;
    }
    // otherwise test which is further to the left
    // and then test if the end of the leftmost one
    // is greater or equal to the end of the rightmost one
    return (start1 < start2 ? end1 >= end2 : end2 >= end1) | 0;
  })
  .reduce((a, c) => a + c, 0);

console.log(s);
