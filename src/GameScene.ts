import {ctx, canvas} from "./defines";
import __Object from "./Object";
import SnakeMgr from "./SnakeMgr";
import GridNode from "./GridNode";
import ___Object from "./Object";

export default class GameScene
{
    // private _snakeParts: SnakePart[][];   // every snake part that is on the field
    private _candy: __Object;           // randomly added candy on field
    private _snakeMgr: SnakeMgr[];
    private _loop: any;

    private _grid: GridNode[][];
    private _gridSize: number;
    private _gridWidth: number;
    private _gridHeight: number;
    private _showGrid: boolean;

    private _score: number;

    private _isMultiplayer: boolean;

    public _isDead: boolean;

    constructor(isMultiplayer: boolean)
    {
        this._isMultiplayer = isMultiplayer;
        this._showGrid = false;

        this.addEventHandlers();

        this.setupScreen();

        if (this.createGrid()) {
            this.startGame();
        } else {
            console.error('ERROR: Unable to create grid for this canvas size and grid size combination.');
        }
    }
    
    public getGridSize():number { return this._gridSize; }
    
    public getGridWH() {
        return {
            width: this._gridWidth,
            height: this._gridHeight
        }
    }
    
    public getGrid():GridNode[][] { return this._grid; }

    public getCandy():___Object { return this._candy; }

    private setupScreen():void
    {
        var score = document.getElementById("score");
        score.style.left = window.innerWidth / 2 + "px";
        score.style.top = window.innerHeight / 2 - canvas.height / 2  - 40 + "px";
        score.style.position = "absolute";

        var highscore = document.getElementById("highscore");
        highscore.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
        highscore.style.top = window.innerHeight / 2 - canvas.height / 2  - 40 + "px";
        highscore.style.position = "absolute";

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

        var size = 50;
        this._gridSize = size;

        var tries = 0;
        while (canvas.width % this._gridSize) {
            if (tries < 500) {
                this._gridSize -= 0.5;
                tries += 1;
            } else if (tries >= 500 && tries < 1000) {
                if (this._gridSize < size) this._gridSize = size;
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

        for (var x = 0; x < this._gridWidth; x += 1) {
            this._grid[x] = [];

            for (var y = 0; y < this._gridHeight; y += 1) {
                var posId = {x: x, y: y};
                
                this._grid[x][y] = new GridNode(this._gridSize, posId);
            }
        }

        return true;
    }

    private addEventHandlers():void { window.addEventListener('keydown', (e)=> { this.keyboardInput(e) }); }

    private keyboardInput(event: KeyboardEvent):any
    {
        // G
        if (event.keyCode == 71) {
            event.preventDefault();
            this._showGrid = (this._showGrid) ? false : true;
        }

        // R
        if (event.keyCode == 82) {
            if (!this._isDead) return;

            event.preventDefault();
            this.startGame();
        }
    }

    // initialize and add our first snake part(s) to array
    private init():void
    {
        var players = (this._isMultiplayer) ? 2 : 1;
        for (var i = 0; i < players; i += 1) {
            var snakeMgr = new SnakeMgr(this, (i) ? "black" : "white", i);
            this._snakeMgr.push(snakeMgr);
        }
    }

    private startGame():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var x = 0; x < this._gridWidth; x += 1) {
            for (var y = 0; y < this._gridHeight; y += 1) {
                this._grid[x][y]._isOccupied = false;
            }
        }

        this._score = 0;
        this._loop = null;
        this._isDead = false;

        this._snakeMgr = [];

        this.init();
        this.spawnCandy();

        this.setupScore();

        this.update();
    }

    // spawn new candy randomly on field
    private spawnCandy():void
    {
        this._candy = null;
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

        // hack fix for a rare undefined bug
        if (freeNodes[x][y] == null) {
            this.spawnCandy();
            return;
        }

        if (!freeNodes[x][y]._isOccupied) {
            var xid = freeNodes[x][y].getPositionID().x,
                yid = freeNodes[x][y].getPositionID().y;

            // console.log(freeNodes);
            // console.log('xid: ' + xid);
            // console.log('yid: ' + yid);
            // console.log(freeNodes[x][y].getPositionID());

            this._candy = new __Object(xid, yid, this._grid, this._gridSize / 2, "circle", "orange");

            // console.log(this._candy.getGridPositionID());
        } else {
            this.spawnCandy();
        }
    }

    private updateScore():void
    {
        this._score += 10;

        var score = document.getElementById("score");
        score.innerHTML = String(this._score);
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
        for (var x = 0; x < this._gridWidth; x += 1) {
            for (var y = 0; y < this._gridHeight; y += 1) {
                this._grid[x][y].draw();
            }
        }
    }


    private collisionCheck():void
    {
        for (var i = 0; i < this._snakeMgr.length; i += 1) {
            var snakeParts = this._snakeMgr[i].getSnakeParts();

            var headXid = snakeParts[0].getGridPositionID().x,
                headYid = snakeParts[0].getGridPositionID().y;

            for (var j = 1; j < snakeParts.length; j += 1) {
                var tailXid = snakeParts[j].getGridPositionID().x,
                    tailYid = snakeParts[j].getGridPositionID().y;

                if (headXid == tailXid && headYid == tailYid) {
                    this._isDead = true;
                }
            }

            var candy = this._candy;
            if (candy != null) {
                var candyXid = candy.getGridPositionID().x,
                    candyYid = candy.getGridPositionID().y;

                if (headXid == candyXid && headYid == candyYid) {
                    this.updateScore();

                    this.spawnCandy();
                    this._snakeMgr[i].addTail();
                }
            }
        }
    }

    // update sprites
    public update():void
    {
        this._loop = requestAnimationFrame( () => this.update() );

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (var i = 0; i < this._snakeMgr.length; i += 1) {
            if (this._isDead) {
                this.gameOver();
                return;
            }

            this._snakeMgr[i].updateSnake();
        }

        this.collisionCheck();
        if (this._candy != null) this._candy.draw();
        if (this._showGrid) this.drawGrid();
    }
}



function getRandomInt(min:number, max:number):number
{
    return Math.floor(Math.random() * (1 + max - min)) + min;
}