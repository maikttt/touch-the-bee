const HIVE_BG = '#ff5900';

enum BEE_COLOR {
  EMPTY  = 0,
  YELLOW = 1,
  PURPLE = 2,
  GREEN  = 3,
  BLUE   = 4,
};

enum GAME_STATE {
  CHANGING_LEVELS = 0,
  WAITING_USER    = 1,
};

interface IAnimator {
  move(deltaTime: number): boolean;
}

class HiveCell {
  public x: number;
  public y: number;
  public size: number;
  public beeColor: BEE_COLOR;

  constructor(x: number, y: number, size: number, beeColor: BEE_COLOR) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.beeColor = beeColor;
  }

  bornBee(): Bee {
    if (this.beeColor === BEE_COLOR.EMPTY) {
      return null;
    }
    const beeColor = this.beeColor;
    this.beeColor = BEE_COLOR.EMPTY;
    return new Bee(this.x, this.y, 0, this.size, beeColor);
  }
}

class Hive {
  public cells: Array<HiveCell> = [];
  public cellSize: number;

  constructor(x: number, y: number, size: number, m: number, n: number) {
    const sin = Math.sin(Math.PI / 3);

    this.cellSize = size;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        this.cells.push(
          new HiveCell(x + 1.5 * j * size, y + size * sin * (2 * i + (j % 2)), size, BEE_COLOR.EMPTY)
        );
      }
    }
  }

  cellWithBeeAt(x: number, y: number): HiveCell {
    for (let cell of this.cells) {
      if (cell.beeColor !== BEE_COLOR.EMPTY && (cell.x - x) ** 2 + (cell.y - y) ** 2 <= (cell.size) ** 2) {
        return cell;
      }
    }
    return null;
  }

  containsForeighers() {
    for (let cell of this.cells) {
      if (cell.beeColor !== BEE_COLOR.EMPTY && cell.beeColor !== BEE_COLOR.YELLOW) {
        return false;
      }
    }
    return true;
  }
}

class Bee {
  public x: number;
  public y: number;
  public angle: number;
  public size: number;
  public color: BEE_COLOR;

  constructor(x: number, y: number, angle: number, size: number, color: BEE_COLOR) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.size = size;
    this.color = color;
  }

  isWorker(): boolean {
    return this.color == BEE_COLOR.YELLOW;
  }
}

class HiveCellBlink implements IAnimator {
  constructor(private cells: Array<HiveCell>, private speed: number = 1, private endSize: number = 5) {}

  move(deltaTime: number) {
    if (this.cells[0] === null || this.cells[0].size * this.speed >= this.endSize * this.speed) {
      return false;
    }
    for (let cell of this.cells) {
      this.applySpeed(cell, deltaTime);
    }
    return true;
  }

  private applySpeed(cell: HiveCell, deltaTime: number) {
    cell.size += deltaTime * this.speed;
    if (this.speed < 0) {
      cell.size = Math.max(this.endSize, cell.size);
    } else {
      cell.size = Math.min(this.endSize, cell.size);
    }
  }
}

class HiveCellRecolor implements IAnimator {
  private executed: boolean = false;
  private beeColorOrder: Array<BEE_COLOR>;

  constructor(private cells: Array<HiveCell>) {
    this.beeColorOrder = [];
    const c = [BEE_COLOR.PURPLE, BEE_COLOR.GREEN, BEE_COLOR.BLUE, BEE_COLOR.YELLOW];
    const l = c.length;
    const t = Date.now();
    for (let i = 0; i < l; i++) {
      this.beeColorOrder.push(c[(i + t) % l])
    }
  }

  move(deltaTime: number): boolean {
    const n = this.rand(Math.floor(this.cells.length / 5), Math.floor(this.cells.length / 3));
    const nums: Set<number> = new Set();
    for (let i = 0; i < n; i++) {
      let index = this.rand(0, this.cells.length);
      while (nums.has(index)) {
        index = (index + 1) % this.cells.length;
      }
      nums.add(index);
    }

    const arr = Array.from(nums);
    for (let i = 0; i < n; i++) {
      this.cells[arr[i]].beeColor = this.beeColorOrder[i % this.beeColorOrder.length];
    }
    return false;
  }

  private rand(a: number, b: number): number {
    return Math.floor( Math.random() * (b - a) ) + a;
  }
}

class BeeFly implements IAnimator {
  constructor(private bee: Bee, private speed: number, private w: number, private h: number) {}

