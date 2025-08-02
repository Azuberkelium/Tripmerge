document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const gameOverDisplay = document.getElementById('game-over');
    const boardSize = 4;
    let board = [];
    let score = 0;

    function createBoard() {
        for (let i = 0; i < boardSize; i++) {
            board[i] = [];
            for (let j = 0; j < boardSize; j++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                gameBoard.appendChild(tile);
                board[i][j] = {
                    value: 0,
                    element: tile
                };
            }
        }
    }

    function spawnTile() {
        let emptyTiles = [];
        for (let j = 0; j < boardSize; j++) {
            if (board[0][j].value === 0) {
                emptyTiles.push(board[0][j]);
            }
        }

        if (emptyTiles.length > 0) {
            const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            randomTile.value = 3;
            updateBoard();
        } else {
            checkForGameOver();
        }
    }

    function updateBoard() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const tile = board[i][j];
                tile.element.textContent = tile.value === 0 ? '' : tile.value;
                tile.element.className = 'tile';
                if (tile.value !== 0) {
                    tile.element.classList.add(`tile-${tile.value}`);
                }
            }
        }
        scoreDisplay.textContent = score;
    }

    function checkForGameOver() {
        // Check for any empty tiles
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j].value === 0) return;
            }
        }

        // Check for possible moves
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize - 1; j++) {
                if (board[i][j].value === board[i][j + 1].value) return;
            }
        }
        for (let j = 0; j < boardSize; j++) {
            for (let i = 0; i < boardSize - 1; i++) {
                if (board[i][j].value === board[i + 1][j].value) return;
            }
        }

        gameOverDisplay.classList.remove('hidden');
    }

    function filterZeros(line) {
        return line.filter(val => val !== 0);
    }

    function mergeLine(line) {
        let filteredLine = filterZeros(line);
        let mergedLine = Array(boardSize).fill(0);
        let merged = false;

        for (let i = 0; i < filteredLine.length; i++) {
            if (i < filteredLine.length - 2 &&
                filteredLine[i] === filteredLine[i + 1] &&
                filteredLine[i] === filteredLine[i + 2]) {
                const newValue = filteredLine[i] * 3;
                score += newValue;
                mergedLine[mergedLine.indexOf(0)] = newValue;
                i += 2;
                merged = true;
            } else {
                mergedLine[mergedLine.indexOf(0)] = filteredLine[i];
            }
        }
        return { mergedLine: mergedLine, merged: merged };
    }

    function move(direction) {
        let moved = false;
        let newBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(0));
        
        for (let i = 0; i < boardSize; i++) {
            let line = [];
            if (direction === 'up' || direction === 'down') {
                for (let j = 0; j < boardSize; j++) {
                    line.push(board[j][i].value);
                }
            } else { // 'left' or 'right'
                for (let j = 0; j < boardSize; j++) {
                    line.push(board[i][j].value);
                }
            }

            if (direction === 'down' || direction === 'right') {
                line.reverse();
            }

            const { mergedLine, merged } = mergeLine(line);

            if (direction === 'down' || direction === 'right') {
                mergedLine.reverse();
            }
            
            if (direction === 'up' || direction === 'down') {
                for (let j = 0; j < boardSize; j++) {
                    if (board[j][i].value !== mergedLine[j]) {
                        board[j][i].value = mergedLine[j];
                        moved = true;
                    }
                }
            } else { // 'left' or 'right'
                for (let j = 0; j < boardSize; j++) {
                    if (board[i][j].value !== mergedLine[j]) {
                        board[i][j].value = mergedLine[j];
                        moved = true;
                    }
                }
            }
        }
        
        if (moved) {
            spawnTile();
        }
        updateBoard();
        checkForGameOver();
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault(); // Prevents page scrolling
            move(e.key.replace('Arrow', '').toLowerCase());
        }
    });

    // Initialize the game
    createBoard();
    spawnTile();
});
