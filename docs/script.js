import { Puzzle } from "./puzzle.js";

var puzzle = Puzzle();

var currentCell = null;
var direction = 0;
var rebus = false;
var shade = "lightgrey";

function advanceCell(x, y) { if (direction) { moveDown(x, y); } else { moveRight(x, y); } }
function retreatCell(x, y) { if (direction) { moveUp(x, y); } else { moveLeft(x, y); } }
function updateCurrentCell(event) { currentCell = getElementXY(event.target); }

function getElementXY(element) { return [parseInt(element.getAttribute("data-x")), parseInt(element.getAttribute("data-y"))]; }
function getInput(x, y) { return document.getElementById("input-" + x + "-" + y); }
function getBottomInput(x, y) { if (y < puzzle.height - 1) { return getInput(x, y + 1); } else { return null; } }
function getLeftInput(x, y) { if (x > 0) { return getInput(x - 1, y); } else { return null; } }
function getRightInput(x, y) { if (x < puzzle.width - 1) { return getInput(x + 1, y); } else { return null; } }
function getTopInput(x, y) { if (y > 0) { return getInput(x, y - 1); } else { return null; } }

function getAnswerFontSize(answer) {
  let fontSize = puzzle.grid.fontSize;
  if (answer.length == 2) { fontSize = 20.0; }
  else if (answer.length == 3) { fontSize = 14.0; }
  else if (answer.length == 4) { fontSize = 10.0; }
  else if (answer.length == 5) { fontSize = 8.0; }
  return fontSize;
}

function getAuthor() { return document.getElementById("puzzle-author").value; }
function getDate() { return document.getElementById("puzzle-date").value; }
function getHeight() { return document.getElementById("puzzle-height").value; }
function getTitle() { return document.getElementById("puzzle-title").value; }
function getWidth() { return document.getElementById("puzzle-width").value; }

function setAuthor() { document.getElementById("puzzle-author").value = puzzle.author; }
function setDate() { document.getElementById("puzzle-date").value = puzzle.date; }
function setHeight() { document.getElementById("puzzle-height").value = puzzle.height; }
function setTitle() { document.getElementById("puzzle-title").value = puzzle.title; }
function setWidth() { document.getElementById("puzzle-width").value = puzzle.width; }

function setBlock(x, y) { puzzle.grid.cell(x, y).block = true; }
function setEmpty(x, y) { puzzle.grid.cell(x, y).empty = true; }

function unsetBlock(x, y) { puzzle.grid.cell(x, y).block = false; }
function unsetEmpty(x, y) { puzzle.grid.cell(x, y).empty = false; }


function clickCommands(event) {
  var [x, y] = getElementXY(event.target);
  switch (true) {

    case event.altKey:
      console.log("Alt-click");
      toggleTopBar(x, y);
      break;

    case event.ctrlKey:
      console.log("Ctrl-click");
      break;

    case event.metaKey:
      console.log("Meta-click");
      toggleLeftBar(x, y);
      break;

    case event.shiftKey:
      console.log("Shift-click");
      toggleShadeSquare(x, y);
      break;

    default:
      break;
  }
}

function doubleClickCommands(event) {
  var [x, y] = getElementXY(event.target);
  switch (true) {

    case event.altKey:
      console.log("Alt-double-click");
      break;

    case event.ctrlKey:
      console.log("Ctrl-double-click");
      break;

    case event.metaKey:
      console.log("Meta-double-click");
      break;

    case event.shiftKey:
      console.log("Shift-double-click");
      break;

    default:
      console.log("Double-click");
      disableEmptyCell(x, y);
      break;
  }
}


function createGrid() {
  puzzle.initializeGrid(puzzle.width, puzzle.height);
  refreshGrid();
  document.getElementById("create-grid-button").style.display = "none";
}

