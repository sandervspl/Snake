import SnakePart from "./SnakePart";
import {ctx, canvas, Direction} from "./defines";
import __Object from "./Object";
import SnakeMgr from "./SnakeMgr";
import GridNode from "./GridNode";

export default class GameScene
{
    private _snakeParts: SnakePart[];   // every snake part that is on the field
    private _candy: __Object;           // randomly added candy on field
    private _snakeMgr: SnakeMgr;
    private _loop: any;

    private _grid: GridNode[][];
    private _gridSize: number;
    private _gridWidth: number;
    private _gridHeight: number;
    private _showGrid: boolean;

    private _score: number;

    public _isDead: boolean;

    constructor()
    {
        this._showGrid = false;

        this.setupScreen();

        if (this.createGrid()) {
            this.startGame();
        } else {
            console.error('ERROR: Unable to create grid for this canvas size and grid size combination.');
        }
    }
    
    public getGridSize():number { return this._gridSize; }
    
    public getGrid():GridNode[][] { return this._grid; }

    private setupScreen():void
    {
        canvas.width = 1000;
        canvas.height = 500;

        canvas.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
        canvas.style.top = window.innerHeight / 2 - canvas.height / 2 + "px";
        canvas.style.position = "absolute";

        var score = document.getElementById("score");
        score.style.left = window.innerWidth / 2 + "px";
        score.style.top = window.innerHeight / 2 - canvas.height / 2  - 40 + "px";
        score.style.position = "absolute";

        var highscore = document.getElementById("highscore");
        highscore.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
        highscore.style.top = window.innerHeight / 2 - canvas.height / 2  - 40 + "px";
        highscore.style.position = "absolute";

        var controls = document.getElementById("controls");
        controls.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
        controls.style.top = window.innerHeight / 2 + canvas.height / 2  + 20 + "px";
        controls.style.position = "absolute";

        this.setupScore();
    }

    private setupScore():void
    {
        var score = document.getElementById("score");
        score.innerHTML = String(this._score);

        var highscore = document.getElementById("highscore");
        highscore.innerHTML = "Highscore: " + (localStorage.getItem("snake_highscore") || 0);
    }

    private createGrid():boolean
    {
        this._grid = [];
        this._gridSize = 50;

        var tries = 0;
        while (canvas.width % this._gridSize) {
            if (tries < 500) {
                this._gridSize -= 0.5;
                tries += 1;
            } else if (tries >= 500 && tries < 1000) {
                if (this._gridSize < 50) this._gridSize += 50;
                this._gridSize += 0.5;
                tries += 1;
            } else {
                break;
            }
        }

        if (canvas.width % this._gridSize ||
            canvas.height % this._gridSize) return false;

        this._gridWidth = Math.round(canvas.width / this._gridSize);
        this._gridHeight = Math.round(canvas.height / this._gridSize);

        for (var i = 0; i < this._gridWidth; i += 1) {
            this._grid[i] = [];

            for (var j = 0; j < this._gridHeight; j += 1) {
                var posId = {x: i, y: j};
                
                this._grid[i][j] = new GridNode(this._gridSize, posId);
            }
        }

        return true;
    }

    private addEventHandlers():void { window.addEventListener('keydown', (e)=> { this.keyboardInput(e) }); }

    private keyboardInput(event: KeyboardEvent):any
    {
        event.preventDefault();

        // G
        if (event.keyCode == 71) this._showGrid = (this._showGrid) ? false : true;

        // R
        if (event.keyCode == 82) {
            if (!this._isDead) return;

            this.startGame();
        }
    }

    // initialize and add our first snake part to array
    private init(count: number = 1):void
    {
        for (var i = 0; i < count; i += 1) {
            var x      = Math.round(this._gridWidth / 2) - i,
                y      = Math.round(this._gridHeight / 2),
                isHead = (i > 0) ? false : true;

            var snake = new SnakePart(x, y, this._grid, this._gridSize, Direction.DIR_RIGHT, isHead);
            this._snakeParts.push(snake);
        }
    }

