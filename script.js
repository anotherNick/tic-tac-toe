const Gameboard = (() => {

    let winner = false;
    let draw = false;
    let freeSpaceCount = 9;
    const gameboard = 
        [['', '', ''],
         ['', '', ''],
         ['', '', '']];
    
    const getGameboard = () => gameboard;

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

    return {getGameboard, placeToken, getWinner, getDraw, reset};

})();



function Players(playerOneName = "Player One", playerTwoName = "Player Two") {

    let currentPlayer = 0;
    const players = [{name: playerOneName,
                      token: "O"},                     
                     {name: playerTwoName,
                      token: "X"}];

    const getCurrentPlayer = () => players[currentPlayer];

    const switchPlayer = () => {

        currentPlayer = (currentPlayer === 0) ? 1 : 0;

    }
    
    return {getCurrentPlayer, switchPlayer};

}



const GameController = (() => {

    let players;

    const startNewGame = () => {

        Gameboard.reset();
        players = Players();

    }

    const tryThisMove = (x, y) => {

        const player = players.getCurrentPlayer();
        const token = player.token;
        
        if(Gameboard.placeToken(token, x, y)) {

            DisplayController.updateGameboard();

            if(Gameboard.getWinner()) {
                
                alert(`${player.name} Wins!`);
                startNewGame();

            } else if(Gameboard.getDraw()) {
                
                alert("It's a draw!");
                startNewGame();
            
            } else {

                players.switchPlayer();
            
            }

        }

}

    return {startNewGame, tryThisMove};
})();



const DisplayController = (() => {

    const updateGameboard = () => {

        const gameboard = Gameboard.getGameboard();

        for(let r = 0; r < gameboard.length; r++){
            
            for(let c = 0; c < gameboard[r].length; c ++){
                
                const thisCell = '.row' + r + ' .col' + c + " span";
                const cell = document.querySelector(thisCell);
                cell.textContent = gameboard[r][c];
            
            }
        
        }

    }

    return {updateGameboard}

})();


const boardDisplay = document.querySelector('#gameboard');
boardDisplay.addEventListener('click', (e) => {

    const x = e.target.closest('td').className.slice(-1);
    const y = e.target.closest('tr').className.slice(-1);
    GameController.tryThisMove(x, y);

})

GameController.startNewGame();