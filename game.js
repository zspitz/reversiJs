const state = new Array(8).fill();
let currentPlayer = 'b';
let availableMoves = {};
let gameOver = false;

const init = () => {
    gameOver = false;
    state.forEach((_, index) => {
        state[index] = new Array(8).fill();
    });

    state[3][3] = 'b';
    state[3][4] = 'w';
    state[4][3] = 'w';
    state[4][4] = 'b';
};

// move in an existing space - returns false
// otherwise returns changes resulting from move
// moves without changes (empty array) are invalid
const getChanges = (row, col) => {
    if (state[row][col] !== undefined) { return false; }

    const offsets = [-1, 0, 1];
    const directions = offsets
        .flatMap(y => offsets.map(x => [y, x]))
        .filter(([y, x]) => y != 0 && x != 0);

    const changes = [];

    for (const [rowOffset, colOffset] of directions) {
        const line = [];
        while (true) {
            let testRow = row + rowOffset * offsetCount;
            let testCol = col + colOffset * offsetCount;

            // out of bounds of board
            if (testRow < 0 || testRow > 7 || testCol < 0 || testCol > 7) { break; }

            const testState = state[testRow][testCol];

            // found empty space
            if (testState === undefined) { break; }

            // found end of line
            if (testState === currentPlayer) {
                changes.push(...line);
                break;
            }

            line.push({ row: testRow, col: testCol });

            offsetCount += 1;
        }
    }

    return changes;
}

const updateAvailableMoves = () => {
    const _availableMoves = {};

    const counts = range(8);

    for (const row of counts) {
        for (const col of counts) {
            const changes = getChanges(row, col);
            if (!changes || !changes.length) { continue; }
            _availableMoves[row + '_' + col] = changes;
        }
    }

    availableMoves = _availableMoves;
}

const otherPlayer = {
    b: 'w',
    w: 'b'
};

const messages = {
    invalidMove: 'Invalid move',
    noMoves1Player: 'No moves for player',
    noMoves2Player: 'No moves for either player'
};

const playMove = (row, col) => {
    const changes = availableMoves[row + '_' + col];
    if (!changes) {
        return {
            msg: messages.invalidMove
        };
    }

    for (const change of changes) {
        state[change.row][change.col] = currentPlayer;
    }

    currentPlayer = otherPlayer[currentPlayer];
    updateAvailableMoves();
    if (!isEmptyObject(availableMoves)) {
        return {};
    }

    const skippedPlayer = currentPlayer;
    currentPlayer = otherPlayer[currentPlayer];
    updateAvailableMoves();
    if (!isEmptyObject(availableMoves)) {
        gameOver = true;
        return {
            msg: messages.noMoves1Player,
            skippedPlayer
        };
    }

    return {
        msg: messages.noMoves2Player
    };
}

init();
