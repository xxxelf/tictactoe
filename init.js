"use strict";
//Variables in the Global Scope
var origBoard;
var huPlayer = "O";
var aiPlayer = "X";
var winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];
//gameCreator
function Game() {
  var self = this;
  self.huScore = document.getElementById("huScore").innerText = "0";
  self.aiScore = document.getElementById("aiScore").innerText = "0";
  self.startGame = function() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
      cells[i].innerText = "";
      cells[i].style.removeProperty("background-color");
      cells[i].addEventListener("click", self.turnClick, false);
    }
  };
  //clicking the tile and running miniMax algorithm
  self.turnClick = function(square) {
    if (typeof origBoard[square.target.id] == "number") {
      self.turn(square.target.id, huPlayer);
      if (!self.checkWin(origBoard, huPlayer) && !self.checkTie())
        self.turn(self.bestSpot(), aiPlayer);
    }
  };
  //writes X or O in the squares
  self.turn = function(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    var gameWon = self.checkWin(origBoard, player);
    if (gameWon) self.gameOver(gameWon);
  };
  //checking if a player won
  self.checkWin = function(board, player) {
    var plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
    var gameWon = null;
    for (var [index, win] of winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: player };
        break;
      }
    }
    return gameWon;
  };
  //player looses AI wins = gameOver return message for loosers
  self.gameOver = function(gameWon) {
    for (var index of winCombos[gameWon.index]) {
      document.getElementById(index).style.backgroundColor =
        gameWon.player == huPlayer ? "blue" : "yellow";
    }
    for (var i = 0; i < cells.length; i++) {
      cells[i].removeEventListener("click", self.turnClick, false);
    }
    self.declareWinner(
      gameWon.player == huPlayer ? "You win!" : "AI for the Win."
    );
    self.aiScore += 1;
  };
  //creating end game Window + Text win or loose! used in checkTie or gameover functions
  self.declareWinner = function(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
  };
  //emty all squares
  self.emptySquares = function() {
    return origBoard.filter(s => typeof s == "number");
  };
  //find out the best spot for the next move
  self.bestSpot = function() {
    return self.minimax(origBoard, aiPlayer).index;
  };
  //player ties with AI = add to human score and return message!
  self.checkTie = function() {
    if (self.emptySquares().length == 0) {
      for (var i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = "blue";
        cells[i].removeEventListener("click", self.turnClick, false);
      }
      self.declareWinner("As good as it gets for you puny Human!");
      self.huScore += 1;
      return true;
    }
    return false;
  };
  //MiniMax Algorithm to calculate best AI move possible!
  self.minimax = function(newBoard, player) {
    var availSpots = self.emptySquares(newBoard);
    if (self.checkWin(newBoard, huPlayer)) {
      return { score: -10 };
    } else if (self.checkWin(newBoard, aiPlayer)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
      var move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player == aiPlayer) {
        var result = self.minimax(newBoard, huPlayer);
        move.score = result.score;
      } else {
        var result = self.minimax(newBoard, aiPlayer);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;

      moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      var bestScore = 10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  };
}
const cells = document.querySelectorAll(".cell");
var theGame = new Game();
theGame.startGame();
