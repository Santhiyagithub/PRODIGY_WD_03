document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.getElementById("reset-button");
    const gameModeSelect = document.getElementById("game-mode");
    const themeSelect = document.getElementById("theme-select");
    const xWinsElement = document.getElementById("x-wins");
    const oWinsElement = document.getElementById("o-wins");
    const tiesElement = document.getElementById("ties");

    let currentPlayer = "X";
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameMode = gameModeSelect.value;
    let xWins = 0;
    let oWins = 0;
    let ties = 0;
    let isGameActive = true;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    gameModeSelect.addEventListener("change", () => {
        gameMode = gameModeSelect.value;
        resetGame();
    });

    themeSelect.addEventListener("change", () => {
        document.body.className = `theme-${themeSelect.value}`;
    });

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

        if (gameState[clickedCellIndex] !== "" || !isGameActive) {
            return;
        }

        makeMove(clickedCell, clickedCellIndex, currentPlayer);
        checkForWinner();
        if (isGameActive) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            if (gameMode === "ai" && currentPlayer === "O") {
                aiMove();
            }
        }
    }

    function makeMove(cell, index, player) {
        gameState[index] = player;
        cell.textContent = player;
    }

    function aiMove() {
        let availableCells = [];
        gameState.forEach((cell, index) => {
            if (cell === "") {
                availableCells.push(index);
            }
        });

        if (availableCells.length === 0) {
            return;
        }

        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        const cell = document.querySelector(`.cell[data-index='${randomIndex}']`);
        makeMove(cell, randomIndex, currentPlayer);
        checkForWinner();
        currentPlayer = "X";
    }

    function checkForWinner() {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];

            if (a === "" || b === "" || c === "") {
                continue;
            }

            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            alert(`Player ${currentPlayer} has won!`);
            isGameActive = false;
            updateScoreboard(currentPlayer);
            return;
        }

        if (!gameState.includes("")) {
            alert("It's a tie!");
            isGameActive = false;
            updateScoreboard("tie");
        }
    }

    function updateScoreboard(result) {
        if (result === "X") {
            xWins++;
            xWinsElement.textContent = xWins;
        } else if (result === "O") {
            oWins++;
            oWinsElement.textContent = oWins;
        } else if (result === "tie") {
            ties++;
            tiesElement.textContent = ties;
        }
    }

    function resetGame() {
        gameState = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        isGameActive = true;
        cells.forEach(cell => cell.textContent = "");
    }

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    resetButton.addEventListener("click", resetGame);
});
