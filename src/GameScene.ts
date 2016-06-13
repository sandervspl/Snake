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

    public _isDead: boolean;

    constructor()
    {
        this._showGrid = false;

        this.setupCanvas();

        if (this.createGrid()) {
            this.startGame();
        } else {
            console.error('ERROR: Unable to create grid for this canvas size and grid size combination.');
        }
    }
    
    public getGridSize():number { return this._gridSize; }
    
    public getGrid():GridNode[][] { return this._grid; }

    private setupCanvas():void
    {
        canvas.width = 1000;
        canvas.height = 500;

        canvas.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
        canvas.style.top = window.innerHeight / 2 - canvas.height / 2 + "px";
        canvas.style.position = "absolute";
    }

    private createGrid():boolean
    {
        this._grid = [];
        this._gridSize = 50;

        var tries = 0;
        while (canvas.width % this._gridSize) {
            this._gridSize -= 0.5;
            tries += 1;

            if (tries > 1000) break;
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

    // initialize and add our first snake part to array
    private init():void
    {
        var x = Math.round(this._gridWidth / 2),
            y = Math.round(this._gridHeight / 2);

        // var position = this._grid[x][y].getPosition();

        var head = new SnakePart(x, y, this._grid, this._gridSize, Direction.DIR_RIGHT, true);
        this._snakeParts.push(head);
    }

    private addEventHandlers():void { window.addEventListener('keydown', (e)=> { this.keyboardInput(e) }); }

    private keyboardInput(event: KeyboardEvent):any
    {
        // G
        if (event.keyCode == 71) this._showGrid = (this._showGrid) ? false : true;

        // R
        if (event.keyCode == 82) {
            if (!this._isDead) return;

            this.startGame();
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

        this._snakeParts = [];
        this._candy = null;
        this._loop = null;
        this._isDead = false;
        this._snakeMgr = new SnakeMgr(this, this._snakeParts);

        this.addEventHandlers();
        this.init();
        this.spawnCandy();

        this.update();
    }

    // spawn new candy randomly on field
    private spawnCandy():void
    {
        var x = getRandomInt(0, this._gridWidth - 1),
            y = getRandomInt(0, this._gridHeight - 1);

        this._candy = new __Object(x, y, this._grid, this._gridSize / 2, "circle");
    }

    // collision
    private collisionCheck():void
    {
        var headX = this._snakeParts[0].getGridPosition().x,
            headY = this._snakeParts[0].getGridPosition().y;

        for (var i = 1; i < this._snakeParts.length; i += 1) {
            var tailX = this._snakeParts[i].getGridPosition().x,
                tailY = this._snakeParts[i].getGridPosition().y;

            if (headX == tailX && headY == tailY) {
                this._isDead = true;
            }
        }

        if (this._candy != null) {
            var candyX = this._candy.getGridPosition().x,
                candyY = this._candy.getGridPosition().y;

            if (headX == candyX && headY == candyY) {
                this._candy = null;
                this.spawnCandy();
                this._snakeMgr.addTail();
            }
        }
    }
    
    private gameOver():void
    {
        ctx.font = "60px Verdana";
        ctx.fillStyle = "red";
        ctx.fillText("Game Over", canvas.width/2 - ctx.measureText("Game Over").width/2, canvas.height/2);

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