function createInput(x, y) {
  let input = document.createElement("input");
  input.id = "input-" + x + "-" + y;
  input.setAttribute("data-x", x);
  input.setAttribute("data-y", y);
  input.type = "text";

  // add the answer
  let answer = puzzle.grid.cell(x, y).answer;
  if (answer) { input.value = answer; }

  let fontSize = getAnswerFontSize(answer);

  // set the styles
  input.style.border = "0px";
  input.style.boxSizing = "border-box";
  input.style.fontSize = fontSize + "px";
  input.style.height = "100%";
  input.style.padding = 0;
  input.style.textAlign = "center";
  input.style.verticalAlign = "middle";
  input.style.width = "100%";

  // add event listeners
  input.addEventListener("click", clickCommands);
  // input.addEventListener("dblclick", doubleClickCommands);
  input.addEventListener("focusin", updateCurrentCell);
  input.addEventListener("focusout", updateAnswer);
  input.addEventListener("keydown", keyboardCommands);

  return input;
}

//
// Blocks
//
function disableBlock(x, y) {
  let input = getInput(x, y);
  puzzle.grid.cell(x, y).answer = "";
  puzzle.grid.cell(x, y).block = false;
  puzzle.grid.cell(x, y).empty = false;
  input.style.display = "inline-block";
  input.parentElement.style.backgroundColor = "rgba(0, 0, 0, 0)";
  console.log("Disabled block for: " + x + ", " + y);
}

function enableBlock(x, y) {
  let input = getInput(x, y);
  puzzle.grid.cell(x, y).answer = false;
  puzzle.grid.cell(x, y).block = true;
  puzzle.grid.cell(x, y).empty = false;
  input.style.display = "none";
  input.value = "";
  input.parentElement.style.backgroundColor = "black";
  console.log("Enabled block for: " + x + ", " + y);
}

function toggleBlock(x, y) {
  if (puzzle.grid.cell(x, y).block) { disableBlock(x, y); } else { enableBlock(x, y); }
}

//
// Empty Cells
//
function disableEmptyCell(x, y) {
  let input = getInput(x, y);
  puzzle.grid.cell(x, y).answer = "";
  puzzle.grid.cell(x, y).block = false;
  puzzle.grid.cell(x, y).empty = false;
  input.style.display = "inline-block";
  input.parentElement.style.backgroundColor = "rgba(0, 0, 0, 0)";
  console.log("Disabled empty for: " + x + ", " + y);
}

function enableEmptyCell(x, y) {
  let input = getInput(x, y);
  puzzle.grid.cell(x, y).answer = false;
  puzzle.grid.cell(x, y).block = false;
  puzzle.grid.cell(x, y).empty = true;
  input.style.display = "none";
  input.value = "";
  console.log("Enabled empty for: " + x + ", " + y);
}

function toggleEmptyCell(x, y) {
  if (puzzle.grid.cell(x, y).empty) { disableEmptyCell(x, y); } else { enableEmptyCell(x, y); }
}


//
// Bottom Bars
//


//
// Left Bars
//
function disableLeftBar(x, y) {
  if (x == 0) { return; }
  let input = getInput(x, y);
  let leftInput = getLeftInput(x, y);
  puzzle.grid.leftCell(x, y).rightBar = false;
  input.parentElement.style.borderLeft = puzzle.grid.gridLineWidth + "px solid black";
  leftInput.parentElement.style.borderRight = puzzle.grid.gridLineWidth + "px solid black";
  console.log("Disabled left bar for: " + x + ", " + y);
}

function enableLeftBar(x, y) {
  if (x == 0) { return; }
  let input = getInput(x, y);
  let leftInput = getLeftInput(x, y);
  puzzle.grid.leftCell(x, y).rightBar = true;
  input.parentElement.style.borderLeft = puzzle.grid.borderWidth + "px solid black";
  leftInput.parentElement.style.borderRight = puzzle.grid.borderWidth + "px solid black";
  console.log("Enabled left bar for: " + x + ", " + y);
}

function toggleLeftBar(x, y) {
  if (x == 0) { return; }
  if (puzzle.grid.leftCell(x, y).rightBar) { disableLeftBar(x, y); } else { enableLeftBar(x, y); }
}

//
// Right Bars
//

