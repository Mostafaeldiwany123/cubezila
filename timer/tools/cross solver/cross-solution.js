// cross.js
(function(global) {
  // Initialize tables and extended tables first.
  global.crossTables.initBasicTables();
  global.crossTables.initExtendedTables();
  // Initialize solvers.
  global.crossSolvers.initSolvers();

  // Create the cross module with its public API.
  const cross = {
    solve: global.crossSolvers.solve,
    solve_xcross: global.crossSolvers.solve_xcross,
    solve_xxcross: global.crossSolvers.solve_xxcross
  };

  // Expose the module to the global namespace.
  global.cross = cross;
})(window);
