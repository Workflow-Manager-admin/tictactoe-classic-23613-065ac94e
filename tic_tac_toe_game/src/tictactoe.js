//
// PUBLIC_INTERFACE
// Main TicTacToe Classic game container for Vite JS
//
// Features: 3x3 grid, two player mode, win/draw logic, reset, themed styling
//

// Generates and manages the main container for the game
export function createTicTacToeApp({ mountId = "app" } = {}) {
  // State
  let board = Array(9).fill(null);
  let xIsNext = true;
  let winner = null;
  let finished = false;

  // Theme
  const colors = {
    primary: "#ffffff",
    secondary: "#222222",
    accent: "#4caf50",
  };

  // Create root container
  const root = document.createElement("div");
  root.className = "ttt-root-container";

  // Helper: get current player symbol
  function currentSymbol() {
    return xIsNext ? "X" : "O";
  }

  // Detect a winner or draw
  // PUBLIC_INTERFACE
  function calculateWinner(squares) {
    /**
     * Returns {winner: <"X"|"O"|null>, winLine: <Array of indexes>|null}
     */
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], winLine: line };
      }
    }
    return {
      winner: null,
      winLine: null,
    };
  }

  // UI: Status message area
  const statusElem = document.createElement("div");
  statusElem.className = "ttt-status";
  function updateStatus() {
    if (winner) {
      statusElem.textContent = `Winner: ${winner} 🎉`;
    } else if (finished) {
      statusElem.textContent = "It's a draw! 🤝";
    } else {
      statusElem.textContent = `Next Player: ${currentSymbol()}`;
    }
  }

  // UI: Grid (3x3)
  const grid = document.createElement("div");
  grid.className = "ttt-board";

  // UI: Cells
  function renderGrid() {
    grid.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("button");
      cell.className = "ttt-cell";
      cell.setAttribute("data-idx", i);
      cell.setAttribute("aria-label", `Cell ${i + 1}`);
      cell.disabled = !!board[i] || finished;
      cell.textContent = board[i] || "";
      cell.onclick = () => handleMove(i);
      grid.appendChild(cell);
    }
  }

  // UI: Reset
  const resetBtn = document.createElement("button");
  resetBtn.className = "ttt-reset-btn";
  resetBtn.textContent = "Reset Game";
  resetBtn.onclick = resetGame;

  // Logic: When a user clicks a cell
  function handleMove(idx) {
    if (board[idx] || finished) return; // ignore filled/final
    board[idx] = currentSymbol();
    const outcome = calculateWinner(board);
    if (outcome.winner) {
      winner = outcome.winner;
      finished = true;
    } else if (board.every((x) => x)) {
      finished = true;
      winner = null;
    } else {
      xIsNext = !xIsNext;
    }
    renderGrid();
    updateStatus();
  }

  // Reset logic
  // PUBLIC_INTERFACE
  function resetGame() {
    board = Array(9).fill(null);
    xIsNext = true;
    winner = null;
    finished = false;
    renderGrid();
    updateStatus();
  }

  // Assemble layout
  root.appendChild(statusElem);
  root.appendChild(grid);
  root.appendChild(resetBtn);

  // Initial styles (component-scoped)
  if (!document.getElementById("ttt-styles")) {
    const style = document.createElement("style");
    style.id = "ttt-styles";
    style.innerHTML = `
      .ttt-root-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: ${colors.primary};
        color: ${colors.secondary};
        min-height: 100vh;
        padding: 1.5rem;
        font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
      }
      .ttt-board {
        display: grid;
        grid-template-columns: repeat(3, 60px);
        grid-template-rows: repeat(3, 60px);
        gap: 10px;
        background: ${colors.secondary};
        padding: 20px;
        border-radius: 14px;
        margin-bottom: 1.8rem;
        box-shadow: 0 6px 40px rgba(34,34,34,0.05);
      }
      .ttt-cell {
        width: 60px;
        height: 60px;
        font-size: 1.7rem;
        font-weight: 600;
        background: ${colors.primary};
        color: ${colors.secondary};
        border: 2px solid ${colors.accent};
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s, box-shadow 0.23s;
        outline: none;
      }
      .ttt-cell:disabled {
        color: #bdbdbd;
        background: #f5f5f5;
        cursor: default;
        opacity: 1;
      }
      .ttt-status {
        margin-bottom: 1.4rem;
        font-size: 1.25rem;
        min-height: 2rem;
        letter-spacing: 0.02em;
      }
      .ttt-reset-btn {
        background: ${colors.accent};
        color: #fff;
        border: none;
        padding: 0.65em 1.8em;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 7px;
        box-shadow: 0 3px 12px rgba(76,175,80,0.13);
        margin-top: 0.6rem;
        cursor: pointer;
        letter-spacing: 0.04em;
        transition: background 0.18s;
      }
      .ttt-reset-btn:hover {
        background: #43a047;
      }
      @media (max-width: 600px) {
        .ttt-board { 
            grid-template-columns: repeat(3, 44px);
            grid-template-rows: repeat(3, 44px);
            padding: 10px;
            gap: 5px; 
        }
        .ttt-cell { width: 44px; height: 44px; font-size: 1.23rem;}
      }
    `;
    document.head.appendChild(style);
  }

  // Mount in page
  function mount() {
    const container = document.getElementById(mountId);
    if (container) {
      container.innerHTML = ""; // clear previous if any
      container.appendChild(root);
      renderGrid();
      updateStatus();
    }
  }

  // Provide mount/unmount public
  // PUBLIC_INTERFACE
  return {
    mount,
    resetGame,
    // For testing or advanced use:
    _debugGetState: () => ({ board: [...board], xIsNext, winner, finished }),
  };
}
