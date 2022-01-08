const n24a = () => {
  const input = `inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 1\nadd x 11\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 16\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 1\nadd x 12\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 11\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 1\nadd x 13\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 12\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 26\nadd x -5\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 12\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 26\nadd x -3\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 12\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 1\nadd x 14\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 2\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 1\nadd x 15\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 11\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 26\nadd x -16\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 4\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 1\nadd x 14\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 12\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 1\nadd x 15\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 9\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 26\nadd x -7\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 10\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 26\nadd x -11\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 11\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 26\nadd x -6\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 6\nmul y x\nadd z y
    inp w\nmul x 0\nadd x z\nmod x 26\ndiv z 26\nadd x -11\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y 15\nmul y x\nadd z y`;

  const state = { x: 0, y: 0, z: 0, w: 0 };

  const inp = (state, prop, value) => state[prop] = value;
  const add = (state, prop, value) => state[prop] += value;
  const mul = (state, prop, value) => state[prop] *= value;
  const div = (state, prop, value) => state[prop] = Math.floor(state[prop] / value);
  const mod = (state, prop, value) => state[prop] %= value;
  const eql = (state, prop, value) => state[prop] = +(state[prop] === value);

  let strNumber = '11189561113216';

  input.split('\n').forEach(inst => {
    const [command, prop, v] = inst.trim().split(' ');

    if (command === 'inp') {
      inp(state, prop, parseInt(strNumber[0]));
      strNumber = strNumber.substr(1);
    }

    const value = Object.keys(state).includes(v) ? state[v] : parseInt(v);

    if (command === 'add') add(state, prop, value);
    if (command === 'mul') mul(state, prop, value);
    if (command === 'div') div(state, prop, value);
    if (command === 'mod') mod(state, prop, value);
    if (command === 'eql') eql(state, prop, value);
  });

  console.log(state);
};

const n21a = () => {
  const input = `on x=-19..34,y=-11..39,z=-31..17
                 on x=-15..35,y=-32..21,z=-32..21
                 on x=-40..7,y=-34..14,z=-19..29
                 on x=-5..49,y=-4..45,z=-9..42
                 on x=-12..41,y=-41..13,z=-16..31
                 on x=-45..7,y=-33..12,z=-31..21
                 on x=-45..4,y=-39..15,z=-4..46
                 on x=-43..8,y=-24..23,z=-4..48
                 on x=-7..37,y=-30..14,z=-10..43
                 on x=-1..49,y=-28..16,z=-33..18
                 off x=18..31,y=-31..-16,z=31..47
                 on x=-33..17,y=-35..11,z=-38..8
                 off x=-20..-5,y=-3..9,z=33..42
                 on x=-46..5,y=-18..28,z=-43..2
                 off x=-25..-11,y=23..41,z=-29..-19
                 on x=-26..18,y=-16..38,z=-41..11
                 off x=27..37,y=33..49,z=9..19
                 on x=-47..7,y=-14..38,z=-18..31
                 off x=30..43,y=-1..14,z=-31..-13
                 on x=-14..35,y=-12..32,z=-36..12`;

  const data = input
    .split('\n')
    .map(str => {
      const [state, xmin, xmax, , ymin, ymax, , zmin, zmax] = str.split(/,|=|\.\./);
      return {
        on: state.trim().startsWith('on'),
        xmin: parseInt(xmin), xmax: parseInt(xmax),
        ymin: parseInt(ymin), ymax: parseInt(ymax),
        zmin: parseInt(zmin), zmax: parseInt(zmax),
      }
    });

  const boxes = {};

  data.forEach((value, i) => {
    for (let x = value.xmin; x <= value.xmax; x++) {
      boxes[x] = boxes[x] || {};

      for (let y = value.ymin; y <= value.ymax; y++) {
        boxes[x][y] = boxes[x][y] || [];

        if (value.on) {
          if (!boxes[x][y].length) {
            boxes[x][y].push({ min: value.zmin, max: value.zmax });
            continue;
          }

          const noIntersections = boxes[x][y].every(box =>
            value.zmax < box.min || box.max < value.min
          );

          if (noIntersections) {
            // диапазоны не пересекаются — добавляем новый диапазон
            // min1 max1 min2 max2
            // min2 max2 min1 max1
            boxes[x][y].push({ min: value.zmin, max: value.zmax });
            continue;
          }

          boxes[x][y] = [...boxes[x][y]].reduce((res, box) => {
            if (
              value.zmin <= box.max && box.max <= value.zmax ||
              box.min <= value.zmax && value.zmax <= box.max
            ) {
              // диапазоны частично пересекаются
              // min1 min2 max1 max2
              // min2 min1 max2 max1
              // min2 min1 max1 max2
              return [...res, { min: Math.min(value.zmin, box.min), max: Math.max(value.zmax, box.max) }];
            }
            // в остальных случаях нужно оставить старый диапазон
            return [...res, box];
          }, []);
        } else {
          boxes[x][y] = [...boxes[x][y]].reduce((res, box) => {
            if (value.zmin <= box.min && box.max <= value.zmax) {
              // новый диапазон полностью покрывает старый — диапазон исчезает
              // min2 min1 max1 max2
              return res;
            } else if (value.zmin >= box.min && value.zmax <= box.max) {
              // новый диапазон полностью внутри — делится на два
              // min1 min2 max2 max1
              return [...res, { min: box.min, max: value.zmin - 1 }, { min: value.zmax + 1, max: box.max }];
            } else if (value.zmin <= box.max && value.zmax >= box.max) {
              // диапазоны частично пересекаются
              // min1 min2 max1 max2
              return [...res, { min: box.min, max: value.zmin - 1 }];
            } else if (box.min <= value.zmax && box.max >= value.zmax) {
              // диапазоны частично пересекаются
              // min2 min1 max2 max1
              return [...res, { min: value.zmax + 1, max: box.max }];
            } else {
              // диапазоны не пересекаются — ничего не меняем
              // min1 max1 min2 max2
              // min2 max2 min1 max1
              return [...res, box];
            }
          }, []);
        }
      }
    }
  });

  const count = Object.keys(boxes).reduce((xres, x) => {
    xres += Object.keys(boxes[x]).reduce((yres, y) => {
      const newBoxes = new Set();

      if (boxes[x][y].length === 1) newBoxes.add(`${boxes[x][y][0].min}_${boxes[x][y][0].max}`);
      if (boxes[x][y].length > 1) {
        // пробуем объединить полученные диапазоны
        boxes[x][y].forEach((box, i) => {
          const remainingBoxes = boxes[x][y].filter((_, ii) => ii !== i);
          const noIntersections = remainingBoxes.every(rb => box.max < rb.min || rb.max < box.min);

          if (noIntersections) {
            newBoxes.add(`${box.min}_${box.max}`);
          }
          if (!noIntersections) {
            remainingBoxes
              .filter(rb => !(box.max < rb.min || rb.max < box.min))
              .forEach(rb => {
                newBoxes.add(`${Math.min(box.min, rb.min)}_${Math.max(box.max, rb.max)}`);
              });
          }
        });
      }
      yres += [...newBoxes].reduce((zres, nb) => {
        const [min, max] = nb.split('_').map(v => parseInt(v));
        return zres + (max - min + 1);
      }, 0);
      return yres;
    }, 0);
    return xres;
  }, 0);

  console.log(count);
};

