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
            // No empty tiles in the top row, which could lead to a game over
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
        // Check if there are any empty tiles
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j].value === 0) return;
            }
        }

        // Check for possible moves
        // (This is a simplified check, a more robust one would check all directions)
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize - 1; j++) {
                if (board[i][j].value === board[i][j+1].value && board[i][j].value !== 0) return;
            }
        }
        
        for (let i = 0; i < boardSize - 1; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j].value === board[i+1][j].value && board[i][j].value !== 0) return;
            }
        }

        gameOverDisplay.classList.remove('hidden');
    }

    function moveTiles(direction) {
        let moved = false;
        if (direction === 'down') {
            for (let j = 0; j < boardSize; j++) {
                let column = [];
                for (let i = 0; i < boardSize; i++) {
                    if (board[i][j].value !== 0) column.push(board[i][j].value);
                }

                column = mergeColumn(column);

                for (let i = 0; i < boardSize; i++) {
                    let newValue = column[i] || 0;
                    if (board[i][j].value !== newValue) {
                        board[i][j].value = newValue;
                        moved = true;
                    }
                }
            }
        }
        // You'd need to add logic for 'up', 'left', 'right' directions here.
        // For simplicity, this example only handles 'down'.
        // The logic for other directions would be similar, but with different loops and array manipulation.

        if (moved) {
            spawnTile();
        }
        updateBoard();
        checkForGameOver();
    }

    function mergeColumn(column) {
        const newColumn = Array(boardSize).fill(0);
        let k = boardSize - 1;

        for (let i = column.length - 1; i >= 0; i--) {
            newColumn[k--] = column[i];
        }

        for (let i = boardSize - 1; i >= 2; i--) {
            if (newColumn[i] === newColumn[i-1] && newColumn[i] === newColumn[i-2] && newColumn[i] !== 0) {
                const newValue = newColumn[i] * 3;
                score += newValue;
                newColumn[i] = newValue;
                newColumn[i-1] = 0;
                newColumn[i-2] = 0;
            }
        }

        // Re-pack the column after merging
        const filteredColumn = newColumn.filter(val => val !== 0);
        const packedColumn = Array(boardSize - filteredColumn.length).fill(0).concat(filteredColumn);
        return packedColumn;
    }

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowDown':
                moveTiles('down');
                break;
            // Add cases for other arrow keys here
            // case 'ArrowUp':
            //     moveTiles('up');
            //     break;
            // case 'ArrowLeft':
            //     moveTiles('left');
            //     break;
            // case 'ArrowRight':
            //     moveTiles('right');
            //     break;
        }
    });
    
    // Initialize the game
    createBoard();
    spawnTile();
});
