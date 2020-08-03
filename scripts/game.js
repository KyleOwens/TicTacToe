const gameController = (() => {
    let gameBoard = [0,0,0,0,0,0,0,0,0];
    let currentPlayer;
    let lastPlayer;
    let gameMode;
    let disabled = false;
    let p1
    let p2

    const beginGame = (gameSetting, player1, player2) => {
        p1 = Player(player1, 'X');
        p2 = Player(player2, 'O');
        currentPlayer = p1;
        lastPlayer = p2;
        gameMode = gameSetting;
    }

    const resetGame = () => {
        gameBoard = [0,0,0,0,0,0,0,0,0]
        disabled = false;
        currentPlayer = p1;
        lastPlayer = p2;
    }

    const playMove = (gridIndex) => {
        gameBoard[gridIndex] = getCurrentMove();
        swapCurrentMove()
    }

    const getCurrentMove = () => {
        return currentPlayer.getMove();
    }

    const getLastMove = () => {
        return lastPlayer.getMove();
    }

    const getCurrentPlayer = () => {
        return currentPlayer.getName();
    }

    const getLastPlayer = () => {
        return lastPlayer.getName();
    }

    const swapCurrentMove = () => {
        const tempPlayer = currentPlayer;
        currentPlayer = lastPlayer;
        lastPlayer = tempPlayer;
    }

    const checkForWin = (gridIndex) => {
        let row = Math.floor(gridIndex/3);
        let column = gridIndex % 3;

        if(checkColumn(column) || checkRow(row) || checkDiagonals()){
            disabled = true;
            return true;
        } else {
            return false;
        }
    }

    const checkForTie = (index) => {
        let tie = true;

        if(checkForWin(index)){
            return false;
        }
        gameBoard.forEach((square) => {
            if (square === 0){
                console.log(square);
                tie = false;
            }
        })
        
        if (tie){
            disable = true;
        }
        return tie;
    }

    const getGameMode = () => {
        return gameMode;
    }

    const isDisabled = () => {
        return disabled;
    }

    const checkColumn = (column) => {
        if(gameBoard[column] === getLastMove() && gameBoard[column + 3] === getLastMove() && gameBoard[column + 6] === getLastMove()){
            return true;
        } else {
            return false;
        }
    }

    const checkRow = (row) => {
        let startIndex = row*3
        if(gameBoard[startIndex] === getLastMove() && gameBoard[startIndex + 1] === getLastMove() && gameBoard[startIndex + 2] === getLastMove()){
            return true;
        } else {
            return false;
        }
    }

    const checkDiagonals = () => {
        if(gameBoard[0] === getLastMove() && gameBoard[4] === getLastMove() && gameBoard[8] === getLastMove()){
            return true;
        } else if (gameBoard[2] === getLastMove() && gameBoard[4] === getLastMove() && gameBoard[6] === getLastMove()){
            return true;
        } else {
            return false;
        }
    }

    const computerMove = () => {
        let moved = false;

        while (!moved) {
            let index = Math.floor(Math.random() * (8 - 0 + 1) + 0);

            if(gameBoard[index] === 0){
                playMove(index)
                moved = true;

                return index;
            }
        }
    }

    return{
        beginGame,
        resetGame,
        getCurrentMove,
        getLastMove,
        getCurrentPlayer,
        getLastPlayer,
        isDisabled,
        playMove,
        checkForWin,
        getGameMode,
        computerMove,
        checkForTie
    }
})();


