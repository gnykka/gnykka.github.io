(() => {
  getRandom = (min, scale) => {
    return min + Math.random() * scale;
  };

  window.addEventListener('load', () => {
    const data = [...Array(20).keys()].map((index) => (
      { id: index, width: getRandom(20, 200), height: getRandom(20, 200) }
    ));

    const canvas = document.querySelector('.canvas');
    const context = canvas.getContext('2d');
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);

    context.fillStyle = 'rgba(45, 132, 218, 0.5)';
    context.strokeStyle = 'none';

    const gridWidth = Math.max(...data.map(({ width }) => width)) * 1.1;
    const gridHeight = Math.max(...data.map(({ height }) => height)) * 1.1;

    let x = 0;
    let y = 0;

    data.forEach((item, index) => {
      const { id, width, height } = item;

      if (x + gridWidth / 2 > canvasWidth) {
        x = 0;
        y += gridHeight;
      }

      item.x = x + getRandom(10, (gridWidth - width) / 2);
      item.y = y + getRandom(10, (gridHeight - height) / 2);

      context.fillRect(item.x, item.y, width, height);

      x += gridWidth;
    });
  });
})();