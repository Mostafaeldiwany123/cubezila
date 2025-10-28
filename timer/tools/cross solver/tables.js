// tables.js
(function(global) {
    // ================================================================
    // Internal Data Structures and Helper Functions
    // ================================================================
    const Tables = {
      // Basic tables (for corners)
      cornerMoves: {},
      permMultiplier: {},
      flipMultiplier: {},
      permPruning: null,
      flipPruning: null,
      // Extended tables (for edge/corner interactions)
      edgeMoves: {},
      cornerEdgeMoves: {},
      edgeCornerPruning: {},
      extendedPruning1: {},
      extendedPruning2: {}
    };
  
    // Update functions
    function updatePermutationState(state, move) {
      const index = (state / 24) | 0;
      const rem = state % 24;
      const tableVal = Tables.cornerMoves[move][index];
      const factor = (tableVal / 384) | 0;
      return 24 * factor + Tables.permMultiplier[rem][((tableVal >> 4) % 24)];
    }
  
    function updateFlipState(state, move) {
      const index = state >> 4;
      const tableVal = Tables.cornerMoves[move][index];
      const lookup = ((tableVal >> 4) % 24);
      const factor = (tableVal / 384) | 0;
      return (factor << 4) | (Tables.flipMultiplier[state & 15][lookup] ^ (tableVal & 15));
    }
  
    function intToBitArray(num) {
      let bits = [];
      for (let i = 0; i < 4; i++) {
        bits.unshift(num & 1);
        num = num >> 1;
      }
      return bits;
    }
  
    function bitArrayToInt(arr) {
      return arr.reduce((acc, bit) => (acc << 1) | bit, 0);
    }
  
    function updateFullState(idx, move) {
      const index = (idx / 384) | 0;
      const slice = Tables.cornerMoves[move][index];
      const flipPart = Tables.flipMultiplier[idx & 15][(slice >> 4) % 24] ^ (slice & 15);
      const permPart = Tables.permMultiplier[(idx >> 4) % 24][(slice >> 4) % 24];
      return ((slice / 384) | 0) * 384 + 16 * permPart + flipPart;
    }
  
    // ================================================================
    // Table Initialization Functions
    // ================================================================
    function initBasicTables() {
      Tables.permMultiplier = {};
      Tables.flipMultiplier = {};
      for (let i = 0; i < 24; i++) {
        Tables.permMultiplier[i] = new Array(24);
      }
      for (let i = 0; i < 16; i++) {
        Tables.flipMultiplier[i] = new Array(24);
      }
      const temp1 = [], temp2 = [], temp3 = [];
      for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 24; j++) {
          searcher.setPermutation(temp1, i, 4);
          searcher.setPermutation(temp2, j, 4);
          for (let k = 0; k < 4; k++) {
            temp3[k] = temp1[temp2[k]];
          }
          Tables.permMultiplier[i][j] = searcher.getPermutation(temp3, 4);
          if (i < 16) {
            const bits = intToBitArray(i);
            for (let k = 0; k < 4; k++) {
              temp3[k] = bits[temp2[k]];
            }
            Tables.flipMultiplier[i][j] = bitArrayToInt(temp3);
          }
        }
      }
      // Generate corner move table using generateMoveTable
      Tables.cornerMoves = [];
      searcher.generateMoveTable(Tables.cornerMoves, 495, getMoveValue);
      Tables.permPruning = [];
      Tables.flipPruning = [];
      searcher.generatePruningTable(Tables.permPruning, 0, 11880, 5, updatePermutationState);
      searcher.generatePruningTable(Tables.flipPruning, 0, 7920, 6, updateFlipState);
  
      function getMoveValue(comb, move) {
        function buildArray(i, r, arr) {
          if (i === 12) return arr;
          if (comb >= searcher.binomialCoefficients[11 - i][r]) {
            comb -= searcher.binomialCoefficients[11 - i][r];
            r--;
            arr[i] = r << 1;
          } else {
            arr[i] = -1;
          }
          return buildArray(i + 1, r, arr);
        }
        const arr = buildArray(0, 4, new Array(12).fill(0));
        searcher.moveEdgePieces(arr, move);
        let newComb = 0, r = 4, t = 0;
        const permArr = [];
        for (let i = 0; i < 12; i++) {
          if (arr[i] >= 0) {
            newComb += searcher.binomialCoefficients[11 - i][r];
            r--;
            permArr[r] = arr[i] >> 1;
            t |= (arr[i] & 1) << (3 - r);
          }
        }
        return ((newComb * 24 + searcher.getPermutation(permArr, 4)) << 4) | t;
      }
    }
  
    function initExtendedTables() {
      initBasicTables();
      Tables.cornerEdgeMoves = {};
      Tables.edgeMoves = {};
      for (let i = 0; i < 24; i++) {
        Tables.cornerEdgeMoves[i] = new Array(6);
        Tables.edgeMoves[i] = new Array(6);
        for (let m = 0; m < 6; m++) {
          Tables.cornerEdgeMoves[i][m] = computeCornerEdgeMove(i, m);
          const edgeArr = new Array(12).fill(-1);
          edgeArr[Math.floor(i / 2)] = i & 1;
          searcher.moveEdgePieces(edgeArr, m);
          for (let e = 0; e < 12; e++) {
            if (edgeArr[e] >= 0) {
              Tables.edgeMoves[i][m] = (e << 1) | edgeArr[e];
              break;
            }
          }
        }
      }
      Tables.edgeCornerPruning = {};
      for (let obj = 0; obj < 4; obj++) {
        Tables.edgeCornerPruning[obj] = (function(obj) {
          const prun = [];
          searcher.generatePruningTable(
            prun,
            (obj + 4) * 3 * 24 + (obj + 4) * 2,
            576,
            5,
            (q, move) => {
              const indexPart = Math.floor(q / 24);
              const edgeIndex = q % 24;
              return Tables.cornerEdgeMoves[indexPart][move] * 24 + Tables.edgeMoves[edgeIndex][move];
            }
          );
          return prun;
        })(obj);
      }
  
      function computeCornerEdgeMove(corner, move) {
        const idx = Math.floor(corner / 3);
        let twist = corner % 3;
        const idxMap = [
          [3, 1, 2, 7, 0, 5, 6, 4],
          [0, 1, 6, 2, 4, 5, 7, 3],
          [1, 2, 3, 0, 4, 5, 6, 7],
          [0, 5, 1, 3, 4, 6, 2, 7],
          [4, 0, 2, 3, 5, 1, 6, 7],
          [0, 1, 2, 3, 7, 4, 5, 6]
        ];
        const twistMap = [
          [2, 0, 0, 1, 1, 0, 0, 2],
          [0, 0, 1, 2, 0, 0, 2, 1],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 2, 0, 0, 2, 1, 0],
          [1, 2, 0, 0, 2, 1, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        twist = (twist + twistMap[move][idx]) % 3;
        return idxMap[move][idx] * 3 + twist;
      }
    }
  
    function initExtendedPrunings() {
      initExtendedTables();
      Tables.extendedPruning1 = {};
      Tables.extendedPruning2 = {};
      let obj1 = 4, obj2 = 5;
      searcher.generatePruningTable(
        Tables.extendedPruning1,
        obj1 * 3 * 24 + obj1 * 2 + 576 * (obj2 * 3 * 24 + obj2 * 2),
        576 * 576,
        7,
        (q, move) => {
          const ec1 = q % 576;
          const ec2 = Math.floor(q / 576);
          return Tables.cornerEdgeMoves[Math.floor(ec1 / 24)][move] * 24 +
                 Tables.edgeMoves[ec1 % 24][move] +
                 576 * (Tables.cornerEdgeMoves[Math.floor(ec2 / 24)][move] * 24 +
                        Tables.edgeMoves[ec2 % 24][move]);
        }
      );
      obj2 = 6;
      searcher.generatePruningTable(
        Tables.extendedPruning2,
        obj1 * 3 * 24 + obj1 * 2 + 576 * (obj2 * 3 * 24 + obj2 * 2),
        576 * 576,
        7,
        (q, move) => {
          const ec1 = q % 576;
          const ec2 = Math.floor(q / 576);
          return Tables.cornerEdgeMoves[Math.floor(ec1 / 24)][move] * 24 +
                 Tables.edgeMoves[ec1 % 24][move] +
                 576 * (Tables.cornerEdgeMoves[Math.floor(ec2 / 24)][move] * 24 +
                        Tables.edgeMoves[ec2 % 24][move]);
        }
      );
    }
  
    // Expose the tables and related functions
    global.crossTables = {
      Tables,
      updatePermutationState,
      updateFlipState,
      intToBitArray,
      bitArrayToInt,
      updateFullState,
      initBasicTables,
      initExtendedTables,
      initExtendedPrunings
    };
  
  })(window);
  