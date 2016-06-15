import SnakePart from "./SnakePart";
import {Direction} from "./Defines";
import GameScene from "./GameScene";

export default class SnakeMgr
{
    private _snakeParts: SnakePart[];
    private _lastUpdateTime: number;        // last time we updated canvas
    private _updateTime: number;            // time difference between updates
    private _game: GameScene;
    private _color: string;
    private _playerID: number;
    
    public _isDead: boolean;
    
    constructor(game: GameScene, color: string, playerID: number)
    {
        this._game = game;
        this._snakeParts = [];
        this._lastUpdateTime = Date.now();
        this._updateTime = 250;             // .25 seconds
        
        this._color = color;
        this._playerID = playerID;
        
        this._isDead = false;
        
        this.init(3);
    }
    
    public getSnakeParts():SnakePart[] { return this._snakeParts; }
    
    public getPlayerID(): number { return this._playerID; }
    
    public getColor(): string { return this._color; }


    private init(count: number = 1):void
    {
        for (var i = 0; i < count; i += 1) {
            var xid       = (this._playerID == 1) ? -3 + Math.round(this._game.getGridWH().width / 2) + i : 3 + Math.round(this._game.getGridWH().width / 2) - i,
                // xid       = 3 - i,
                yid       = Math.round(this._game.getGridWH().height / 2),
                // yid       = 5,
                isHead    = (i > 0) ? false : true,
                direction = (this._playerID == 1) ? Direction.DIR_LEFT : Direction.DIR_RIGHT;

            var tail = new SnakePart(xid, yid, this._game.getGrid(), this._game.getGridSize(), direction, isHead, this._playerID);
            this._snakeParts.push(tail);
        }
    }
    
    // add new tail according to last snake part's direction
    public addTail():void
    {
        var last      = this._snakeParts.length - 1;
        var direction = this._snakeParts[last]._curDirection;

        var x = this._snakeParts[last].getGridPositionID().x,
            y = this._snakeParts[last].getGridPositionID().y;

        switch (direction)
        {
            case Direction.DIR_UP:
                y += 1;
                break;

            case Direction.DIR_RIGHT:
                x -= 1;
                break;

            case Direction.DIR_DOWN:
                y -= 1;
                break;

            case Direction.DIR_LEFT:
                x += 1;
                break;
        }

        var tail = new SnakePart(x, y, this._game.getGrid(), this._game.getGridSize(), direction, false, this._playerID);
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
                // update their direction flag, given from previous snake part
                if (i > 0) {
                    // save current direction
                    var dir = this._snakeParts[i]._curDirection;

                    // add previous direction to current tail
                    this._snakeParts[i]._curDirection = prevDir;

                    // add saved direction to variable, so we can give it to the next tail
                    prevDir = dir;
                }

                if (!this._snakeParts[i].updatePosition())
                    this._isDead = true;

                if (this._snakeParts[0]._isBeyondMap) this._game._isGameOver = true;
            }
        }

        if (diff > this._updateTime) this._lastUpdateTime = curTime;
    }
}