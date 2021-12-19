const {strict: assert} = require('assert');
const {randomUUID} = require('crypto');

const findById = (nums, id) => {
  //console.log(nums, id);

  if (nums[0] === id) {
    return nums;
  }
  if (typeof nums[0] === 'string') {
    return null;
  }
  //console.log(id);
  return nums.map(num => findById(num, id)).filter(x => x)[0];
};

let depth = 300;

const explode = nums => {
  const allFlat = nums.flat(5);
  console.log(JSON.stringify(removeIds(nums)));
  if (!depth--) process.exit();
  const prettyFlat = nums.flat(4);

  const [left, right] = prettyFlat.filter(x => Array.isArray(x));
  const {parent} = left.parent;
  //console.log(parent);

  //console.log(typeof parent[0][0]);
  // removing the left number
  if (typeof parent[0][0] !== 'string') {
    const [leftId, leftValue] = left;
    parent[0] = [randomUUID(), 0];
    parent[0].parent = parent;
    if (Number.isInteger(parent[1][1])) {
      parent[1][1] = parent[1][1] + right[1];
      //console.log(leftId, leftValue);
    } else {
      // this is a pair of pairs! damn

      parent[1][0][1] = parent[1][0][1] + right[1];
    }

    const idToLeft = allFlat[allFlat.indexOf(leftId) - 2];

    if (idToLeft) {
      const toLeft = findById(nums, idToLeft);
      toLeft[1] += leftValue;
    }
  } else {
    // removing the right number
    //sconsole.log(left.parent);
    const [rightId, rightValue] = right;
    //console.log(valueToRight);
    parent[1] = [randomUUID(), 0];
    parent[1].parent = parent;
    const idToRight = allFlat[allFlat.indexOf(rightId) + 2];
    //console.log('after', parent[0]);
    parent[0][1] = parent[0][1] + left[1];
    if (idToRight) {
      const toRight = findById(nums, idToRight);
      toRight[1] += rightValue;
    }
  }
  return nums;
};

const split = (nums, id) => {
  const toRemove = findById(nums, id);
  //console.log(toRemove);
  const parent = toRemove.parent;
  const value = toRemove[1];
  if (parent[0][0] === id) {
    parent[0] = [
      [randomUUID(), Math.floor(value / 2)],
      [randomUUID(), Math.ceil(value / 2)],
    ];
    parent[0].parent = parent;
    parent[0][0].parent = parent[0];
    parent[0][1].parent = parent[0];
  } else {
    parent[1] = [
      [randomUUID(), Math.floor(value / 2)],
      [randomUUID(), Math.ceil(value / 2)],
    ];
    parent[1].parent = parent;
    parent[1][0].parent = parent[0];
    parent[1][1].parent = parent[0];
  }
  return nums;
};

const addIds = nums => {
  const parent = nums.map(num => {
    return Array.isArray(num) ? addIds(num) : [randomUUID(), num];
  });
  parent.forEach(num => (num.parent = parent));
  return parent;
};

const removeIds = nums => {
  //console.log(nums);

  const [id, value, ___] = nums;
  if (id === null) return removeIds(value);
  if (Number.isInteger(value)) return value;
  return nums.map(num => {
    const [id, val] = num;
    return typeof id === 'string' ? val : removeIds(num);
  });
};

const reduce = idNums => {
  let flattened = idNums.flat(4);
  // nested inside of four pairs
  while (flattened.some(num => Array.isArray(num)) || flattened.some(num => num > 9)) {
    if (flattened.some(num => Array.isArray(num))) {
      idNums = explode(idNums);
      flattened = idNums.flat(4);
      continue;
    }
    if (flattened.some(num => num > 9)) {
      let index = 0;
      for (let i = 0; i < flattened.length; ++i) {
        if (flattened[i] > 9) {
          index = i;
          break;
        }
      }

      idNums = split(idNums, flattened[index - 1]);
      flattened = idNums.flat(4);
    }
  }

  return idNums;
};

const reduction = nums => {
  const reduced = reduce(addIds(nums));
  // hack to avoid having logic for the top level array
  return removeIds([null, reduced]);
};

