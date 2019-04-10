(() => {
  window.addEventListener('load', () => {
    const pictures = document.querySelector('.pictures');

    const tagUrl = 'https://api.tumblr.com/v2/tagged';
    const postUrl = 'https://api.tumblr.com/v2/blog/';
    const apiKey = 'qERU7FQgk2qe5cVA76WWbyWeUpvC4PqaWehCj990ARTmQpjChE';
    const defaultTag = 'landscape';

    function onImageLoad(event) {
      const parent = event.target.parentElement;

      parent.classList.add('loaded');
      parent.style['height'] = 'auto';
    }

    function getBlogPics(name) {
      fetch(`${postUrl}${name}/posts/photo?api_key=${apiKey}`)
        .then(data => data.json())
        .then(({ response }) => {
          if (!response.posts) { return; }

          response.posts.forEach((post) => {
            if (!post.photos) { return; }

            const picture = document.createElement('div');
            const img = document.createElement('img');

            picture.classList.add('picture');

            picture.appendChild(img);
            pictures.appendChild(picture);

            const { url, width, height } = post.photos[0].original_size;

            picture.style['height'] = `${img.clientWidth * height / width}px`;

            img.src = url;
            img.onload = onImageLoad;
          });
        });
    }

    function getBlogs(tag) {
      // TODO: попробовать брать фото для случайного таймстемпа
      // тогда они будут более случайными

      fetch(`${tagUrl}?tag=${tag}&api_key=${apiKey}`)
        .then(data => data.json())
        .then(({ response }) => {
          if (!response || !response.length) {
            pictures.innerHTML = 'Ничего не найдено';
            return;
          }

          pictures.innerHTML = '';
          response
            .map(post => post.blog_name)
            .filter((name, i, array) => array.indexOf(name) === i)
            .forEach((name) => { getBlogPics(name); });
        });
    }

    getBlogs(defaultTag);

    const form = document.querySelector('.form');
    const input = form.elements['tag'];
    const button = form.elements['submit'];

    input.value = defaultTag;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      getBlogs(input.value);
    });
    button.addEventListener('click', () => {
      getBlogs(input.value);
    });
  });
})();