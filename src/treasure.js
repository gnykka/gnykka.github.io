(() => {
  const createSvgElement = (tag, classes, { ...options }) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);

    element.setAttribute('class', classes);

    Object
      .entries(options || {})
      .forEach(([key, value]) =>
        element.setAttribute(key, value)
      );

    return element;
  };

  const randomStep = (margin) => {
    const min = -margin * 0.1;
    const max = margin * 0.1;
    const middle = (max + min) / 2;
    const delta = (middle - min) / (max - min);
    const rand = Math.random();

    if(rand < delta){
      return min + Math.sqrt(rand * (max - min) * (middle - min));
    }
    return max - Math.sqrt((1 - rand) * (max - min) * (max - middle));
  };

  const createPointsArray = (rect, margin, step) => {
    const width = rect.width;
    const height = rect.height;

    const points = [];
    let x = 0;
    let y = 0;

    //draw left column
    for (let i = margin; i < height - margin; i += step) {
      y = i;
      x = x + randomStep(margin);
      points.push({ x: x + margin, y });
    }
    //draw bottom row
    for (let i = x; i < width - margin * 2; i += step) {
      x = i;
      y = y + randomStep(margin);
      points.push({ x: x + margin, y });
    }
    //draw right column
    for (let i = y; i > margin; i -= step) {
      y = i;
      x = x + randomStep(margin);
      points.push({ x: x + margin, y: y });
    }
    //draw top row
    for (let i = x; i > 0; i -= step) {
      x = i + margin;
      y = y + randomStep(margin);
      points.push({ x: x, y: y });
    }

    const last = points[points.length - 1];
    const min = points.slice(0, height / step).reduce((res, p, index) => {
      const v = Math.sqrt((last.x - p.x) * (last.x - p.x) + (last.y - p.y) * (last.y - p.y));
      if (!res || v < res.v) res = { i: index, v };
      return res;
    }, null);

    points.splice(0, min.i);

    return points;
  }

  // TODO: добавлять path в clipPath
  // TODO: вместо path — rect с clip-path
  // TODO: остров-круг с clip-path в случайном месте на карте
  // TODO: менять круг, превращая в похожую на остров форму
  // TODO: случайная скорость и длина анимации + останавливать на текущем месте при mouseleave

  window.addEventListener('load', () => {
    const map = document.getElementsByTagName('svg')[0];
    const margin = 80;
    const step = 8;
    const rect = map.getBoundingClientRect();

    const renderMapBorder = () => {
      const points = createPointsArray(rect, margin, step);
      let pathString = points.reduce((res, p, index) => {
        if (index === 0) res += `M${p.x},${p.y}`;
        else res += `L${p.x},${p.y}`;
        return res;
      }, '');
      pathString += `L${points[0].x},${points[0].y}`;

      const path = createSvgElement(
        'path', '', { d: pathString },
      );
      map.appendChild(path);
    };

    const renderCompass = () => {
      const size = margin;
      const diff = 5;
      const radius = size * 0.5;
      const pos = {
        x: Math.random() < 0.5 ? 20 : (rect.width - margin - 20),
        y: Math.random() < 0.5 ? 40 : (rect.height - margin - 20),
      };

      const compass = createSvgElement('g', 'compass', {});
      const circle = createSvgElement(
        'circle', '',
        { cx: pos.x + radius, cy: pos.y + radius, r: size * 0.2 },
      );

      const vLine = createSvgElement(
        'path', '',
        { d: `M${pos.x + radius},${pos.y - diff} v${size + diff * 2}` },
      );
      const hLine = createSvgElement(
        'path', '',
        { d: `M${pos.x},${pos.y + radius} h${size}` },
      );
      const d1Line = createSvgElement(
        'path', '',
        { d: `M${pos.x + size * 0.25},${pos.y + size * 0.25} L${pos.x + size * 0.75},${pos.y + size * 0.75}` },
      );
      const d2Line = createSvgElement(
        'path', '',
        { d: `M${pos.x + size * 0.25},${pos.y + size * 0.75} L${pos.x + size * 0.75},${pos.y + size * 0.25}` },
      );

      const nLabel = createSvgElement(
        'text', 'horizontal',
        { x: pos.x + radius, y: pos.y - diff * 3 }
      );
      const nLabelNode = document.createTextNode('N');
      nLabel.appendChild(nLabelNode);

      const ax = pos.x + radius;
      const arrow = createSvgElement(
        'path', '',
        { d: `M${ax},${pos.y - diff} L${ax + diff},${pos.y + diff * 2} L${ax},${pos.y + diff} L${ax - diff},${pos.y + diff * 2}Z` },
      );

      compass.appendChild(circle);

      compass.appendChild(vLine);
      compass.appendChild(hLine);
      compass.appendChild(d1Line);
      compass.appendChild(d2Line);

      compass.appendChild(nLabel);
      compass.appendChild(arrow);

      map.appendChild(compass);
    };

    renderMapBorder();
    renderCompass();
  });
})();