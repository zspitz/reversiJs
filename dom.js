const boardElement = document.querySelector('#board');
const playerElement = document.querySelector('#currentPlayer');
const availableMovesElement = document.querySelector('#availableMoves');
const showAvailablesInput = document.querySelector('#showAvailables');

const cellHtml = (value, rowIndex, colIndex) => {
    const classNames = [];
    if (value) { classNames.push(value); }
    if (
        showAvailablesInput.checked &&
        availableMoves[`${rowIndex}_${colIndex}`]
    ) {
        classNames.push('available');
    }
    const classString = classNames.length ? `class="${classNames.join(' ')}"` : '';
    return `<td data-row="${rowIndex}" data-col="${colIndex}" ${classString}>${rowIndex},${colIndex}</td>`;
}


const rowHtml = (row, rowIndex) =>
    `<tr>
    ${row
        .map((cell, cellIndex) => cellHtml(cell, rowIndex, cellIndex))
        .join('\n')
    }
    </tr>`;

const draw = () => {
    boardElement.innerHTML =
        `<table><tbody>
        ${state
            .map((row, rowIndex) => rowHtml(row, rowIndex))
            .join('\n')
        }
        </tbody></table>`;

    playerElement.innerText = `Current player: ${currentPlayer}`;

    availableMovesElement.innerHTML =
        Object.entries(availableMoves)
            .map(
                ([point, changes]) => `<p>${point.replace('_', ',')} (${changes.length})`
            )
            .join('\n');
};

draw();

showAvailablesInput.addEventListener('change', () => draw());

boardElement.addEventListener('click', e => {
    if (!e.target.matches('td')) { return; }
    if (gameOver) { return; }

    const { row, col } = e.target.dataset;
    const { msg, skippedPlayer } = playMove(row, col);

    if (msg === messages.invalidMove) {
        alert(msg);
        return;
    }

    draw();

    if (msg === messages.noMoves1Player) {
        alert(`${msg} ${skippedPlayer}`);
    } else if (msg === messages.noMoves2Player) {
        alert(`${msg}! Game over!`);
    }
})