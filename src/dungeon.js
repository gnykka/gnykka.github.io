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

    let rows = 6;
    let cols = 12;

    let grid = [];

    const getKey = cell => `${cell.row}_${cell.col}`;

    const isLinked = (cellA, cellB) => {
      const link = cellA.links.find(l => l.row === cellB.row && l.col === cellB.col);
      return !!link;
    };

    const getNeighbors = cell => {
      const list = [];
      
      if (cell.north) list.push(grid[cell.north.row][cell.north.col])
      if (cell.south) list.push(grid[cell.south.row][cell.south.col])
      if (cell.east) list.push(grid[cell.east.row][cell.east.col])
      if (cell.west) list.push(grid[cell.west.row][cell.west.col])

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

      const breadcrumbs = {
        [getKey(start)]: 0,
        [getKey(finish)]: grid[current.row][current.col].distance,
      };

      while (getKey(current) !== getKey(start)) {
        for (let l of grid[current.row][current.col].links) {
          if (grid[l.row][l.col].distance < grid[current.row][current.col].distance) {
            breadcrumbs[getKey(l)] = grid[l.row][l.col].distance;
            current = l;
            break;
          }
        }
      }

      // get new random neighbor with some probability
      const getNeighbor = cell => {
        const gen = Math.random() < 0.4;
        const neighbors = cell.links.filter(l => !Object.keys(breadcrumbs).includes(getKey(l)));

        return gen && neighbors.length
          ? neighbors[Math.round(Math.random() * (neighbors.length - 1))]
          : null;
      };

      // for each cell in the path we can try to add dead ends to complicate the result path
      // we will add dead ends up to 2 cells
      [...Object.keys(breadcrumbs)].forEach(key => {
        const [row, col] = key.split('_').map(v => parseInt(v));
        const cell = grid[row][col];

        const neighbor = getNeighbor(cell);

        if (neighbor) {
          breadcrumbs[getKey(neighbor)] = breadcrumbs[key] + 1;

          const nextNeighbor = getNeighbor(grid[neighbor.row][neighbor.col]);

          if (nextNeighbor) {
            breadcrumbs[getKey(nextNeighbor)] = breadcrumbs[key] + 2;
          }
        }
      });

      return breadcrumbs;
    };

    // get rooms from cells by concating some neighbors
    const getRooms = path => {
      const keys = Object.keys(path);
      const rooms = [];

      // calculate where is the door from the room
      const getRoomDoor = (roomCells, cell) => {
        // true if the door is on the top or bottom of the room
        const vertical = roomCells.some(rc => rc.cell.col === cell.col);

        // if vertical then if it's on the north or south side
        // else if not vertical then if it's on the west or east side
        const north = vertical && roomCells.every(rc => rc.cell.row > cell.row);
        const west = !vertical && roomCells.every(rc => rc.cell.col > cell.col);

        return {
          x: vertical ? (cell.x1 + cell.x2) / 2 : (west ? cell.x2 : cell.x1),
          y: vertical ? (north ? cell.y2 : cell.y1) : (cell.y1 + cell.y2) / 2,
          vertical,
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
              const roomCells = pos
                .map(r => ({ key: getKey(r), cell: grid[r.row][r.col] }))
                .concat([{ key: getKey(cell), cell }]);

              const roomKeys = roomCells.map(({ key }) => key);
              // get all the links of room cells and filter them to get the doors
              // all the neighbors should also be inside the path
              const roomDoors = roomCells
                .reduce((res, { cell }) => res.concat(grid[cell.row][cell.col].links), [])
                .filter(l => {
                  const key = getKey(l);
                  return Object.keys(path).includes(key) && !roomKeys.includes(key);
                })
                .map(l => getRoomDoor(roomCells, grid[l.row][l.col]));

              rooms.push({
                count: 4,
                cells: roomCells,
                cell: {
                  x1: Math.min(...roomCells.map(r => r.cell.x1)),
                  x2: Math.max(...roomCells.map(r => r.cell.x2)),
                  y1: Math.min(...roomCells.map(r => r.cell.y1)),
                  y2: Math.max(...roomCells.map(r => r.cell.y2)),
                },
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
            const hasRoom = keys.includes(getKey(r));

            if (hasRoom) {
              const roomCells = [
                { key: getKey(r), cell: grid[r.row][r.col] },
                { key: getKey(cell), cell },
              ];

              const roomKeys = roomCells.map(({ key }) => key);
              const roomDoors = cell.links
                .concat(grid[r.row][r.col].links)
                .filter(l => {
                  const key = getKey(l);
                  return Object.keys(path).includes(key) && !roomKeys.includes(key);
                })
                .map(l => getRoomDoor(roomCells, grid[l.row][l.col]));

              rooms.push({
                count: 2,
                cells: roomCells,
                cell: {
                  x1: Math.min(...roomCells.map(r => r.cell.x1)),
                  x2: Math.max(...roomCells.map(r => r.cell.x2)),
                  y1: Math.min(...roomCells.map(r => r.cell.y1)),
                  y2: Math.max(...roomCells.map(r => r.cell.y2)),
                },
                doors: roomDoors,
              });

              keys.splice(index, 1);
              keys.splice(keys.findIndex(k => k === getKey(r)), 1);

              continue loop;
            }
          }
        }

        rooms.push({
          count: 1,
          cells: [{ key: getKey(cell), cell }],
          doors: cell.links
            .filter(l => Object.keys(path).includes(getKey(l)))
            .map(l => ({
              x: cell.col === l.col ? (cell.x1 + cell.x2) / 2 : (l.col > cell.col ? cell.x2 : cell.x1),
              y: cell.row === l.row ? (cell.y1 + cell.y2) / 2 : (l.row > cell.row ? cell.y2 : cell.y1),
              vertical: cell.col === l.col,
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

      ctx.strokeStyle = '#000';
      ctx.fillStyle = 'rgba(50, 125, 255, 0.5)';
      ctx.lineWidth = lineWidth;

      rooms.forEach(room => {
        const cell = room.cell || room.cells[0].cell;

        const { x1, y1, x2, y2 } = cell;
        const door = size * 0.33;

        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        ctx.strokeStyle = '#fff';

        room.doors.forEach(d => {
          ctx.beginPath();
          if (d.vertical) {
            ctx.moveTo(d.x - door, d.y);
            ctx.lineTo(d.x + door, d.y);
          } else {
            ctx.moveTo(d.x, d.y - door);
            ctx.lineTo(d.x, d.y + door);
          }
          ctx.stroke();
        });

        ctx.strokeStyle = '#000';
      });
    };

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

      grid.forEach(row => {
        row.forEach(cell => {
          cell.x1 = cell.col * size * pixelRatio;
          cell.y1 = cell.row * size * pixelRatio;
          cell.x2 = (cell.col + 1) * size * pixelRatio;
          cell.y2 = (cell.row + 1) * size * pixelRatio;
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