const n20b = () => {
  const input = `Player 1 starting position: 2
                 Player 2 starting position: 10`;

  const players = input.split('\n').map((p, i) => {
    const position = parseInt(p.substr(p.indexOf(':') + 2)) - 1;
    return { id: i + 1, score: 0, position };
  });

  const checkWinner = () => players.findIndex(p => p.score >= 21);

  const shiftPosition = (position, roll) => (position + roll) % 10;

  const counts = {
    3: 1, // 111
    4: 3, // 112, 121, 211
    5: 6, // 113, 131, 311, 122, 212, 221
    6: 7, // 123, 132, 213, 231, 312, 321, 222
    7: 6, // 223, 232, 322, 133, 313, 331
    8: 3, // 233, 323, 332
    9: 1, // 333
  };

  const createUniverses = (player) => {
    const winner = checkWinner();

    if (winner !== -1) {
      return winner === 0
        ? { p0: 1, p1: 0 }
        : { p0: 0, p1: 1 };
    }

    const sum = { p0: 0, p1: 0 };

    for (let roll = 3; roll <= 9; roll++) {
      const multiplier = counts[roll];
      const oldPosition = players[player].position;
      const oldScore = players[player].score;

      players[player].position = shiftPosition(players[player].position, roll);
      players[player].score += (players[player].position + 1);

      const universe = createUniverses(player === 0 ? 1 : 0);

      sum.p0 += multiplier * universe.p0;
      sum.p1 += multiplier * universe.p1;

      players[player].position = oldPosition;
      players[player].score = oldScore;
    }

    return sum;
  }

  const result = createUniverses(0);

  console.log(result);
};

const n20a = () => {
  const input = `Player 1 starting position: 2
                 Player 2 starting position: 10`;

  const players = input.split('\n').map((p, i) => {
    const position = parseInt(p.substr(p.indexOf(':') + 2)) - 1;
    return { id: i + 1, score: 0, position };
  });

  const endOfGame = () => !!players.find(p => p.score >= 1000);

  const shiftPosition = (position, roll) => (position + roll) % 10;

  let roll = 1;

  while (!endOfGame()) {
    for (let p = 0; p < players.length; p++) {
      const currentRoll = 3 * roll + 3;

      players[p].position = shiftPosition(players[p].position, currentRoll);
      players[p].score += (players[p].position + 1);

      roll += 3;

      if (players[p].score >= 1000) break;
    }
  }

  const minScore = Math.min(...players.map(p => p.score));

  console.log(minScore * (roll - 1));
};

