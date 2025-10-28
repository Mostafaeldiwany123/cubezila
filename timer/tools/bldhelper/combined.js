// Global variables
var white = "#FFFFFF";   // White face
var red = "#FF1A1A";     // Bright red face
var orange = "#FF8000";  // Bright orange face
var yellow = "#FFE600";  // Bright yellow face
var blue = "#0066FF";    // Bright blue face
var green = "#00CC00";   // Bright green face

function incrementString(str) {
    const letter = str.charAt(0);
    const number = parseInt(str.slice(1));
    return String.fromCharCode(letter.charCodeAt(0) + 1) + number;
}

// Base Puzzle class
class Puzzle {
    scrambles;
    scrambleIndex = 0;

    constructor() {
        this.scrambles = new Array();
    }

    addRandomScramble() {}
    // drawScheme is disabled because we no longer want to render the cube image.
    drawScheme() {}
    doScramble() {}
    solve() {}

    // New helper to use scramble.js's generateScramble() and return an array of moves.
    generateRandomScramble() {
        // Call generateScramble() (from scramble.js) and split it by space.
        const scramble = generateScramble().split(' ');
        return scramble;
    }
}

class ThreeByThree extends Puzzle {
    edges;
    corners;
    centres;

    constructor() {
        super();
        this.edges = new Map();
        this.corners = new Map();
        this.centres = new Map();
        this.solve();
    }

    static Move = {
        R: "R",
        U: "U",
        F: "F",
        L: "L",
        D: "D",
        B: "B",
    };

    solve() {
        const letters = [
            ["A", "B", "C", "D"],
            ["E", "F", "G", "H"],
            ["I", "J", "K", "L"],
            ["M", "N", "O", "P"],
            ["Q", "R", "S", "T"],
            ["U", "V", "W", "X"],
        ];

        for (const currRow of letters) {
            for (const key of currRow) {
                const color =
                    key == "A" || key == "B" || key == "C" || key == "D"
                        ? white
                        : key == "E" || key == "F" || key == "G" || key == "H"
                          ? orange
                          : key == "I" || key == "J" || key == "K" || key == "L"
                            ? green
                            : key == "M" || key == "N" || key == "O" || key == "P"
                              ? red
                              : key == "Q" || key == "R" || key == "S" || key == "T"
                                ? blue
                                : key == "U" || key == "V" || key == "W" || key == "X"
                                  ? yellow
                                  : null;

                const id0 = key + "0";
                const id1 = key + "1";

                this.edges.set(id1, color);
                this.corners.set(id0, color);
            }
        }

        this.centres.set("UCentre", white);
        this.centres.set("BCentre", blue);
        this.centres.set("RCentre", red);
        this.centres.set("FCentre", green);
        this.centres.set("DCentre", yellow);
        this.centres.set("LCentre", orange);
    }

    // Original setColor() updates a DOM element. We'll leave it here,
    // but it will be overridden in our subclass to be a no-op.
    setColor(id, pieces) {
        const el = document.getElementById(id);
        if (el) {
            el.setAttribute(
                "style",
                "background-color: " +
                    pieces.get(id) +
                    "; width: " +
                    this.w +
                    "; height: " +
                    this.h,
            );
        }
    }

    addRandomScramble() {
        // Use generateScramble() from scramble.js.
        const scramble = generateScramble().split(' ');
        this.addScramble(scramble);
    }

    addScramble(givenScramble) {
        if (this.scrambles.length != 0) {
            this.scrambleIndex++;
        }
        this.scrambles.push(givenScramble);
    }

    strigifyScramble() {
        let result = "";
        for (let i = 0; i < this.scrambles[this.scrambleIndex].length; i++) {
            result += this.scrambles[this.scrambleIndex][i];
            if (i != this.scrambles[this.scrambleIndex].length - 1) {
                result += " ";
            }
        }
        return result;
    }

    doScramble() {
        this.solve();
        for (let i = 0; i < this.scrambles[this.scrambleIndex].length; i++) {
            this.move(this.scrambles[this.scrambleIndex][i]);
        }
    }

