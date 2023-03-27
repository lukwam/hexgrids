function Cell(x, y) {
  let answer = false;
  let number = false;

  let bottomBar = false;
  let rightBar = false;

  let block = false;
  let empty = false;

  let circle = false;
  let shadeCircle = false;
  let shadeSquare = false;

  return {
    answer,
    number,
    rightBar,
    bottomBar,
    block,
    empty,
    x,
    y,
    circle,
    shadeCircle,
    shadeSquare,
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
  let gridLineWidth = 0.25;

  let width = null;
  let height = null;

  function cell(x, y) {
    return cells[[x, y]];
  }

  function bottomCell(x, y) { if (y < height - 1) { return cell(x, y + 1); } return null; }
  function leftCell(x, y) { if (x > 0) { return cell(x - 1, y); } return null; }
  function rightCell(x, y) { if (x < width - 1) { return cell(x + 1, y); } return null; }
  function topCell(x, y) { if (y > 0) { return cell(x, y - 1); } return null; }

  function hasBottomBar(x, y) {
    let c = cell(x, y);
    let b = bottomCell(x, y);
    if (c && c.bottomBar) { return true; }
    if (b && b.empty) { return true; }
    return false
  }

  function hasLeftBar(x, y) {
    let l = leftCell(x, y);
    if (l && l.rightBar) { return true; }
    if (l && l.empty) { return true; }
    return false
  }

  function hasRightBar(x, y) {
    let c = cell(x, y);
    let r = rightCell(x, y);
    if (c && c.rightBar) { return true; }
    if (r && r.empty) { return true; }
    return false
  }

  function hasTopBar(x, y) {
    let t = topCell(x, y);
    if (t && t.bottomBar) { return true; }
    if (t && t.empty) { return true; }
    return false
  }


  function init(w, h) {
    width = w;
    height = h;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        cells[[x, y]] = Cell(x, y);
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
    gridLineWidth,
    init,
    size,
    bottomCell,
    leftCell,
    rightCell,
    topCell,
    hasBottomBar,
    hasLeftBar,
    hasRightBar,
    hasTopBar,
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

  function initializeGrid(w, d) {
    width = w;
    height = d;
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
