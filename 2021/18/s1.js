const {strict: assert} = require('assert');
const exp = require('constants');
const {randomUUID} = require('crypto');

// node has a value if applicable, left and right;
// if a node has a value it cannot have a parent
// I dont think we need ids if we do inorder traversals
// but I might be wrong
// // {
// //   value, left, id;
// // }

const convertFromBinTree = node => {
  if (!node) return null;
  if (node.value !== null) return node.value;
  return [convertFromBinTree(node.left), convertFromBinTree(node.right)];
};

const convertToBinaryTree = (nums, leafs) => {
  const [l, r] = nums;

  let left = {
    left: null,
    right: null,
    value: l,
  };
  if (Array.isArray(l)) {
    left = convertToBinaryTree(l, leafs);
  } else {
    left.index = leafs.push(left) - 1;
  }

  let right = {
    left: null,
    right: null,
    value: r,
  };
  if (Array.isArray(r)) {
    right = convertToBinaryTree(r, leafs);
  } else {
    right.index = leafs.push(right) - 1;
  }
  return {left, right, value: null};
};

const explode = (node, leafs, depth) => {
  if (!node) return;
  //console.log(node, depth);
  if (explode(node.left, leafs, depth + 1)) return true;

  if (depth === 3 && !node.value) {
    let deleteNode = (node?.left?.left && node.left) || (node?.right?.left && node.right);
    if (deleteNode) {
      const leftDelete = deleteNode.left;
      const rightDelete = deleteNode.right;

      const leftNode = leafs[leftDelete.index - 1];
      //console.log(deleteNode, leafs);

      if (leftNode) leftNode.value += leftDelete.value;
      const rightNode = leafs[rightDelete.index + 1];

      if (rightNode) rightNode.value += rightDelete.value;

      deleteNode.value = 0;
      deleteNode.left = null;
      deleteNode.right = null;
      return true;
    }
  }
  if (explode(node.right, leafs, depth + 1)) return true;
};

const split = node => {
  if (!node) return;
  //console.log(node);
  if (split(node.left)) return true;

  if (node?.left?.value > 9) {
    const val = node.left.value;
    node.left.value = null;
    node.left.left = {
      left: null,
      right: null,
      value: Math.floor(val / 2),
    };
    node.left.right = {
      left: null,
      right: null,
      value: Math.ceil(val / 2),
    };
    return true;
  }

  if (node?.right?.value > 9) {
    const val = node.right.value;
    node.right.value = null;
    node.right.left = {
      left: null,
      right: null,
      value: Math.floor(val / 2),
    };
    node.right.right = {
      left: null,
      right: null,
      value: Math.ceil(val / 2),
    };
    return true;
  }
  if (split(node.right)) return true;
};

const reduction = nums => {
  let leafs = [];
  let binTree = convertToBinaryTree(nums, leafs);
  let flattened = nums.flat(3);

  let ret = nums;
  let needsExplosion = flattened.some(num => Array.isArray(num));
  let needsSplit = flattened.some(num => num > 9);
  while (needsExplosion || needsSplit) {
    if (needsExplosion) {
      explode(binTree, leafs, 0);

      //console.log('ret2!', JSON.stringify(ret, undefined, 2));

      //console.log('ret3!', JSON.stringify(ret, undefined, 2), needsExplosion);

      // console.log(JSON.stringify(ret, undefined, 2));
    } else {
      // we are splitting baby
      split(binTree);
    }
    ret = convertFromBinTree(binTree);
    leafs = [];
    binTree = convertToBinaryTree(ret, leafs);
    //console.log(JSON.stringify(ret));
    //console.log(JSON.stringify(leafs.map(l => ' ' + l.value)));
    needsExplosion = ret.flat(3).some(num => Array.isArray(num));
    needsSplit = ret.flat(3).some(num => num > 9);
  }
  //console.log('getting returned!', JSON.stringify(ret, undefined, 2));

  return ret;
};

