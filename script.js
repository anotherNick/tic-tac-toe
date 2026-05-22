const Gameboard = (() => {

    let winner = false;
    let draw = false;
    let freeSpaceCount = 9;
    const gameboard = 
        [['', '', ''],
         ['', '', ''],
         ['', '', '']];
    
    const getGameboard = () => gameboard;

    const getElement = () => document.querySelector('#gameboard');

    const reset = () => {
        for(let row = 0; row < gameboard.length; row++){
            for(let col = 0; col < gameboard[row].length; col++){
                gameboard[row][col] = '';
            }
        }
        resetFreeSpaceCount();
        resetWinner();
    }

    const getFreeSpaces = () => freeSpaceCount;

    const resetFreeSpaceCount = () => { 
        freeSpaceCount = 9; 
        hasDraw = false; 
    };

    const removeFreeSpace = () => { freeSpaceCount--; }

    const placeToken = function(token, col, row){
        if(gameboard[row] !== undefined && gameboard[row][col] === ''){

            gameboard[row][col] = token;
            removeFreeSpace();
            checkForWinner(token);
            checkForDraw();
            return true;

        }

        return false;
    }
    
    const checkForDraw = () => { draw = (freeSpaceCount < 1);}

    const getDraw = () => draw;

    const getWinner = () => winner;

    const checkForWinner = function(token) {
     
        const gb = getGameboard();
   
        if( (gb[0][0] === token && gb[0][1] === token && gb[0][2] === token)
         || (gb[1][0] === token && gb[1][1] === token && gb[1][2] === token)
         || (gb[2][0] === token && gb[2][1] === token && gb[2][2] === token)
         || (gb[0][0] === token && gb[1][0] === token && gb[2][0] === token)
         || (gb[0][1] === token && gb[1][1] === token && gb[2][1] === token)
         || (gb[0][2] === token && gb[1][2] === token && gb[2][2] === token)
         || (gb[0][0] === token && gb[1][1] === token && gb[2][2] === token)
         || (gb[0][2] === token && gb[1][1] === token && gb[2][0] === token)
        ) {
            winner = true;
        }
    }

    const resetWinner = () => {

        winner = false;

    }

    return {getGameboard, getElement, placeToken, getWinner, getDraw, reset};

})();



function Players() {

    let currentPlayer = 0;

    const players = (() => {
        const playerOneName = document.querySelector('#player-one-name').value || 'Player One';
        const playerTwoName = document.querySelector('#player-two-name').value || 'Player Two';
        
        return [{name: playerOneName,
                 token: "O"},                     
                {name: playerTwoName,
                 token: "X"}];
        

    })();

    const getCurrentPlayer = () => players[currentPlayer];

    const switchPlayer = () => {

        currentPlayer = (currentPlayer === 0) ? 1 : 0;

    }
    
    return {getCurrentPlayer, switchPlayer};

}



const GameController = (() => {

    let players;
    let ongoingGame = false;

    const startNewGame = () => {

        Gameboard.reset();
        players = Players();
        ongoingGame = true;

    }

    const endGame = () => {

        ongoingGame = false;

    }

    const tryThisMove = (x, y) => {

        if(!ongoingGame) { startNewGame(); }

        let player = players.getCurrentPlayer();
        const token = player.token;
        
        if(Gameboard.placeToken(token, x, y)) {

            DisplayController.updateGameboard();

            if(Gameboard.getWinner()) {
                
                DisplayController.updateUserMessage(`${player.name} Wins!`);
                endGame();

            } else if(Gameboard.getDraw()) {
                
                DisplayController.updateUserMessage("It's a draw!");
                endGame();
            
            } else {

                players.switchPlayer();
                DisplayController.updateUserMessage(`${players.getCurrentPlayer().name} make your move!`)
            
            }

        }

}

    const gbElement = Gameboard.getElement();
    gbElement.addEventListener('click', (e) => {

        const x = e.target.closest('td').className.slice(-1);
        const y = e.target.closest('tr').className.slice(-1);
        tryThisMove(x, y);

    });

    const startButton = document.querySelector('#start-game');
    startButton.addEventListener('click', () => {

        startNewGame();
        DisplayController.updateGameboard();
        DisplayController.updateUserMessage(`${players.getCurrentPlayer().name} make your move!`)

    });


    return {startNewGame, tryThisMove};
})();



const DisplayController = (() => {

    const updateGameboard = () => {

        const gb = Gameboard.getGameboard();
        const gbDisplay = Gameboard.getElement();

        for(let r = 0; r < gb.length; r++){
            for(let c = 0; c < gb[r].length; c ++){
                
                const thisCell = '.row' + r + ' .col' + c + " span";
                const cell = gbDisplay.querySelector(thisCell);
                cell.textContent = gb[r][c];
            
            }
        }
    }

    const updateUserMessage = (msg) => {

        const messageDisplay = document.querySelector('#user-message');
        messageDisplay.textContent = msg;

    }

    return {updateGameboard, updateUserMessage};

})();
