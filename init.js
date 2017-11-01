"use strict";
const cells = document.querySelectorAll(".cell");
var theGame = new Game();
function init() {
  theGame.startGame();
}

document.addEventListener("DOMContentLoaded", init);
