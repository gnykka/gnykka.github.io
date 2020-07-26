(() => {
  window.addEventListener('load', () => {
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
    const debounce = (func, context, delay = 0) => {
      let timeout;

      return (...args) => {
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(
          () => requestAnimationFrame(func.bind(context, ...args)),
          delay
        );
      };
    };

    const $border = document.querySelector('.border');
    const $svg = $border.querySelector('svg');

    let width = 0;
    let height = 0;
    let points = [];
    let count = 0;

    const size = { min: 10, max: 100 };
    const colors = [
      'rgb(0, 0, 0)',
      'rgb(220, 50, 24)',
      'rgb(234, 144, 51)',
      'rgb(36, 65, 108)',
      'rgb(238, 201, 77)',
    ];

    const render = () => {
      count = 6 + Math.round(Math.random() * 4);

      const rand = Math.round(Math.random() * colors.length);
      const indexes = [...Array(count).keys()].sort(() => Math.random() - 0.5);
      const elements = indexes.map(() => {
        const ds = size.max - size.min;

        return {
          x: size.min + Math.random() * (width - size.max - 2 * size.min),
          y: size.min + Math.random() * (height - size.max - 2 * size.min),
          mass: Math.random(),
          width: size.min + Math.random() * ds,
          height: size.min + Math.random() * ds,
          type: Math.random() > 0.5 ? 'ellipse' : 'rect',
        };
      });

      $svg.innerHTML = '';
      
      elements.forEach((el, i) => {
        const vr = Math.sqrt(el.x * el.x + el.y * el.y);
        const vn = points.map(p => {
          const x = p.x - el.x;
          const y = p.y - el.y;
          const r = Math.sqrt(x * x + y * y);
          
          return {
            x, y,
            ang: Math.acos((el.x * x + el.y * y) / (vr * r)),
          };
        });
        const distances = vn.map(v => Math.sqrt(v.x * v.x + v.y * v.y));
        const summ = distances.reduce((res, d) => res + d, 0);
        const fn = distances.map(d => 1 - d / summ);
        const angle = vn.reduce((res, v) => res + v.ang, 0) / vn.length;

        const x = el.x + (1 - el.mass) * vn.reduce((res, v, i) => res + v.x * fn[i], 0);
        const y = el.y + (1 - el.mass) * vn.reduce((res, v, i) => res + v.y * fn[i], 0);
        const color = colors[(i + rand) % colors.length];
        const $el = el.type === 'rect'
          ? createSvgElement('rect', '', {
            x: x,
            y: y,
            width: el.width,
            height: el.height,
            fill: color,
          })
          : createSvgElement('ellipse', '', {
            cx: x + el.width * 0.5,
            cy: y + el.height * 0.5,
            rx: el.width * 0.5,
            ry: el.height * 0.5,
            fill: color,
          });
        const sign = Math.random() > 0.5 ? 1 : -1;
        
        $el.style.transform = `rotate(${angle * sign * 10}deg)`;
        $svg.appendChild($el);
      });
    };

    const resize = () => {
      width = $border.clientWidth;
      height = $border.clientHeight;
      
      size.max = Math.max(width, height) * 0.2;

      $svg.style.width = `${width}px`;
      $svg.style.height = `${height}px`;
      
      points = [
        { 
          x: width * (0.2 + Math.random() * 0.6),
          y: height * (0.2 + Math.random() * 0.6),
        }, {
          x: width * (0.2 + Math.random() * 0.6),
          y: height * (0.2 + Math.random() * 0.6),
        },
      ];
    }

    const init = () => {
     resize();
     render();
    };

    init();

    window.addEventListener('resize', debounce(init, this, 20));
    window.addEventListener('mousemove', debounce(render, this, 20));
    window.addEventListener('touchstart', debounce(render, this, 20));
    window.addEventListener('click', debounce(render, this, 20));
  });
})();
