const scrambleParser = (() => {
  "use strict";

  // ----------------------------------------------------------------
  // Token Pattern
  // ----------------------------------------------------------------
  // We use a named capture group regex so that each part of a scramble token
  // is clearly identified. This regex is functionally equivalent to:
  //   /^(\d+(?:-\d+)?)?([FRUBLDfrubldzxySME])(?:([w])|&sup(\d);)?([2'])?$/
  // but uses names to improve readability.
  const tokenRegex = /^(?<width>\d+(?:-\d+)?)?(?<face>[FRUBLDfrubldzxySME])(?:(?<wide>w)|&sup(?<sup>\d);)?(?<mod>[2'])?$/;

  // ----------------------------------------------------------------
  // parseScramble: Public function to parse a scramble string
  //
  // Parameters:
  //   scramble (string): the scramble string (e.g. "R U2 F' ...")
  //   moveMap (array): an array that maps the standard face letters ("FRUBLD")
  //                    to indices used by your solver.
  //
  // Returns:
  //   An array of move arrays. Each move is represented as:
  //     [mappedIndex, primaryWidth, power, secondaryWidth]
  // which exactly matches the original output.
  // ----------------------------------------------------------------
  function parseScramble(scramble = '', moveMap) {
    // Trim and split the scramble string by whitespace to get tokens.
    const tokens = scramble.trim().split(/\s+/);
    const moveSequence = [];

    // Define the valid face characters.
    const validFaces = "FRUBLDfrubldzxySME";

    // Process each token.
    for (const token of tokens) {
      // Try matching the token using our new regex with named groups.
      const match = tokenRegex.exec(token);
      if (!match) continue; // Skip token if no match found

      // Extract groups from the match. Default to empty strings when not provided.
      const { width = '', face, wide = '', sup = '', mod = '' } = match.groups;

      // Determine the index of the face letter within the valid set.
      const faceIndex = validFaces.indexOf(face);
      if (faceIndex === -1) continue; // Skip if invalid

      // Special case: If faceIndex > 14, process differently.
      // (The original code uses this to handle rotations or special moves.)
      if (faceIndex > 14) {
        // Map the face letter using a new array [0,4,5] and modulus.
        const mappedFace = [0, 4, 5][faceIndex % 3];
        // Determine modValue: Look up the index of the modifier in "2'" 
        // (defaulting to 'X' if no modifier, which yields index -1, then add 2).
        const modValue = "2'".indexOf(mod || 'X') + 2;
        // Add two moves to the sequence.
        moveSequence.push([
          moveMap.indexOf("FRUBLD".charAt(mappedFace)),
          2,
          modValue
        ]);
        moveSequence.push([
          moveMap.indexOf("FRUBLD".charAt(mappedFace)),
          1,
          4 - modValue
        ]);
        // Continue to next token.
        continue;
      }

      // Otherwise, process as a normal move.
      // If a width is specified, split it on '-' to extract primary and secondary widths.
      const widthParts = width ? width.split('-') : [];
      let primaryWidth;

      // For standard faces (faceIndex < 12) determine primaryWidth:
      if (faceIndex < 12) {
        if (widthParts[0]) {
          primaryWidth = Number(widthParts[0]);
        } else if (sup) {
          primaryWidth = Number(sup);
        } else {
          // If a wide flag 'w' is present or faceIndex > 5, then primaryWidth is 2; otherwise, 1.
          primaryWidth = (wide === 'w' || faceIndex > 5) ? 2 : 1;
        }
      } else {
        primaryWidth = -1; // For non-standard faces.
      }
      // Secondary width is taken from the part after '-' if available, otherwise -1.
      const secondaryWidth = (widthParts[1] !== undefined) ? Number(widthParts[1]) : -1;

      // Determine modifier offset: "2'" string is used to map the modifier to a number.
      // If no modifier is provided, default to 'X', which gives -1, then add 2.
      const modOffset = "2'".indexOf(mod || 'X') + 2;
      // Compute the power of the move. For standard faces, power is positive; otherwise negative.
      const power = (faceIndex < 12 ? 1 : -1) * modOffset;
      // Map the face: Use faceIndex modulo 6 on the standard string "FRUBLD".
      const mappedIndex = moveMap.indexOf("FRUBLD".charAt(faceIndex % 6));

      // Append the move to the sequence.
      moveSequence.push([mappedIndex, primaryWidth, power, secondaryWidth]);
    }

    return moveSequence;
  }

  // Expose the public API.
  return { parseScramble };
})();
