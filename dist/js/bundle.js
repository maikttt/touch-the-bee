/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ts/game.ts":
/*!************************!*\
  !*** ./src/ts/game.ts ***!
  \************************/
/*! exports provided: HiveGame */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"HiveGame\", function() { return HiveGame; });\nconst HIVE_BG = '#ff5900';\nvar BEE_COLOR;\n(function (BEE_COLOR) {\n    BEE_COLOR[BEE_COLOR[\"EMPTY\"] = 0] = \"EMPTY\";\n    BEE_COLOR[BEE_COLOR[\"YELLOW\"] = 1] = \"YELLOW\";\n    BEE_COLOR[BEE_COLOR[\"PURPLE\"] = 2] = \"PURPLE\";\n    BEE_COLOR[BEE_COLOR[\"GREEN\"] = 3] = \"GREEN\";\n    BEE_COLOR[BEE_COLOR[\"BLUE\"] = 4] = \"BLUE\";\n})(BEE_COLOR || (BEE_COLOR = {}));\n;\nvar GAME_STATE;\n(function (GAME_STATE) {\n    GAME_STATE[GAME_STATE[\"CHANGING_LEVELS\"] = 0] = \"CHANGING_LEVELS\";\n    GAME_STATE[GAME_STATE[\"WAITING_USER\"] = 1] = \"WAITING_USER\";\n})(GAME_STATE || (GAME_STATE = {}));\n;\nclass HiveCell {\n    constructor(x, y, size, beeColor) {\n        this.x = x;\n        this.y = y;\n        this.size = size;\n        this.beeColor = beeColor;\n    }\n    bornBee() {\n        if (this.beeColor === BEE_COLOR.EMPTY) {\n            return null;\n        }\n        const beeColor = this.beeColor;\n        this.beeColor = BEE_COLOR.EMPTY;\n        return new Bee(this.x, this.y, 0, this.size, beeColor);\n    }\n}\nclass Hive {\n    constructor(x, y, size, m, n) {\n        this.cells = [];\n        const sin = Math.sin(Math.PI / 3);\n        this.cellSize = size;\n        for (let i = 0; i < n; i++) {\n            for (let j = 0; j < m; j++) {\n                this.cells.push(new HiveCell(x + 1.5 * j * size, y + size * sin * (2 * i + (j % 2)), size, BEE_COLOR.EMPTY));\n            }\n        }\n    }\n    cellWithBeeAt(x, y) {\n        for (let cell of this.cells) {\n            if (cell.beeColor !== BEE_COLOR.EMPTY && Math.pow((cell.x - x), 2) + Math.pow((cell.y - y), 2) <= Math.pow((cell.size), 2)) {\n                return cell;\n            }\n        }\n        return null;\n    }\n    containsForeighers() {\n        for (let cell of this.cells) {\n            if (cell.beeColor !== BEE_COLOR.EMPTY && cell.beeColor !== BEE_COLOR.YELLOW) {\n                return false;\n            }\n        }\n        return true;\n    }\n}\nclass Bee {\n    constructor(x, y, angle, size, color) {\n        this.x = x;\n        this.y = y;\n        this.angle = angle;\n        this.size = size;\n        this.color = color;\n    }\n    isWorker() {\n        return this.color == BEE_COLOR.YELLOW;\n    }\n}\nclass HiveCellBlink {\n    constructor(cells, speed = 1, endSize = 5) {\n        this.cells = cells;\n        this.speed = speed;\n        this.endSize = endSize;\n    }\n    move(deltaTime) {\n        if (this.cells[0] === null || this.cells[0].size * this.speed >= this.endSize * this.speed) {\n            return false;\n        }\n        for (let cell of this.cells) {\n            this.applySpeed(cell, deltaTime);\n        }\n        return true;\n    }\n    applySpeed(cell, deltaTime) {\n        cell.size += deltaTime * this.speed;\n        if (this.speed < 0) {\n            cell.size = Math.max(this.endSize, cell.size);\n        }\n        else {\n            cell.size = Math.min(this.endSize, cell.size);\n        }\n    }\n}\nclass HiveCellRecolor {\n    constructor(cells) {\n        this.cells = cells;\n        this.executed = false;\n        this.beeColorOrder = [];\n        const c = [BEE_COLOR.PURPLE, BEE_COLOR.GREEN, BEE_COLOR.BLUE, BEE_COLOR.YELLOW];\n        const l = c.length;\n        const t = Date.now();\n        for (let i = 0; i < l; i++) {\n            this.beeColorOrder.push(c[(i + t) % l]);\n        }\n    }\n    move(deltaTime) {\n        const n = this.rand(Math.floor(this.cells.length / 5), Math.floor(this.cells.length / 3));\n        const nums = new Set();\n        for (let i = 0; i < n; i++) {\n            let index = this.rand(0, this.cells.length);\n            while (nums.has(index)) {\n                index = (index + 1) % this.cells.length;\n            }\n            nums.add(index);\n        }\n        const arr = Array.from(nums);\n        for (let i = 0; i < n; i++) {\n            this.cells[arr[i]].beeColor = this.beeColorOrder[i % this.beeColorOrder.length];\n        }\n        return false;\n    }\n    rand(a, b) {\n        return Math.floor(Math.random() * (b - a)) + a;\n    }\n}\nclass BeeFly {\n    constructor(bee, speed, w, h) {\n        this.bee = bee;\n        this.speed = speed;\n        this.w = w;\n        this.h = h;\n    }\n    move(deltaTime) {\n        const { bee } = this;\n        if (bee.x + bee.size < 0 || bee.x > this.w) {\n            return false;\n        }\n        if (bee.y + bee.size < 0 || bee.y > this.h) {\n            return false;\n        }\n        this.speed -= 0.005 * deltaTime;\n        bee.x += deltaTime * this.speed;\n        bee.y += deltaTime * this.speed;\n        return true;\n    }\n}\nclass ParallelAnimation {\n    constructor(anims, callback = null) {\n        this.anims = anims;\n        this.callback = callback;\n    }\n    move(deltaTime) {\n        if (!this.anims.length) {\n            if (this.callback) {\n                this.callback();\n                this.callback = null;\n            }\n            return false;\n        }\n        const moves = this.anims.map(anim => anim.move(deltaTime));\n        this.anims = this.anims.filter((_, i) => moves[i]);\n        return true;\n    }\n}\nclass SerialAnimation {\n    constructor(anims, callback = null) {\n        this.anims = anims;\n        this.callback = callback;\n    }\n    move(deltaTime) {\n        while (this.anims.length) {\n            if (this.anims[0].move(deltaTime)) {\n                return true;\n            }\n            this.anims.shift();\n        }\n        if (this.callback) {\n            this.callback();\n            this.callback = null;\n        }\n        return false;\n    }\n}\nclass HiveGameDrawer {\n    constructor(ctx, imageBg, imageBee) {\n        this.ctx = ctx;\n        this.imageBg = imageBg;\n        this.imageBee = imageBee;\n        this.$score = document.querySelector('.score');\n        this.$time = document.querySelector('.timer');\n    }\n    drawHiveCell(cell) {\n        this.drawHiveCellLines(cell);\n        if (cell.beeColor != BEE_COLOR.EMPTY) {\n            this.putBeeImage(cell.x, cell.y, cell.size, cell.beeColor);\n        }\n    }\n    drawBee(bee) {\n        this.putBeeImage(bee.x, bee.y, bee.size, bee.color);\n    }\n    drawBg() {\n        const { ctx, imageBg } = this;\n        /* const { height, width } = imageBg;\n        const m = Math.ceil(ctx.canvas.width / width);\n        const n = Math.ceil(ctx.canvas.height / height);\n        for (let i = 0; i < n; i++) {\n          for (let j = 0; j < m; j++) {\n            this.ctx.drawImage(\n              this.imageBg, 0, 0, width, height, j * width, i * height, width, height\n            );\n          }\n        } */\n        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);\n    }\n    drawScore(score) {\n        this.$score.innerText = `Score: ${score}`;\n    }\n    drawTime(time) {\n        const ntime = Math.round(time / 10);\n        const int = Math.floor(ntime / 100);\n        const rest = ntime % 100;\n        this.$time.innerText = `${int}.${rest < 10 ? `0${rest}` : rest}`;\n    }\n    putBeeImage(x, y, size, color) {\n        const [bx, by] = this.beeImageCoordsByColor(color);\n        const semisize = size / 2;\n        this.ctx.drawImage(this.imageBee, bx, by, 720, 720, x - semisize, y - semisize, size, size);\n    }\n    drawHiveCellLines(cell) {\n        const COLOR_BG = '#000';\n        const COLOR_HIVE_P = '#ffc62a';\n        const COLOR_HIVE_S = '#ffd561';\n        const COLOR_HIVE_L = '#ff9202';\n        const sin = Math.sin(Math.PI / 3);\n        const cos = Math.cos(Math.PI / 3);\n        const { ctx } = this;\n        const { x, y, size } = cell;\n        ctx.beginPath();\n        ctx.moveTo(x - size, y);\n        ctx.lineTo(x - size * cos, y - size * sin);\n        ctx.lineTo(x + size * cos, y - size * sin);\n        ctx.lineTo(x + size, y);\n        ctx.lineTo(x + size * cos, y + size * sin);\n        ctx.lineTo(x - size * cos, y + size * sin);\n        ctx.lineTo(x - size, y);\n        ctx.fillStyle = COLOR_HIVE_P;\n        ctx.fill();\n        ctx.beginPath();\n        ctx.moveTo(x + size * cos, y - size * sin);\n        ctx.bezierCurveTo(x + size / 1.5, y, x + size / 2, y + size / 1.1, x - size * cos, y + size * sin);\n        ctx.lineTo(x + size * cos, y + size * sin);\n        ctx.lineTo(x + size, y);\n        ctx.fillStyle = COLOR_HIVE_S;\n        ctx.fill();\n        ctx.beginPath();\n        ctx.moveTo(x - size, y);\n        ctx.lineTo(x - size * cos, y - size * sin);\n        ctx.lineTo(x + size * cos, y - size * sin);\n        ctx.lineTo(x + size, y);\n        ctx.lineTo(x + size * cos, y + size * sin);\n        ctx.lineTo(x - size * cos, y + size * sin);\n        ctx.lineTo(x - size, y);\n        ctx.strokeStyle = COLOR_HIVE_L;\n        ctx.lineWidth = 6;\n        ctx.lineCap = 'round';\n        ctx.stroke();\n    }\n    beeImageCoordsByColor(color) {\n        switch (color) {\n            case BEE_COLOR.YELLOW: return [0, 0];\n            case BEE_COLOR.PURPLE: return [720, 0];\n            case BEE_COLOR.GREEN: return [1440, 0];\n            case BEE_COLOR.BLUE: return [2160, 0];\n        }\n    }\n}\nclass HiveGame {\n    constructor(ctx, imageBg, imageBee) {\n        this.drawer = null;\n        this.bees = [];\n        this.animator = null;\n        this.isAnimating = false;\n        this.gameState = GAME_STATE.WAITING_USER;\n        this.events = new Map();\n        this.drawer = new HiveGameDrawer(ctx, imageBg, imageBee);\n        const m = 8;\n        const n = 4;\n        const size = 80;\n        const x0 = ctx.canvas.width / 2 - 3 * (m - 1) * size / 4;\n        const y0 = ctx.canvas.height / 2 - Math.sqrt(3) * (2 * n - 1) * size / 4;\n        this.hive = new Hive(x0, y0, size, m, n);\n        this.init();\n    }\n    init() {\n        this.animator = null;\n        this.bees = [];\n        new HiveCellRecolor(this.hive.cells).move(0);\n        this.draw();\n        this.timeLeft = 20000;\n        this.score = 0;\n    }\n    handleWrongTouch() {\n        this.changeHives();\n        this.runAnimation();\n    }\n    handleToNextLevel() {\n        this.timeLeft += 2000;\n        this.changeHives();\n        this.runAnimation();\n    }\n    handleCorrectTouch(bee) {\n        this.score++;\n        this.bees.push(bee);\n        if (!this.animator) {\n            this.animator = new ParallelAnimation([]);\n        }\n        this.animator = new ParallelAnimation(\n        // @TODO: canvas size should not be hardcoded here\n        this.bees.map(b => new BeeFly(b, -0.1, 1200, 800)));\n        this.runAnimation();\n    }\n    handleClick(x, y) {\n        if (this.timeLeft <= 0 || this.gameState == GAME_STATE.CHANGING_LEVELS) {\n            return;\n        }\n        if (this.gameState == GAME_STATE.WAITING_USER) {\n            const hiveCell = this.hive.cellWithBeeAt(x, y);\n            const bee = hiveCell === null ? null : hiveCell.bornBee();\n            if (bee !== null) {\n                if (bee.isWorker()) {\n                    this.handleWrongTouch();\n                }\n                else if (this.newLevelRequired()) {\n                    this.handleToNextLevel();\n                }\n                else {\n                    this.handleCorrectTouch(bee);\n                }\n            }\n        }\n    }\n    on(event, callback) {\n        this.events.set(event, callback);\n    }\n    trigger(event, ...args) {\n        if (this.events.has(event)) {\n            const callback = this.events.get(event);\n            callback(...args);\n        }\n    }\n    draw() {\n        this.drawer.drawBg();\n        for (const cell of this.hive.cells) {\n            this.drawer.drawHiveCell(cell);\n        }\n        for (const bee of this.bees) {\n            this.drawer.drawBee(bee);\n        }\n        this.drawer.drawTime(this.timeLeft);\n        this.drawer.drawScore(this.score);\n    }\n    runAnimation() {\n        if (this.timeLeft <= 0 || this.isAnimating) {\n            return;\n        }\n        this.isAnimating = true;\n        const prevTime = Date.now();\n        requestAnimationFrame(() => {\n            const deltaT = Date.now() - prevTime;\n            const wasMoved = this.animator ? this.animator.move(deltaT) : false;\n            this.timeLeft = Math.max(0, this.timeLeft - deltaT);\n            this.draw();\n            this.isAnimating = false;\n            this.runAnimation();\n            if (!wasMoved && this.animator) {\n                this.animator = null;\n            }\n            if (!this.timeLeft) {\n                this.trigger('endgame', this.score);\n            }\n        });\n    }\n    changeHives() {\n        this.bees = [];\n        this.animator = new SerialAnimation([\n            new HiveCellBlink(this.hive.cells, -1, 10),\n            new HiveCellRecolor(this.hive.cells),\n            new HiveCellBlink(this.hive.cells, 5, this.hive.cellSize),\n        ], () => {\n            this.gameState = GAME_STATE.WAITING_USER;\n        });\n    }\n    newLevelRequired() {\n        return this.hive.containsForeighers();\n    }\n}\n\n\n//# sourceURL=webpack:///./src/ts/game.ts?");

