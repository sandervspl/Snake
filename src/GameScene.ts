import SnakePart from "./SnakePart";
import {ctx, canvas, Direction} from "./defines";
import __Object from "./Object";

export default class GameScene
{
    private _snakeParts:SnakePart[] = [];   // every snake part that is on the field
    private _lastUpdateTime: number;        // last time we updated canvas
    private _updateTime: number;            // time difference between updates
    private _candy: __Object;               // randomly added candy on field
    private isDead: boolean;

    constructor()
    {
        this._lastUpdateTime = Date.now();
        this._updateTime = 100;             // .25 seconds

        this.isDead = false;

        this.addEventHandlers();
        this.init();
        this.spawnCandy();

        this.update();
    }

    // add keyboard event handlers
    private addEventHandlers():void { window.addEventListener('keydown', (e)=> { this.keyboardInput(e) }); }

    // update direction flags with keyboard input
    private keyboardInput(event: KeyboardEvent):any
    {
        var head = this._snakeParts[0];

        switch (event.keyCode)
        {
            case 38:
            case 87:
                if (head._direction != Direction.DIR_DOWN)
                    head._direction = Direction.DIR_UP;
                break;

            case 39:
            case 68:
                if (head._direction != Direction.DIR_LEFT)
                    head._direction = Direction.DIR_RIGHT;
                break;

            case 40:
            case 83:
                if (head._direction != Direction.DIR_UP)
                    head._direction = Direction.DIR_DOWN;
                break;

            case 37:
            case 65:
                if (head._direction != Direction.DIR_RIGHT)
                    head._direction = Direction.DIR_LEFT;
                break;
        }
    }

    // initialize and add our first snake part to array
    private init():void
    {
        var x = canvas.width / 2,
            y = canvas.height / 2;

        var head = new SnakePart(x, y, Direction.DIR_RIGHT);
        this._snakeParts.push(head);
    }

    // spawn new candy randomly on field
    private spawnCandy():void
    {
        var x = Math.random() * (canvas.width - this._snakeParts[0].getSprite().width),
            y = Math.random() * (canvas.height - this._snakeParts[0].getSprite().height);

        this._candy = new __Object(x, y, "images/candy.png");
    }

    // add new tail according to last snake part's direction
    private spawnTail():void
    {
        var x = 0,
            y = 0,
            last = this._snakeParts.length - 1,
            direction = this._snakeParts[last]._direction;

        switch (this._snakeParts[last]._direction)
        {
            case Direction.DIR_UP:
                x = this._snakeParts[last].getPositionX();
                y = this._snakeParts[last].getPositionY() + this._snakeParts[last].getSprite().height;
                break;

            case Direction.DIR_RIGHT:
                x = this._snakeParts[last].getPositionX() - this._snakeParts[last].getSprite().width;
                y = this._snakeParts[last].getPositionY();
                break;

            case Direction.DIR_DOWN:
                x = this._snakeParts[last].getPositionX();
                y = this._snakeParts[last].getPositionY() - this._snakeParts[last].getSprite().height;
                break;

            case Direction.DIR_LEFT:
                x = this._snakeParts[last].getPositionX() + this._snakeParts[last].getSprite().width;
                y = this._snakeParts[last].getPositionY();
                break;
        }

        var tail = new SnakePart(x, y, direction);
        this._snakeParts.push(tail);
    }

    // collision
    private collisionCheck():void
    {
        var head = this._snakeParts[0],
            ax1 = head.getPositionX(),
            ax2 = head.getPositionX() + head.getSprite().width,
            ay1 = head.getPositionY(),
            ay2 = head.getPositionY() + head.getSprite().height;

        var bx1 = this._candy.getPositionX(),
            bx2 = this._candy.getPositionX() + this._candy.getSprite().width,
            by1 = this._candy.getPositionY(),
            by2 = this._candy.getPositionY() + this._candy.getSprite().height;

        if (isCollision(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2)) {
            this._candy = null;
            this.spawnCandy();
            this.spawnTail();
        }

        for (var i = 1; i < this._snakeParts.length; i += 1) {
            var tail = this._snakeParts[i];
            bx1 = tail.getPositionX();
            bx2 = tail.getPositionX() + tail.getSprite().width;
            by1 = tail.getPositionY();
            by2 = tail.getPositionY() + tail.getSprite().height;

            if (isCollision(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2)) {
                this.isDead = true;
            }
        }
    }

    private updateSnake():void
    {
        var curTime = Date.now(),
            diff    = curTime - this._lastUpdateTime,
            prevDir = this._snakeParts[0]._direction;

        if (diff > this._updateTime) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // update snake and tail positions according to direction
            for (var i = 0; i < this._snakeParts.length; i += 1)
            {
                this._snakeParts[i].update();

                // update their direction flag, given from previous tail (or head when i == 1)
                if (i > 0) {
                    // save current direction
                    var dir = this._snakeParts[i]._direction;

                    // add previous direction to current tail
                    this._snakeParts[i]._direction = prevDir;

                    // add saved direction to variable, so we can give it to the next tail
                    prevDir = dir;
                }
            }

            this._lastUpdateTime = curTime;
        }
    }

    // update sprites
    private update():void
    {
        requestAnimationFrame(() => this.update());

        if (this.isDead) {
            ctx.font = "60px Verdana";
            ctx.fillText("Game Over", canvas.width/2 - ctx.measureText("Game Over").width/2, canvas.height/2);
            return;
        }

        this.updateSnake();
        this.collisionCheck();

        if (this._candy != null) this._candy.update();
    }
}



// check collision between two rectangles
export function isCollision(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2):boolean
{
    return  ax1 < bx2 &&
            ax2 > bx1 &&
            ay1 < by2 &&
            ay2 > by1;
}