const addAll = list => {
  return list.reduce((p, c) => {
    if (!p) return c;

    let ret = reduction([p, c]);
    console.log(JSON.stringify(ret));
    return ret;
  });
};

const magnitude = num => {
  return Number.isInteger(num) ? num : 3 * magnitude(num[0]) + 2 * magnitude(num[1]);
};

assert.deepEqual(reduction([[[[0, 9], 2], 3], 4]), [[[[0, 9], 2], 3], 4]);
assert.deepEqual(reduction([[[[[9, 8], 1], 2], 3], 4]), [[[[0, 9], 2], 3], 4]);
assert.deepEqual(reduction([7, [6, [5, [4, [3, 2]]]]]), [7, [6, [5, [7, 0]]]]);
assert.deepEqual(reduction([[6, [5, [4, [3, 2]]]], 1]), [[6, [5, [7, 0]]], 3]);
assert.deepEqual(reduction([[[15, 2], 3], 4]), [[[[7, 8], 2], 3], 4]);
assert.deepEqual(reduction([[6, [5, [4, [3, 2]]]], 1]), [[6, [5, [7, 0]]], 3]);
assert.deepEqual(
  reduction([
    [
      [[[4, 3], 4], 4],
      [7, [[8, 4], 9]],
    ],
    [1, 1],
  ]),
  [
    [
      [[0, 7], 4],
      [
        [7, 8],
        [6, 0],
      ],
    ],
    [8, 1],
  ]
);

assert.deepEqual(
  addAll([
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
  ]),
  [
    [
      [
        [1, 1],
        [2, 2],
      ],
      [3, 3],
    ],
    [4, 4],
  ]
);

assert.deepEqual(
  addAll([
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
    [6, 6],
  ]),
  [
    [
      [
        [5, 0],
        [7, 4],
      ],
      [5, 5],
    ],
    [6, 6],
  ]
);

assert.equal(
  magnitude(
    addAll([
      [
        [
          [0, [5, 8]],
          [
            [1, 7],
            [9, 6],
          ],
        ],
        [
          [4, [1, 2]],
          [[1, 4], 2],
        ],
      ],
      [
        [[5, [2, 8]], 4],
        [5, [[9, 9], 0]],
      ],
      [
        6,
        [
          [
            [6, 2],
            [5, 6],
          ],
          [
            [7, 6],
            [4, 7],
          ],
        ],
      ],
      [
        [
          [6, [0, 7]],
          [0, 9],
        ],
        [4, [9, [9, 0]]],
      ],
      [
        [
          [7, [6, 4]],
          [3, [1, 3]],
        ],
        [[[5, 5], 1], 9],
      ],
      [
        [
          6,
          [
            [7, 3],
            [3, 2],
          ],
        ],
        [
          [
            [3, 8],
            [5, 7],
          ],
          4,
        ],
      ],
      [
        [
          [
            [5, 4],
            [7, 7],
          ],
          8,
        ],
        [[8, 3], 8],
      ],
      [
        [9, 3],
        [
          [9, 9],
          [6, [4, 9]],
        ],
      ],
      [
        [2, [[7, 7], 7]],
        [
          [5, 8],
          [
            [9, 3],
            [0, 2],
          ],
        ],
      ],
      [
        [
          [[5, 2], 5],
          [8, [3, 7]],
        ],
        [
          [5, [7, 5]],
          [4, 4],
        ],
      ],
    ])
  ),
  4140
);

assert.deepEqual(
  reduction([
    [
      [
        [
          [7, 0],
          [7, 7],
        ],
        [
          [7, 7],
          [7, 8],
        ],
      ],
      [
        [
          [7, 7],
          [8, 8],
        ],
        [
          [7, 7],
          [8, 7],
        ],
      ],
    ],
    [
      7,
      [
        5,
        [
          [3, 8],
          [1, 4],
        ],
      ],
    ],
  ]),
  [
    [
      [
        [7, 7],
        [7, 8],
      ],
      [
        [9, 5],
        [8, 7],
      ],
    ],
    [
      [
        [6, 8],
        [0, 8],
      ],
      [
        [9, 9],
        [9, 0],
      ],
    ],
  ]
);

