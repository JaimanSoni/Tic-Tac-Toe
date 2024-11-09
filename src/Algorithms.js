const checkWinner = (board) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            
            return [board[a], [a, b, c]];
        }
    }

    return [board.includes(null) ? null : 'Tie'];
};

const minimax = (board, isMaximizing) => {
    let winner = checkWinner(board);
    winner = winner[0]
    if (winner === 'O') return 1;
    if (winner === 'X') return -1;
    if (winner === 'Tie') return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(board, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                let score = minimax(board, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

export  {minimax, checkWinner};