//
// Top Bars
//
function disableTopBar(x, y) {
  if (y == 0) { return; }
  let input = getInput(x, y);
  let topInput = getTopInput(x, y);
  puzzle.grid.topCell(x, y).bottomBar = false;
  input.parentElement.style.borderTop = puzzle.grid.gridLineWidth + "px solid black";
  topInput.parentElement.style.borderBottom = puzzle.grid.gridLineWidth + "px solid black";
  console.log("Disabled top bar for: " + x + ", " + y);
}

function enableTopBar(x, y) {
  if (y == 0) { return; }
  let input = getInput(x, y);
  let topInput = getTopInput(x, y);
  puzzle.grid.cell(x, y - 1).bottomBar = true;
  input.parentElement.style.borderTop = puzzle.grid.borderWidth + "px solid black";
  topInput.parentElement.style.borderBottom = puzzle.grid.borderWidth + "px solid black";
  console.log("Enabled top bar for: " + x + ", " + y);
}

function toggleTopBar(x, y) {
  if (y == 0) { return; }
  if (puzzle.grid.cell(x, y - 1).bottomBar) { disableTopBar(x, y); } else { enableTopBar(x, y); }
}

//
// Shade Squares
//
function disableShadeSquare(x, y) {
  let input = getInput(x, y);
  puzzle.grid.cell(x, y).shadeSquare = false;
  input.style.backgroundColor = "rgba(0, 0, 0, 0)";
  input.parentElement.style.backgroundColor = "rgba(0, 0, 0, 0)";
  console.log("Disabled shade square for: " + x + ", " + y);
}

function enableShadeSquare(x, y) {
  let input = getInput(x, y);
  puzzle.grid.cell(x, y).shadeSquare = true;
  input.style.backgroundColor = shade;
  input.parentElement.style.backgroundColor = shade;
  console.log("Enabled shade square for: " + x + ", " + y);
}

function toggleShadeSquare(x, y) {
  if (puzzle.grid.cell(x, y).shadeSquare) { disableShadeSquare(x, y); } else { enableShadeSquare(x, y); }
}

function initializePuzzle() {
  setAuthor();
  setTitle();
  setDate();
  setWidth();
  setHeight();
}

function keyboardCommands(event) {
  let [x, y] = getElementXY(event.target);

  if (rebus) {
    return;
  }

  switch (event.key) {

    case "ArrowRight":
      moveRight(x, y);
      event.preventDefault();
      break;

    case "ArrowLeft":
      moveLeft(x, y);
      event.preventDefault();
      break;

    case "ArrowDown":
      moveDown(x, y);
      event.preventDefault();
      break;

    case "ArrowUp":
      moveUp(x, y);
      event.preventDefault();
      break;

    case "Backspace":
      if (event.target.value.length == 0) {
        event.target.value = "";
        retreatCell(x, y);
      }
      break;

    case "Delete":
    case ".": // Period
      puzzle.grid.cell(x, y).empty = true;
      enableEmptyCell(x, y);
      break;

    case "Enter":
      if (event.metaKey) {
        if (direction) {
          if (y > 0) {
            toggleLeftBar(x, y);
          }
        }
        else {
          if (x > 0) {
            toggleTopBar(x, y);
          }
        }
      } else {
        if (direction) {
          if (y > 0) {
            toggleTopBar(x, y);
          }
        }
        else {
          if (x > 0) {
            toggleLeftBar(x, y);
          }
        }
      }
      break;

    case "Insert":
    case ",": // Comma
    case "#": // Hash
      toggleBlock(x, y);
      advanceCell(x, y);
      event.preventDefault();
      break;

    case "Tab":
    case " ": // Space
      if (event.shiftKey) { retreatCell(x, y); } else { advanceCell(x, y); }
      event.preventDefault();
      break;

    case "/": // Slash
      toggleDirection();
      event.preventDefault();
      break;

    default:
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      if (/^[a-zA-Z0-9]$/.test(event.key)) {
        event.target.value = event.key.toUpperCase();
        advanceCell(x, y);
        event.preventDefault();
        return
      }
      console.log("Unhandled key: " + event.key)
      break;
  }
}

