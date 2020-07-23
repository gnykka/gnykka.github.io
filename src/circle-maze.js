(() => {
  window.addEventListener('load', () => {
    const mazeContainer = document.querySelector('.maze');
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const pixelRatio = window.devicePixelRatio || 1;
    const lineWidth = 4;

    let size = 10;

    let width = 0;
    let rows = 0;

    let grid = [];
    let maxDistance = 0;

    const isLinked = (cellA, cellB) => {
      const link = cellA.links.find(l => l.row === cellB.row && l.col === cellB.col);
      return !!link;
    };

    const getNeighbors = cell => {
      const list = [];

      if (cell.cw) list.push(grid[cell.cw.row][cell.cw.col])
      if (cell.ccw) list.push(grid[cell.ccw.row][cell.ccw.col])
      if (cell.inward) list.push(grid[cell.inward.row][cell.inward.col])

      cell.outward.forEach(out => {
        list.push(grid[out.row][out.col]);
      });

      return list;
    };

    const huntAndKill = () => {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * grid[randomRow].length);

      let current = grid[randomRow][randomCol];

      while (current) {
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
      }

      renderMaze();
    };

    const renderMaze = () => {
      ctx.clearRect(0, 0, width * pixelRatio, width * pixelRatio);

      ctx.strokeStyle = '#000';
      ctx.lineWidth = lineWidth;

      for (let row of grid) {
        for (let cell of row) {
          if (cell.row) {
            if (!cell.inward || !isLinked(cell, cell.inward)) {
              ctx.beginPath();
              ctx.moveTo(cell.innerCcwX, cell.innerCcwY);
              ctx.lineTo(cell.innerCwX, cell.innerCwY);
              ctx.stroke();
            }

            if (!cell.cw || !isLinked(cell, cell.cw)) {
              ctx.beginPath();
              ctx.moveTo(cell.innerCwX, cell.innerCwY);
              ctx.lineTo(cell.outerCwX, cell.outerCwY);
              ctx.stroke();
            }

            if (cell.row === grid.length - 1 && cell.col !== row.length * 0.75) {
              ctx.beginPath();
              ctx.moveTo(cell.outerCcwX, cell.outerCcwY);
              ctx.lineTo(cell.outerCwX, cell.outerCwY);
              ctx.stroke();
            }
          }
        }
      }
    };

    const renderPath = () => {
      let row = grid.length - 1;
      let cell = { ...grid[row][grid[row].length * 0.75] };
      let nextCell = null;
      let { distance } = cell;

      ctx.strokeStyle = '#f00';

      ctx.beginPath();
      ctx.moveTo(cell.centerX, cell.centerY);

      while (distance > 0) {
        const link = cell.links.filter(l => grid[l.row][l.col].distance === distance - 1)[0];
        nextCell = { ...grid[link.row][link.col] };

        ctx.lineTo(cell.centerX, cell.centerY);

        distance -= 1;
        cell = { ...nextCell };
      }

      ctx.lineTo(width * 0.5 * pixelRatio, width * 0.5 * pixelRatio);
      ctx.stroke();
    };

    const calculateDistance = (row = 0, col = 0, value = 0) => {
      maxDistance = Math.max(maxDistance, value);

      grid[row][col].distance = value;
      grid[row][col].links.forEach(l => {
        const { distance } = grid[l.row][l.col];
        if (!distance && distance !== 0) {
          calculateDistance(l.row, l.col, value + 1);
        }
      });
    };

    const solveMaze = () => {
      calculateDistance();
      renderPath();
    };

    const createGrid = () => {
      const rowHeight = 1 / rows;

      grid = [];
      grid.push([{ row: 0, col: 0, links: [], outward: [] }]);

      for (let i = 1; i < rows; i++) {
        const radius = i / rows;
        const circumference = 2 * Math.PI * radius;
        const prevCount = grid[i - 1].length;
        const cellWidth = circumference / prevCount;
        const ratio = Math.round(cellWidth / rowHeight);
        const count = prevCount * ratio;

        const row = [];

        for (let j = 0; j < count; j++) {
          row.push({
            row: i,
            col: j,
            links: [],
            outward: [],
          })
        }

        grid.push(row);
      }

      grid.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell.row > 0) {
            cell.cw = { row: i, col: (j === row.length - 1 ? 0 : j + 1) };
            cell.ccw = { row: i, col: (j === 0 ? row.length - 1 : j - 1) };

            const ratio = grid[i].length / grid[i - 1].length;
            const parent = grid[i - 1][Math.floor(j / ratio)];

            cell.inward = { row: parent.row, col: parent.col };
            parent.outward.push({ row: cell.row, col: cell.col });
          }
        });
      });

      positionCells();
    };

    const positionCells = () => {
      const center = width / 2;

      grid.forEach(row => {
        row.forEach(cell => {
          const angle = 2 * Math.PI / row.length;
          const innerRadius = cell.row * size
          const outerRadius = (cell.row + 1) * size
          const angleCcw = cell.col * angle;
          const angleCw = (cell.col + 1) * angle;

          cell.innerCcwX = Math.round(center + (innerRadius * Math.cos(angleCcw))) * pixelRatio + lineWidth / 2;
          cell.innerCcwY = Math.round(center + (innerRadius * Math.sin(angleCcw))) * pixelRatio + lineWidth / 2;
          cell.outerCcwX = Math.round(center + (outerRadius * Math.cos(angleCcw))) * pixelRatio + lineWidth / 2;
          cell.outerCcwY = Math.round(center + (outerRadius * Math.sin(angleCcw))) * pixelRatio + lineWidth / 2;
          cell.innerCwX = Math.round(center + (innerRadius * Math.cos(angleCw))) * pixelRatio + lineWidth / 2;
          cell.innerCwY = Math.round(center + (innerRadius * Math.sin(angleCw))) * pixelRatio + lineWidth / 2;
          cell.outerCwX = Math.round(center + (outerRadius * Math.cos(angleCw))) * pixelRatio + lineWidth / 2;
          cell.outerCwY = Math.round(center + (outerRadius * Math.sin(angleCw))) * pixelRatio + lineWidth / 2;

          const centerAngle = (angleCcw + angleCw) / 2;

          cell.centerX = (Math.round(center + (innerRadius * Math.cos(centerAngle))) * pixelRatio + lineWidth / 2 +
            Math.round(center + (outerRadius * Math.cos(centerAngle))) * pixelRatio + lineWidth / 2) / 2;
          cell.centerY = (Math.round(center + (innerRadius * Math.sin(centerAngle))) * pixelRatio + lineWidth / 2 +
            Math.round(center + (outerRadius * Math.sin(centerAngle))) * pixelRatio + lineWidth / 2) / 2;
        });
      });
    };

    const resize = change => {
      width = Math.min(mazeContainer.clientWidth, mazeContainer.clientHeight);

      if (change) {
        size = Math.floor(width / 2 / rows);
      } else {
        rows = Math.floor(width / 2 / size);
      }

      width = 2 * rows * size;

      canvas.width = width * pixelRatio + lineWidth;
      canvas.height = width * pixelRatio + lineWidth;

      canvas.style.width = `${width + lineWidth}px`;
      canvas.style.height = `${width + lineWidth}px`;
    };

    const createMaze = () => {
      resize();
      createGrid();
      huntAndKill();
    };

    createMaze();

    const createButton = document.querySelector('button.create');
    const solveButton = document.querySelector('button.solve');

    createButton.addEventListener('click', () => {
      createMaze();
    });
    solveButton.addEventListener('click', () => {
      solveMaze();
    });

    window.addEventListener('resize', () => {
      resize(true);
      positionCells();
      renderMaze();
    });
  });
})();
