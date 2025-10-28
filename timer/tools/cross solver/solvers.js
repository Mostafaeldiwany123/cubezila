// solvers.js
(function(global) {
    // Destructure the functions and Tables from crossTables.
    const {
      Tables,
      updatePermutationState,
      updateFlipState,
      initBasicTables,
      initExtendedTables,
      initExtendedPrunings
    } = global.crossTables;
  
    // ================================================================
    // Solver Instantiation
    // ================================================================
    let solvCross, solvXCross, solvXXCross;
    function initSolvers() {
      solvCross = new searcher.SolutionSearcher(
        idx => (idx[0] + idx[1]) === 0,
        idx => {
          const h1 = searcher.getPruningValue(Tables.permPruning, idx[0]);
          const h2 = searcher.getPruningValue(Tables.flipPruning, idx[1]);
          return h1 > h2 ? h1 : h2;
        },
        (idx, move) => {
          return [
            updatePermutationState(idx[0], move),
            updateFlipState(idx[1], move)
          ];
        },
        6, 3, [1, 2, 4, 9, 18, 36]
      );
  
      solvXCross = new searcher.SolutionSearcher(
        idx => (idx[0] + idx[1]) === 0 &&
               idx[2] === (idx[4] + 4) * 2 &&
               idx[3] === (idx[4] + 4) * 3,
        idx => {
          const a = searcher.getPruningValue(Tables.permPruning, idx[0]);
          const b = searcher.getPruningValue(Tables.flipPruning, idx[1]);
          const c = searcher.getPruningValue(Tables.edgeCornerPruning[idx[4]], idx[3] * 24 + idx[2]);
          return a > b ? (a > c ? a : c) : (b > c ? b : c);
        },
        (idx, move) => {
          return [
            updatePermutationState(idx[0], move),
            updateFlipState(idx[1], move),
            Tables.edgeMoves[idx[2]][move],
            Tables.cornerEdgeMoves[idx[3]][move],
            idx[4]
          ];
        },
        6, 3, [1, 2, 4, 9, 18, 36]
      );
  
      solvXXCross = new searcher.SolutionSearcher(
        idx => (idx[0] + idx[1]) === 0 &&
               idx[2] === 4 * 2 &&
               idx[3] === 4 * 3 &&
               ((idx[4] === 5 * 2 && idx[5] === 5 * 3) ||
                (idx[4] === 6 * 2 && idx[5] === 6 * 3)),
        idx => {
          const a = searcher.getPruningValue(Tables.permPruning, idx[0]);
          const b = searcher.getPruningValue(Tables.flipPruning, idx[1]);
          const c = searcher.getPruningValue(idx[6], idx[3] * 24 + idx[2] + 576 * (idx[5] * 24 + idx[4]));
          return Math.max(a, b, c);
        },
        (idx, move) => {
          return [
            updatePermutationState(idx[0], move),
            updateFlipState(idx[1], move),
            Tables.edgeMoves[idx[2]][move],
            Tables.cornerEdgeMoves[idx[3]][move],
            Tables.edgeMoves[idx[4]][move],
            Tables.cornerEdgeMoves[idx[5]][move],
            idx[6]
          ];
        },
        6, 3, [1, 2, 4, 9, 18, 36]
      );
    }
  
    // ================================================================
    // Public Solving Functions (API)
    // ================================================================
    function solve(moves) {
      initBasicTables();
      const moveOrder = ["FRUBLD", "FLDBRU", "FDRBUL", "FULBDR", "URBDLF", "DRFULB"];
      const allSolutions = [];
      for (let face = 0; face < 6; face++) {
          let flip = 0, perm = 0;
          for (const move of moves) {
              const mIndex = moveOrder[face].indexOf("FRUBLD".charAt(move[0]));
              const rep = move[2];
              for (let j = 0; j < rep; j++) {
                  flip = updateFlipState(flip, mIndex);
                  perm = updatePermutationState(perm, mIndex);
              }
          }
          const solutions = [];
          const maxDepth = 20;
          const maxSolutions = 6;  // Increased from 4 to 12
          for (let d = 0; d <= maxDepth && solutions.length < maxSolutions; d++) {
              const sol = solvCross.solve([perm, flip], d, d);
              if (sol) {
                  const solStr = sol.map(mv => "FRUBLD".charAt(mv[0]) + " 2'".charAt(mv[1]));
                  if (!solutions.some(existing => existing.join(" ") === solStr.join(" "))) {
                      solutions.push(solStr);
                  }
              }
          }
          allSolutions.push(solutions);
      }
      return allSolutions;
    }
  
    function solve_xcross(moves, face) {
      initBasicTables();
      let flip = 0, perm = 0;
      let e1 = [8, 10, 12, 14];
      let c1 = [12, 15, 18, 21];
      const moveOrder = ["FRUBLD", "FLDBRU", "FDRBUL", "FULBDR", "URBDLF", "DRFULB"];
      for (const move of moves) {
        const mIndex = moveOrder[face].indexOf("FRUBLD".charAt(move[0]));
        const rep = move[2];
        for (let j = 0; j < rep; j++) {
          flip = updateFlipState(flip, mIndex);
          perm = updatePermutationState(perm, mIndex);
          for (let k = 0; k < 4; k++) {
            e1[k] = Tables.edgeMoves[e1[k]][mIndex];
            c1[k] = Tables.cornerEdgeMoves[c1[k]][mIndex];
          }
        }
      }
      const idxs = [];
      for (let i = 0; i < 4; i++) {
        idxs.push([perm, flip, e1[i], c1[i], i]);
      }
      const solutions = [];
      const maxDepth = 20;
      const maxSolutions = 6;  // Changed to 6 solutions for XCross
      for (let depth = 0; depth <= maxDepth && solutions.length < maxSolutions; depth++) {
        const newSols = solvXCross.solveMulti(idxs, depth, depth);
        if (newSols && newSols[0]) {
            const sol = newSols[0].map(mv => "FRUBLD".charAt(mv[0]) + " 2'".charAt(mv[1]));
            if (!solutions.some(existing => existing.join(" ") === sol.join(" "))) {
                solutions.push(sol);
            }
        }
        if (solutions.length >= maxSolutions && depth >= 8) break;
      }
      return solutions;
    }
  
    function solve_xxcross(moves, face) {
      try {
        initExtendedPrunings();
        const idxs = [];
        const moveOrder = ["FRUBLD", "FLDBRU", "FDRBUL", "FULBDR", "URBDLF", "DRFULB"];
        const yrotOrder = ["FRUBLD", "RBULFD", "BLUFRD", "LFURBD"];
        const rotations = 2;
        for (let yrot = 0; yrot < rotations; yrot++) {
          let flip = 0, perm = 0;
          let e1 = [8, 10, 12];
          let c1 = [12, 15, 18];
          const moveIndices = moves.map(move => 
            yrotOrder[yrot].indexOf("FRUBLD".charAt(moveOrder[face].indexOf("FRUBLD".charAt(move[0]))))
          );
          for (let i = 0; i < moves.length; i++) {
            const mIndex = moveIndices[i];
            const rep = moves[i][2];
            if (mIndex === -1) continue;
            for (let j = 0; j < rep; j++) {
              flip = updateFlipState(flip, mIndex);
              perm = updatePermutationState(perm, mIndex);
              const newE1 = e1.map(e => Tables.edgeMoves[e][mIndex]);
              const newC1 = c1.map(c => Tables.cornerEdgeMoves[c][mIndex]);
              e1 = newE1;
              c1 = newC1;
            }
          }
          idxs.push([perm, flip, e1[0], c1[0], e1[1], c1[1], Tables.extendedPruning1]);
          idxs.push([perm, flip, e1[0], c1[0], e1[2], c1[2], Tables.extendedPruning2]);
        }
        const maxDepthLocal = 18;
        const solutions = [];
        const startTime = Date.now();
        const timeLimit = 3000;
        const maxSolutions = 6;  // Added maxSolutions variable
        
        for (let depth = 0; depth <= maxDepthLocal; depth += 1) {
          if (Date.now() - startTime > timeLimit) {
            console.warn("solve_xxcross: time limit reached");
            return solutions.length ? solutions : [];
          }
          const sol = solvXXCross.solveMulti(idxs, depth, depth);
          if (sol && sol[0]) {
            const yrot = sol[1] >> 1;
            const solStr = sol[0].map(mv => yrotOrder[yrot].charAt(mv[0]) + " 2'"[mv[1]]);
            if (!solutions.some(existing => existing.join(" ") === solStr.join(" "))) {
              solutions.push(solStr);
            }
          }
          if (solutions.length >= maxSolutions && depth >= 8) break;
        }
        return solutions;
      } catch (error) {
        console.error("Error in solve_xxcross:", error);
        return [];
      }
    }
  
    // Expose the solver API.
    global.crossSolvers = {
      initSolvers,
      solve,
      solve_xcross,
      solve_xxcross
    };
  
  })(window);