    singleTurn(id1, id2, id3, id4, pieces) {
        const lostPiece = pieces.get(id1);
        pieces.set(id1, pieces.get(id2));
        pieces.set(id2, pieces.get(id3));
        pieces.set(id3, pieces.get(id4));
        pieces.set(id4, lostPiece);

        this.setColor(id1, pieces);
        this.setColor(id2, pieces);
        this.setColor(id3, pieces);
        this.setColor(id4, pieces);
    }

    doubleTurn(id1, id2, id3, id4, pieces) {
        const lostPiece1 = pieces.get(id1);
        pieces.set(id1, pieces.get(id3));
        pieces.set(id3, lostPiece1);

        const lostPiece2 = pieces.get(id2);
        pieces.set(id2, pieces.get(id4));
        pieces.set(id4, lostPiece2);

        this.setColor(id1, pieces);
        this.setColor(id2, pieces);
        this.setColor(id3, pieces);
        this.setColor(id4, pieces);
    }

    move(moveAsString) {
        if (moveAsString == "R") {
            this.singleTurn("B0", "J0", "V0", "T0", this.corners);
            this.singleTurn("C0", "K0", "W0", "Q0", this.corners);
            this.singleTurn("B1", "J1", "V1", "T1", this.edges);

            this.singleTurn("M0", "P0", "O0", "N0", this.corners);
            this.singleTurn("M1", "P1", "O1", "N1", this.edges);
        } else if (moveAsString == "R'") {
            this.singleTurn("B0", "T0", "V0", "J0", this.corners);
            this.singleTurn("C0", "Q0", "W0", "K0", this.corners);
            this.singleTurn("B1", "T1", "V1", "J1", this.edges);

            this.singleTurn("M0", "N0", "O0", "P0", this.corners);
            this.singleTurn("M1", "N1", "O1", "P1", this.edges);
        } else if (moveAsString == "R2") {
            this.doubleTurn("B0", "J0", "V0", "T0", this.corners);
            this.doubleTurn("C0", "K0", "W0", "Q0", this.corners);
            this.doubleTurn("B1", "J1", "V1", "T1", this.edges);

            this.doubleTurn("M0", "P0", "O0", "N0", this.corners);
            this.doubleTurn("M1", "P1", "O1", "N1", this.edges);
        } else if (moveAsString == "L") {
            this.singleTurn("A0", "S0", "U0", "I0", this.corners);
            this.singleTurn("D0", "R0", "X0", "L0", this.corners);
            this.singleTurn("D1", "R1", "X1", "L1", this.edges);

            this.singleTurn("F0", "E0", "H0", "G0", this.corners);
            this.singleTurn("E1", "H1", "G1", "F1", this.edges);
        } else if (moveAsString == "L'") {
            this.singleTurn("A0", "I0", "U0", "S0", this.corners);
            this.singleTurn("D0", "L0", "X0", "R0", this.corners);
            this.singleTurn("D1", "L1", "X1", "R1", this.edges);

            this.singleTurn("F0", "G0", "H0", "E0", this.corners);
            this.singleTurn("E1", "F1", "G1", "H1", this.edges);
        } else if (moveAsString == "L2") {
            this.doubleTurn("A0", "S0", "U0", "I0", this.corners);
            this.doubleTurn("D0", "R0", "X0", "L0", this.corners);
            this.doubleTurn("D1", "R1", "X1", "L1", this.edges);

            this.doubleTurn("F0", "E0", "H0", "G0", this.corners);
            this.doubleTurn("E1", "H1", "G1", "F1", this.edges);
        } else if (moveAsString == "M") {
            this.singleTurn("C1", "Q1", "W1", "K1", this.edges);
            this.singleTurn("I1", "A1", "S1", "U1", this.edges);
            this.singleTurn("FCentre", "UCentre", "BCentre", "DCentre", this.centres);

            this.edgeBuffer =
                this.edgeBuffer == "C1" ? "K1" : this.edgeBuffer == "I1" ? "U1" : "W1";
        } else if (moveAsString == "U") {
            this.singleTurn("J0", "N0", "R0", "F0", this.corners);
            this.singleTurn("I0", "M0", "Q0", "E0", this.corners);
            this.singleTurn("I1", "M1", "Q1", "E1", this.edges);

            this.singleTurn("D0", "C0", "B0", "A0", this.corners);
            this.singleTurn("D1", "C1", "B1", "A1", this.edges);
        } else if (moveAsString == "U'") {
            this.singleTurn("J0", "F0", "R0", "N0", this.corners);
            this.singleTurn("I0", "E0", "Q0", "M0", this.corners);
            this.singleTurn("I1", "E1", "Q1", "M1", this.edges);

            this.singleTurn("A0", "B0", "C0", "D0", this.corners);
            this.singleTurn("A1", "B1", "C1", "D1", this.edges);
        } else if (moveAsString == "U2") {
            this.doubleTurn("J0", "N0", "R0", "F0", this.corners);
            this.doubleTurn("I0", "M0", "Q0", "E0", this.corners);
            this.doubleTurn("I1", "M1", "Q1", "E1", this.edges);

            this.doubleTurn("D0", "C0", "B0", "A0", this.corners);
            this.doubleTurn("D1", "C1", "B1", "A1", this.edges);
        } else if (moveAsString == "D") {
            this.singleTurn("K0", "G0", "S0", "O0", this.corners);
            this.singleTurn("L0", "H0", "T0", "P0", this.corners);
            this.singleTurn("K1", "G1", "S1", "O1", this.edges);

            this.singleTurn("V0", "U0", "X0", "W0", this.corners);
            this.singleTurn("U1", "X1", "W1", "V1", this.edges);
        } else if (moveAsString == "D'") {
            this.singleTurn("K0", "O0", "S0", "G0", this.corners);
            this.singleTurn("L0", "P0", "T0", "H0", this.corners);
            this.singleTurn("K1", "O1", "S1", "G1", this.edges);

            this.singleTurn("V0", "W0", "X0", "U0", this.corners);
            this.singleTurn("U1", "V1", "W1", "X1", this.edges);
        } else if (moveAsString == "D2") {
            this.doubleTurn("K0", "G0", "S0", "O0", this.corners);
            this.doubleTurn("L0", "H0", "T0", "P0", this.corners);
            this.doubleTurn("K1", "G1", "S1", "O1", this.edges);

            this.doubleTurn("V0", "U0", "X0", "W0", this.corners);
            this.doubleTurn("U1", "X1", "W1", "V1", this.edges);
        } else if (moveAsString == "F") {
            this.singleTurn("M0", "D0", "G0", "V0", this.corners);
            this.singleTurn("P0", "C0", "F0", "U0", this.corners);
            this.singleTurn("P1", "C1", "F1", "U1", this.edges);

            this.singleTurn("J0", "I0", "L0", "K0", this.corners);
            this.singleTurn("J1", "I1", "L1", "K1", this.edges);
        } else if (moveAsString == "F'") {
            this.singleTurn("M0", "V0", "G0", "D0", this.corners);
            this.singleTurn("P0", "U0", "F0", "C0", this.corners);
            this.singleTurn("P1", "U1", "F1", "C1", this.edges);

            this.singleTurn("J0", "K0", "L0", "I0", this.corners);
            this.singleTurn("J1", "K1", "L1", "I1", this.edges);
        } else if (moveAsString == "F2") {
            this.doubleTurn("M0", "D0", "G0", "V0", this.corners);
            this.doubleTurn("P0", "C0", "F0", "U0", this.corners);
            this.doubleTurn("P1", "C1", "F1", "U1", this.edges);

            this.doubleTurn("J0", "I0", "L0", "K0", this.corners);
            this.doubleTurn("J1", "I1", "L1", "K1", this.edges);
        } else if (moveAsString == "B") {
            this.singleTurn("A0", "N0", "W0", "H0", this.corners);
            this.singleTurn("B0", "O0", "X0", "E0", this.corners);
            this.singleTurn("A1", "N1", "W1", "H1", this.edges);

            this.singleTurn("Q0", "T0", "S0", "R0", this.corners);
            this.singleTurn("Q1", "T1", "S1", "R1", this.edges);
        } else if (moveAsString == "B'") {
            this.singleTurn("A0", "H0", "W0", "N0", this.corners);
            this.singleTurn("B0", "E0", "X0", "O0", this.corners);
            this.singleTurn("A1", "H1", "W1", "N1", this.edges);

            this.singleTurn("Q0", "R0", "S0", "T0", this.corners);
            this.singleTurn("Q1", "R1", "S1", "T1", this.edges);
        } else if (moveAsString == "B2") {
            this.doubleTurn("A0", "N0", "W0", "H0", this.corners);
            this.doubleTurn("B0", "O0", "X0", "E0", this.corners);
            this.doubleTurn("A1", "N1", "W1", "H1", this.edges);

            this.doubleTurn("Q0", "T0", "S0", "R0", this.corners);
            this.doubleTurn("Q1", "T1", "S1", "R1", this.edges);
        }
    }