/***/ }),

/***/ "./src/ts/main.ts":
/*!************************!*\
  !*** ./src/ts/main.ts ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/ts/game.ts\");\n\nfunction loadImage(src) {\n    return new Promise((response, reject) => {\n        const img = new Image();\n        img.src = src;\n        img.onerror = (err) => {\n            reject(err);\n        };\n        img.onload = () => {\n            response(img);\n        };\n    });\n}\nfunction main() {\n    return Promise.all([\n        loadImage('./dist/img/bees.png'),\n        loadImage('./dist/img/grass.png'),\n        loadImage('./dist/img/flowers.png'),\n    ])\n        .then(([imageBees, imageBg]) => {\n        const CLS_NONE = 'none';\n        const canvas = document.querySelector('canvas');\n        const $menu = document.querySelector('.menu');\n        const $game = document.querySelector('.game');\n        if (!canvas) {\n            throw new Error('No display');\n        }\n        const ctx = canvas.getContext('2d');\n        const game = new _game__WEBPACK_IMPORTED_MODULE_0__[\"HiveGame\"](ctx, imageBg, imageBees);\n        game.on('endgame', (score) => {\n            alert(`Your score: ${score}`);\n            $menu.classList.remove(CLS_NONE);\n            $game.classList.add(CLS_NONE);\n        });\n        canvas.addEventListener('click', function (event) {\n            game.handleClick(event.offsetX, event.offsetY);\n        });\n        document.querySelector('.menu .new-game').addEventListener('click', function () {\n            game.init();\n            $menu.classList.add(CLS_NONE);\n            $game.classList.remove(CLS_NONE);\n        });\n    })\n        .catch(err => {\n        console.error(err);\n    });\n}\nmain();\n\n\n//# sourceURL=webpack:///./src/ts/main.ts?");

/***/ })

/******/ });