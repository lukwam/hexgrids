function Cell() {
  let answer = "";
  let number = null;

  let rightBar = false;
  let bottomBar = false;

  let block = false;
  let empty = false;

  return {
    answer,
    number,
    rightBar,
    bottomBar,
    block,
    empty,
  }
}

function Grid() {
  let borderColor = "black";
  let borderStyle = "solid";
  let borderWidth = 1.5;

  let cellSize = 35.0;
  let cells = {}

  let fontFamily = "Arial, Helvetica, sans-serif";
  let fontSize = 24.0;
  let gridLines = true;

  let width = null;
  let height = null;

  function cell(x, y) {
    return cells[[x, y]];
  }

  function init(w, h) {
    width = w;
    height = h;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        cells[[x, y]] = Cell();
      }
    }
  }

  function size() {
    let x = width * cellSize;
    let y = height * cellSize;
    return [x, y];
  }

  return {
    borderColor,
    borderStyle,
    borderWidth,
    cell,
    cells,
    cellSize,
    fontFamily,
    fontSize,
    gridLines,
    init,
    size,
  }
}

export function Puzzle() {
  let title = "Title";
  let author = "Author";
  let date = new Date().toJSON().slice(0, 10);
  let width = 8;
  let height = 8;

  let grid = Grid();

  let instructions = "";
  let solution = "";

  function initializeGrid() {
    grid.init(width, height);
  }

  return {
    title,
    author,
    date,
    width,
    height,
    grid,
    instructions,
    solution,
    initializeGrid,
  }
}
