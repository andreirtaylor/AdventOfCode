// see https://www.npmjs.com/package/datastructures-js
import {
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
} from 'datastructures-js';
const employeesQueue = new PriorityQueue({
  compare: (e1, e2) => {
    if (e1.salary > e2.salary) return -1; // do not swap
    if (e1.salary < e2.salary) return 1; // swap

    // salaries are the same, compare rank
    return e1.rank < e2.rank ? 1 : -1;
  },
});
const fs = require('fs');

const data = fs.readFileSync('./testInput.txt', {
  encoding: 'utf8',
  flag: 'r',
});
