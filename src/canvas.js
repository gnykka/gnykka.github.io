(() => {
  getRandom = (min, scale) => {
    return min + Math.random() * scale;
  };

  window.addEventListener('load', () => {
    const tagUrl = 'https://api.tumblr.com/v2/tagged';
    const postUrl = 'https://api.tumblr.com/v2/blog/';
    const apiKey = 'qERU7FQgk2qe5cVA76WWbyWeUpvC4PqaWehCj990ARTmQpjChE';
    const tag = 'fashion';

    // prepare canvas for rendering
    const main = document.querySelector('main');
    const canvas = document.querySelector('.canvas');
    const context = canvas.getContext('2d');
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);

    context.fillStyle = 'rgba(45, 132, 218, 0.5)';
    context.strokeStyle = 'none';

    const photos = [];
    let i;
    let imax;

    function renderPhotos() {
      const gridWidth = Math.max(...photos.map(({ width }) => width));
      const gridHeight = Math.max(...photos.map(({ height }) => height));
      //const gridWidth = photos.reduce((res, photo) => res + photo.width, 0) / photos.length * 1.4;
      //const gridHeight = photos.reduce((res, photo) => res + photo.height, 0) / photos.length * 1.4;

      let x = -gridWidth / 2;
      let y = -gridHeight / 2;

      photos.forEach((photo, index) => {
        const { id, width, height } = photo;

        if (x + gridWidth / 2 > canvasWidth) {
          x = 0;
          y += gridHeight;
        }

        photo.x = x + getRandom(10, (gridWidth - width));
        photo.y = y + getRandom(10, (gridHeight - height));

        const image = new Image(width, height);
        image.src = photo.url;
        image.onload = () => {
          context.drawImage(event.path[0], photo.x, photo.y, width, height);
        };

        x += gridWidth;
      });
    }

    function getBlogPics(name) {
      fetch(`${postUrl}${name}/posts/photo?api_key=${apiKey}`)
        .then(data => data.json())
        .then(({ response }) => {
          if (!response.posts) { return; }

          response.posts
            .filter(({ photos }) => photos && photos.length)
            .forEach((post) => {
              const photo = post.photos[0].original_size;
              const width = photo.width / 8; //Math.max(photo.width / 5, 50);
              const index = Math.floor(Math.random() * photos.length);

              photos.splice(index, 0, {
                id: post.id,
                width,
                height: photo.height * width / photo.width,
                url: photo.url,
              });
            });

          i += 1;
          if (i === imax) {
            renderPhotos();
          }
        })
    }

    // get and render data
    fetch(`${tagUrl}?tag=${tag}&api_key=${apiKey}`)
      .then(data => data.json())
      .then(({ response }) => {
        if (!response || !response.length) { return; }

        const res = response
          .map(post => post.blog_name)
          .filter((name, i, array) => array.indexOf(name) === i);

        imax = res.length - 1;
        i = 0;

        res.forEach((name) => { getBlogPics(name); });
      });
  });
})();
