import {ctx, canvas} from "./defines";
import __Object from "./Object";
import SnakeMgr from "./SnakeMgr";
import GridNode from "./GridNode";
import Game from "./Game";
export default class GameScene
{
    private _game: Game;
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

    public _isGameOver: boolean;

    constructor(game: Game, isMultiplayer: boolean)
    {
        this._game = game;

        this._isMultiplayer = isMultiplayer;
        this._showGrid = false;

        this.addEventHandlers();

        if (!this._isMultiplayer) this.setupScreen();

        if (this.createGrid()) {
            this.startGame();
        } else {
            errorMsg("GameScene", "constructor", "Unable to create grid for this canvas size and grid size combination.");
        }
    }
    
    public getGame():Game { return this._game; }
    
    public getGridSize():number { return this._gridSize; }
    
    public getGridWH() {
        return {
            width: this._gridWidth,
            height: this._gridHeight
        }
    }
    
    public getGrid():GridNode[][] { return this._grid; }

    private setupScreen():void
    {
        var offsetY = 25;

        var el    = "score",
            score = document.getElementById(el),
            error = "Could not find element! Given: ";

        if (score) {
            score.style.left = window.innerWidth / 2 + "px";
            score.style.top = window.innerHeight / 2 - canvas.height / 2 - offsetY + "px";
            score.style.position = "absolute";
        } else {
            errorMsg("GameScene", "setupScreen", error + el);
        }

        el = "highscore";
        var highscore = document.getElementById("highscore");

        if (highscore) {
            highscore.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
            highscore.style.top = window.innerHeight / 2 - canvas.height / 2 - offsetY + "px";
            highscore.style.position = "absolute";
        } else {
            errorMsg("GameScene", "setupScreen", error + el);
        }
    }

    private setupScore(clear: boolean = false):void
    {
        var el    = "score",
            score = document.getElementById(el),
            error = "Could not find element! Given: ";

        if (score) {
            score.innerHTML = (this._isMultiplayer || clear) ? "" : String(this._score);
        } else {
            errorMsg("GameScene", "setupScore", error + el);
        }

        el = "highscore";
        var highscore = document.getElementById("highscore");

        if (highscore) {
            highscore.innerHTML = (this._isMultiplayer || clear) ? "" : "Highscore: " + (localStorage.getItem("snake_highscore") || 0);
        } else {
            errorMsg("GameScene", "setupScore", error + el);
        }
    }

    private updateScore():void
    {
        this._score += 10 * (this._game._difficulty - 1);

        var el = "score",
            score = document.getElementById(el),
            error = "Could not find element! Given: ";

        if (score) {
            score.innerHTML = String(this._score);
        } else {
            errorMsg("GameScene", "updateScore", error + el);
        }
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

        if (canvas.width % this._gridSize || canvas.height % this._gridSize)
            return false;

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

    private addEventHandlers():void { window.addEventListener('keyup', (e)=> { this.keyboardInput(e) }); }

    private keyboardInput(event: KeyboardEvent):any
    {
        if (!this._game._hasGameStarted) return;

        // ESCAPE
        if (event.keyCode == 27) {
            if (!this._isGameOver) return;
            
            cancelAnimationFrame(this._loop);
            this.setupScore(true);
            this._game.startMenu();
        }

        // G
        if (event.keyCode == 71) {
            this._showGrid = (this._showGrid) ? false : true;
        }

        // R
        if (event.keyCode == 82) {
            if (!this._isGameOver) return;
            
            cancelAnimationFrame(this._loop);
            // this._game._hasGameStarted = false;
            this.startGame();

            // if (!this._isMultiplayer)
            //     this._game.startSPGame();
            // else
            //     this._game.startMPGame();

            // this._game.startMenu((this._isMultiplayer) ? 2 : 1);
        }
    }

    private startGame():void
    {
        // this._loop = null;
        this._game.getMenu().cancelAnimFrame();     // hack fix

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var x = 0; x < this._gridWidth; x += 1) {
            for (var y = 0; y < this._gridHeight; y += 1) {
                this._grid[x][y]._isOccupied = false;
            }
        }

        this._isGameOver = false;

        this._score = 0;
        this.setupScore();

        this._snakeMgr = [];

        this.init();
        this.spawnCandy();
        this.update();

        console.log('startgame');
    }

