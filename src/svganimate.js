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

  window.addEventListener('load', () => {
    const svg = document.querySelector('svg g');

    startAnimation = (index) => {
      const animation = document.querySelector(`animateMotion#am${index}`);
      animation.parentElement.classList.remove('hidden');
      animation.beginElement();
    };

    stopAnimation = (index) => {
      const animation = document.querySelector(`animateMotion#am${index}`);
      animation.parentElement.classList.add('hidden');
      animation.endElement();
    };

    animate = (i) => {
      const next = i === 1 ? 2 : 1;

      stopAnimation(i);
      startAnimation(next);

      setTimeout(() => {
        animate(next);
      }, 5000);
    };

    animate(1);
  });
})();