const n19a = () => {
  const input = `--- scanner 0 ---
    404,-588,-901
    528,-643,409
    -838,591,734
    390,-675,-793
    -537,-823,-458
    -485,-357,347
    -345,-311,381
    -661,-816,-575
    -876,649,763
    -618,-824,-621
    553,345,-567
    474,580,667
    -447,-329,318
    -584,868,-557
    544,-627,-890
    564,392,-477
    455,729,728
    -892,524,684
    -689,845,-530
    423,-701,434
    7,-33,-71
    630,319,-379
    443,580,662
    -789,900,-551
    459,-707,401

    --- scanner 1 ---
    686,422,578
    605,423,415
    515,917,-361
    -336,658,858
    95,138,22
    -476,619,847
    -340,-569,-846
    567,-361,727
    -460,603,-452
    669,-402,600
    729,430,532
    -500,-761,534
    -322,571,750
    -466,-666,-811
    -429,-592,574
    -355,545,-477
    703,-491,-529
    -328,-685,520
    413,935,-424
    -391,539,-444
    586,-435,557
    -364,-763,-893
    807,-499,-711
    755,-354,-619
    553,889,-390

    --- scanner 2 ---
    649,640,665
    682,-795,504
    -784,533,-524
    -644,584,-595
    -588,-843,648
    -30,6,44
    -674,560,763
    500,723,-460
    609,671,-379
    -555,-800,653
    -675,-892,-343
    697,-426,-610
    578,704,681
    493,664,-388
    -671,-858,530
    -667,343,800
    571,-461,-707
    -138,-166,112
    -889,563,-600
    646,-828,498
    640,759,510
    -630,509,768
    -681,-892,-333
    673,-379,-804
    -742,-814,-386
    577,-820,562

    --- scanner 3 ---
    -589,542,597
    605,-692,669
    -500,565,-823
    -660,373,557
    -458,-679,-417
    -488,449,543
    -626,468,-788
    338,-750,-386
    528,-832,-391
    562,-778,733
    -938,-730,414
    543,643,-506
    -524,371,-870
    407,773,750
    -104,29,83
    378,-903,-323
    -778,-728,485
    426,699,580
    -438,-605,-362
    -469,-447,-387
    509,732,623
    647,635,-688
    -868,-804,481
    614,-800,639
    595,780,-596

    --- scanner 4 ---
    727,592,562
    -293,-554,779
    441,611,-461
    -714,465,-776
    -743,427,-804
    -660,-479,-426
    832,-632,460
    927,-485,-438
    408,393,-506
    466,436,-512
    110,16,151
    -258,-428,682
    -393,719,612
    -211,-452,876
    808,-476,-593
    -575,615,604
    -485,667,467
    -680,325,-822
    -627,-443,-432
    872,-547,-609
    833,512,582
    807,604,487
    839,-516,451
    891,-625,532
    -652,-548,-490
    30,-46,-14`;

  const data = input.split('\n\n').map(scannerInput =>
    scannerInput.split('\n').slice(1).map(coordsInput => {
      const [x, y, z] = coordsInput.trim().split(',');
      return [parseInt(x), parseInt(y), parseInt(z)];
    })
  );

  const getOrientations = (s1, s2) => {
    const angles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];

    const vectors = [];

    for (xAngle of angles) {
      const mx = [
        [1, 0, 0],
        [0, Math.cos(xAngle), -Math.sin(xAngle)],
        [0, Math.sin(xAngle), Math.cos(xAngle)],
      ];

      for (yAngle of angles) {
        const my = [
          [Math.cos(yAngle), 0, Math.sin(yAngle)],
          [0, 1, 0],
          [-Math.sin(yAngle), 0, Math.cos(yAngle)],
        ];

        for (zAngle of angles) {
          const mz = [
            [Math.cos(zAngle), -Math.sin(zAngle), 0],
            [Math.sin(zAngle), Math.cos(zAngle), 0],
            [0, 0, 1],
          ];
          //const beacons = data[s2].map(vector => {
          const vector = [1, 2, 3];

          const vectorX = [
            vector[0] * mx[0][0] + vector[1] * mx[1][0] + vector[2] * mx[2][0],
            vector[0] * mx[0][1] + vector[1] * mx[1][1] + vector[2] * mx[2][1],
            vector[0] * mx[0][2] + vector[1] * mx[1][2] + vector[2] * mx[2][2],
          ];
          const vectorY = [
            vectorX[0] * my[0][0] + vectorX[1] * my[1][0] + vectorX[2] * my[2][0],
            vectorX[0] * my[0][1] + vectorX[1] * my[1][1] + vectorX[2] * my[2][1],
            vectorX[0] * my[0][2] + vectorX[1] * my[1][2] + vectorX[2] * my[2][2],
          ];
          const vectorZ = [
            Math.round(vectorY[0] * mz[0][0] + vectorY[1] * mz[1][0] + vectorY[2] * mz[2][0]),
            Math.round(vectorY[0] * mz[0][1] + vectorY[1] * mz[1][1] + vectorY[2] * mz[2][1]),
            Math.round(vectorY[0] * mz[0][2] + vectorY[1] * mz[1][2] + vectorY[2] * mz[2][2]),
          ];

          console.log(xAngle / Math.PI, yAngle / Math.PI, zAngle / Math.PI, vectorZ);

          vectors.push(vectorZ);
          //return vectorZ;
          //});

          /*const diffs = {};

          data[s1].forEach(([x, y, z]) =>
            beacons.forEach(vector => {
              const key = `${vector[0] - x}_${vector[1] - y}_${vector[2] - z}`;
              diffs[key] = diffs[key] ? diffs[key] + 1 : 1;
            })
          );

          console.log(diffs);*/
        }
      }
    }
    console.log(vectors);
    console.log(vectors.reduce((res, v) => {
      const key = `${parseInt(v[0])}_${parseInt(v[1])}_${parseInt(v[2])}`;
      res[key] = res[key] ? res[key] + 1 : 1;
      return res;
    }, {}));
  };

  console.log(getOrientations(0, 1));
};