function moveRight(x, y) {
  let rightInput = getRightInput(x, y);
  if (rightInput) {
    rightInput.focus();
  } else {
    // move to beginning of next row
    if (y < puzzle.height - 1) {
      getInput(0, y + 1).focus();
      // move to first cell: 0, 0
    } else {
      getInput(0, 0).focus();
    }
  }
}

function moveLeft(x, y) {
  let leftInput = getLeftInput(x, y);
  if (leftInput) {
    leftInput.focus();
  } else {
    // move to end of previous row
    if (y > 0) {
      getInput(puzzle.width - 1, y - 1).focus();
      // move to last cell: -1, -1
    } else {
      getInput(puzzle.width - 1, puzzle.height - 1).focus();
    }
  }
}

function moveDown(x, y) {
  let bottomInput = getBottomInput(x, y);
  if (bottomInput) {
    bottomInput.focus();
  } else {
    // move to beginning of next column
    if (x < puzzle.width - 1) {
      getInput(x + 1, 0).focus();
      // move to first cell: 0, 0
    } else {
      getInput(0, 0).focus();
    }
  }
}

function moveUp(x, y) {
  let topInput = getTopInput(x, y);
  if (topInput) {
    topInput.focus();
  } else {
    // move to end of previous column
    if (x > 0) {
      var input = getInput(x - 1, puzzle.height - 1);
      input.focus();
      // move to last cell: -1, -1
    } else {
      var input = getInput(puzzle.width - 1, puzzle.height - 1);
      input.focus();
    }
  }
}