    // drawScheme is disabled: no cube image/table is rendered.
    drawScheme() {}
}

// Override cube3x3bld to disable DOM updates for cube faces.
class cube3x3bld extends ThreeByThree {
    edgeBuffer = "U1";
    cornerBuffer = "A0";

    setBuffers(edgeLetter, cornerLetter) {
        if (!/^[A-X]$/.test(edgeLetter) || !/^[A-X]$/.test(cornerLetter)) {
            throw new Error("Buffers must be letters A-X");
        }
        this.edgeBuffer = edgeLetter + "1";
        this.cornerBuffer = cornerLetter + "0";
    }

    setColor(id, pieces) {
        // No operation; we are not rendering cube faces.
    }

    getBldSolutionEdges() {
        let solvedEdges = this.getSolvedEdges();
        let numberOfSolvedEdges = 0;
        this.edges.forEach(function (value, key) {
            if (value == true) {
                numberOfSolvedEdges++;
            }
        });
        numberOfSolvedEdges /= 2;

        let result = [];
        while (numberOfSolvedEdges < 12) {
            let starter = this.pickEdge(solvedEdges);
            if (starter == null) break;
            numberOfSolvedEdges++;
            // Mark new cycle with HTML span
            result.push(`<span class="new-cycle">${starter}</span>`);
            let curr = starter;
            while (true) {
                curr = this.getNextEdge(curr, solvedEdges);
                result.push(curr);
                if (curr == starter || this.getComplimentaryOfEdge(curr) == starter) {
                    break;
                } else {
                    numberOfSolvedEdges++;
                }
            }
        }
        return result;
    }