n19a();

const n18b = () => {
  const algorithm = '##....###.#.##...##....####..###.#.######.#.#.##.#.####.#.#####.##.##..##.###.###..##.##..#####.##..#..##..#...#.####..#.###..#....####.#..##.##...#######.###...#.######..#..#...###..###.#####.##..#.#.###.#.###.#..#.###.###.#..##.....####..#.##.##.#..#...###.#.....##..#....#.##..#....#....####.#...#.#.##.#...#.##..#..#.#..###.###.#.##...##.#.##.##..#..##.#..#...######.#.#..###....##...##....#....##....#.#..##..#####.####.#.##...#...#.#.#....#.####...#.##..#...#..#....#..#..#..##.#.#.#.#######.###..##.#.....';
  const data = `#...##.##.#..#..#..#.....##.#.#..#.###.####...####.#.###.....#.########..###...###....#......###...#
                ####.##.#.###.#.##....##..##.....####..#.##.....##.###.#..#...####..#..###..###.#...##..#.#..#.#####
                ###.#..#..#..##..#..#.###..#..###.###.#.###......###.##.#.##.#........#..#...#..#...#.##..#.##.....#
                .#.#..#..#.####..##.#...##...#.##.#...##.....#.####.#.##.#.#..####.#.#..#..###.#..###......##.##....
                ###.##......####..#.#..#.##.###.##.##..#####.#.#...#.###.#.#.#....####..#.####..#..##...###.##.#..##
                .#####.#..##..###.#..#..#..##..#.##.##..##..#####..#.#.#.##....##.#.###.#####.##..##.#..####...###.#
                ..#..##..########...#...##....#.#..#.#.###.#...#.#..#####.###...##.#..#.##.##..#.#.#....#...##.....#
                .......##..............##...#.####....#####.###.###.#.#..#.#.####.###.#####.##..#.....####.#...##...
                #..#...##.#.##...##.####..##.....###.#.##.#####.##...#.#.###.#.##..#..#.####..###..##.##...#...#.#.#
                .#....##.#..#########.#.##.##.####....####.#..#..#...#....###.#..#.##.##...#.########.#...##.#.#####
                .....##.###.##.##..##...#....#.##.#.###...###..#..###.#.##....###.###..#...####........#..##.##...##
                ##.##.##..#....#.#..#..##..#..#.####..###....######.####..#...#.#..####.....#.#.##.#.#..##..#.#.#.#.
                #######....###.###...###..###..#..#.#..#...##.##.#.##.#.#..#.#.##.#.#####.##..######.####..##..##.##
                #..#.#..#..#.#......###....##....##.###.##.#..##..###.#..###.##..####..#....####.#...####..#.....##.
                .#.####......###.....#.#.##...##.###.##....#.##...#.#.....###.#..#.###...#...#..#..##.##..#..#.#.#..
                #.#...#.####..##...#.####.##....##.##.......#######...#.#..##.##.....#...#..###....#...#..#.......##
                ####.##..#..#...######.##..##.#.######..#####..###.###.#.....###.#.###...###.##...##.#......#.#.####
                ####..#..#......##.......######.#####....#..#..##.##.##.#.##.....#..##.###.....###.##.#..##.##.##.##
                ..##.#.#####...#.##.#.#.##...#..##.######.#.#.#####...#..##.##..##..#.##.....##.##.#.#.#.##...#.#..#
                .#.#.....#..#..#.###.##.##...###...########.####.####..##.###....##..###.#..###..###.....#.##..#.#.#
                ##.#.##.....#....#.#.....###..#..##.#.##..##.###...#..#...###.....####.#..##.##..#...#.##.##......#.
                .###.#.#..####.#.#..#.##..#.#.#...######.#.#########.####...#.#.#..##...#.#...#...#...#.##..........
                .###.###...##..#..##.##.#...#.#..###.##.#...####.######..##.#.....##.#####..#....#.###.###.#####.##.
                #..###.######....##....####..#...#..##...#.###..#..###...###.#...#...##...##.#.##.##....#..#........
                .#...#..####.####......#..##....#.#....####..##.#..#.##......#.##.....####..####..#.#...#.##...####.
                #.####.#..####..#..#.######.##.#####....#.####.#...#.#.#..#.#.###..#..#....#.#.#.#..#.###.....#....#
                ....##.###..###.###.#.##.##.##.#.###..###.#..#..#####....##.#...##.##.#.....#.##.##.#.#####..#####..
                ..#.##.#.###.#....#.#..#.######..#......##.....##.##....#...#.#.###.#...#..#.###..#.#.##.#....#..###
                ####.....#.#.#.#.#..#...#.###.##.#..#..#.##.#.##.#...#..###..#.....#....#......#.#...#.##.##.#..#.#.
                ..##...##...###.##.####.#....#...#.###..#.##.#..##....#....#.#.#...........###.##....#..###.#.######
                .#.#...####...##..##.#.#..#...#.#.########.####..#..###.#..##.##..###.#.##.#....#..###....#..##....#
                #.###.##.###.###.####...##.#..##..#.#..#.#.##.#.#.##...#..#.#..#.##.#..#...##.###.....#####.#.....##
                ....##........##.##....##......#...#.#...##.#.##.##.##..###....###..#...####.####.####.#..##.##.#..#
                .###.#.#..#..##..#.#..#.###..#####...###......#..##.#######...##.###...#...#..#...##...##.###.#..#.#
                #..##.##..#.####...#.###.###.###....####.#####.##...####.###.#.#####.#####.#..#.#####..#.###.#..#.#.
                ..#..#.....##..##.#.##.#.....#..#####.###....#.##.#.##....#.....##....##.#.###.#......#.#.#.#####...
                ######..#.#.##.#####.#.##...#####..#.##.###..##..#..#.###.#.#..#.#.....##..#...##.#...#...#..##..#..
                .##.#########..###........###.####.#..#...#..#.####......##..#####.#.#.##.##.#...##....##..#.###..#.
                ..#..#..#.##....##..#..#.....###.#....####..####.#.##.#..####.#.#...#.#.###..#..#####...#...#.#.#..#
                ...###.##...##......#.##.#.#..#..#...###..#########..##.....#####..###.###.....##.....####.##.###..#
                ####..##...####.#.###..##.#.##.#.#...#.....#..###.#####....#.##.####..#.##.....##..#.#.##..##.#...##
                ..####....##....#...#.#..###...#.#....##...##..###.#.####.#....##.###.######..######...##....#.##.##
                ##..#.#.#..###.####.#..#.##.###...#.#...###.##.#.#.#.#.#.#.#.#.....##.#..#.#.##.....#..##.......##.#
                ...#####.#..##.##.#...##..#.##...#.##...##....#.#.#..#.#.#.#.#.#.#..##..#.#..#.#.#.#.#.###.#...####.
                .#..#.#####.#.##..##..#..##..#.####.###......##.####.#.###.######...###..#..####.#...#.#..##....#...
                ##..#.##.##....#..###.#...##..###.#.#..##..#.#..#.#...##.###.#####.#..#...#.#..##.#..##.####.#..#.##
                .#.##..####.#...#.##.#.#...#..##..#.#......#..###..#...#....###...##...##..##....#..###.##...#####.#
                #..#.#.#..##..#..###..#.#.###.......#####.##.##.##..#..###.#.#.#.######..###..#..###.###.#..####...#
                ..###...##.##.##..##.#.##.##.#.######....####...##.#.###.#####...####.#...#...#.#..###....#.##...#.#
                #.###.##.#.##.#.##.#..##...##.#.####.###.###....#.##..#.##..#.#..#.#..##....#..#####...#####.##....#
                #...##.#####..#..###########.###.....###....###.#.#..#########.#.###.##..#.##.#.#....#.##.##.#.#.##.
                #...#...##..###....##.#...##..#..#..##.##...#..#...##....###.......#####..#...#.#..#....#.#.##.##.##
                .##...#..#.####.##...#..##..####..##..#..######.......#.#...#.#..#...#.#.#..###..#.##.##...##....###
                #######.#.#..#.#.###.##.##...#...#....#...##.#..#.##....#..#.#####..#.####...####.##.##..#####.##.##
                ###..###....##...####.#.#.###......#.###...#.#..#...#####...#.######.#...#.##..##.#...##.#..##.###.#
                .#.....#.#..#.#...#.##.#.###....###..#.#.#.##...##....#....#...#.#..##.....#..#.....####.#..#..#....
                .###.##....#.#.#.#...#.####...#.##..##.#.##.##.#.####.#.#..####.####.##...###....###..##..##.#.#####
                ...#.##.###.###.#.##.#.##.##..##.##..#..##..##.########.#..##...###.#.###...#...#.....#...#.....###.
                ##.#.##...###...######.#.....#.#.....#.#.#.####..#..##..##.#####....###.#.##....####...#....##..#..#
                .#.##..##.##.##########..#..#.#..#####.#####..####.##.#...#.#.##..#..#.##..#...###....#..#.....#..#.
                ###..##...##.#.###....####....#..##.###.....#####..#.#.#..####.####....######.##.#.###.#.####.##..#.
                #.##.#....#.#...##.#..####.#.##.###.##..##..###.#....##....#.#.#.#.#####.#######...##.##.#.....#...#
                ..###.####.##.#.#..#..###.#.#...###..#...#.#.#...#.#.#.#....#.##.#.####...#..#...###...####..#.#..#.
                ....##.#.####..###.##.###....#########..#.#..##..#....#..###...#.....#.###.##..#.#....###.#.#..#..#.
                ..#....##########..##.#####.###.###.#....#.#..#.##.#...#..###.##..#..###..#######..##...##..#...#...
                #..#...............#.#.#.#.....###..##.....####..#...#...####.#......###.##.######....#...#......#..
                .....####.##...#....##..#....######.##.#...##.#.##...####...#.#..####..###.#.#.#######....#.###.##..
                ...##.#.#####.#####.#..#.#...####......##.##.#..#.#.#..####.#######.##..##.##.....##.#.#.##..####..#
                ##...##....#.#....#..#.###.#....#.###.##.#.##.##.###.##.....###.#..#..##...#.##.....###...######...#
                #....###.#.#########.#..#.#.##...######..##.#.#..##.###...#..#..###..#####.#..####.....####.#..#.#.#
                .##.###.##...#.###..###.#...#..###.##.##..#.....#....#..#.#...#.##..#..#.#..#.###.######.##.#.#...##
                .#..#.....##.#..##.#.....#..###...#####...#...#..#.#...#..#....#.#..#....###.###.#####..#.#..##.....
                #..#..#.#...##.##...#..#..####.###..###.#....#.#..#.#.####.#..#.###.###........###....#..###...#...#
                ##.#.##....#.####..#.....##.........#.#...####...#...##.#########.#.#.##....#....#.##...##.....#####
                .##.#..#.#.#..####....###.#.##...#.....#....##.#.#..#####.###.....#.####...##.#..#####..#.#...#...##
                ..######..#.###.###.#..#.#####.#.##.#.##..####.#....##.##...#.#..####...##...###..###...#.#####.##.#
                .#.#.###...#..####.#.#..#.#..#..#..###...#.#...####..##.##...#.#.##..###..###.##.#..###.#.#.#..###.#
                #..##..##..##.........#.#......#....#.#####....#..#.##.####.#.#.#...#.....#.#..#.###.#....###.....##
                ..#####.#.##...#.#.#..#.....####......##..####.#..##....#...#.####.....##..###.##...###.#.###.###.##
                .#.##.##.#.######.#.....#.###..###....#.....###...#..##....#..##.#...######.....#.##..#####.#.#####.
                ..#.###.#.##...######..#..#..###.#.#....##.#..#....#....###.#.#..##.#..#.##..##....#..##.#######..##
                .#.....##.#...#.####..#..###.####.###..##.#..#..#..#.###.###...#.#.##..#..###..####..###.#..#.##.#..
                ##..######...####.##..#.#.######.#..#.####.#..#...#.#.##..#...###.#.....####..####.#...#.....#...#.#
                #.#.#....#..#.#...##.##..##.####.######...###.#.#..#..#.#.###..##.#..##.###..##..###.###.#...##..###
                ..#####.#..##.##.#.####.###.#....##...#.###.##..#.#.#.###.#.#....#.#.#..###.##.#..#....###...#...##.
                ....####..##.##.#....##..###.##.###..######....#.##.##..#..#####...##.....#..##..#.##..#.......#...#
                #...##.###..#..#.....#..#.##..#.######.....#.#######....#...######.####...#.##..#..###.#..#.......##
                ###..##.########....###.#.##.###.#..#.####.#.###.###...##...##..####.#...##...#.###..#####.###....#.
                #.##..#..####..##..###.#.##.....##..##...#.###.#..#.##.##..#..##.###.#..###..###.#.##..#....#..###..
                ..#######.####.....#.#######.#.#..#.#...#.#..###....#...#..###..##...#....#...#.#.##.##..#..#....#.#
                .....#.#..#..#...#.....##..#......#.##.#.#..#####..#.###.##.##...#.#...#...##.#.#####.#####..###..##
                .#.##..#.....#..#..####.#.##...##.#...###.#.#..#####.#.#.####..###..#.#.##..#..####.##.##..####..#..
                #.#####....##.......#...#.##..#..#..##......#...##..####..###...#..#..#.#.###...##.###.####..###..#.
                #.##...#.###.#.##..####..##..###.###..........####..#.##.....#.#..##########.#.##.#.#..#...##.#.##..
                #.#.#..##.#..###..###..##......###.#.##.#.#.###.##.###....#....#..###.#.#..####.#..#####.#######..#.
                ##.##..####....#..##..##.#.#...##..#####.#.#...##..##..###..#.#.##..#.####...#.###..#.#.##......##.#
                ##......#.#..##...#..#.#.#.....#...#....####.#.###.......###.#.###...#.#.#.#####.#....##..#.#.......
                ###.##..##..###..##..######..#..#.#...#####..##..#...##.#...#..#.##..#..###.#....##.#.##..##.#.#.#.#
                ####.##.#....#.###.#..#.#####..#.#..#..##...######.###...##..#.#....##.#..####..#...#.#.#.##..##....
                .####.#.##...#.##..#.##.#...##..######.###.#..#.###.#######.#.......#.#.###.#######.#.#.#.....##..#.`;

  const expandImage = (image, count) => {
    const empty = new Array(count).fill([]);
    const emptyRow = new Array(count).fill('0');

    const expanded = [...empty]
      .concat(image)
      .concat([...empty])
      .map(row => {
        if (!row.length) return new Array(image[0].length + emptyRow.length * 2).fill('0');
        return [...emptyRow].concat(row).concat([...emptyRow]);
      });

    return expanded;
  };

  const enchant = (image, enchanter, bit) => {
    return image.reduce((res, inputRow, i, array) => {
      const outputRow = inputRow.reduce((resRow, v, j, row) => {
        const value =
          (i > 0 && j > 0 ? array[i - 1][j - 1] : bit) +
          (i > 0 ? array[i - 1][j] : bit) +
          (i > 0 && j < array.length - 1 ? array[i - 1][j + 1] : bit) +
          (j > 0 ? row[j - 1] : bit) + v +
          (j < array.length - 1 ? row[j + 1] : bit) +
          (i < row.length - 1 && j > 0 ? array[i + 1][j - 1] : bit) +
          (i < row.length - 1 ? array[i + 1][j] : bit) +
          (i < row.length - 1 && j < array.length - 1 ? array[i + 1][j + 1] : bit);

        resRow.push(enchanter[parseInt(value, 2)]);
        return resRow;
      }, []);

      res.push(outputRow);
      return res;
    }, []);
  };

  const inputImage = data.split('\n')
    .map(row => row.replace(/ /g,'').split('').map(v => (v === '#' ? '1' : '0')));

  const expandedImage = expandImage(inputImage, 50);

  const enchanter = algorithm.split('').map(v => (v === '#' ? '1' : '0'));

  let output = expandImage(inputImage, 50);
  let bit = '0';

  for (let i = 0; i < 50; i++) {
    output = enchant(output, enchanter, bit);
    
    if (bit === '0') bit = '1';
    else bit = '0';
  }

  const count = output.reduce((res, row) => {
    const value = row.filter(v => v === '1').length;
    return res + value;
  }, 0);

  console.log(count);
};