function refreshGrid() {
  console.log("Refresing the grid...")
  var grid = document.getElementById("grid");
  const borderWidth = puzzle.grid.borderWidth;

  // create the new table element
  var table = document.createElementNS("http://www.w3.org/1999/xhtml", "table");
  table.id = "grid";

  // set the width and height
  var [width, height] = puzzle.grid.size();
  table.style.width = width + "px";
  table.style.height = height + "px";
  table.style.borderColor = puzzle.grid.borderColor;
  table.style.borderSpacing = "0px";
  table.style.borderStyle = puzzle.grid.borderStyle;
  table.style.borderWidth = borderWidth + "px";

  // create the table body element
  var tbody = document.createElement("tbody");

  // create the rows
  for (var y = 0; y < puzzle.height; y++) {

    // create a row
    var tr = document.createElement("tr");

    // create the cells
    for (var x = 0; x < puzzle.width; x++) {
      let gridCell = puzzle.grid.cell(x, y);
      let bottomCell = null;
      let leftCell = null;
      let rightCell = null;
      let topCell = null;

      if (y < puzzle.height - 1) { bottomCell = puzzle.grid.cell(x, y + 1); }
      if (x > 0) { leftCell = puzzle.grid.cell(x - 1, y); }
      if (x < puzzle.width - 1) { rightCell = puzzle.grid.cell(x + 1, y); }
      if (y > 0) { topCell = puzzle.grid.cell(x, y - 1); }

      // create cell
      var td = document.createElement("td");
      td.id = "cell-" + x + "-" + y;
      td.setAttribute("data-x", x);
      td.setAttribute("data-y", y);

      td.style.border = puzzle.grid.gridLineWidth + "px solid black";
      td.style.padding = "2px";

      td.addEventListener("dblclick", doubleClickCommands);

      // handle blocks by setting background to black
      if (gridCell && gridCell.block) { td.style.backgroundColor = "black"; }
      // handle empty cells by setting background to transparent
      else if (gridCell.empty) { td.style.backgroundColor = "rgba(0, 0, 0, 0)"; }
      // handle regular cells by creating inputs
      else { var input = createInput(x, y); td.appendChild(input); }

      // handle left bar
      if (puzzle.grid.hasLeftBar(x, y)) { td.style.borderLeft = puzzle.grid.borderWidth + "px solid black"; }

      // handle right bar
      if (puzzle.grid.hasRightBar(x, y)) { td.style.borderRight = puzzle.grid.borderWidth + "px solid black"; }

      // handle top bar
      if (puzzle.grid.hasTopBar(x, y)) { td.style.borderTop = puzzle.grid.borderWidth + "px solid black"; }

      // handle bottom bar
      if (puzzle.grid.hasBottomBar(x, y)) { td.style.borderBottom = puzzle.grid.borderWidth + "px solid black"; }

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  grid.parentNode.replaceChild(table, grid);
  if (currentCell) {
    var [x, y] = currentCell;
    var input = getInput(x, y);
    input.focus();
  }
}

function toggleDirection() {
  var gridDirection = document.getElementById("grid-entry-direction");
  if (direction) {
    direction = 0;
    gridDirection.innerHTML = "across";
  } else {
    direction = 1;
    gridDirection.innerHTML = "down";
  }
  console.log("Toggled the grid entry direction: " + direction);
  refreshGrid();
}

function toggleRebus() {
  var gridDirection = document.getElementById("grid-entry-style");
  if (rebus) {
    rebus = false;
    gridDirection.innerHTML = "normal";
  } else {
    rebus = true;
    gridDirection.innerHTML = "rebus";
  }
  console.log("Toggled rebus entry: " + rebus);
}

function updateAnswer(event) {
  var answer = event.target.value;
  var [x, y] = getElementXY(event.target);
  var cell = puzzle.grid.cell(x, y);
  var original = cell.answer;
  cell.answer = answer.trim().toUpperCase();
  event.target.value = cell.answer;
  let fontSize = getAnswerFontSize(cell.answer);
  event.target.style.fontSize = fontSize + "px";
  if (original != cell.answer) {
    console.log("Updated the answer for " + x + "-" + y + ": " + cell.answer);
  }
}

function updateAuthor() {
  var puzzleAuthor = document.getElementById("puzzle-author");
  var author = puzzleAuthor.value.trim();
  // TODO: Validate author
  puzzle.author = author;
  puzzleAuthor.value = puzzle.author;
  console.log("Updated the author: " + author);
}

function updateDate() {
  var puzzleDate = document.getElementById("puzzle-date");
  var date = puzzleDate.value.trim();
  if (isNaN(Date.parse(date))) {
    alert("Date must be in the format YYYY-MM-DD");
    puzzleDate.value = puzzle.date;
    return;
  }
  puzzle.date = date;
  puzzleDate.value = puzzle.date;
  console.log("Updated the date: " + date);
}

function updateHeight() {
  var puzzleHeight = document.getElementById("puzzle-height");
  var height = puzzleHeight.value.trim();
  if (isNaN(height)) {
    alert("Height must be a number");
    puzzleHeight.value = puzzle.height;
    return;
  }
  puzzle.height = parseInt(height);
  puzzleHeight.value = puzzle.height;
  console.log("Updated the height: " + height);
}

function updateTitle() {
  var puzzleTitle = document.getElementById("puzzle-title");
  var title = puzzleTitle.value.trim();
  // TODO: Validate title
  puzzle.title = title;
  puzzleTitle.value = puzzle.title;
  document.title = "HexGrids: " + puzzle.title;
  // document.title = "HexGrids: " + puzzle.title + " (" + puzzle.width + "x" + puzzle.height + ")";
  console.log("Updated the title: " + title);
}

function updateWidth() {
  var puzzleWidth = document.getElementById("puzzle-width");
  var width = puzzleWidth.value.trim();
  if (isNaN(width)) {
    alert("Width must be a number");
    puzzleWidth.value = puzzle.width;
    return;
  }
  puzzle.width = parseInt(width);
  puzzleWidth.value = puzzle.width;
  console.log("Updated the width: " + width);
}

initializePuzzle();

window.createGrid = createGrid
window.puzzle = puzzle;
window.toggleDirection = toggleDirection;
window.toggleRebus = toggleRebus;
window.updateAuthor = updateAuthor;
window.updateDate = updateDate;
window.updateHeight = updateHeight;
window.updateTitle = updateTitle;
window.updateWidth = updateWidth;
