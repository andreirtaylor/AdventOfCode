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

// const d = fs.readFileSync("./sampleInput.txt", {
//   encoding: "utf8",
//   flag: "r",
// });

const d = fs.readFileSync("./theRealInput.txt", {
  encoding: "utf8",
  flag: "r",
});

// Loss = 0
// Draw = 3
// Win = 6

// A: Rock 
// B: Paper
// C: Scissors
// X: Rock
// Y: Paper
// Z: Scissors
const theirs = [null, "A", "B", "C"]
const symbols = [null, "X", "Y", "Z"]
s = d.split("\n").map(l=>{
  const [them,me]=l.split(" ")
  const myIndex =symbols.indexOf(me)
  const theirIndex = theirs.indexOf(them)
  let ans = 0
  if(myIndex===1){
    ans = (theirIndex===1?3:theirIndex===2?1:2)
  } else if(myIndex===2){
    ans = 3 + theirIndex
  } else {
    ans= 6 + (theirIndex===1?2:theirIndex===2?3:1)
  }

  return ans
}).reduce((a,c)=>a+c,0)

console.log(s)


// 1 1 3
// 1 2 4
// 1 3 8
// 2 1 1
// 2 2 5
// 2 3 9
// 3 1 3
// 3 2 6
// 3 3 7