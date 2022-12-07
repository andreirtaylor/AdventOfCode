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

const signal = d.split('');
const LENGTH = 14;
for (let i = LENGTH - 1; i < signal.length; i++) {
  const slice = signal.slice(i - LENGTH, i);
  if (new Set(slice).size === LENGTH) {
    console.log(i);
    break;
  }
}
