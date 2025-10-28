function cleanAlgorithm(alg) {
    return alg.replace(/[\[\](){}]/g, '').trim();
}

function invertMove(move) {
    if (!move) return '';
    const baseMove = move[0];
    const modifier = move.slice(1);
    
    // Handle U2' case - return as is
    if (modifier === "2'") return move;
    if (modifier === "2") return move;
    if (modifier === "'") return baseMove;
    return baseMove + "'";
}

function invertAlgorithm(algorithm) {
    // First clean the algorithm
    const cleanedAlg = cleanAlgorithm(algorithm);
    
    // Add spaces between moves if they don't exist
    const withSpaces = cleanedAlg.replace(/([A-Z])(?=[A-Z])/g, '$1 ');
    
    // Split into moves and invert
    const moves = withSpaces.split(/\s+/);
    return moves.reverse().map(move => invertMove(move)).join(' ');
}