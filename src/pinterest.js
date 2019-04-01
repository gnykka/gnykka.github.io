(() => {
  window.addEventListener('load', () => {
    const pictures = document.querySelector('.pictures');
    const baseUrl = 'https://api.pinterest.com/v3/pidgets/users/';
    const defaultUser = 'townofdragons';

    function getNewPins(user) {
      fetch(`${baseUrl}${user}/pins/`)
        .then(data => data.json())
        .then(({ data }) => {
          pictures.innerHTML = '';
          data.pins.forEach((pin) => {
            const picture = document.createElement('div');
            picture.classList.add('picture');

            const img = document.createElement('img');
            img.src = pin.images['564x'].url;

            picture.appendChild(img);
            pictures.appendChild(picture);
          });
        });
    }

    getNewPins(defaultUser);

    const form = document.querySelector('.form');
    const input = form.elements['username'];
    const button = form.elements['submit'];

    input.value = defaultUser;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      getNewPins(input.value);
    });
    button.addEventListener('click', (event) => {
      getNewPins(input.value);
    });

    // add cover while loading
    // masonry layout ?
  });
})();