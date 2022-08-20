import { HiveGame } from './game';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((response, reject) => {
    const img = new Image();
    img.src = src;
    img.onerror = (err) => {
      reject(err);
    };
    img.onload = () => {
      response(img);
    };
  });
}

function main() {
  return Promise.all([
    loadImage('./dist/img/bees.png'),
    loadImage('./dist/img/grass.png'),
    loadImage('./dist/img/flowers.png'),
  ])
  .then(([imageBees, imageBg]) => {
    const CLS_NONE = 'none';
    const canvas = document.querySelector('canvas');
    const $menu = document.querySelector('.menu');
    const $game = document.querySelector('.game');
    if (!canvas) {
      throw new Error('No display');
    }
    const ctx = canvas.getContext('2d');
    const game = new HiveGame(ctx, imageBg, imageBees);
    game.on('endgame', (score: number) => {
      alert(`Your score: ${score}`);
      $menu.classList.remove(CLS_NONE);
      $game.classList.add(CLS_NONE);
    });
    canvas.addEventListener('click', function(event) {
      game.handleClick(event.offsetX, event.offsetY);
    });
    document.querySelector('.menu .new-game').addEventListener('click', function() {
      game.init();
      $menu.classList.add(CLS_NONE);
      $game.classList.remove(CLS_NONE);
    });
  })
  .catch(err => {
    console.error(err);
  });
}

main();
