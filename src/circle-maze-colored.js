(() => {
  window.addEventListener('load', () => {
    const mazeContainer = document.querySelector('.maze');
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const pixelRatio = window.devicePixelRatio || 1;

    let size = 10;
    let width = 0;
    let rows = 0;

    let grid = [];
    let maxDistance = 0;

    const isLinked = (cellA, cellB) => {
      const link = cellA.links.find(l => l.row === cellB.row && l.col === cellB.col);
      return !!link;
    };

    const getNeighbors = ({ row, col }, empty) => {
      const list = [];
      const cell = grid[row][col];

      if (cell.cw) {
        const { length } = grid[cell.cw.row][cell.cw.col].links;
        const include = empty && !length || !empty && !!length;

        if (include) list.push({ ...cell.cw });
      }
      if (cell.ccw) {
        const { length } = grid[cell.ccw.row][cell.ccw.col].links;
        const include = empty && !length || !empty && !!length;

        if (include) list.push({ ...cell.ccw });
      }
      if (cell.inward) {
        const { length } = grid[cell.inward.row][cell.inward.col].links;
        const include = empty && !length || !empty && !!length;

        if (include) list.push({ ...cell.inward });
      }

      cell.outward.forEach(out => {
        const { length } = grid[out.row][out.col].links;
        const include = empty && !length || !empty && !!length;

        if (include) list.push({ ...out });
      });

      return list;
    };

    const huntAndKill = () => {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * grid[randomRow].length);

      let current = { row: randomRow, col: randomCol };

      while (current) {
        const unvisitedNeighbors = getNeighbors(current, true);
        const { length } = unvisitedNeighbors;

        if (length) {
          const rand = Math.floor(Math.random() * length);
          const { row, col } = unvisitedNeighbors[rand];

          grid[current.row][current.col].links.push({ row, col });
          grid[row][col].links.push({ ...current });

          current = unvisitedNeighbors[rand];
        } else {
          current = null;

          loop:
          for (let row of grid) {
            for (let cell of row) {
              const visitedNeighbors = getNeighbors(cell);

              if (cell.links.length === 0 && visitedNeighbors.length !== 0) {
                current = cell;

                const rand = Math.floor(Math.random() * visitedNeighbors.length);
                const { row, col } = visitedNeighbors[rand];

                grid[current.row][current.col].links.push({ row, col });
                grid[row][col].links.push({ ...current });

                break loop;
              }
            }
          }
        }
      }
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

    const renderMaze = () => {
      ctx.clearRect(0, 0, width * pixelRatio, width * pixelRatio);

      for (let row of grid) {
        for (let cell of row) {
          const { distance } = cell;

          if (distance) {
            const intensity = (maxDistance - distance) / maxDistance;
            const dark = Math.round(255 * intensity);
            const bright = 128 + Math.round(127 * intensity);

            ctx.fillStyle = `rgb(${dark}, ${bright}, ${dark})`;

            ctx.beginPath();
            ctx.moveTo(cell.innerCcwX, cell.innerCcwY);
            ctx.lineTo(cell.outerCcwX, cell.outerCcwY);
            ctx.lineTo(cell.outerCwX, cell.outerCwY);
            ctx.lineTo(cell.innerCwX, cell.innerCwY);
            ctx.fill();
          }
        }
      }
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

      grid.forEach((row, index) => {
        const angle = 2 * Math.PI / row.length;
        const innerRadius = index * size
        const outerRadius = (index + 1) * size

        row.forEach(cell => {
          const angleCcw = cell.col * angle;
          const angleCw = (cell.col + 1) * angle;

          const cosCcw = Math.cos(angleCcw);
          const sinCcw = Math.sin(angleCcw);
          const cosCw = Math.cos(angleCw);
          const sinCw = Math.sin(angleCw);

          cell.innerCcwX = Math.round(center + (innerRadius * cosCcw)) * pixelRatio;
          cell.innerCcwY = Math.round(center + (innerRadius * sinCcw)) * pixelRatio;
          cell.outerCcwX = Math.round(center + (outerRadius * cosCcw)) * pixelRatio;
          cell.outerCcwY = Math.round(center + (outerRadius * sinCcw)) * pixelRatio;
          cell.innerCwX = Math.round(center + (innerRadius * cosCw)) * pixelRatio;
          cell.innerCwY = Math.round(center + (innerRadius * sinCw)) * pixelRatio;
          cell.outerCwX = Math.round(center + (outerRadius * cosCw)) * pixelRatio;
          cell.outerCwY = Math.round(center + (outerRadius * sinCw)) * pixelRatio;

          const centerAngle = (angleCcw + angleCw) / 2;
          const cosCenter = Math.cos(centerAngle);
          const sinCenter = Math.sin(centerAngle);

          cell.centerX = (Math.round(center + (innerRadius * cosCenter)) +
            Math.round(center + (outerRadius * cosCenter))) * pixelRatio / 2;
          cell.centerY = (Math.round(center + (innerRadius * sinCenter)) +
            Math.round(center + (outerRadius * sinCenter))) * pixelRatio / 2;
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

      canvas.width = width * pixelRatio;
      canvas.height = width * pixelRatio;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${width}px`;
    };

    const createMaze = () => {
      resize();
      createGrid();
      huntAndKill();
      calculateDistance();
      renderMaze();
    };

    setInterval(() => {
      createMaze();
    }, 100);
  });
})();
