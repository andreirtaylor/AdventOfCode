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
} = require("datastructures-js");

const fs = require("fs");

// const d = fs.readFileSync("./testInput.txt", {
//   encoding: "utf8",
//   flag: "r",
// });

const d = fs.readFileSync("./theRealInput.txt", {
  encoding: "utf8",
  flag: "r",
});


//.reduce((a,c)=>a|0+c|0,0)
//const lines = Math.max(...data.split("\n\n").map(l=>l.split("\n")));
m = Math.max(...d.split("\n\n").map(l=>l.split("\n").map(n=>n|0).reduce((a,c)=>a+c,0)));
console.log(m)
