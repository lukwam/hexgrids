import { Puzzle } from "./puzzle.js";

var puzzle = Puzzle();

var currentCell = null;
var direction = 0;
var rebus = false;
var tableIndex = {};

function advanceCell(x, y) {
  if (direction) {
    moveDown(x, y);
  } else {
    moveRight(x, y);
  }
}

function clickCommands(event) {
  var x = parseInt(event.target.getAttribute("data-x"));
  var y = parseInt(event.target.getAttribute("data-y"));
  switch (true) {
    case event.altKey:
      console.log("Alt-click");
      break;
    case event.ctrlKey:
      console.log("Ctrl-click");
      break;
    case event.metaKey:
      console.log("Meta-click");
      break;
    case event.shiftKey:
      console.log("Shift-click");
      break;
    default:
      break;
  }
}

function createGrid() {
  puzzle.initializeGrid();
  refreshGrid();
  var button = document.getElementById("create-grid-button");
  button.remove()
}

function disableBlock(event) {
  let x = parseInt(event.target.getAttribute("data-x"));
  let y = parseInt(event.target.getAttribute("data-y"));
  puzzle.grid.cell(x, y).block = false;
  event.target.style.backgroundColor = "rgba(0, 0, 0, 0)";
}

function disableCell(event) {
  event.target.readOnly = true;
  event.target.value = "";
  let x = parseInt(event.target.getAttribute("data-x"));
  let y = parseInt(event.target.getAttribute("data-y"));
  puzzle.grid.cell(x, y).answer = "";
  puzzle.grid.cell(x, y).black = false;
  puzzle.grid.cell(x, y).empty = true;
}

function disableLeftBar(event) {
  let x = parseInt(event.target.getAttribute("data-x"));
  let y = parseInt(event.target.getAttribute("data-y"));
  let leftInput = document.getElementById("input-" + (x - 1) + "-" + y);
  puzzle.grid.cell(x - 1, y).rightBar = false;
  event.target.style.borderLeft = puzzle.grid.borderWidth + "px solid #bbb";
  leftInput.style.borderRight = puzzle.grid.borderWidth + "px solid #bbb";
}

function disableTopBar(event) {
  let x = parseInt(event.target.getAttribute("data-x"));
  let y = parseInt(event.target.getAttribute("data-y"));
  let topInput = document.getElementById("input-" + x + "-" + (y - 1));
  puzzle.grid.cell(x, y - 1).bottomBar = false;
  event.target.style.borderTop = puzzle.grid.borderWidth + "px solid #bbb";
  topInput.style.borderBottom = puzzle.grid.borderWidth + "px solid #bbb";
}

function enableBlock(event) {
  let x = parseInt(event.target.getAttribute("data-x"));
  let y = parseInt(event.target.getAttribute("data-y"));
  puzzle.grid.cell(x, y).block = true;
  puzzle.grid.cell(x, y).answer = "";
  event.target.style.backgroundColor = "black";
  event.target.style.border = puzzle.grid.borderWidth + "px solid black";
}

function enableCell(event) {
  event.target.readOnly = false;
  let x = parseInt(event.target.getAttribute("data-x"));
  let y = parseInt(event.target.getAttribute("data-y"));
  puzzle.grid.cell(x, y).block = false;
  puzzle.grid.cell(x, y).empty = false;
}

function enableLeftBar(event) {
  let x = parseInt(event.target.getAttribute("data-x"));
  let y = parseInt(event.target.getAttribute("data-y"));
  let leftInput = document.getElementById("input-" + (x - 1) + "-" + y);
  puzzle.grid.cell(x - 1, y).rightBar = true;
  event.target.style.borderLeft = puzzle.grid.borderWidth + "px solid black";
  leftInput.style.borderRight = puzzle.grid.borderWidth + "px solid black";
}

function enableTopBar(event) {
  let x = parseInt(event.target.getAttribute("data-x"));
  let y = parseInt(event.target.getAttribute("data-y"));
  let topInput = document.getElementById("input-" + x + "-" + (y - 1));
  puzzle.grid.cell(x, y - 1).bottomBar = true;
  event.target.style.borderTop = puzzle.grid.borderWidth + "px solid black";
  topInput.style.borderBottom = puzzle.grid.borderWidth + "px solid black";
}