  move(deltaTime: number): boolean {
    const { bee  } = this;
    if (bee.x + bee.size < 0 || bee.x > this.w) {
      return false;
    }
    if (bee.y + bee.size < 0 || bee.y > this.h) {
      return false;
    }
    this.speed -= 0.005 * deltaTime;
    bee.x += deltaTime * this.speed;
    bee.y += deltaTime * this.speed;
    return true;
  }
}

class AnimationEndNotiff implements IAnimator {
  private executed: boolean = false;

  constructor(private anim: IAnimator, private endCallback: Function) {}

  move(deltaT: number): boolean {
    if (this.executed) {
      return false;
    }
    const wasMoved = this.anim.move(deltaT);
    if (!wasMoved) {
      this.executed = true;
      this.endCallback();
      return false;
    }
    return true;
  }
}

class SerialAnimation implements IAnimator {
  constructor(private anims: Array<IAnimator>) {}

  move(deltaTime: number): boolean {
    while (this.anims.length) {
      if (this.anims[0].move(deltaTime)) {
        return true;
      }
      this.anims.shift();
    }
    return false;
  }
}

class ParallelAnimation {
  constructor(private anims: Array<IAnimator>) {}

  move(deltaTime: number): boolean {
    if (!this.anims.length) {
      return false;
    }
    const moves = this.anims.map(anim => anim.move(deltaTime));
    this.anims = this.anims.filter((_, i) => moves[i]);
    return true;
  }

  add(animation: IAnimator) {
    this.anims.push(animation);
  }
}

class HiveGameDrawer {
  private $score: HTMLElement;
  private $time: HTMLElement;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private imageBg: HTMLImageElement,
    private imageBee: HTMLImageElement,
   ) {
    this.$score = document.querySelector('.score');
    this.$time = document.querySelector('.timer');
  }

  drawHiveCell(cell: HiveCell) {
    this.drawHiveCellLines(cell);
    if (cell.beeColor != BEE_COLOR.EMPTY) {
      this.putBeeImage(cell.x, cell.y, cell.size, cell.beeColor);
    }
  }

  drawBee(bee: Bee) {
    console.log(bee.angle);
    this.putBeeImage(bee.x, bee.y, bee.size, bee.color);
  }

  drawBg() {
    const { ctx, imageBg } = this;
    /* const { height, width } = imageBg;
    const m = Math.ceil(ctx.canvas.width / width);
    const n = Math.ceil(ctx.canvas.height / height);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        this.ctx.drawImage(
          this.imageBg, 0, 0, width, height, j * width, i * height, width, height
        );
      }
    } */

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  drawScore(score: number) {
    this.$score.innerText = `Score: ${score}`;
  }

  drawTime(time: number) {
    const ntime = Math.round(time / 10);
    const int = Math.floor(ntime / 100);
    const rest = ntime % 100;
    this.$time.innerText = `${int}.${rest < 10 ? `0${rest}` : rest}`;
  }

  private putBeeImage(x: number, y: number, size: number, color: BEE_COLOR) {
    const [bx, by] = this.beeImageCoordsByColor(color);
    const semisize = size / 2;
    this.ctx.drawImage(
      this.imageBee, bx, by, 720, 720, x - semisize, y - semisize, size, size
    );
  }

  private drawHiveCellLines(cell: HiveCell) {
    const COLOR_BG = '#000';
    const COLOR_HIVE_P = '#ffc62a';
    const COLOR_HIVE_S = '#ffd561';
    const COLOR_HIVE_L = '#ff9202';
    const sin = Math.sin(Math.PI / 3);
    const cos = Math.cos(Math.PI / 3);
    const { ctx } = this;
    const { x, y, size } = cell;

    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x - size * cos, y - size * sin);
    ctx.lineTo(x + size * cos, y - size * sin);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size * cos, y + size * sin);
    ctx.lineTo(x - size * cos, y + size * sin);
    ctx.lineTo(x - size, y);
    ctx.fillStyle = COLOR_HIVE_P;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + size * cos, y - size * sin);
    ctx.bezierCurveTo(x+size/1.5, y, x+size/2, y+size/1.1, x - size * cos, y + size * sin);
    ctx.lineTo(x + size * cos, y + size * sin);
    ctx.lineTo(x + size, y);
    ctx.fillStyle = COLOR_HIVE_S;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x - size * cos, y - size * sin);
    ctx.lineTo(x + size * cos, y - size * sin);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size * cos, y + size * sin);
    ctx.lineTo(x - size * cos, y + size * sin);
    ctx.lineTo(x - size, y);
    ctx.strokeStyle = COLOR_HIVE_L;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  private beeImageCoordsByColor(color: BEE_COLOR): Array<number> {
    switch (color) {
      case BEE_COLOR.YELLOW: return [0, 0];
      case BEE_COLOR.PURPLE: return [720, 0];
      case BEE_COLOR.GREEN:  return [1440, 0];
      case BEE_COLOR.BLUE:   return [2160, 0];
    }
  }
}