    getBldSolutionCorners() {
        let solvedCorners = this.getSolvedCorners();
        let numberOfSolvedCorners = 0;
        this.corners.forEach(function (value, key) {
            if (value == true) {
                numberOfSolvedCorners++;
            }
        });
        numberOfSolvedCorners /= 3;

        let result = [];
        while (numberOfSolvedCorners < 8) {
            let starter = this.pickCorner(solvedCorners);
            if (starter == null) break;
            numberOfSolvedCorners++;
            // Mark new cycle with HTML span
            result.push(`<span class="new-cycle">${starter}</span>`);
            let curr = starter;
            while (true) {
                curr = this.getNextCorner(curr, solvedCorners);
                result.push(curr);
                if (curr == starter || 
                    this.getComplimentaryOfCorner(curr)[0] == starter ||
                    this.getComplimentaryOfCorner(curr)[1] == starter) {
                    break;
                } else {
                    numberOfSolvedCorners++;
                }
            }
        }
        return result;
    }

    strigifySolutionEdges(edges) {
        if (!Array.isArray(edges)) return "";
        let result = "";
        let ctr = 0;
        for (const edge of edges) {
            if (edge == null || 
                edge.replace(/<[^>]+>/g, '').charAt(0) == this.edgeBuffer.charAt(0) || 
                edge.replace(/<[^>]+>/g, '').charAt(0) == this.getComplimentaryOfEdge(this.edgeBuffer).charAt(0)) {
                continue;
            }
            // Only show the letter, preserve span for new cycles
            if (edge.includes('class="new-cycle"')) {
                result += `<span class="new-cycle">${edge.charAt(edge.indexOf('>') + 1)}</span>`;
            } else {
                result += edge.charAt(0);
            }
            if (ctr == 1) {
                result += " ";
            }
            ctr++;
            ctr %= 2;
        }
        return result;
    }

