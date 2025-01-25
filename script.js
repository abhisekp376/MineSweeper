const minefield = document.getElementById('minefield');
const restartButton = document.getElementById('restart-button');

let gridWidth = 10;
let gridHeight = 10;
let numberOfMines = 15;
let cells = [];

function createBoard(width, height) {
    minefield.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    cells = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.dataset.isMine = false;
            cell.dataset.isRevealed = false;
            cell.dataset.isFlagged = false;
            minefield.appendChild(cell);
            cells.push(cell);
        }
    }
}

function placeMines(numberOfMines) {
    let placedMines = 0;

    while (placedMines < numberOfMines) {
        const x = Math.floor(Math.random() * gridWidth);
        const y = Math.floor(Math.random() * gridHeight);
        const cell = cells.find(cell => cell.dataset.x == x && cell.dataset.y == y);

        if (cell.dataset.isMine === 'false') {
            cell.dataset.isMine = true;
            placedMines++;
        }
    }
}

function getAdjacentCells(cell) {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const adjacentCells = [];

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            const newX = x + dx;
            const newY = y + dy;

            if (newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridHeight) {
                const adjacentCell = cells.find(c => c.dataset.x == newX && c.dataset.y == newY);
                if (adjacentCell) adjacentCells.push(adjacentCell);
            }
        }
    }

    return adjacentCells;
}

function calculateAdjacentMines() {
    cells.forEach(cell => {
        if (cell.dataset.isMine === 'false') {
            const adjacentCells = getAdjacentCells(cell);
            const adjacentMines = adjacentCells.filter(c => c.dataset.isMine === 'true').length;

            if (adjacentMines > 0) {
                cell.textContent = adjacentMines;
                cell.dataset.adjacentMines = adjacentMines;
            }
        }
    });
}

function revealCell(cell) {
    if (cell.dataset.isRevealed === 'true' || cell.dataset.isFlagged === 'true') return;

    cell.dataset.isRevealed = true;
    cell.classList.add('revealed');

    if (cell.dataset.isMine === 'true') {
        cell.classList.add('mine');
        alert('You clicked on a mine! Game Over!');
        setupGame();
        return;
    }

    if (!cell.dataset.adjacentMines) {
        const adjacentCells = getAdjacentCells(cell);
        adjacentCells.forEach(revealCell);
    }
}

function toggleFlag(cell) {
    if (cell.dataset.isRevealed === 'true') return;

    if (cell.dataset.isFlagged === 'false') {
        cell.dataset.isFlagged = true;
        cell.classList.add('flag');
    } else {
        cell.dataset.isFlagged = false;
        cell.classList.remove('flag');
    }
}

function setupGame() {
    minefield.innerHTML = '';
    createBoard(gridWidth, gridHeight);
    placeMines(numberOfMines);
    calculateAdjacentMines();

    cells.forEach(cell => {
        cell.addEventListener('click', () => revealCell(cell));
        cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            toggleFlag(cell);
        });
    });
}

restartButton.addEventListener('click', setupGame);

setupGame();
