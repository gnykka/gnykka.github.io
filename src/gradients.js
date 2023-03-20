(() => {
  window.addEventListener('load', () => {
    const palette = [
      '#ffadad','#ffd6a5','#fdffb6','#caffbf','#9bf6ff','#a0c4ff','#bdb2ff','#ffc6ff',
    ];

    const shuffle = (array, salt) => {
      let currentIndex = array.length
      let randomIndex;

      while (currentIndex > 0) {
        randomIndex = Math.floor(salt % 10 / 10 * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }

      return array;
    };

    const setGradient = (div, text) => {
      const letters = text
        .replace(/[^a-z]/gi,'')
        .toLowerCase();

      const getCount = () => {
        const { length } = text;
        const range = [3, 6];

        if (length <= range[1]) {
          return Math.max(range[0], length);
        }

        return range[0] + length % (range[1] - range[0] + 1);
      };

      const getValueFromChar = (char, range) => {
        const base = ["a".charCodeAt(0), "z".charCodeAt(0)];
        const value = char.charCodeAt(0);

        return range[0] + ((value - base[0]) / (base[1] - base[0])) * (range[1] - range[0]);
      }

      const getLettersSalt = (letters) => {
        return letters.split('').reduce((res, l) => res + l.charCodeAt(0), 0);
      }

      const getStops = (count) => {
        const salt = getLettersSalt(letters);
        const fullLetters = letters.length < count * 3
          ? letters + shuffle('abcdefghijklmnopqrstuvwxyz', salt).slice(0, count * 3 - letters.length)
          : letters;

        const fullSalt = getLettersSalt(fullLetters);
        const sortedLetters = shuffle(fullLetters.split(''), fullSalt);
        const sortedPalette = shuffle([...palette], fullSalt);
        const stops = [];

        for (let i = 0; i < count; i++) {
          const x = getValueFromChar(sortedLetters[i * 3], [10, 90]);
          const y = getValueFromChar(sortedLetters[i * 3 + 1], [10, 90]);
          const size = getValueFromChar(sortedLetters[i * 3 + 2], [25, 75]);

          stops.push({
            x, y,
            color: sortedPalette[i % sortedPalette.length],
            size,
          });
        }

        return stops.sort((s1, s2) => s1.size > s2.size ? 1 : -1);
      };

      const count = getCount();
      const stops = getStops(count);

      const gradientStr = stops.reduce((res, stop) => (
        res + `radial-gradient(circle at ${stop.x}% ${stop.y}%, ${
          stop.color} ${stop.size * 0.1}%, transparent ${stop.size}%), `
      ), '').slice(0, -2);

      div.style.background = gradientStr;
    };

    const divs = document.querySelectorAll('.list > div');
    const paletteDiv = document.querySelector('.palette');

    [...divs].forEach(div => {
      setGradient(div, div.innerText);
    });

    paletteDiv.style.background = `linear-gradient(90deg,
      #ffadad 0%, #ffadad 12.5%,
      #ffd6a5 12.5%, #ffd6a5 25%,
      #fdffb6 25%, #fdffb6 37.5%,
      #caffbf 37.5%, #caffbf 50%,
      #9bf6ff 50%, #9bf6ff 62.5%,
      #a0c4ff 62.5%, #a0c4ff 75%,
      #bdb2ff 75%, #bdb2ff 87.5%,
      #ffc6ff 87.5%, #ffc6ff 100%)`;
  });
})();