const n18a = () => {
  const input = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]\n[[[5,[2,8]],4],[5,[[9,9],0]]]\n[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]\n[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]\n[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]\n[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]\n[[[[5,4],[7,7]],8],[[8,3],8]]\n[[9,3],[[9,9],[6,[4,9]]]]\n[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]\n[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

  const parse = (str) => {
    const list = [];

    let depth = 0;
    let left = true;

    for (let i = 0; i < str.length; i++) {
      if (str[i] === '[') {
        depth += 1;
        left = true;
      }
      if (str[i] === ']') {
        depth -= 1;
        left = true;
      }
      if (str[i] === ',') {
        left = false;
      }

      if (/^\d+$/.test(str[i])) {
        list.push({
          value: +str[i],
          depth,
          pair: left ? 1 : -1,
        });
      }
    }

    return list;
  };

  const concat = (list, addList) =>
    list.concat(addList).map(v => ({ ...v, depth: v.depth + 1 }));

  const explode = (list) => {
    const index = list.findIndex(v => v.depth === 5);

    if (index === -1) return false;

    if (index > 0) list[index - 1].value += list[index].value;
    if (index < list.length - 2) list[index + 2].value += list[index + 1].value;

    let pair = 1;

    if (index === list.length - 2) pair = -1;
    else if (index > 0 && list[index - 1].depth === list[index].depth - 1 && list[index - 1].pair === 1) pair = -1;

    list.splice(index, 2, {
      value: 0,
      depth: list[index].depth - 1,
      pair,
    });

    return true;
  };

  const split = (list) => {
    const index = list.findIndex(v => v.value > 9);

    if (index === -1) return false;

    list.splice(
      index,
      1,
      { value: Math.floor(list[index].value / 2), depth: list[index].depth + 1, pair: 1 },
      { value: Math.ceil(list[index].value / 2), depth: list[index].depth + 1, pair: -1 },
    );

    return true;
  };

  const add = (list1, list2) => {
    const list = concat(list1, list2);

    while (true) {
      while(explode(list));

      if (!split(list)) {
        break;
      }
    }

    return list;
  };

  const calculate = (list) => {
    while (list.length > 1) {
      const index = list.findIndex((v, i, arr) =>
        v.depth === arr[i + 1].depth && v.pair === 1 && arr[i + 1].pair === -1);

      let pair = 1;

      if (index === list.length - 2) pair = -1;
      else if (index > 0 && list[index - 1].depth === list[index].depth - 1 && list[index - 1].pair === 1) pair = -1;

      list.splice(index, 2, {
        value: list[index].value * 3 + list[index + 1].value * 2,
        depth: list[index].depth - 1,
        pair,
      });
    }

    return list[0].value;
  }

  const data = input.split('\n');

  let list = parse(data.shift());

  data.forEach(item => {
    list = add(list, parse(item));
  });

  console.log(calculate(list));
};

