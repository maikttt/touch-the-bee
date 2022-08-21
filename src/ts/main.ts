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
  ])
  .then(([imageBees]) => {
    const CLS_NONE = 'none';
    const canvas = document.querySelector('canvas');
    const $menu = document.querySelector('.menu');
    const $game = document.querySelector('.game');
    const $finalGamePanel: HTMLElement = document.querySelector('.final-message');
    const $finalScore: HTMLElement = document.querySelector('.final-message p');
    if (!canvas) {
      throw new Error('No display');
    }
    const ctx = canvas.getContext('2d');
    const game = new HiveGame(ctx, imageBees);
    game.on('endgame', (score: number) => {
      $finalScore.innerText = `Your score: ${score}`;
      $game.classList.add(CLS_NONE);
      $finalGamePanel.classList.remove(CLS_NONE);
    });
    canvas.addEventListener('click', function(event) {
      game.handleClick(event.offsetX, event.offsetY);
    });
    document.querySelector('.menu .new-game').addEventListener('click', function() {
      game.init();
      $menu.classList.add(CLS_NONE);
      $game.classList.remove(CLS_NONE);
    });
    document.querySelector('.final-message button').addEventListener('click', function() {
      $finalGamePanel.classList.add(CLS_NONE);
      $menu.classList.remove(CLS_NONE);
    });
  })
  .catch(err => {
    console.error(err);
  });
}

main();
