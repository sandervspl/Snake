import SnakePart from "./SnakePart";
import {ctx, canvas, Direction} from "./defines";
import __Object from "./Object";
import SnakeMgr from "./SnakeMgr";
import GridNode from "./GridNode";

export default class GameScene
{
    private _snakeParts: SnakePart[];   // every snake part that is on the field
    private _candy: __Object;           // randomly added candy on field
    private _isDead: boolean;
    private _snakeMgr: SnakeMgr;
    private _loop: any;

    private _grid: GridNode[][];
    private _gridSize: number;
    private _gridWidth: number;
    private _gridHeight: number;

    constructor()
    {
        this.setupCanvas();
        this.createGrid();
        this.startGame();
    }
    
    public getGridSize():number { return this._gridSize; }

    private setupCanvas():void
    {
        canvas.width = 1000;
        canvas.height = 500;
        canvas.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
        canvas.style.top = window.innerHeight / 2 - canvas.height / 2 + "px";
        canvas.style.position = "absolute";
    }

    private createGrid():void
    {
        this._grid = [];

        this._gridSize = 50;

        var tries = 0;
        while (canvas.width % this._gridSize) {
            this._gridSize -= 0.5;

            if (tries > 1000) {
                console.log('escaped');
                break;
            }
        }


        this._gridWidth = Math.round(canvas.width / this._gridSize);
        this._gridHeight = Math.round(canvas.height / this._gridSize);

        for (var i = 0; i < this._gridWidth; i += 1) {
            this._grid[i] = [];

            for (var j = 0; j < this._gridHeight; j += 1) {
                var posId = {x: i, y: j};
                
                this._grid[i][j] = new GridNode(this._gridSize, posId);
            }
        }
    }

    // initialize and add our first snake part to array
    private init():void
    {
        var x = Math.round(this._gridWidth / 2),
            y = Math.round(this._gridHeight / 2);

        var position = this._grid[x][y].getPosition();

        var head = new SnakePart(position.x, position.y, this._gridSize, Direction.DIR_RIGHT, true);
        this._snakeParts.push(head);
    }

    private addEventHandlers():void { window.addEventListener('keydown', (e)=> { this.keyboardInput(e) }); }

    private keyboardInput(event: KeyboardEvent):any
    {
        if (!this._isDead) return;

        if (event.keyCode == 82) {
            this.startGame();
        }

    }

    private startGame():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        var size = this._gridSize / 2;

        var x = getRandomInt(0, this._gridWidth - 1),
            y = getRandomInt(0, this._gridHeight - 1);

        var position = this._grid[x][y].getPosition();

        x = position.x + size;
        y = position.y + size;

        this._candy = new __Object(x, y, this._gridSize / 2, "circle");
    }

    // collision
    private collisionCheck():void
    {
        var head = this._snakeParts[0],
            ax1 = head.getPositionX(),
            ax2 = head.getPositionX() + head.getSize(),
            ay1 = head.getPositionY(),
            ay2 = head.getPositionY() + head.getSize();

        for (var i = 1; i < this._snakeParts.length; i += 1) {
            var tail = this._snakeParts[i];
            bx1 = tail.getPositionX();
            bx2 = tail.getPositionX() + tail.getSize();
            by1 = tail.getPositionY();
            by2 = tail.getPositionY() + tail.getSize();

            if (isCollision(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2)) {
                this._isDead = true;
            }
        }

        if (this._candy != null) {
            var bx1 = this._candy.getPositionX(),
                bx2 = this._candy.getPositionX() + this._candy.getSize(),
                by1 = this._candy.getPositionY(),
                by2 = this._candy.getPositionY() + this._candy.getSize();

            if (isCollision(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2)) {
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

    private updateGrid():void
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

        if (this._isDead) {
            this.gameOver();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this._snakeMgr.updateSnake();
        this.collisionCheck();

        if (this._candy != null) this._candy.draw();

        this.updateGrid();
    }
}



// check collision between two rectangles
function isCollision(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2):boolean
{
    return  ax1 < bx2 &&
            ax2 > bx1 &&
            ay1 < by2 &&
            ay2 > by1;
}

function getRandomInt(min:number , max:number):number
{
    return Math.floor(Math.random() * (1 + max - min)) + min;
}