function initializePuzzle() {
  setAuthor();
  setTitle();
  setDate();
  setWidth();
  setHeight();
}

function keyboardCommands(event) {
  var x = parseInt(event.target.getAttribute("data-x"));
  var y = parseInt(event.target.getAttribute("data-y"));

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
      disableCell(event);
      break;

    case "Enter":
      if (direction) {
        if (y > 0) {
          toggleTopBar(event);
        }
      } else {
        if (x > 0) {
          toggleLeftBar(event);
        }
      }
      break;

    case "Insert":
    case ",": // Comma
    case "#": // Hash
      enableBlock(event);
      advanceCell(x, y);
      event.preventDefault();
      break;

    case "Tab":
    case " ": // Space
      advanceCell(x, y);
      event.preventDefault();
      break;

    case "/": // Slash
      toggleDirection();
      event.preventDefault();
      break;

    default:
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
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
  if (x < puzzle.width - 1) {
    var input = document.getElementById("input-" + (x + 1) + "-" + y);
    input.focus();
  } else {
    if (y < puzzle.height - 1) {
      var input = document.getElementById("input-0-" + (y + 1));
      input.focus();
    } else {
      var input = document.getElementById("input-0-0");
      input.focus();
    }
  }
}

function moveLeft(x, y) {
  if (x > 0) {
    var input = document.getElementById("input-" + (x - 1) + "-" + y);
    input.focus();
  } else {
    if (y > 0) {
      var input = document.getElementById("input-" + (puzzle.width - 1) + "-" + (y - 1));
      input.focus();
    } else {
      var input = document.getElementById("input-" + (puzzle.width - 1) + "-" + (puzzle.height - 1));
      input.focus();
    }
  }
}

function moveDown(x, y) {
  if (y < puzzle.height - 1) {
    var input = document.getElementById("input-" + x + "-" + (y + 1));
    input.focus();
  } else {
    if (x < puzzle.width - 1) {
      var input = document.getElementById("input-" + (x + 1) + "-0");
      input.focus();
    } else {
      var input = document.getElementById("input-0-0");
      input.focus();
    }
  }
}

function moveUp(x, y) {
  if (y > 0) {
    var input = document.getElementById("input-" + x + "-" + (y - 1));
    input.focus();
  } else {
    if (x > 0) {
      var input = document.getElementById("input-" + (x - 1) + "-" + (puzzle.height - 1));
      input.focus();
    } else {
      var input = document.getElementById("input-" + (puzzle.width - 1) + "-" + (puzzle.height - 1));
      input.focus();
    }
  }
}