const n17b = () => {
  const xmin = 206;
  const xmax = 250;
  const ymin = -105;
  const ymax = -57;

  const answer = new Set([]);

  for (let y = ymin; y <= ymax; y++) {
    const steps = 2 * Math.abs(y + 1) + 2;

    for (let step = 1; step <= steps; step++) {
      for (let x = xmin; x <= xmax; x++) {
        const stepx = Math.min(step, (-1 + Math.sqrt(1 + 8 * x)) / 2);
        const stepy = step;

        const vx = x / stepx + (stepx - 1) / 2;
        const vy = y / stepy + (stepy - 1) / 2;

        if (Number.isInteger(vx) && Number.isInteger(vy)) {
          answer.add(`${vx}, ${vy}`);
        }
      }
    }
  }

  console.log(answer);
  console.log(answer.size);
};

const n16b = () => {
  const inputHex = `420D50000B318100415919B24E72D6509AE67F87195A3CCC518CC01197D538C3E00BC9A349A09802D258CC16FC016100660DC4283200087C6485F1C8C015A00A5A5FB19C363F2FD8CE1B1B99DE81D00C9D3002100B58002AB5400D50038008DA2020A9C00F300248065A4016B4C00810028003D9600CA4C0084007B8400A0002AA6F68440274080331D20C4300004323CC32830200D42A85D1BE4F1C1440072E4630F2CCD624206008CC5B3E3AB00580010E8710862F0803D06E10C65000946442A631EC2EC30926A600D2A583653BE2D98BFE3820975787C600A680252AC9354FFE8CD23BE1E180253548D057002429794BD4759794BD4709AEDAFF0530043003511006E24C4685A00087C428811EE7FD8BBC1805D28C73C93262526CB36AC600DCB9649334A23900AA9257963FEF17D8028200DC608A71B80010A8D50C23E9802B37AA40EA801CD96EDA25B39593BB002A33F72D9AD959802525BCD6D36CC00D580010A86D1761F080311AE32C73500224E3BCD6D0AE5600024F92F654E5F6132B49979802129DC6593401591389CA62A4840101C9064A34499E4A1B180276008CDEFA0D37BE834F6F11B13900923E008CF6611BC65BCB2CB46B3A779D4C998A848DED30F0014288010A8451062B980311C21BC7C20042A2846782A400834916CFA5B8013374F6A33973C532F071000B565F47F15A526273BB129B6D9985680680111C728FD339BDBD8F03980230A6C0119774999A09001093E34600A60052B2B1D7EF60C958EBF7B074D7AF4928CD6BA5A40208E002F935E855AE68EE56F3ED271E6B44460084AB55002572F3289B78600A6647D1E5F6871BE5E598099006512207600BCDCBCFD23CE463678100467680D27BAE920804119DBFA96E05F00431269D255DDA528D83A577285B91BCCB4802AB95A5C9B001299793FCD24C5D600BC652523D82D3FCB56EF737F045008E0FCDC7DAE40B64F7F799F3981F2490`; // `D2FE28`;

  const input = inputHex
    .split('')
    .map(v => {
      const parsed = parseInt(v, 16).toString(2);
      return '0000'.substr(parsed.length) + parsed;
    })
    .join('');

  const parsePacket = (str) => {
    const version = parseInt(str.substr(0, 3), 2);
    const typeId = parseInt(str.substr(3, 3), 2);

    console.log('');
    console.log('version =', version, 'typeId =', typeId);

    if (typeId === 4) {
      const data = str.substr(6);
      const groups = [];

      let last = false;
      let bit = '';
      let i = 0;

      while (!last) {
        if (i % 5 === 0) {
          if (bit) {
            groups.push(bit);
            bit = '';
          }
          last = data[i] === '0';
        } else {
          bit += data[i];
        }
        i++;
      }
      groups.push(data.substr(i, 4));

      const result = parseInt(groups.join(''), 2);
      console.log('value =', result);

      return { data: data.substring(i + 4), value: result };
    } else {
      const lengthTypeId = str[6];

      console.log('lengthTypeId =', lengthTypeId);

      const length = lengthTypeId === '0' ? 15 : 11;
      const count = parseInt(str.substr(7, length), 2);

      let data = str.substr(7 + length);
      let i = 0;
      let values = [];

      if (lengthTypeId === '0') {
        console.log('bits count =', count);

        while (str.length - 7 - length - data.length < count) {
          const res = parsePacket(data);
          data = res.data;
          values.push(res.value);
        }
      } else {
        console.log('packets count =', count);

        for (let p = 0; p < count; p++) {
          const res = parsePacket(data);
          data = res.data;
          values.push(res.value);
        }
      }

      let result;
      if (typeId === 0) {
        result = values.reduce((r, v) => r + v, 0);
      } else if (typeId === 1) {
        result = values.reduce((r, v) => r * v, 1);
      } else if (typeId === 2) {
        result = Math.min(...values);
      } else if (typeId === 3) {
        result = Math.max(...values);
      } else if (typeId === 5) {
        result = values[0] > values[1] ? 1 : 0;
      } else if (typeId === 6) {
        result = values[0] < values[1] ? 1 : 0;
      } else if (typeId === 7) {
        result = values[0] === values[1] ? 1 : 0;
      } else {
        result = '-';
      }

      return { data: data.substr(i), value: result };
    }
  }

  console.log('\n----\n', parsePacket(input).value);
};
