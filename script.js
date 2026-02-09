// ====== CONFIGURATION ======
const GRID_SIZE = 3; // Change to 4 for 4x4 puzzle
// ===========================

const TILE_SIZE = 100;
const IMAGE_SIZE = GRID_SIZE * TILE_SIZE;
let tiles = [];
let emptyIndex = GRID_SIZE * GRID_SIZE - 1;

function init() {
    // Create solved state: [0, 1, 2, ..., n-1, null]
    tiles = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE - 1; i++) {
        tiles.push(i);
    }
    tiles.push(null);
    emptyIndex = tiles.length - 1;

    // Shuffle by making random moves
    shuffle(100);

    render();
}

function shuffle(moves) {
    for (let i = 0; i < moves; i++) {
        const neighbors = getNeighbors(emptyIndex);
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        // Swap the random neighbor with empty
        tiles[emptyIndex] = tiles[randomNeighbor];
        tiles[randomNeighbor] = null;
        emptyIndex = randomNeighbor;
    }
}

function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    if (row > 0) neighbors.push(index - GRID_SIZE); // up
    if (row < GRID_SIZE - 1) neighbors.push(index + GRID_SIZE); // down
    if (col > 0) neighbors.push(index - 1); // left
    if (col < GRID_SIZE - 1) neighbors.push(index + 1); // right

    return neighbors;
}

function render() {
    const grid = document.getElementById('puzzleGrid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`;

    tiles.forEach((tile, index) => {
        const div = document.createElement('div');
        div.className = 'tile';

        if (tile === null) {
            div.classList.add('empty');
        } else {
            const originalRow = Math.floor(tile / GRID_SIZE);
            const originalCol = tile % GRID_SIZE;

            div.style.backgroundImage = `url('us.png')`;
            div.style.backgroundSize = `${IMAGE_SIZE}px ${IMAGE_SIZE}px`;
            div.style.backgroundPosition = `-${originalCol * TILE_SIZE}px -${originalRow * TILE_SIZE}px`;

            div.onclick = () => clickTile(index);
        }

        grid.appendChild(div);
    });
}

function clickTile(clickedIndex) {
    // Get neighbors of the empty space
    const neighborsOfEmpty = getNeighbors(emptyIndex);

    // If the clicked tile is adjacent to empty, swap them
    if (neighborsOfEmpty.includes(clickedIndex)) {
        // Move clicked tile to empty position
        tiles[emptyIndex] = tiles[clickedIndex];
        tiles[clickedIndex] = null;
        emptyIndex = clickedIndex;

        render();

        if (isSolved()) {
            setTimeout(showValentine, 500);
        }
    }
}

function isSolved() {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] !== i) return false;
    }
    return tiles[tiles.length - 1] === null;
}

function showValentine() {
    document.getElementById('puzzleView').classList.remove('active');
    document.getElementById('valentineView').classList.add('active');
}

function showCats() {
    document.getElementById('valentineView').classList.remove('active');
    document.getElementById('catsView').classList.add('active');
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init();
    document.getElementById('yesBtn').addEventListener('click', showCats);
});