    strigifySolutionCorners(corners) {
        if (!Array.isArray(corners)) return "";
        let result = "";
        let ctr = 0;
        for (const corner of corners) {
            if (corner == null || 
                corner.replace(/<[^>]+>/g, '').charAt(0) == this.cornerBuffer.charAt(0) ||
                corner.replace(/<[^>]+>/g, '').charAt(0) == this.getComplimentaryOfCorner(this.cornerBuffer)[0].charAt(0) ||
                corner.replace(/<[^>]+>/g, '').charAt(0) == this.getComplimentaryOfCorner(this.cornerBuffer)[1].charAt(0)) {
                continue;
            }
            // Only show the letter, preserve span for new cycles
            if (corner.includes('class="new-cycle"')) {
                result += `<span class="new-cycle">${corner.charAt(corner.indexOf('>') + 1)}</span>`;
            } else {
                result += corner.charAt(0);
            }
            if (ctr == 1) {
                result += " ";
            }
            ctr++;
            ctr %= 2;
        }
        return result;
    }

    getSolvedEdges() {
        let result = new Map();
        let curr = "A1";
        let solvedCube = new ThreeByThree();
        solvedCube.solve();
        for (let i = 0; i < 24; i++) {
            if (result.has(curr)) {
                curr = incrementString(curr);
                continue;
            }
            let complimentary = this.getComplimentaryOfEdge(curr);
            if (
                solvedCube.edges.get(curr) == this.edges.get(curr) &&
                solvedCube.edges.get(complimentary) == this.edges.get(complimentary)
            ) {
                result.set(curr, true);
                result.set(complimentary, true);
            } else {
                result.set(curr, false);
                result.set(complimentary, false);
            }
            curr = incrementString(curr);
        }
        return result;
    }

    getSolvedCorners() {
        let result = new Map();
        let curr = "A0";
        let solvedCube = new ThreeByThree();
        solvedCube.solve();
        for (let i = 0; i < 24; i++) {
            if (result.has(curr)) {
                curr = incrementString(curr);
                continue;
            }
            const complimentaries = this.getComplimentaryOfCorner(curr);
            const complimentary1 = complimentaries[0];
            const complimentary2 = complimentaries[1];
            if (
                solvedCube.corners.get(curr) == this.corners.get(curr) &&
                solvedCube.corners.get(complimentary1) == this.corners.get(complimentary1) &&
                solvedCube.corners.get(complimentary2) == this.corners.get(complimentary2)
            ) {
                result.set(curr, true);
                result.set(complimentary1, true);
                result.set(complimentary2, true);
            } else {
                result.set(curr, false);
                result.set(complimentary1, false);
                result.set(complimentary2, false);
            }
            curr = incrementString(curr);
        }
        return result;
    }

    pickEdge(solvedEdges) {
        if (solvedEdges.get(this.edgeBuffer) == false) {
            solvedEdges.set(this.edgeBuffer, true);
            solvedEdges.set(this.getComplimentaryOfEdge(this.edgeBuffer), true);
            return this.edgeBuffer;
        }
        let curr = "A1";
        for (let i = 0; i < 24; i++) {
            if (solvedEdges.get(curr) == false) {
                solvedEdges.set(curr, true);
                solvedEdges.set(this.getComplimentaryOfEdge(curr), true);
                return curr;
            }
            curr = incrementString(curr);
        }
        return null;
    }

