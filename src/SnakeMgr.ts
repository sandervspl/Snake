import SnakePart from "./SnakePart";
import {Direction} from "./Defines";
import GameScene from "./GameScene";

export default class SnakeMgr
{
    private _snakeParts: SnakePart[];
    private _lastUpdateTime: number;        // last time we updated canvas
    private _updateTime: number;            // time difference between updates
    private _game: GameScene;
    
    constructor(game: GameScene, snakeParts: SnakePart[])
    {
        this._game = game;
        this._snakeParts = snakeParts;
        this._lastUpdateTime = Date.now();
        this._updateTime = 150;             // .15 seconds
    }

    // add new tail according to last snake part's direction
    public addTail():void
    {
        var x = 0,
            y = 0,
            last = this._snakeParts.length - 1,
            direction = this._snakeParts[last]._curDirection;

        switch (direction)
        {
            case Direction.DIR_UP:
                x = this._snakeParts[last].getGridPosition().x;
                y = this._snakeParts[last].getGridPosition().y + 1;
                break;

            case Direction.DIR_RIGHT:
                x = this._snakeParts[last].getGridPosition().x - 1;
                y = this._snakeParts[last].getGridPosition().y;
                break;

            case Direction.DIR_DOWN:
                x = this._snakeParts[last].getGridPosition().x;
                y = this._snakeParts[last].getGridPosition().y - 1;
                break;

            case Direction.DIR_LEFT:
                x = this._snakeParts[last].getGridPosition().x + 1;
                y = this._snakeParts[last].getGridPosition().y;
                break;
        }

        var tail = new SnakePart(x, y, this._game.getGrid(), this._game.getGridSize(), direction, false);
        this._snakeParts.push(tail);
    }

    public updateSnake():void
    {
        var curTime = Date.now(),
            diff    = curTime - this._lastUpdateTime,
            prevDir = this._snakeParts[0]._curDirection;

        // update snake and tail positions according to direction
        for (var i = 0; i < this._snakeParts.length; i += 1)
        {
            this._snakeParts[i].draw();

            if (diff > this._updateTime) {
                // update their direction flag, given from previous tail or head when i == 1
                if (i > 0) {
                    // save current direction
                    var dir = this._snakeParts[i]._curDirection;

                    // add previous direction to current tail
                    this._snakeParts[i]._curDirection = prevDir;

                    // add saved direction to variable, so we can give it to the next tail
                    prevDir = dir;
                }

                this._snakeParts[i].updatePosition();
            }
        }

        if (diff > this._updateTime) this._lastUpdateTime = curTime;
    }
}