assert.deepEqual(
  addAll([
    [
      [
        [0, [4, 5]],
        [0, 0],
      ],
      [
        [
          [4, 5],
          [2, 6],
        ],
        [9, 5],
      ],
    ],
    [
      7,
      [
        [
          [3, 7],
          [4, 3],
        ],
        [
          [6, 3],
          [8, 8],
        ],
      ],
    ],
    [
      [
        2,
        [
          [0, 8],
          [3, 4],
        ],
      ],
      [
        [[6, 7], 1],
        [7, [1, 6]],
      ],
    ],
    [
      [
        [[2, 4], 7],
        [6, [0, 5]],
      ],
      [
        [
          [6, 8],
          [2, 8],
        ],
        [
          [2, 1],
          [4, 5],
        ],
      ],
    ],
    [
      7,
      [
        5,
        [
          [3, 8],
          [1, 4],
        ],
      ],
    ],
    [
      [2, [2, 2]],
      [8, [8, 1]],
    ],
    [2, 9],
    [
      1,
      [
        [[9, 3], 9],
        [
          [9, 0],
          [0, 7],
        ],
      ],
    ],
    [[[5, [7, 4]], 7], 1],
    [
      [[[4, 2], 2], 6],
      [8, 7],
    ],
  ]),
  [
    [
      [
        [8, 7],
        [7, 7],
      ],
      [
        [8, 6],
        [7, 7],
      ],
    ],
    [
      [
        [0, 7],
        [6, 6],
      ],
      [8, 7],
    ],
  ]
);

