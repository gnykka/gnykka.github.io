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

  const getRandomMultiplier = (mult) => {
    const sign = Math.random() > 0.5 ? 1 : -1;
    return Math.random() * mult * sign;
  }

  window.addEventListener('load', () => {
    const map = document.getElementsByTagName('svg')[0];
    const margin = 70;
    const step = 6;
    const boundingRect = map.getBoundingClientRect();
    const cross = {
      cx: margin * 1.5 + Math.random() * (boundingRect.width - margin * 3),
      cy: margin * 1.5 + Math.random() * (boundingRect.height - margin * 3),
    };
    const crossSize = 6;

    let pathString;

    const addClipPath = () => {
      const points = createPointsArray(boundingRect, margin, step);

      pathString = points.reduce((res, p, index) => {
        if (index === 0) res += `M${p.x},${p.y}`;
        else res += `L${p.x},${p.y}`;
        return res;
      }, '');
      pathString += `L${points[0].x},${points[0].y}`;

      const cp = createSvgElement(
        'clipPath', '', { id: 'map-border' },
      );
      const path = createSvgElement(
        'path', '', { d: pathString },
      );

      cp.appendChild(path);
      map.appendChild(cp);
    }

    const renderMapBorder = () => {
      const path = createSvgElement('path', '', { d: pathString });
      map.appendChild(path);
    };

    const renderIsland = () => {
      [...Array(4).keys()].forEach(i => {
        const circle = createSvgElement('circle', '', {
          cx: cross.cx,
          cy: cross.cy,
          r: (i + 1) * 40,
          'clip-path': 'url(#map-border)',
        });

        map.appendChild(circle);

        const length = circle.getTotalLength();
        const step = 0.05;

        let position = length * step * 0.5;
        let points = [];

        while (position <= length) {
          const pt = circle.getPointAtLength(position);
          const x = Math.round(pt.x + getRandomMultiplier((i + 1) * 2));
          const y = Math.round(pt.y + getRandomMultiplier((i + 1) * 2));

          points.push({ x, y });
          position += length * step;
        }

        const rand = Math.round(Math.random() * (points.length - 1));
        points = points.concat(points.splice(0, rand));

        let circleString = points.slice(0, -1).reduce((str, pt, index) => {
          if (index === 0) str += `${pt.x} ${pt.y}`;
          else if (index % 2 === 1) {
            str += ` S ${pt.x} ${pt.y}`;
          }
          else str += ` ${pt.x} ${pt.y}`;
          return str;
        }, 'M');
        //circleString += ` A ${length / 5} ${length / 5} 0 0 1 ${points[0].x} ${points[0].y}`;

        const path = createSvgElement('path', `area area-${i}`, {
          d: circleString,
          'clip-path': 'url(#map-border)',
        });

        map.appendChild(path);
        map.removeChild(circle);
      });
    }

    const renderCross = () => {
      const l1 = createSvgElement('line', 'cross', {
        x1: cross.cx - crossSize, y1: cross.cy - crossSize,
        x2: cross.cx + crossSize, y2: cross.cy + crossSize,
      });
      const l2 = createSvgElement('line', 'cross', {
        x1: cross.cx - crossSize, y1: cross.cy + crossSize,
        x2: cross.cx + crossSize, y2: cross.cy - crossSize,
      });
      map.appendChild(l1);
      map.appendChild(l2);
    }

    const renderCompass = () => {
      const size = margin;
      const diff = 5;
      const radius = size * 0.5;
      const pos = {
        x: boundingRect.width - margin - 20,
        y: boundingRect.height - margin - 20,
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

    addClipPath();
    renderMapBorder();
    renderIsland();
    renderCross();
    renderCompass();
  });
})();