const displayController = ((gameController) => {
    const titleScreen = document.querySelector('#title-screen');
    const titleModal = document.querySelector('.pop-up')
    const modalForm = document.querySelector('.pop-up form')
    const modalCancel = document.querySelector('#cancel');
    const player1Input = document.querySelector('#player1');
    const player2Input = document.querySelector('#player2');
    const gameBoard = document.querySelector('.game-board')
    const gameGrid = document.querySelector('.game-grid');
    const gameSquares = Array.from(document.querySelectorAll('td'));
    const turnIndicator = document.querySelector('.turn-indicator');
    const computerTile = document.querySelector('#pvc');
    const playerTile = document.querySelector('#pvp')
    const mainMenuButton = document.querySelector('#main-menu');
    const resetButton = document.querySelector('#reset-game');

    computerTile.addEventListener('click', (e) => {
            toggleTitleScreen();
            toggleGameBoard();
            gameController.beginGame('pvc', 'Player', 'Computer');
            updateStatus(gameController.getCurrentPlayer() + "'s turn!");
    });

    playerTile.addEventListener('click', (e) => {
        titleModal.style.display = 'block';
    });

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        titleModal.style.display = 'none';
        toggleTitleScreen();
        toggleGameBoard();
        gameController.beginGame('pvp', player1Input.value, player2Input.value);
        modalForm.reset();
        updateStatus(gameController.getCurrentPlayer() + "'s turn!")
    });

    modalCancel.addEventListener('click', (e) => {
        titleModal.style.display = 'none';
        modalForm.reset();
    });

    gameSquares.forEach(square => {
        square.addEventListener('mouseover', (e) => {
            if(!e.target.classList.contains('selected') && !gameController.isDisabled()){
                e.target.textContent = gameController.getCurrentMove();
            }
        });
        square.addEventListener('mouseleave', (e) => {
            if(!e.target.classList.contains('selected') && !gameController.isDisabled()){
                e.target.textContent = '';
            }
        });
        square.addEventListener('click', (e) => {
            if(!gameController.isDisabled()){                
                e.target.textContent = gameController.getCurrentMove();
                e.target.classList.add('selected');
                gameController.playMove(e.target.id);
                updateStatus(gameController.getCurrentPlayer() + "'s turn!")
                
                if (gameController.checkForWin(e.target.id)){
                    updateStatus(gameController.getLastPlayer() + ' WINS')
                }

                if (gameController.checkForTie(e.target.id)){
                    updateStatus('Tie game!')
                }

                if (!gameController.checkForWin(e.target.id) && gameController.getGameMode() === 'pvc' && gameController.getCurrentPlayer() === 'Computer' && !gameController.checkForTie()){
                    let index = gameController.computerMove();

                    gameSquares.forEach(square => {
                        if (square.id == index){
                            square.textContent = 'O';
                            square.classList.add('selected');
                            if (gameController.checkForWin(index)){
                                updateStatus(gameController.getLastPlayer() + ' WINS')
                            }
                            if (gameController.checkForTie(index)){
                                updateStatus('Tie game!')
                            }
                        }
                    });
                }
            }
        });
    });

    mainMenuButton.addEventListener('click', () => {
        toggleTitleScreen();
        toggleGameBoard();
        gameController.resetGame();
        resetBoard();
    });

    resetButton.addEventListener('click', () => {
        gameController.resetGame()
        resetBoard()
    })

    const toggleTitleScreen = () => {
        !titleScreen.classList.contains('hide-left') ? titleScreen.classList.add('hide-left') : titleScreen.classList.remove('hide-left');     
    }

    const toggleGameBoard = () => {
        !gameBoard.classList.contains('hide-right') ? gameBoard.classList.add('hide-right') : gameBoard.classList.remove('hide-right')
    }

    const updateStatus = (text) => {
        turnIndicator.textContent = text
    }

    const resetBoard = () => {
        gameSquares.forEach((square) => {
            square.textContent = '';
            square.classList.remove('selected')
            updateStatus(gameController.getCurrentPlayer() + "'s turn!")
        });
    }

    return {
        toggleTitleScreen, 
        toggleGameBoard}
})(gameController);

const Player = (playerName, moveIndicator) => {
    const name = playerName;
    const move = moveIndicator;

    const getName = () => {
        return name;
    }

    const getMove = () => {
        return move;
    }

    return {getName, getMove}
}