console.log(
  magnitude(
    addAll([
      [
        [
          [
            [3, 0],
            [0, 0],
          ],
          1,
        ],
        4,
      ],
      [
        [
          [[3, 4], 0],
          [7, 7],
        ],
        [1, 6],
      ],
      [
        [[[2, 0], 5], 7],
        [
          [
            [3, 1],
            [2, 6],
          ],
          [[0, 8], 6],
        ],
      ],
      [
        [[[5, 5], 0], 1],
        [
          [[0, 0], 1],
          [
            [0, 6],
            [0, 9],
          ],
        ],
      ],
      [
        [0, [0, [1, 7]]],
        [3, [1, [7, 6]]],
      ],
      [
        [
          [9, [5, 2]],
          [
            [5, 2],
            [6, 8],
          ],
        ],
        [
          [[7, 0], 7],
          [
            [2, 3],
            [9, 4],
          ],
        ],
      ],
      [
        [
          [[3, 8], 7],
          [
            [0, 7],
            [2, 0],
          ],
        ],
        [0, [[2, 9], 0]],
      ],
      [
        [
          [7, [2, 2]],
          [3, 4],
        ],
        [6, 7],
      ],
      [
        8,
        [
          [[3, 3], 8],
          [
            [7, 1],
            [6, 7],
          ],
        ],
      ],
      [
        [9, [9, 8]],
        [
          [1, [9, 1]],
          [2, 5],
        ],
      ],
      [
        [
          [7, 8],
          [
            [1, 2],
            [2, 6],
          ],
        ],
        [
          [9, 7],
          [6, [7, 0]],
        ],
      ],
      [
        [
          [3, 3],
          [[5, 6], 5],
        ],
        [[[2, 8], 1], 9],
      ],
      [
        [
          [2, [5, 0]],
          [
            [9, 9],
            [4, 0],
          ],
        ],
        [0, 5],
      ],
      [
        [
          [9, 3],
          [
            [9, 4],
            [5, 8],
          ],
        ],
        [
          [
            [3, 2],
            [7, 1],
          ],
          [[3, 8], 1],
        ],
      ],
      [
        [3, 2],
        [
          [6, [0, 9]],
          [8, 3],
        ],
      ],
      [
        [
          [5, 7],
          [
            [7, 4],
            [4, 6],
          ],
        ],
        [[[9, 8], 3], 3],
      ],
      [
        [[4, [2, 8]], 9],
        [
          [
            [8, 5],
            [9, 7],
          ],
          [
            [8, 9],
            [2, 6],
          ],
        ],
      ],
      [
        [[1, [2, 4]], 6],
        [
          [8, [5, 2]],
          [
            [0, 7],
            [4, 1],
          ],
        ],
      ],
      [
        [
          [[4, 3], 6],
          [
            [6, 4],
            [4, 2],
          ],
        ],
        [
          [9, 0],
          [[5, 9], 9],
        ],
      ],
      [
        [
          [[3, 0], 6],
          [4, [7, 5]],
        ],
        4,
      ],
      [
        [
          [
            [1, 0],
            [7, 1],
          ],
          0,
        ],
        [[[8, 5], 8], 2],
      ],
      [
        [
          [
            [2, 9],
            [4, 1],
          ],
          [
            [8, 9],
            [3, 3],
          ],
        ],
        [9, [[0, 7], 2]],
      ],
      [
        [1, [4, [4, 2]]],
        [
          [
            [3, 5],
            [8, 8],
          ],
          2,
        ],
      ],
      [
        [
          [8, [1, 4]],
          [[6, 5], 5],
        ],
        [[7, [4, 7]], 4],
      ],
      [
        [
          [[0, 5], 2],
          [[9, 2], 0],
        ],
        0,
      ],
      [
        [
          [
            [6, 2],
            [2, 4],
          ],
          [0, [7, 3]],
        ],
        [9, [8, [5, 9]]],
      ],
      [[8, 0], 2],
      [
        [
          [[0, 2], 2],
          [
            [9, 2],
            [8, 1],
          ],
        ],
        [
          [
            [7, 6],
            [5, 3],
          ],
          6,
        ],
      ],
      [
        [
          [
            [8, 7],
            [5, 3],
          ],
          [[3, 0], 8],
        ],
        [
          [
            [8, 4],
            [2, 2],
          ],
          [[8, 1], 2],
        ],
      ],
      [
        [
          [
            [1, 5],
            [4, 6],
          ],
          [
            [4, 0],
            [2, 4],
          ],
        ],
        [
          [1, 1],
          [
            [0, 7],
            [7, 3],
          ],
        ],
      ],
      [
        [7, 2],
        [
          [7, [6, 7]],
          [8, 5],
        ],
      ],
      [
        [
          [9, 7],
          [[6, 6], 9],
        ],
        8,
      ],
      [
        [4, 2],
        [
          [
            [1, 0],
            [9, 1],
          ],
          [
            [0, 7],
            [8, 0],
          ],
        ],
      ],
      [
        [
          [[5, 9], 5],
          [8, 9],
        ],
        [
          [2, 4],
          [
            [5, 2],
            [8, 3],
          ],
        ],
      ],
      [
        [
          [
            [4, 5],
            [7, 0],
          ],
          [4, 5],
        ],
        [
          [7, [6, 4]],
          [
            [1, 7],
            [6, 3],
          ],
        ],
      ],
      [[2, 0], 4],
      [
        [
          2,
          [
            [5, 1],
            [2, 1],
          ],
        ],
        [
          [5, [7, 2]],
          [
            [2, 3],
            [7, 0],
          ],
        ],
      ],
      [
        [4, [4, 9]],
        [9, [6, 8]],
      ],
      [
        [
          [
            [6, 1],
            [1, 5],
          ],
          [0, [4, 0]],
        ],
        [[[7, 0], 2], 4],
      ],
      [
        [
          [
            [3, 3],
            [2, 2],
          ],
          [[2, 4], 2],
        ],
        [[8, [1, 1]], 4],
      ],
      [
        [
          [[1, 5], 8],
          [
            [9, 4],
            [7, 7],
          ],
        ],
        [
          [
            [8, 7],
            [7, 2],
          ],
          [0, [7, 3]],
        ],
      ],
      [9, [[7, [0, 4]], 4]],
      [4, [0, 8]],
      [
        [
          [[2, 6], 1],
          [8, [8, 4]],
        ],
        [
          [8, 2],
          [1, [8, 4]],
        ],
      ],
      [
        [7, [8, [8, 8]]],
        [4, 1],
      ],
      [
        [0, 6],
        [
          [7, [5, 9]],
          [[7, 1], 8],
        ],
      ],
      [4, 6],
      [
        [
          [
            [3, 2],
            [5, 6],
          ],
          [0, 7],
        ],
        [8, [7, [9, 5]]],
      ],
      [
        [
          [3, 7],
          [4, 5],
        ],
        6,
      ],
      [
        [
          [0, [3, 9]],
          [9, 1],
        ],
        6,
      ],
      [
        [
          [[7, 3], 8],
          [6, 7],
        ],
        [
          [1, 0],
          [1, 7],
        ],
      ],
      [
        [[5, [4, 8]], 2],
        [
          [[7, 1], 6],
          [[0, 3], 2],
        ],
      ],
      [
        [1, 0],
        [
          [1, 2],
          [[2, 0], 1],
        ],
      ],
      [
        [
          8,
          [
            [6, 1],
            [7, 1],
          ],
        ],
        0,
      ],
      [
        [9, [2, 0]],
        [[7, [6, 2]], 4],
      ],
      [
        [
          [9, [9, 4]],
          [[4, 8], 3],
        ],
        [
          [9, 0],
          [
            [2, 2],
            [0, 6],
          ],
        ],
      ],
      [
        [
          [7, 5],
          [[2, 9], 6],
        ],
        [
          [2, 4],
          [
            [1, 1],
            [8, 2],
          ],
        ],
      ],
      [
        [
          [1, [6, 3]],
          [
            [2, 2],
            [1, 8],
          ],
        ],
        [
          [
            [7, 3],
            [6, 0],
          ],
          [4, [7, 6]],
        ],
      ],
      [6, 5],
      [
        [3, [9, [4, 4]]],
        [
          [6, 9],
          [4, 5],
        ],
      ],
      [
        [
          [4, [1, 8]],
          [[4, 0], 6],
        ],
        [
          [
            [9, 0],
            [8, 3],
          ],
          [
            [8, 6],
            [3, 2],
          ],
        ],
      ],
      [
        [
          [8, [1, 2]],
          [[3, 9], 6],
        ],
        [[3, 0], 1],
      ],
      [[1, [2, [4, 0]]], 6],
      [
        0,
        [
          [
            [1, 3],
            [9, 1],
          ],
          [
            [3, 8],
            [9, 4],
          ],
        ],
      ],
      [
        2,
        [
          2,
          [
            [2, 7],
            [7, 8],
          ],
        ],
      ],
      [
        [
          [3, 0],
          [[4, 6], 2],
        ],
        [9, 2],
      ],
      [
        [
          [5, [2, 2]],
          [
            [2, 7],
            [9, 9],
          ],
        ],
        [
          [3, [4, 4]],
          [8, [9, 8]],
        ],
      ],
      [
        [
          [
            [7, 5],
            [7, 9],
          ],
          [[8, 5], 6],
        ],
        [
          [1, [8, 4]],
          [8, 2],
        ],
      ],
      [
        [
          [6, 4],
          [5, 5],
        ],
        [
          [[8, 1], 5],
          [
            [6, 4],
            [6, 9],
          ],
        ],
      ],
      [
        [
          [[8, 9], 0],
          [[4, 6], 7],
        ],
        [
          [
            [3, 9],
            [6, 4],
          ],
          [8, [7, 4]],
        ],
      ],
      [4, [[7, 7], 4]],
      [
        [
          [
            [4, 9],
            [1, 2],
          ],
          [8, [4, 7]],
        ],
        [
          [8, [4, 8]],
          [0, [5, 4]],
        ],
      ],
      [1, [7, 9]],
      [
        [
          [5, [2, 0]],
          [
            [4, 3],
            [6, 8],
          ],
        ],
        [9, 9],
      ],
      [
        [
          [[3, 9], 9],
          [4, 3],
        ],
        [1, [3, [8, 1]]],
      ],
      [
        [
          [
            [8, 7],
            [6, 1],
          ],
          [3, 9],
        ],
        [5, [[8, 0], 4]],
      ],
      [
        [
          [
            [8, 2],
            [4, 6],
          ],
          [6, [9, 9]],
        ],
        [1, [[7, 7], 4]],
      ],
      [
        [7, 5],
        [
          [5, 0],
          [0, 3],
        ],
      ],
      [
        [
          [6, 0],
          [9, 1],
        ],
        [
          [
            [4, 3],
            [5, 0],
          ],
          [
            [9, 5],
            [0, 0],
          ],
        ],
      ],
      [8, [[3, 6], 3]],
      [
        [
          [[9, 3], 7],
          [1, 3],
        ],
        [
          [
            [6, 4],
            [8, 4],
          ],
          [1, 5],
        ],
      ],
      [
        [
          [[3, 8], 2],
          [5, 4],
        ],
        [
          [[1, 8], 5],
          [2, [2, 7]],
        ],
      ],
      [
        [2, 9],
        [6, [0, 2]],
      ],
      [
        [2, [7, 9]],
        [
          [4, 1],
          [
            [9, 2],
            [0, 7],
          ],
        ],
      ],
      [
        [0, [6, 4]],
        [
          [9, 2],
          [0, [0, 7]],
        ],
      ],
      [
        [
          [
            [7, 2],
            [8, 6],
          ],
          [6, 2],
        ],
        [
          [
            [1, 6],
            [2, 2],
          ],
          1,
        ],
      ],
      [
        [1, 6],
        [
          [
            [4, 3],
            [8, 2],
          ],
          [3, [9, 4]],
        ],
      ],
      [
        [9, [7, 3]],
        [
          [[7, 0], 4],
          [
            [1, 7],
            [2, 2],
          ],
        ],
      ],
      [
        [7, [5, [9, 8]]],
        [
          [
            [7, 5],
            [7, 6],
          ],
          [7, [9, 8]],
        ],
      ],
      [
        [
          [
            [6, 1],
            [4, 3],
          ],
          4,
        ],
        [[[5, 9], 4], 2],
      ],
      [
        [
          [
            [5, 1],
            [2, 5],
          ],
          0,
        ],
        [
          [7, [5, 7]],
          [[4, 4], 9],
        ],
      ],
      [9, 2],
      [4, [[[6, 6], 5], 7]],
      [
        [
          8,
          [
            [7, 3],
            [0, 7],
          ],
        ],
        8,
      ],
      [
        [
          [3, 4],
          [[2, 3], 0],
        ],
        [
          [
            [9, 6],
            [1, 1],
          ],
          [4, [0, 4]],
        ],
      ],
      [
        [
          [
            [3, 3],
            [2, 3],
          ],
          [2, 5],
        ],
        [[4, [2, 7]], 3],
      ],
      [
        [[8, [0, 3]], 2],
        [4, 4],
      ],
      [
        [
          [3, 5],
          [
            [2, 1],
            [3, 4],
          ],
        ],
        [[0, 3], 4],
      ],
      [
        [[[4, 1], 4], 2],
        [
          [[3, 7], 2],
          [[8, 1], 3],
        ],
      ],
      [
        [
          [
            [0, 6],
            [7, 3],
          ],
          [5, [3, 9]],
        ],
        [7, [[4, 1], 8]],
      ],
    ])
  )
);