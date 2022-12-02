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
const theirs = ["A", "B", "C"]
const symbols = ["X", "Y", "Z"]
s = d.split("\n").map(l=>{
  const [them,me]=l.split(" ")
  const myIndex =symbols.indexOf(me)
  const theirIndex = theirs.indexOf(them)
  let ans = 0
  if(myIndex===0){
    ans =  1+ (theirIndex===0?3:theirIndex===1?0:6)
  } else if(myIndex===1){
    ans = 2 + (theirIndex===1?3:theirIndex===2?0:6)
  } else {
    ans= 3 + (theirIndex===2?3:theirIndex===0?0:6)
  }
  return ans
}).reduce((a,c)=>a+c,0)


console.log(s)


// A X = 4 1 3
// A Y = 4 2 6
// A Z = 4 3 0
// B X = 5 1 0
// B Y = 5 2 3
// B Z = 5 3 6
// C X = 6 1 6
// C Y = 6 2 0
// C Z = 6 3 3