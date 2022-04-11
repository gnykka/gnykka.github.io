(() => {
  window.addEventListener('load', () => {
    const mazeContainer = document.querySelector('.maze');
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const pixelRatio = window.devicePixelRatio || 1;
    const lineWidth = 10;

    let size = 0;

    let width = 0;
    let height = 0;

    let rows = 16;
    let cols = 32;

    let grid = [];

    const getKey = cell => `${cell.row}_${cell.col}`;

    const getNeighbors = cell => {
      const list = [];
      
      if (cell.top) list.push(grid[cell.top.row][cell.top.col])
      if (cell.bottom) list.push(grid[cell.bottom.row][cell.bottom.col])
      if (cell.right) list.push(grid[cell.right.row][cell.right.col])
      if (cell.left) list.push(grid[cell.left.row][cell.left.col])

      return list;
    };

    // calculate all distances for all cells starting from top left corner
    const calculateDistances = (row = 0, col = 0, value = 0) => {
      grid[row][col].distance = value;
      grid[row][col].links.forEach(l => {
        const { distance } = grid[l.row][l.col];
        if (!distance && distance !== 0) {
          calculateDistances(l.row, l.col, value + 1);
        }
      });
    };

    // get optimized path (without any dead ends) from start cell to finish cell
    // add some dead ends later
    const getPath = (start, finish) => {
      let current = finish;

      const breadcrumbs = [getKey(finish)];

      while (getKey(current) !== getKey(start)) {
        for (let l of grid[current.row][current.col].links) {
          if (grid[l.row][l.col].distance < grid[current.row][current.col].distance) {
            breadcrumbs.push(getKey(l));
            current = l;
            break;
          }
        }
      }

      // get new random neighbor with some probability
      const getNeighbor = cell => {
        const gen = Math.random() < 0.5;
        const neighbors = cell.links.filter(l => !breadcrumbs.includes(getKey(l)));

        return gen && neighbors.length
          ? neighbors[Math.round(Math.random() * (neighbors.length - 1))]
          : null;
      };

      // for each cell in the path we can try to add dead ends to complicate the result path
      // we will add dead ends up to 2 cells
      [...breadcrumbs].forEach(key => {
        const [row, col] = key.split('_').map(v => parseInt(v));
        const cell = grid[row][col];

        const neighbor = getNeighbor(cell);

        if (neighbor) {
          breadcrumbs.push(getKey(neighbor));

          const nextNeighbor = getNeighbor(grid[neighbor.row][neighbor.col]);

          if (nextNeighbor) {
            breadcrumbs.push(getKey(nextNeighbor));
          }
        }
      });

      return breadcrumbs;
    };

    // get rooms from cells by concating some neighbors
    const getRooms = path => {
      const keys = [...path];
      const rooms = [];

      // direction from cellB to cellA
      const getDoorDirection = (cellA, cellB) => {
        if (cellB.col === cellA.col) {
          return cellB.row > cellA.row ? 'bottom' : 'top';
        }
        if (cellB.row === cellA.row) {
          return cellB.col > cellA.col ? 'right' : 'left';
        }
        return '';
      };

      // calculate where is the door from the room
      const getRoomDoor = (roomCells, linkCell) => {
        // find the nearest cell of roomCells
        const index = roomCells.findIndex(rc =>
          (rc.col === linkCell.col && Math.abs(rc.row - linkCell.row) === 1) ||
          (rc.row === linkCell.row && Math.abs(rc.col - linkCell.col) === 1)
        );

        return {
          index,
          direction: getDoorDirection(roomCells[index], linkCell),
        };
      };

      loop:
      while (keys.length) {
        const index = Math.round(Math.random() * (keys.length - 1));
        const [row, col] = keys[index].split('_').map(v => parseInt(v));
        const cell = grid[row][col];

        const canBe4Room = Math.random() < 0.66;

        if (canBe4Room) {
          // possible configurations of 4-cell rooms
          // we can have 4-cell room only if all the cells are in created path
          const pos4Rooms = [
            [{ row: row - 1, col: col - 1 }, { row: row - 1, col }, { row, col: col - 1 }],
            [{ row: row - 1, col }, { row: row - 1, col: col + 1 }, { row, col: col + 1 }],
            [{ row, col: col + 1 }, { row: row + 1, col: col + 1 }, { row: row + 1, col }],
            [{ row: row + 1, col }, { row: row + 1, col: col - 1 }, { row, col: col - 1 }],
          ];

          for (let pos of pos4Rooms) {
            const hasRoom = pos.every(r => keys.includes(getKey(r)));

            if (hasRoom) {
              // save all the cells that are in the room
              const roomCells = [...pos, { row: cell.row, col: cell.col }].sort((ca, cb) => (
                ca.row > cb.row || ca.col > cb.col ? 1 : -1
              ));

              const roomKeys = roomCells.map(rc => getKey(rc));

              // get all the links of room cells and filter them to get the doors
              // all the neighbors should also be inside the path
              const roomDoors = roomCells
                .reduce((res, rc) => res.concat(grid[rc.row][rc.col].links), [])
                .filter(l => {
                  const key = getKey(l);
                  return path.includes(key) && !roomKeys.includes(key);
                })
                .map(l => getRoomDoor(roomCells, l));

              rooms.push({
                count: { vertical: 2, horizontal: 2 },
                cells: roomCells,
                doors: roomDoors,
              });

              keys.splice(index, 1);
              pos.forEach(r => keys.splice(keys.findIndex(k => k === getKey(r)), 1));

              continue loop;
            }
          }
        }

        const canBe2Room = Math.random() < 0.5;

        if (canBe2Room) {
          // generate 2-cell rooms the same way as 4-cell
          const pos2Rooms = [
            { row: row - 1, col },
            { row: row + 1, col },
            { row, col: col - 1 },
            { row, col: col + 1 },
          ];

          for (let r of pos2Rooms) {
            const rKey = getKey(r);
            const hasRoom = keys.includes(rKey);

            if (hasRoom) {
              const roomCells = [{ ...r }, { row: cell.row, col: cell.col }].sort((ca, cb) => (
                ca.row > cb.row || ca.col > cb.col ? 1 : -1
              ));

              const roomKeys = roomCells.map(rc => getKey(rc));
              const roomDoors = roomCells
                .reduce((res, rc) => res.concat(grid[rc.row][rc.col].links), [])
                .filter(l => {
                  const key = getKey(l);
                  return path.includes(key) && !roomKeys.includes(key);
                })
                .map(l => getRoomDoor(roomCells, l));

              rooms.push({
                count: {
                  vertical: roomCells[0].col === roomCells[1].col ? 2 : 1,
                  horizontal: roomCells[0].row === roomCells[1].row ? 2 : 1,
                },
                cells: roomCells,
                doors: roomDoors,
              });

              keys.splice(index, 1);
              keys.splice(keys.findIndex(k => k === rKey), 1);

              continue loop;
            }
          }
        }

        rooms.push({
          count: { vertical: 1, horizontal: 1 },
          cells: [{ row: cell.row, col: cell.col }],
          doors: cell.links
            .filter(l => path.includes(getKey(l)))
            .map(l => ({
              index: 0,
              direction: getDoorDirection(cell, l),
            })),
        });
        keys.splice(index, 1);
      }

      return rooms;
    };

    // this is the True Prim's algorithm to generate mazes
    const prim = () => {
      const current = grid[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)];
      const active = [current];
      const costs = {};

      for (let row of grid) {
        for (let cell of row) {
          costs[getKey(cell)] = Math.round(Math.random() * 100);
        }
      }

      while (active.length) {
        const cell = active.sort((a, b) => costs[getKey(a)] > costs[getKey(b)] ? 1 : -1)[0];
        const availableNeighbors = getNeighbors(cell).filter(n => n.links.length === 0);

        if (availableNeighbors.length) {
          const neighbor = availableNeighbors.sort((a, b) => costs[getKey(a)] > costs[getKey(b)] ? 1 : -1)[0];
          neighbor.links.push({ row: cell.row, col: cell.col });
          cell.links.push({ row: neighbor.row, col: neighbor.col });
          active.push(neighbor);
        } else {
          const index = active.findIndex(c => getKey(c) === getKey(cell));
          active.splice(index, 1);
        }
      }
    };

    const generate = () => {
      prim();
      calculateDistances();

      const path = getPath(grid[0][0], grid[rows - 1][cols - 1]);
      const rooms = getRooms(path);

      renderRooms(rooms);
    };

    const renderRooms = (rooms) => {
      ctx.clearRect(0, 0, width * pixelRatio, height * pixelRatio);

      ctx.strokeStyle = '#fff';
      ctx.fillStyle = 'rgba(50, 200, 255)';
      ctx.lineWidth = lineWidth;

      rooms.forEach(room => {
        const { row, col } = room.cells[0];
        const { count, horizontal, vertical } = room;

        const x1 = col * size * pixelRatio;
        const x2 = x1 + count.horizontal * size * pixelRatio;
        const y1 = row * size * pixelRatio;
        const y2 = y1 + count.vertical * size * pixelRatio;

        const doorSize = size * 0.2 * pixelRatio;

        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

        ctx.strokeStyle = '#000';

        room.doors.forEach(({ index, direction }) => {
          ctx.beginPath();

          const sourceCell = room.cells[index];
          const vertical = direction === 'top' || direction === 'bottom';

          if (vertical) {
            const x = size * (sourceCell.col + 0.5) * pixelRatio;
            const y = direction === 'top'
              ? sourceCell.row * size * pixelRatio
              : (sourceCell.row + 1) * size * pixelRatio;

            ctx.moveTo(x - doorSize, y);
            ctx.lineTo(x + doorSize, y);
          } else {
            const x = direction === 'left'
              ? sourceCell.col * size * pixelRatio
              : (sourceCell.col + 1) * size * pixelRatio;
            const y = size * (sourceCell.row + 0.5) * pixelRatio;

            ctx.moveTo(x, y - doorSize);
            ctx.lineTo(x, y + doorSize);
          }

          ctx.stroke();
        });

        ctx.strokeStyle = '#fff';
      });
    };

    const createGrid = () => {
      grid = [];

      for (let i = 0; i < rows; i++) {
        const row = [];

        for (let j = 0; j < cols; j++) {
          row.push({ row: i, col: j, links: [] });
        }

        grid.push(row);
      }

      grid.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (i > 0) cell.top = { row: i - 1, col: j };
          if (i < rows - 1) cell.bottom = { row: i + 1, col: j };
          if (j > 0) cell.left = { row: i, col: j - 1 };
          if (j < cols - 1) cell.right = { row: i, col: j + 1 };
        });
      });
    };

    const resize = () => {
      width = mazeContainer.clientWidth;
      height = mazeContainer.clientHeight;

      size = Math.min(Math.floor(height / rows), Math.floor(width / cols));

      width = cols * size;
      height = rows * size;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    };

    const createMaze = () => {
      resize();
      createGrid();
      generate();
    };

    createMaze();
  });
})();