function refreshGrid() {
  console.log("Refresing the grid...")
  var grid = document.getElementById("grid");

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
  table.style.borderWidth = puzzle.grid.borderWidth + "px";

  // create the table body element
  var tbody = document.createElement("tbody");

  // create the rows
  for (var y = 0; y < puzzle.height; y++) {

    // create a row
    var row = document.createElement("tr");

    // create the cells
    for (var x = 0; x < puzzle.width; x++) {

      // create cell
      var cell = document.createElement("td");
      cell.setAttribute("data-x", x);
      cell.setAttribute("data-y", y);
      cell.style.border = "none";
      cell.style.margin = 0;
      cell.style.padding = 0;

      // create input
      var input = document.createElement("input");
      input.id = "input-" + x + "-" + y;
      input.addEventListener("click", clickCommands);
      input.addEventListener("dblclick", enableCell);
      input.addEventListener("focusin", updateCurrentCell);
      input.addEventListener("focusout", updateAnswer);
      input.addEventListener("keydown", keyboardCommands);
      input.setAttribute("data-x", x);
      input.setAttribute("data-y", y);
      input.type = "text";

      let borderWidth = puzzle.grid.borderWidth;
      let gridCell = puzzle.grid.cell(x, y);

      let bottomCell = null;
      if (y < puzzle.height - 1) {
        bottomCell = puzzle.grid.cell(x, y + 1);
      }

      let leftCell = null;
      if (x > 0) {
        leftCell = puzzle.grid.cell(x - 1, y);
      }

      let rightCell = null;
      if (x < puzzle.width - 1) {
        rightCell = puzzle.grid.cell(x + 1, y);
      }

      let topCell = null;
      if (y > 0) {
        topCell = puzzle.grid.cell(x, y - 1);
      }

      // handle blocks
      if (gridCell.block) {
        input.readOnly = true;
        input.style.backgroundColor = "black";
        input.style.border = borderWidth + "px solid black";

      // handle empty cells
      } else if (gridCell.empty) {
        input.readOnly = true;
        input.style.backgroundColor = "rgba(0, 0, 0, 0)";

      // handle bars
      } else {
        input.style.backgroundColor = "rgba(0, 0, 0, 0)";
        input.style.border = borderWidth + "px solid #bbb";

        // check for left bar
        if (x == 0 || leftCell.empty || leftCell.block || leftCell.rightBar) {
          input.style.borderLeft = borderWidth + "px solid black";
        }

        // check for right bar
        if (x == puzzle.width - 1 || rightCell.empty || rightCell.block || gridCell.rightBar) {
          input.style.borderRight = borderWidth + "px solid black";
        }

        // check for top bar
        if (y == 0 || topCell.empty || topCell.block || topCell.bottomBar) {
          input.style.borderTop = borderWidth + "px solid black";
        }

        // check for bottom bar
        if (y == puzzle.height - 1 || bottomCell.empty || bottomCell.block || gridCell.bottomBar) {
          input.style.borderBottom = borderWidth + "px solid black";
        }
      }

      input.style.boxSizing = "border-box";
      input.style.fontSize = puzzle.grid.fontSize + "px";
      input.style.margin = 0;
      input.style.padding = 0;
      input.style.textAlign = "center";
      input.style.verticalAlign = "middle";
      input.style.height = "100%";
      input.style.width = "100%";
      input.value = gridCell.answer;

      cell.appendChild(input);
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  grid.parentNode.replaceChild(table, grid);
  if (currentCell) {
    var [x, y] = currentCell;
    var input = document.getElementById("input-" + x + "-" + y);
    input.focus();
  }
}

function retreatCell(x, y) {
  if (direction) {
    moveUp(x, y);
  } else {
    moveLeft(x, y);
  }
}

function setAuthor() {
  var puzzleAuthor = document.getElementById("puzzle-author");
  puzzleAuthor.value = puzzle.author;
}

function setDate() {
  var puzzleDate = document.getElementById("puzzle-date");
  puzzleDate.value = puzzle.date;
}

function setHeight() {
  var puzzleHeight = document.getElementById("puzzle-height");
  puzzleHeight.value = puzzle.height;
}

function setTitle() {
  var puzzleTitle = document.getElementById("puzzle-title");
  puzzleTitle.value = puzzle.title;
}

function setWidth() {
  var puzzleWidth = document.getElementById("puzzle-width");
  puzzleWidth.value = puzzle.width;
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

function toggleLeftBar(event) {
  var x = parseInt(event.target.getAttribute("data-x"));
  var y = parseInt(event.target.getAttribute("data-y"));
  if (puzzle.grid.cell(x - 1, y).rightBar) {
    disableLeftBar(event);
  } else {
    enableLeftBar(event);
  }
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

function toggleTopBar(event) {
  var x = parseInt(event.target.getAttribute("data-x"));
  var y = parseInt(event.target.getAttribute("data-y"));
  if (puzzle.grid.cell(x, y - 1).bottomBar) {
    disableTopBar(event);
  } else {
    enableTopBar(event);
  }
}

function updateAnswer(event) {
  var answer = event.target.value;
  var x = parseInt(event.target.getAttribute("data-x"));
  var y = parseInt(event.target.getAttribute("data-y"));
  var cell = puzzle.grid.cell(x, y);
  var original = cell.answer;
  cell.answer = answer.trim().toUpperCase();
  event.target.value = cell.answer;
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

function updateCurrentCell(event) {
  var x = parseInt(event.target.getAttribute("data-x"));
  var y = parseInt(event.target.getAttribute("data-y"));
  currentCell = [x, y];
  // console.log("Updated the current cell: " + currentCell);
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
