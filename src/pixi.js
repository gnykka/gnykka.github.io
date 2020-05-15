(() => {
  window.addEventListener('load', () => {
    const images = [
      'https://66.media.tumblr.com/5410571415fd694fd7537cc0ea43745b/tumblr_pvk2qoENod1w6pximo1_320.jpg',
      'https://66.media.tumblr.com/917746f48bde6bc8c54e2ed603a8c5e4/tumblr_p825xcNxA51toxqo3o1_320.jpg',
      'https://66.media.tumblr.com/18de6d4ea82fd4cd5d0b94374e3b56d2/tumblr_o9wlg6CuNJ1srgaato1_320.jpg',
      'https://66.media.tumblr.com/6097014e8ff9b4fe794454ecaf88ea80/tumblr_prh73kMNa61ubmg08o1_320.jpg',
      'https://66.media.tumblr.com/65d1afad25388122f9f5f2966c91fe61/tumblr_p01npc5wSh1th8ngro1_320.jpg',
      'https://66.media.tumblr.com/6936ee7268dd0ecf3383c3397ac10704/tumblr_nck1xvEpG11rv2dfko1_320.jpg',
      'https://66.media.tumblr.com/3298af018269d997a65d9bfda3fee469/tumblr_nu7s13mAyl1uz7z3yo1_320.jpg',
      'https://66.media.tumblr.com/9910fa728581cc8b803f1baeeb7cadfc/tumblr_mx88ew2vfo1qgxwoyo1_320.jpg',
      'https://66.media.tumblr.com/37a170fd965f505bbca66d9f99783553/tumblr_p43pax6Sja1sn2thco1_320.jpg',
      'https://66.media.tumblr.com/4e83c7d57929aee806739b287da5c08c/tumblr_mnacsjFu6I1ruf1nho1_320.jpg',
      'https://66.media.tumblr.com/4631bdd30e13850f811666c5f359d473/tumblr_p91tbkqUa51w14mzeo1_320.jpg',
      'https://66.media.tumblr.com/90780b88ef43c06547d155e0b46ab8b6/tumblr_ppjo1niOnL1qzleo5o1_320.jpg',
      'https://66.media.tumblr.com/bf241f5fbee938e4221d611cc8e545ab/tumblr_p0bsuvkH7j1uhbzjxo1_320.jpg',
      'https://66.media.tumblr.com/251aae5415f35b2bd3ccd8579a5657a1/tumblr_p9zqgsBEVJ1rqafmyo1_320.jpg',
      'https://66.media.tumblr.com/817c1487303bcac3453510d8fa61a30b/tumblr_p3g20kZvY41sar9xvo1_320.jpg',
    ];

    const { PIXI } = window;
    const main = document.querySelector('main');

    const width = main.clientWidth;
    const height = main.clientHeight;

    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0xFFFFFF,
      antialias: true,
    });
    const container = new PIXI.Container();

    container.sortableChildren = true;
    app.stage.addChild(container);
    main.appendChild(app.view);

    const sprites = {};
    const textures = {};
    const count = 200;

    animate = (key) => {
      if (sprites[key].img.alpha < 1) {
        sprites[key].img.alpha += Math.pow(sprites[key].img.alpha, 2);
        requestAnimationFrame(() => animate(key));
      }
    };

    renderSprite = (index) => {
      textures[index] = PIXI.Texture.from(images[index]);

      Object.keys(sprites)
        .filter(key => sprites[key].index === index)
        .forEach(key => {
          const img = new PIXI.Sprite(textures[index]);

          const originalWidth = img.width;
          const originalHeight = img.height;
          const imgWidth = originalWidth / 3;
          const imgHeight = imgWidth * originalHeight / originalWidth;

          img.x = sprites[key].x;
          img.y = sprites[key].y;
          img.width = imgWidth;
          img.height = imgHeight;
          img.zIndex = parseInt(key);
          img.alpha = 0.1;

          container.addChild(img);

          sprites[key].img = img;
          sprites[key].width = imgWidth;

          animate(key);
        });

      if (index < images.length - 1) {
        load(index + 1);
      }
    }

    step = () => {
      const spritesToRemove = [];

      for (let i = 0; i < count; i++) {
        const sprite = sprites[i];

        if (sprite.img) {
          sprite.x -= sprite.speed;
          sprite.img.x = sprite.x;
          if (sprite.x + sprite.width < 0) spritesToRemove.push(i);
        }
      }

      spritesToRemove.forEach(i => {
        sprites[i].x = width + sprites[i].width;
      });
    }

    calculate = () => {
      for (let i = 0; i < count; i++) {
        const index = i % images.length;

        const shift = 100;
        const x = -shift + Math.random() * (width + shift);
        const y = -shift + Math.random() * (height + shift);
        const speed = 1 + Math.random();

        sprites[i] = { index, x, y, speed };
      }
      app.ticker.add(step);
    };

    load = (index) => {
      app.loader.reset();
      app.loader.add(images[index], images[index]);
      app.loader.load(() => renderSprite(index));
    }

    calculate();
    load(0);
  });
})();
