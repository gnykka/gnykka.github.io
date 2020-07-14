(() => {
  window.addEventListener('load', () => {
    const mazeContainer = document.querySelector('.maze');
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const pixelRatio = window.devicePixelRatio || 1;
    const lineWidth = 4;

    let size = 25;

    let width = 0;
    let height = 0;
    let rows = 0;
    let cols = 0;

    let grid = [];
    let current = null;
    let animation = null;

    let maxDistance = 0;

    // check whether two cells are linked
    const isLinked = (cellA, cellB) => {
      const link = cellA.links.find(l => l.row === cellB.row && l.col === cellB.col);
      return !!link;
    };

    // get all neighbors of a cell
    const getNeighbors = cell => {
      const list = [];
      
      if (cell.north) list.push(grid[cell.north.row][cell.north.col])
      if (cell.south) list.push(grid[cell.south.row][cell.south.col])
      if (cell.east) list.push(grid[cell.east.row][cell.east.col])
      if (cell.west) list.push(grid[cell.west.row][cell.west.col])

      return list;
    };

    // each step of algorithm — calculate and render
    const huntAndKillStep = () => {
      const unvisitedNeighbors = getNeighbors(current).filter(n => n.links.length === 0);
      const { length } = unvisitedNeighbors;

      if (length) {
        const rand = Math.floor(Math.random() * length);
        const { row, col } = unvisitedNeighbors[rand];

        current.links.push({ row, col });
        grid[row][col].links.push({ row: current.row, col: current.col });

        current = unvisitedNeighbors[rand];
      } else {
        current = null;

        loop:
        for (let row of grid) {
          for (let cell of row) {
            const visitedNeighbors = getNeighbors(cell).filter(n => n.links.length !== 0);

            if (cell.links.length === 0 && visitedNeighbors.length !== 0) {
              current = cell;

              const rand = Math.floor(Math.random() * visitedNeighbors.length);
              const { row, col } = visitedNeighbors[rand];

              current.links.push({ row, col });
              grid[row][col].links.push({ row: current.row, col: current.col });

              break loop;
            }
          }
        }
      }

      renderGrid();

      if (current) {
        animation = requestAnimationFrame(huntAndKillStep);
      } else {
        maxDistance = 0;
        calculateDistances();
      }
    };

    // start of the algorithm — with a random cell
    const huntAndKill = () => {
      current = grid[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)];
      huntAndKillStep();
    };

    // reqursive walk through links to calculate distances from top left corner and render changes
    const calculateDistances = (row = 0, col = 0, value = 0) => {
      animation = requestAnimationFrame(() => {
        maxDistance = Math.max(maxDistance, value);

        grid[row][col].distance = value;
        grid[row][col].links.forEach(l => {
          const { distance } = grid[l.row][l.col];
          if (!distance && distance !== 0) {
            calculateDistances(l.row, l.col, value + 1);
          }
        });

        fillGrid();
      });
    };

    // rerender color grid
    const fillGrid = () => {
      for (let row of grid) {
        for (let cell of row) {
          const { distance } = cell;

          if (distance) {
            const intensity = (maxDistance - distance) / maxDistance;
            const dark = Math.round(255 * intensity);
            const bright = 128 + Math.round(127 * intensity);

            const x1 = cell.x1 + (!cell.west || !isLinked(cell, cell.west) ? lineWidth / 2 : 0);
            const y1 = cell.y1 + (!cell.north || !isLinked(cell, cell.north) ? lineWidth / 2 : 0);
            const x2 = cell.x2 - (!cell.east || !isLinked(cell, cell.east) ? lineWidth / 2 : 0);
            const y2 = cell.y2 - (!cell.south || !isLinked(cell, cell.south) ? lineWidth / 2 : 0);

            ctx.fillStyle = `rgb(${dark}, ${dark}, ${bright})`;
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
          }
        }
      }
    };

    // render borders of cells
    const renderBorders = () => {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = lineWidth;

      for (let row of grid) {
        for (let cell of row) {
          const {
            x1, y1, x2, y2,
            north, south, west, east,
          } = cell;

          if (!north) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y1);
            ctx.stroke();
          }

          if (!west) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y2);
            ctx.stroke();
          }

          if (!south || !isLinked(cell, south)) {
            ctx.beginPath();
            ctx.moveTo(x1, y2);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }

          if (!east || !isLinked(cell, east)) {
            ctx.beginPath();
            ctx.moveTo(x2, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }
    };

    // render the main grid on each step of the algorithm
    const renderGrid = () => {
      ctx.clearRect(0, 0, width * pixelRatio, height * pixelRatio);

      for (let row of grid) {
        for (let cell of row) {
          const { x1, y1, x2, y2 } = cell;

          if (cell.links.length === 0) {
            ctx.fillStyle = '#ccc';
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
          }
          if (current && cell.row === current.row && cell.col === current.col) {
            ctx.fillStyle = '#2d84da';
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
          }
        }
      }

      renderBorders();
    };

    // initialize the grid with not connected cells
    const createGrid = () => {
      grid = [];

      for (let i = 0; i < rows; i++) {
        const row = [];

        for (let j = 0; j < cols; j++) {
          row.push({
            row: i,
            col: j,
            links: [],
          })
        }

        grid.push(row);
      }

      grid.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (i > 0) cell.north = { row: i - 1, col: j };
          if (i < rows - 1) cell.south = { row: i + 1, col: j };
          if (j > 0) cell.west = { row: i, col: j - 1 };
          if (j < cols - 1) cell.east = { row: i, col: j + 1 };
        });
      });

      positionCells();
    };

    // calculate and save cells x and y coordinates
    const positionCells = () => {
      grid.forEach(row => {
        row.forEach(cell => {
          cell.x1 = cell.col * size * pixelRatio;
          cell.y1 = cell.row * size * pixelRatio;
          cell.x2 = (cell.col + 1) * size * pixelRatio;
          cell.y2 = (cell.row + 1) * size * pixelRatio;
        });
      });
    };

    // resize canvas, grid and cells
    const resize = change => {
      width = mazeContainer.clientWidth;
      height = mazeContainer.clientHeight;

      if (change) {
        size = Math.min(Math.floor(height / rows), Math.floor(width / cols));
      } else {
        rows = Math.floor(height / size);
        cols = Math.floor(width / size);
      }
      
      width = cols * size;
      height = rows * size;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    };

    // main method — set sizes, init and prerender grid, start the algorithm
    const createMaze = () => {
      window.cancelAnimationFrame(animation);

      resize();
      createGrid();
      renderGrid();
      huntAndKill();
    };

    createMaze();

    const button = document.querySelector('button');

    button.addEventListener('click', () => {
      createMaze();
    });

    window.addEventListener('resize', () => {
      resize(true);
      positionCells();
      renderGrid();
      fillGrid();
    });
  });
})();