    pickCorner(solvedCorners) {
        if (solvedCorners.get(this.cornerBuffer) == false) {
            solvedCorners.set(this.cornerBuffer, true);
            solvedCorners.set(this.getComplimentaryOfCorner(this.cornerBuffer)[0], true);
            solvedCorners.set(this.getComplimentaryOfCorner(this.cornerBuffer)[1], true);
            return this.cornerBuffer;
        }
        let curr = "A0";
        for (let i = 0; i < 24; i++) {
            if (solvedCorners.get(curr) == false) {
                solvedCorners.set(curr, true);
                solvedCorners.set(this.getComplimentaryOfCorner(curr)[0], true);
                solvedCorners.set(this.getComplimentaryOfCorner(curr)[1], true);
                return curr;
            }
            curr = incrementString(curr);
        }
        return null;
    }

    getNextEdge(currEdge, solvedEdges) {
        let curr = "A1";
        let solvedCube = new ThreeByThree();
        solvedCube.solve();

        const color1 = this.edges.get(currEdge);
        const color2 = this.edges.get(this.getComplimentaryOfEdge(currEdge));
        for (let i = 0; i < 24; i++) {
            const currCompl = this.getComplimentaryOfEdge(curr);
            if (solvedCube.edges.get(curr) == color1 && solvedCube.edges.get(currCompl) == color2) {
                solvedEdges.set(curr, true);
                solvedEdges.set(currCompl, true);
                return curr;
            }
            curr = incrementString(curr);
        }
        return null;
    }

    getNextCorner(currCorner, solvedCorners) {
        let curr = "A0";
        let solvedCube = new ThreeByThree();
        solvedCube.solve();

        const color1 = this.corners.get(currCorner);
        const color2 = this.corners.get(this.getComplimentaryOfCorner(currCorner)[0]);
        const color3 = this.corners.get(this.getComplimentaryOfCorner(currCorner)[1]);

        for (let i = 0; i < 24; i++) {
            const currCompl1 = this.getComplimentaryOfCorner(curr)[0];
            const currCompl2 = this.getComplimentaryOfCorner(curr)[1];

            if (
                (solvedCube.corners.get(curr) == color1 &&
                    solvedCube.corners.get(currCompl1) == color2 &&
                    solvedCube.corners.get(currCompl2) == color3) ||
                (solvedCube.corners.get(curr) == color1 &&
                    solvedCube.corners.get(currCompl1) == color3 &&
                    solvedCube.corners.get(currCompl2) == color2)
            ) {
                solvedCorners.set(curr, true);
                solvedCorners.set(currCompl1, true);
                solvedCorners.set(currCompl2, true);
                return curr;
            }
            curr = incrementString(curr);
        }
        return null;
    }

    getComplimentaryOfEdge(edge) {
        if (edge == "A1") return "Q1";
        else if (edge == "Q1") return "A1";
        else if (edge == "B1") return "M1";
        else if (edge == "M1") return "B1";
        else if (edge == "C1") return "I1";
        else if (edge == "I1") return "C1";
        else if (edge == "D1") return "E1";
        else if (edge == "E1") return "D1";
        else if (edge == "F1") return "L1";
        else if (edge == "L1") return "F1";
        else if (edge == "G1") return "X1";
        else if (edge == "X1") return "G1";
        else if (edge == "H1") return "R1";
        else if (edge == "R1") return "H1";
        else if (edge == "J1") return "P1";
        else if (edge == "P1") return "J1";
        else if (edge == "K1") return "U1";
        else if (edge == "U1") return "K1";
        else if (edge == "N1") return "T1";
        else if (edge == "T1") return "N1";
        else if (edge == "O1") return "V1";
        else if (edge == "V1") return "O1";
        else if (edge == "S1") return "W1";
        else if (edge == "W1") return "S1";
        else return null;
    }