    private startGame():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < this._gridWidth; i += 1) {
            for (var j = 0; j < this._gridHeight; j += 1) {
                this._grid[i][j]._isOccupied = false;
            }
        }

        this._score = 0;
        this._snakeParts = [];
        this._candy = null;
        this._loop = null;
        this._isDead = false;
        this._snakeMgr = new SnakeMgr(this, this._snakeParts);

        this.addEventHandlers();
        this.init(3);
        this.spawnCandy();

        this.setupScore();

        this.update();
    }

    // spawn new candy randomly on field
    private spawnCandy():void
    {
        var freeNodes: GridNode[][] = [];

        for (var x = 0, i = 0; x < this._gridWidth; x += 1) {
            freeNodes[i] = [];

            for (var y = 0, j = 0; y < this._gridHeight; y += 1) {
                if (!this._grid[x][y]._isOccupied) {
                    freeNodes[i][j] = this._grid[x][y];
                    j += 1;
                }
            }

            i += 1;
        }

        var x = getRandomInt(0, freeNodes.length - 1),
            y = getRandomInt(0, freeNodes[x].length - 1);

        // hack fix for some rare undefined bug
        if (freeNodes[x][y] == null) {
            this.spawnCandy();
            return;
        }

        if (!freeNodes[x][y]._isOccupied) {
            var posxid = freeNodes[x][y].getPositionID().x,
                posyid = freeNodes[x][y].getPositionID().y;
        }

        // console.log(freeNodes);
        // console.log('xid: ' + posxid);
        // console.log('yid: ' + posyid);
        // console.log(freeNodes[x][y].getPositionID());

        this._candy = new __Object(posxid, posyid, this._grid, this._gridSize / 2, "circle");

        // console.log(this._candy.getGridPositionID());
    }

    // collision
    private collisionCheck():void
    {
        var headX = this._snakeParts[0].getGridPositionID().x,
            headY = this._snakeParts[0].getGridPositionID().y;

        for (var i = 1; i < this._snakeParts.length; i += 1) {
            var tailX = this._snakeParts[i].getGridPositionID().x,
                tailY = this._snakeParts[i].getGridPositionID().y;

            if (headX == tailX && headY == tailY) {
                this._isDead = true;
            }
        }

        if (this._candy != null) {
            var candyX = this._candy.getGridPositionID().x,
                candyY = this._candy.getGridPositionID().y;

            if (headX == candyX && headY == candyY) {
                this.updateScore();

                this._candy = null;
                this.spawnCandy();
                this._snakeMgr.addTail();
            }
        }
    }

    private updateScore():void
    {
        this._score += 10;

        var score = document.getElementById("score");
        if (score) {
            score.innerHTML = String(this._score);
        }
    }
    
    private gameOver():void
    {
        var hs = localStorage.getItem("snake_highscore");
        if (this._score > hs) localStorage.setItem("snake_highscore", String(this._score));

        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.rect(0, canvas.height/3, canvas.width, canvas.height * 0.35);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.restore();

        ctx.font = "60px Verdana";
        ctx.fillStyle = "black";
        ctx.fillText("Game Over", canvas.width/2 - ctx.measureText("Game Over").width/2, canvas.height/2);
        ctx.font = "40px Verdana";
        ctx.fillText("Press R to play again", canvas.width/2 - ctx.measureText("Press R to play again").width/2, canvas.height/2 + 50);

        cancelAnimationFrame(this._loop);
    }

    private drawGrid():void
    {
        for (var i = 0; i < this._gridWidth; i += 1) {
            for (var j = 0; j < this._gridHeight; j += 1) {
                this._grid[i][j].draw();
            }
        }
    }

    // update sprites
    private update():void
    {
        this._loop = requestAnimationFrame( () => this.update() );

        if (this._snakeParts[0]._isBeyondMap) this._isDead = true;

        if (this._isDead) {
            this.gameOver();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this._snakeMgr.updateSnake();
        this.collisionCheck();

        if (this._candy != null) this._candy.draw();

        if (this._showGrid) this.drawGrid();
    }
}



function getRandomInt(min:number , max:number):number
{
    return Math.floor(Math.random() * (1 + max - min)) + min;
}