const addAll = listOfNums => {
  let curr = listOfNums[0];
  console.log(listOfNums.length);
  for (let i = 1; i < listOfNums.length; ++i) {
    console.log(listOfNums.length);

    curr = reduction([curr, listOfNums[i]]);
    console.log(JSON.stringify(curr));
    console.log(listOfNums.length);
  }
  return curr;
  // return listOfNums.reduce((p, c) => {
  //   console.log(c);
  //   if (p === null) return c;
  //   let ret = reduction([p, c]);
  //   console.log(JSON.stringify(listOfNums, undefined, 2));
  //   console.log(JSON.stringify(ret));
  //   return ret;
  // }, null);
};

// assert.deepEqual(reduction([[[[0, 9], 2], 3], 4]), [[[[0, 9], 2], 3], 4]);
// assert.deepEqual(reduction([[[[[9, 8], 1], 2], 3], 4]), [[[[0, 9], 2], 3], 4]);
// assert.deepEqual(reduction([7, [6, [5, [4, [3, 2]]]]]), [7, [6, [5, [7, 0]]]]);
// assert.deepEqual(reduction([[6, [5, [4, [3, 2]]]], 1]), [[6, [5, [7, 0]]], 3]);
// // will have to delete this test
// assert.deepEqual(reduction([[[15, 2], 3], 4]), [[[[7, 8], 2], 3], 4]);
// assert.deepEqual(reduction([[6, [5, [4, [3, 2]]]], 1]), [[6, [5, [7, 0]]], 3]);
// assert.deepEqual(
//   reduction([
//     [
//       [[[4, 3], 4], 4],
//       [7, [[8, 4], 9]],
//     ],
//     [1, 1],
//   ]),
//   [
//     [
//       [[0, 7], 4],
//       [
//         [7, 8],
//         [6, 0],
//       ],
//     ],
//     [8, 1],
//   ]
// );

// assert.deepEqual(
//   addAll([
//     [1, 1],
//     [2, 2],
//     [3, 3],
//     [4, 4],
//   ]),
//   [
//     [
//       [
//         [1, 1],
//         [2, 2],
//       ],
//       [3, 3],
//     ],
//     [4, 4],
//   ]
// );

// assert.deepEqual(
//   reduction([
//     [
//       [
//         [
//           [1, 1],
//           [2, 2],
//         ],
//         [3, 3],
//       ],
//       [4, 4],
//     ],
//     [5, 5],
//   ]),
//   [
//     [
//       [
//         [0, [3, 2]],
//         [3, 3],
//       ],
//       [4, 4],
//     ],
//     [5, 5],
//   ]
// );

console.log(
  JSON.stringify(
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
    ])
  )
);

// assert.deepEqual(
//   addAll([
//     [
//       [
//         [0, [4, 5]],
//         [0, 0],
//       ],
//       [
//         [
//           [4, 5],
//           [2, 6],
//         ],
//         [9, 5],
//       ],
//     ],
//     [
//       7,
//       [
//         [
//           [3, 7],
//           [4, 3],
//         ],
//         [
//           [6, 3],
//           [8, 8],
//         ],
//       ],
//     ],
//     [
//       [
//         2,
//         [
//           [0, 8],
//           [3, 4],
//         ],
//       ],
//       [
//         [[6, 7], 1],
//         [7, [1, 6]],
//       ],
//     ],
//     [
//       [
//         [[2, 4], 7],
//         [6, [0, 5]],
//       ],
//       [
//         [
//           [6, 8],
//           [2, 8],
//         ],
//         [
//           [2, 1],
//           [4, 5],
//         ],
//       ],
//     ],
//     [
//       7,
//       [
//         5,
//         [
//           [3, 8],
//           [1, 4],
//         ],
//       ],
//     ],
//     [
//       [2, [2, 2]],
//       [8, [8, 1]],
//     ],
//     [2, 9],
//     [
//       1,
//       [
//         [[9, 3], 9],
//         [
//           [9, 0],
//           [0, 7],
//         ],
//       ],
//     ],
//     [[[5, [7, 4]], 7], 1],
//     [
//       [[[4, 2], 2], 6],
//       [8, 7],
//     ],
//   ]),
//   [
//     [
//       [
//         [8, 7],
//         [7, 7],
//       ],
//       [
//         [8, 6],
//         [7, 7],
//       ],
//     ],
//     [
//       [
//         [0, 7],
//         [6, 6],
//       ],
//       [8, 7],
//     ],
//   ]
// );

// /// turn the array into a more manageable type
// // {
// //   value, parent, id;
// // }
