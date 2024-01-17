const boardElement = document.querySelector('board');
const playerElement = document.querySelector('currentPlayer');
const availableMovesElement = document.querySelector('availableMoves');

const cellHtml = (value, rowIndex, colIndex) =>
    `<td data-row="${rowIndex}" data-col="${colIndex}" ${value ? `class="${value}"` : ''}>${rowIndex},${colIndex}</td>`;

const rowHtml = (row, rowIndex) =>
    `<tr>
    ${row
        .map((cell, cellIndex) => cellHtml(cell, rowIndex, cellIndex))
        .join('\n')
    }
    </tr>`;

const draw = () => {
    boardElement.innerHTLM =
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