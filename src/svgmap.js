(() => {
  const options = {
    corsenabled : false, ltres : 2, qtres : 2, pathomit : 4,
    colorsampling : 0, numberofcolors : 2, mincolorratio : 0, colorquantcycles : 2,
    linefilter : true
  };

  listTiles = (images, index) => {
    const tilesContainer = document.querySelector(`.tiles-${index}`);

    [...images].forEach(img => {
      const link = document.createElement('a');
      link.href = img.src;
      link.innerText = img.src;
      link.target = '_blank';
      tilesContainer.appendChild(link);
    });
  };

  renderCanvas = (images, index) => {
    const map = document.querySelector(`#map-${index}`);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = map.clientWidth;
    canvas.height = map.clientHeight;

    [...images].forEach((img, i) => {
      const path = `../images/tiles-${index}/tile-${i + 1}.png`;
      const [ trX, trY ] = img.style.transform.split(/,|\(|\)| |px/).filter(Boolean).slice(1);

      const image = new Image();
      image.setAttribute('src', path);
      image.setAttribute('crossorigin', '');
      image.onload = () => {
        ctx.drawImage(image, trX, trY, img.clientWidth, img.clientWidth);
      };
    });

    setTimeout(() => {
      const url = canvas.toDataURL();
      const img = document.createElement('img');
      img.setAttribute('src', url);
      img.setAttribute('crossorigin', '');

      ImageTracer.imageToSVG(
        img.src,
        (svgstr) => {
          ImageTracer.appendSVGString(svgstr, `svgcontainer-${index}`);

          const paths = document.getElementsByTagName('path');
          [...paths].forEach(p => {
            const stroke = p.getAttribute('stroke').split(/,|\(|\)| |px/)[1];
            const { width, height } = p.getBoundingClientRect();
            if (stroke >= 127 || width < 30 && height < 30) {
              p.remove();
            } else {
              p.setAttribute('fill', 'yellow');
            }
          });
        },
        options,
      );
    }, 1000);
  };

  onMapLoad = (index) => {
    const mapContainer = document.querySelector(`#map-${index}`);
    const images = mapContainer.getElementsByTagName('img');

    listTiles(images, index);
    renderCanvas(images, index);
  };

  window.addEventListener('load', () => {
    const map1 = L.map('map-1').setView([55.7512, 37.6184], 13);
    L.tileLayer(
      'https://tiles.mapiful.com/mono/{z}/{x}/{y}.png',
      { maxZoom: 16, attribution: '' }
    ).addTo(map1);
    map1.whenReady(() => onMapLoad(1));

    const map2 = L.map('map-2').setView([55.7512, 37.6184], 12);
    L.tileLayer(
      'https://tiles.mapiful.com/mono/{z}/{x}/{y}.png',
      { maxZoom: 16, attribution: '' }
    ).addTo(map2);
    map2.whenReady(() => onMapLoad(2));

    const map3 = L.map('map-3').setView([55.7512, 37.6184], 11);
    L.tileLayer(
      'https://tiles.mapiful.com/mono/{z}/{x}/{y}.png',
      { maxZoom: 16, attribution: '' }
    ).addTo(map3);
    map3.whenReady(() => onMapLoad(3));
  });
})();
