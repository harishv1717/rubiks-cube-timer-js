export default function generateScramble(cube = "3x3x3") {
    const baseMoves = ["R", "U", "F"];

    const scrambleSizes = {
        "2x2x2": 11,
        "3x3x3": 20,
        "4x4x4": 45,
        "5x5x5": 60,
        "6x6x6": 80,
        "7x7x7": 100
    };

    const size = scrambleSizes[cube];
    const cubeSize = parseInt(cube.slice(0, 1));

    if (cubeSize >= 3) baseMoves.push("L", "B", "D");
    if (cubeSize >= 4) baseMoves.push("Rw", "Uw", "Fw");
    if (cubeSize >= 5) baseMoves.push("Lw", "Bw", "Dw");
    if (cubeSize >= 6) baseMoves.push("3Rw", "3Uw", "3Fw");
    if (cubeSize >= 7) baseMoves.push("3Lw", "3Bw", "3Dw");

    let bad = true;
    let scramble = [];

    while (bad) {
        scramble = [];
        for (let i = 0; i < size; i++) scramble.push(Math.floor(Math.random() * baseMoves.length));

        for (let i = 0; i < size - 1; i++) {
            if (scramble[i] === scramble[i + 1]) {
                bad = true;
                break;
            } else bad = false;
        }
    }

    return scramble
        .map(index => {
            const moves = [baseMoves[index], `${baseMoves[index]}'`, `${baseMoves[index]}2`];
            return moves[Math.floor(Math.random() * moves.length)];
        })
        .join(" ");
}