    getComplimentaryOfCorner(corner) {
        if (corner == "A0") return ["E0", "R0"];
        else if (corner == "E0") return ["A0", "R0"];
        else if (corner == "R0") return ["A0", "E0"];
        else if (corner == "B0") return ["N0", "Q0"];
        else if (corner == "N0") return ["B0", "Q0"];
        else if (corner == "Q0") return ["B0", "N0"];
        else if (corner == "C0") return ["J0", "M0"];
        else if (corner == "J0") return ["C0", "M0"];
        else if (corner == "M0") return ["C0", "J0"];
        else if (corner == "D0") return ["F0", "I0"];
        else if (corner == "F0") return ["D0", "I0"];
        else if (corner == "I0") return ["D0", "F0"];
        else if (corner == "G0") return ["L0", "U0"];
        else if (corner == "L0") return ["G0", "U0"];
        else if (corner == "U0") return ["G0", "L0"];
        else if (corner == "H0") return ["S0", "X0"];
        else if (corner == "S0") return ["H0", "X0"];
        else if (corner == "X0") return ["H0", "S0"];
        else if (corner == "K0") return ["P0", "V0"];
        else if (corner == "P0") return ["K0", "V0"];
        else if (corner == "V0") return ["K0", "P0"];
        else if (corner == "O0") return ["T0", "W0"];
        else if (corner == "T0") return ["O0", "W0"];
        else if (corner == "W0") return ["O0", "T0"];
        else return null;
    }
}

const puzzle = new cube3x3bld();

function getLineOfEdgesSolution() {
    const result = puzzle.getBldSolutionEdges();
    return `<div class="solution-header">Solution for edges:</div>
            <div class="letter-sequence">${puzzle.strigifySolutionEdges(result)}</div>`;
}

function getLineOfCornersSolution() {
    const cornerSolution = puzzle.strigifySolutionCorners(puzzle.getBldSolutionCorners());
    return "Solution for the corners: " + cornerSolution;
}

function updateBuffers() {
    const edgeBuffer = document.getElementById("edge-buffer").value.toUpperCase();
    const cornerBuffer = document.getElementById("corner-buffer").value.toUpperCase();
    
    try {
        puzzle.setBuffers(edgeBuffer, cornerBuffer);
        puzzle.doScramble();
        document.getElementById("solutionEdges").innerHTML = getLineOfEdgesSolution();
        document.getElementById("solutionCorners").innerHTML = getLineOfCornersSolution();
    } catch (error) {
        alert("Please enter valid buffer letters (A-X)");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let next = document.getElementById("next");
    next.addEventListener("click", function () {
        if (puzzle.scrambles.length == 0) {
            console.log("Something went wrong");
            return;
        }

        if (puzzle.scrambles.length == puzzle.scrambleIndex + 1) {
            const randomScramble = puzzle.generateRandomScramble();
            puzzle.addScramble(randomScramble);
        } else {
            puzzle.scrambleIndex++;
        }

        update();

        if (!document.getElementById("last").classList.contains("isActive")) {
            document.getElementById("last").classList.add("isActive");
        }
    });

    let last = document.getElementById("last");
    last.addEventListener("click", function () {
        if (!last.classList.contains("isActive")) {
            return;
        }
        if (puzzle.scrambleIndex != 0) {
            puzzle.scrambleIndex--;
        }
        update();
        if (puzzle.scrambleIndex == 0) {
            document.getElementById("last").classList.remove("isActive");
        }
    });

    // Removed event listener for "makeSentence" because no such element exists.
    // document.getElementById("makeSentence").addEventListener("click", function() { ... });

    function update() {
        puzzle.doScramble();
        const newScrambleText = puzzle.strigifyScramble();
        document.getElementById("scramble3x3").innerHTML = newScrambleText;
        document.getElementById("solutionEdges").innerHTML = getLineOfEdgesSolution();
        document.getElementById("solutionCorners").innerHTML = getLineOfCornersSolution();
    }
});

function makePuzzleAppear() {
    const randomScramble = puzzle.generateRandomScramble();
    puzzle.addScramble(randomScramble);
    const scrambleText = puzzle.strigifyScramble();

    // Place scramble text inside scramble-container (creates <p id="scramble3x3">)
    document.getElementById('scramble-container').innerHTML = 
        '<p id="scramble3x3">' + scrambleText + "</p>";

    // Do not call drawScheme() since we aren't rendering the cube image.
    puzzle.doScramble();
    document.getElementById('solutionEdges').innerHTML = getLineOfEdgesSolution();
    document.getElementById('solutionCorners').innerHTML = getLineOfCornersSolution();
}



