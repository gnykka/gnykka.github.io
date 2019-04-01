(() => {
  window.addEventListener('load', () => {
    const pictures = document.querySelector('.pictures');
    const cover = document.querySelector('.cover');
    const loadMore = document.querySelector('.load-more');
    const baseUrl = 'https://api.tumblr.com/v2/tagged';
    const apiKey = 'qERU7FQgk2qe5cVA76WWbyWeUpvC4PqaWehCj990ARTmQpjChE';
    const defaultTag = 'fashion';

    let minTimestamp;

    function getNewPics(tag, newRequest = true) {
      cover.classList.add('visible');
      loadMore.classList.remove('visible');

      fetch(`${baseUrl}?tag=${tag}&api_key=${apiKey}${newRequest ? '' : `&before=${minTimestamp}`}`)
        .then(data => data.json())
        .then(({ response }) => {
          if (!response || !response.length) {
            if (newRequest) {
              pictures.innerHTML = 'Ничего не найдено';
            }
            cover.classList.remove('visible');
            return;
          }

          if (newRequest) {
            pictures.innerHTML = '';
            minTimestamp = -1;
          }
          response
            .filter(post => post.type === 'photo')
            .forEach((post) => {
              if (minTimestamp === -1 || post.timestamp < minTimestamp) {
                minTimestamp = post.timestamp;
              }

              const picture = document.createElement('div');
              picture.classList.add('picture');

              const img = document.createElement('img');
              img.src = post.photos[0].original_size.url;

              picture.appendChild(img);
              pictures.appendChild(picture);
            });
          cover.classList.remove('visible');
          loadMore.classList.add('visible');
        });
    }

    getNewPics(defaultTag);

    const form = document.querySelector('.form');
    const input = form.elements['tag'];
    const button = form.elements['submit'];

    input.value = defaultTag;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      getNewPics(input.value);
    });
    button.addEventListener('click', () => {
      getNewPics(input.value);
    });

    loadMore.children[0].addEventListener('click', () => {
      getNewPics(input.value, false);
    });
  });
})();