export class HiveGame {
  private drawer: HiveGameDrawer = null;
  private hive: Hive;
  private bees: Array<Bee> = [];
  private animator: ParallelAnimation = new ParallelAnimation([]);
  private isAnimating: boolean = false;
  private gameState: GAME_STATE = GAME_STATE.WAITING_USER;
  private score: number;
  private timeLeft: number;
  private events: Map<string, Function> = new Map();

  constructor(
    ctx: CanvasRenderingContext2D,
    imageBg: HTMLImageElement,
    imageBee: HTMLImageElement,
   ) {
    this.drawer = new HiveGameDrawer(ctx, imageBg, imageBee);

    const m = 8;
    const n = 4;
    const size = 80;

    const x0 = ctx.canvas.width / 2 - 3 * (m - 1) * size / 4;
    const y0 = ctx.canvas.height / 2 - Math.sqrt(3) * (2 * n - 1) * size / 4;

    this.hive = new Hive(x0, y0, size, m, n);
    this.init();
  }

  init() {
    this.bees = [];

    new HiveCellRecolor(this.hive.cells).move(0);
    this.draw();
    this.timeLeft = 20000;
    this.score = 0;
  }

  private handleWrongTouch() {
    this.changeHives();
    this.runAnimation();
  }

  private handleToNextLevel() {
    this.timeLeft += 2000;
    this.changeHives();
    this.runAnimation();
  }

  private handleCorrectTouch(bee: Bee) {
    this.score++;
    this.bees.push(bee);
    this.animator.add(
      new AnimationEndNotiff(
        new BeeFly(bee, -0.1, 1200, 800), () => {
          this.bees = this.bees.filter(b => b !== bee);
        }
      )
    );
    this.runAnimation();
  }

  handleClick(x: number, y: number) {
    if (this.timeLeft <= 0 || this.gameState == GAME_STATE.CHANGING_LEVELS) {
      return;
    }
    if (this.gameState == GAME_STATE.WAITING_USER) {
      const hiveCell = this.hive.cellWithBeeAt(x, y);
      const bee = hiveCell === null ? null : hiveCell.bornBee();

      if (bee !== null) {
        if (bee.isWorker()) {
          this.handleWrongTouch();
        } else if (this.newLevelRequired()) {
          this.handleToNextLevel();
        } else {
          this.handleCorrectTouch(bee);
        }
      }
    }
  }

  on(event: string, callback: Function) {
    this.events.set(event, callback);
  }

  private trigger(event: string, ...args: any) {
    if (this.events.has(event)) {
      const callback = this.events.get(event);
      callback(...args);
    }
  }

  private draw() {
    this.drawer.drawBg();
    for (const cell of this.hive.cells) {
      this.drawer.drawHiveCell(cell);
    }
    for (const bee of this.bees) {
      this.drawer.drawBee(bee);
    }
    this.drawer.drawTime(this.timeLeft);
    this.drawer.drawScore(this.score);
  }

  private runAnimation() {
    if (this.timeLeft <= 0 || this.isAnimating) {
      return;
    }
    this.isAnimating = true;
    const prevTime = Date.now();
    requestAnimationFrame(() => {
      const deltaT = Date.now() - prevTime;
      this.animator.move(deltaT);
      this.timeLeft = Math.max(0, this.timeLeft - deltaT);
      this.draw();
      this.isAnimating = false;
      this.runAnimation();
      if (!this.timeLeft) {
        this.trigger('endgame', this.score);
      }
    });
  }

  private changeHives() {
    this.bees = [];
    this.animator = new ParallelAnimation([
      new AnimationEndNotiff(
        new SerialAnimation([
          new HiveCellBlink(this.hive.cells, -1, 10),
          new HiveCellRecolor(this.hive.cells),
          new HiveCellBlink(this.hive.cells, 5, this.hive.cellSize),
        ]), () => {
          this.gameState = GAME_STATE.WAITING_USER;
        }
      )
    ]);
  }

  private newLevelRequired(): boolean {
    return this.hive.containsForeighers();
  }
}