    // initialize and add our first snake part(s) to array
    private init():void
    {
        var players = (this._isMultiplayer) ? 2 : 1;
        for (var i = 0; i < players; i += 1) {
            var snakeMgr = new SnakeMgr(this, (i) ? "Black" : "White", i);
            this._snakeMgr.push(snakeMgr);
        }
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

            this._candy = new __Object(xid, yid, this._grid, this._gridSize / 2, "circle", "orange");
        } else {
            this.spawnCandy();
        }
    }
    
    private gameOver():void
    {
        var winner = "No one";
        if (this._isMultiplayer) {
            for (var i = 0; i < this._snakeMgr.length; i += 1) {
                var index = (i > 0) ? 0 : 1;
                if (this._snakeMgr[i]._isDead) winner = this._snakeMgr[index].getColor();
            }
        }

        // game over message
        var msg  = (this._isMultiplayer) ? winner + " wins!" : "Game Over!",
            msg2 = "Press R to play again",
            msg3 = "Press ESCAPE to go to menu";

        // background
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.rect(0, canvas.height/3, canvas.width, canvas.height * 0.4);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.restore();

        // game over text
        ctx.font = "60px Verdana";
        ctx.fillStyle = "black";
        ctx.fillText(msg, canvas.width/2 - ctx.measureText(msg).width/2, canvas.height/2);

        // Press R...
        ctx.font = "30px Verdana";
        ctx.fillText(msg2, canvas.width/2 - ctx.measureText(msg2).width/2, canvas.height/2 + 40);

        // Press ESC...
        ctx.fillText(msg3, canvas.width/2 - ctx.measureText(msg3).width/2, canvas.height/2 + 80);

        // high score tracking
        var item = "snake_highscore",
            hs   = localStorage.getItem(item);

        if (hs) {
            if (this._score > hs) localStorage.setItem(item, String(this._score));
        } else {
            errorMsg("GameScene", "gameOver", "Could not find localStorage item. Given: " + item);
        }

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
            var snakeMgr   = this._snakeMgr[i],
                snakeParts = snakeMgr.getSnakeParts();

            var headXid  = snakeParts[0].getGridPositionID().x,
                headYid  = snakeParts[0].getGridPositionID().y,
                playerID = snakeMgr.getPlayerID();

            // look through all bodies, even our own
            for (var j = 0; j < this._snakeMgr.length; j += 1) {
                for (var k = 0; k < this._snakeMgr[j].getSnakeParts().length; k += 1) {
                    // skip our own head part
                    if (k == 0 && playerID == this._snakeMgr[j].getPlayerID())
                        continue;

                    // look through body parts
                    var part = this._snakeMgr[j].getSnakeParts()[k];
                    var tailXid = part.getGridPositionID().x,
                        tailYid = part.getGridPositionID().y;

                    // we hit a bodypart
                    if (headXid == tailXid && headYid == tailYid) {
                        snakeMgr._isDead = true;
                        this._isGameOver = true;
                    }
                }
            }

            // candy
            var candy = this._candy;
            if (candy != null) {
                var candyXid = candy.getGridPositionID().x,
                    candyYid = candy.getGridPositionID().y;

                if (headXid == candyXid && headYid == candyYid) {
                    if (!this._isMultiplayer) this.updateScore();

                    this.spawnCandy();
                    this._snakeMgr[i].addTail();
                }
            }
        }
    }

    // update sprites
    public update():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.collisionCheck();

        for (var i = 0; i < this._snakeMgr.length; i += 1) {
            this._snakeMgr[i].updateSnake();
        }

        if (this._candy != null) this._candy.draw();
        if (this._showGrid) this.drawGrid();

        if (this._isGameOver) {
            this.gameOver();
            return;
        }

        this._loop = requestAnimationFrame( () => this.update() );
    }
}



function getRandomInt(min:number, max:number):number
{
    return Math.floor(Math.random() * (1 + max - min)) + min;
}

function errorMsg(className: string, methodName: string, ...text: string[]):void
{
    if (!this._game._debug) return;

    var msg = "ERROR! " + className + "::" + methodName + " | ";
    for (let t of text) {
        msg += t + " ";
    }
    console.log(msg);
}