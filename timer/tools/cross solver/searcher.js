const searcher = (() => {

  // ================================================================
  // Combinatorics Setup
  // ================================================================
  // Here we compute binomial coefficients for n up to 31 and the factorials for numbers 0..31.
  // We use a dynamic programming approach but structure the code very differently from the original.
  
  // Initialize empty arrays for binomials and factorials.
  const binomialCoefficients = []; // Will be a 2D array [n][k]
  const factorials = [1];          // factorials[0] = 1

  // Use a loop for n = 0 to 31 (i.e. 32 rows)
  for (let n = 0; n < 32; n++) {
    // Create a new row for n
    let row = new Array(32).fill(0);
    // Set boundary values: n choose 0 and n choose n are both 1.
    row[0] = 1;
    row[n] = 1;
    // Compute inner binomials using the recursive formula:
    // C(n, k) = C(n-1, k-1) + C(n-1, k)
    for (let k = 1; k < n; k++) {
      row[k] = binomialCoefficients[n - 1][k - 1] + binomialCoefficients[n - 1][k];
    }
    binomialCoefficients[n] = row;
    // Compute factorial for (n+1) using the previous factorial, for n < 31.
    if (n < 31) {
      factorials[n + 1] = factorials[n] * (n + 1);
    }
  }

  // ================================================================
  // Pruning and Permutation Helper Functions
  // ================================================================

  // getPruningValue:
  // Returns a 4-bit (nibble) value stored in the pruning table 'table' at a given index.
  // The table is a byte array where each byte contains two 4-bit values.
  function getPruningValue(table, index) {
    // Compute which byte holds the nibble and how much to shift.
    const byteIndex = index >>> 3;       // equivalent to Math.floor(index/8)
    const shiftAmount = (index & 7) * 4;   // each nibble is 4 bits
    return (table[byteIndex] >>> shiftAmount) & 0xF;
  }

  // setPermutation:
  // Given an index 'idx' and a size 'n', fill the array 'arr' with a permutation
  // of numbers [0..n-1]. If 'even' is negative, adjust parity by swapping the last two elements.
  function setPermutation(arr, idx, n, even) {
    const available = [];
    for (let i = 0; i < n; i++) {
      available.push(i);
    }
    let parity = 0;
    // Loop through the first n-1 positions, selecting an element based on idx/factorial.
    for (let i = 0; i < n - 1; i++) {
      const factor = factorials[n - 1 - i];
      const pos = Math.floor(idx / factor);
      idx %= factor;
      parity ^= pos;
      // Remove the element at 'pos' from available and assign it to arr[i].
      arr[i] = available.splice(pos, 1)[0];
    }
    // The last element is the remaining one.
    arr[n - 1] = available[0];
    // If 'even' is negative and the parity is odd, swap the last two elements.
    if (even < 0 && (parity & 1) !== 0) {
      const temp = arr[n - 1];
      arr[n - 1] = arr[n - 2];
      arr[n - 2] = temp;
    }
    return arr;
  }

  // getPermutation:
  // Converts a permutation array 'arr' (of length n) back into its index.
  // If 'even' is negative, return the index halved.
  function getPermutation(arr, n, even) {
    const available = [];
    for (let i = 0; i < n; i++) {
      available.push(i);
    }
    let idx = 0;
    for (let i = 0; i < n - 1; i++) {
      const pos = available.indexOf(arr[i]);
      idx = idx * (n - i) + pos;
      available.splice(pos, 1);
    }
    return even < 0 ? (idx >>> 1) : idx;
  }

  // ================================================================
  // Move Table Generation
  // ================================================================
  // generateMoveTable:
  // Fills the moveTable with the state obtained after applying a move.
  // If 'doMove' is an array, its first element is taken as the move function and the rest are arguments for a Coord.
  function generateMoveTable(moveTable, size, doMove, N_MOVES = 6) {
    if (Array.isArray(doMove)) {
      const [moveFn, ...coordArgs] = doMove;
      const coord = new mathlib.Coord(...coordArgs);
      for (let m = 0; m < N_MOVES; m++) {
        moveTable[m] = [];
        for (let i = 0; i < size; i++) {
          const stateArr = coord.set([], i);
          moveFn(stateArr, m);
          moveTable[m][i] = coord.get(stateArr);
        }
      }
    } else {
      for (let m = 0; m < N_MOVES; m++) {
        moveTable[m] = [];
        for (let i = 0; i < size; i++) {
          moveTable[m][i] = doMove(i, m);
        }
      }
    }
  }
//ori: ori1, ori2, ..., orin, base
	// arr[perm[idx2]] = arr[perm[idx1]] + ori[idx2] - ori[idx1] + base
	function acycle(arr, perm, pow, ori) {
		pow = pow || 1;
		var plen = perm.length;
		var tmp = [];
		for (var i = 0; i < plen; i++) {
			tmp[i] = arr[perm[i]];
		}
		for (var i = 0; i < plen; i++) {
			var j = (i + pow) % plen;
			arr[perm[j]] = tmp[i];
			if (ori) {
				arr[perm[j]] += ori[j] - ori[i] + ori.at(-1);
			}
		}
		return acycle;
	}
  // ================================================================
  // Edge Moves
  // ================================================================
  // moveEdgePieces:
  // Applies a move 'm' to the array 'arr' representing the edge pieces.
  // This new implementation uses an if/else chain rather than a switch-case.
  function moveEdgePieces(arr, m) {
    if (m === 0) {
      // Front move: rotate four edges with an orientation adjustment of 1.
      rotateFourEdges(arr, 0, 7, 8, 4, 1);
    } else if (m === 1) {
      // Right move: orientation adjustment 0.
      rotateFourEdges(arr, 3, 6, 11, 7, 0);
    } else if (m === 2) {
      // Up move: no orientation change.
      rotateFourEdges(arr, 0, 1, 2, 3, 0);
    } else if (m === 3) {
      // Back move: orientation adjustment 1.
      rotateFourEdges(arr, 2, 5, 10, 6, 1);
    } else if (m === 4) {
      // Left move: orientation adjustment 0.
      rotateFourEdges(arr, 1, 4, 9, 5, 0);
    } else if (m === 5) {
      // Down move: no orientation change.
      rotateFourEdges(arr, 11, 10, 9, 8, 0);
    }
  }

  // rotateFourEdges:
  // Rotates the four specified positions (a, b, c, d) in 'arr' and applies an XOR with orientation 'ori'.
  function rotateFourEdges(arr, a, b, c, d, ori) {
    const temp = arr[a];
    arr[a] = arr[d] ^ ori;
    arr[d] = arr[c] ^ ori;
    arr[c] = arr[b] ^ ori;
    arr[b] = temp ^ ori;
  }

  // ================================================================
  // Pruning Table Generation
  // ================================================================
  // generatePruningTable:
  // Builds a pruning table (stored in 'prun') from an initial index or indices.
  // This implementation uses a new iterative style with forEach and separate variables.
  function generatePruningTable(prun, init, size, maxd = 256, doMove, N_MOVES = 6, N_POWER = 3, N_INV = 256) {
    const useMoveTable = Array.isArray(doMove);
    const numBytes = (size + 7) >>> 3;
    // Initialize every byte of the pruning table to -1.
    for (let i = 0; i < numBytes; i++) {
      prun[i] = -1;
    }
    // Ensure init is an array.
    if (!Array.isArray(init)) {
      init = [init];
    }
    // Set the initial states in the pruning table.
    init.forEach(val => {
      const byteIndex = val >>> 3;
      const shift = (val & 7) * 4;
      prun[byteIndex] ^= 15 << shift;
    });

    // Iteratively expand the pruning table until no further progress.
    for (let level = 0; level <= maxd; level++) {
      let progress = 0;
      const inversion = (level >= N_INV);
      // Calculate a fill value that will be used to mark new states.
      const fill = (level + 1) ^ 15;
      const target = inversion ? 0xF : level;
      const checkValue = inversion ? level : 0xF;
      // Outer loop: iterate through all possible state indices.
      outer: for (let p = 0; p < size; p++) {
        // Get the nibble from the pruning table.
        const current = getPruningValue(prun, p);
        if (current !== target) continue;
        // For each move, try to update reachable states.
        for (let m = 0; m < N_MOVES; m++) {
          let q = p;
          for (let power = 0; power < N_POWER; power++) {
            q = useMoveTable ? doMove[m][q] : doMove(q, m);
            if (q < 0) break;
            if (getPruningValue(prun, q) !== checkValue) continue;
            progress++;
            if (inversion) {
              // Mark state p as solved at the next level.
              const byteIndex = p >>> 3;
              const shift = (p & 7) * 4;
              prun[byteIndex] ^= fill << shift;
              continue outer;
            }
            // Mark state q as solved at the next level.
            const byteIndex = q >>> 3;
            const shift = (q & 7) * 4;
            prun[byteIndex] ^= fill << shift;
          }
        }
      }
      if (progress === 0) break;
    }
  }

  // ================================================================
  // Searcher for Solutions (Iterative Deepening)
  // ================================================================
  // The SolutionSearcher uses iterative deepening depth-first search to find a move sequence.
  function SolutionSearcher(isSolved, getPrun, doMove, N_AXIS, N_POWER, ckmv) {
    this.isSolved = isSolved || (() => true);
    this.getPrun = getPrun;
    this.doMove = doMove;
    this.N_AXIS = N_AXIS;
    this.N_POWER = N_POWER;
    // ckmv is an array for restricting move sequences; if not provided, initialize with default values.
    this.ckmv = ckmv || valuedArray(N_AXIS, i => 1 << i);
  }

  // solve: Find a single solution starting from an initial index.
  SolutionSearcher.prototype.solve = function(idx, minl, MAXL, callback, cost) {
    const sols = this.solveMulti([idx], minl, MAXL, callback, cost);
    return sols === null ? null : sols[0];
  };

  // solveMulti: Find multiple solutions starting from an array of indices.
  SolutionSearcher.prototype.solveMulti = function(idxs, minl, MAXL, callback, cost) {
    this.sidx = 0;
    this.sol = [];
    this.length = minl;
    this.idxs = idxs;
    return this.nextMulti(MAXL, callback, cost);
  };

  // nextMulti: Incrementally deepen the search until a solution is found or maximum depth is reached.
  SolutionSearcher.prototype.nextMulti = function(MAXL, callback, cost) {
    this.cost = (cost || 1e9) + 1;
    this.callback = callback || (() => true);
    while (this.length <= MAXL) {
      while (this.sidx < this.idxs.length) {
        if (this.idaSearch(this.idxs[this.sidx], this.length, 0, -1, this.sol) === 0) {
          return this.cost <= 0 ? null : [this.sol, this.sidx];
        }
        this.sidx++;
      }
      this.sidx = 0;
      this.length++;
    }
    return null;
  };

  // idaSearch: Perform an iterative deepening depth-first search.
  SolutionSearcher.prototype.idaSearch = function(idx, maxl, depth, lastMove, sol) {
    this.cost--;
    if (this.cost <= 0) return 0;
    const current = this.getPrun(idx);
    if (current > maxl) {
      // If current heuristic value is too high, return an indication (2 means cutoff).
      return current > maxl + 1 ? 2 : 1;
    } else if (maxl === 0) {
      // If no depth remains, check if the state is solved.
      return this.isSolved(idx) && this.callback(sol, this.sidx) ? 0 : 1;
    } else if (current === 0 && maxl === 1 && this.isSolved(idx)) {
      return 1;
    }
    // Choose a starting axis based on current depth.
    let axis = sol.length > depth ? sol[depth][0] : 0;
    // Try each move axis.
    for (; axis < this.N_AXIS; axis++) {
      // Skip moves that are not allowed by the move ordering restriction.
      if ((this.ckmv[lastMove] >> axis) & 1) continue;
      let nextIdx = Array.isArray(idx) ? idx.slice() : idx;
      let power = sol.length > depth ? sol[depth][1] : 0;
      for (; power < this.N_POWER; power++) {
        nextIdx = this.doMove(nextIdx, axis, power);
        if (nextIdx === null) break;
        sol[depth] = [axis, power];
        const ret = this.idaSearch(nextIdx, maxl - 1, depth + 1, axis, sol);
        if (ret === 0) return 0;
        sol.pop();
        if (ret === 2) break;
      }
    }
    return 1;
  };

  // valuedArray: Helper to create an array of a given length filled with values computed by valueFn.
  function valuedArray(length, valueFn) {
    const arr = [];
    for (let i = 0; i < length; i++) {
      arr[i] = valueFn(i);
    }
    return arr;
  }

  // ================================================================
  // Public API
  // ================================================================
  return {
    binomialCoefficients: binomialCoefficients,
    factorials: factorials,
    getPruningValue: getPruningValue,
    setPermutation: setPermutation,
    getPermutation: getPermutation,
    generateMoveTable: generateMoveTable,
    moveEdgePieces: moveEdgePieces,
    generatePruningTable: generatePruningTable,
    SolutionSearcher: SolutionSearcher,
  };
})();
