import { useState } from "react";
import './App.css';

function Square({ cssClass, value, onSquareClick }) {
  return (
    <button className={`${cssClass}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {  
  function handleClick(i, row, col) {
    const [winner, winColorArr] = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }    
    onPlay(nextSquares, [row, col]);
  }

  const [winner, winColorArr] = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } 
  else if (squares.includes(null)) {
    status = "Next player: " + (xIsNext ? "X" : "O");
  } else {
    status = "Draw!!!";
  }

  const numRow = 3;
  const numCol = 3;
  return (
    <>
      <div className="status">{status}</div>
      {[Array(numRow).fill(null).map((rowArrVal, rowArrIndex) => {        
        return  <div key={rowArrIndex} className="board-row">
          {[Array(numCol).fill(null).map((colArrVal, colArrIndex) => {
            let squareIndex = (numRow)*rowArrIndex + colArrIndex;            
            return <Square cssClass={winColorArr[squareIndex]==null ? "square" : "square win-color"} key={squareIndex} value={squares[squareIndex]} onSquareClick={() => handleClick(squareIndex, rowArrIndex, colArrIndex)} />
          })]}
      </div>
      })]}            
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([[Array(9).fill(null),0, [null, null]]]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const xIsNext = history[currentMoveIndex][1] % 2 === 0;
  const [isAscending, setIsAscending] = useState(1); // History list is Ascending
  const currentSquares = history[currentMoveIndex][0];

  function handlePlay(nextSquares, rowCol) {
    const currentMove = history[currentMoveIndex][1];
    const sliceHistory = history.filter(history => {
      return history[1]<=currentMove;
    })
    const nextHistory = [...sliceHistory, [nextSquares, currentMove + 1, rowCol]];    
    setHistory(nextHistory);
    setCurrentMoveIndex(nextHistory.length - 1);
  }

  function jumpTo(nextMove) { 
    history.forEach((val, index) => {
      if (val[1]===nextMove) {
        setCurrentMoveIndex(index);    
      }
    });
  }

  function sort() {
    let sortedHistory = null;    

    if (isAscending) {
      sortedHistory = history.sort((a, b) => {
        return b[1]-a[1];
      });    
    } 
    else {
      sortedHistory = history.sort((a, b) => {
        return a[1]-b[1];
      });
    }

    sortedHistory.forEach((val, index) => {
      if (val[1]===currentMoveIndex) {
        setCurrentMoveIndex(index);    
      }
    });

    setIsAscending((isAscending + 1) % 2);    
    setHistory(sortedHistory);
  }

  const moves = history.map(([squares ,move, [row, col]], index) => {
    let description;
    let cordinate = row!=null ? ` (${row}, ${col})` : "";
    if (move > 0) {
      description = "Go to move #" + move + cordinate;
    } else {
      description = "Go to game start";
    }

    if (index===currentMoveIndex) {
      description = "You are at move #" + move + cordinate;
    }

    return (
      <li key={index}>
        {(index===currentMoveIndex ? <div>{description}</div> : <button onClick={() => jumpTo(move)}>{description}</button>)}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => sort()}>Sắp xếp</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const winColorArr = [...Array(9).fill(null)]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {    
      winColorArr[a] = winColorArr[b] = winColorArr[c] = 1;      
      return [squares[a], winColorArr];
    }
  }
  return [null, []];
}
