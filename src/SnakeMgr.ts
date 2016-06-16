import SnakePart from "./SnakePart";
import {Direction} from "./Defines";
import GameScene from "./GameScene";

export default class SnakeMgr
{
    private _snakeParts: SnakePart[];       // snake parts array
    private _lastUpdateTime: number;        // last time we updated snake position
    private _updateTime: number;            // time difference between updates
    private _gameScene: GameScene;          // gameScene controller
    private _color: string;                 // rendering color
    private _playerID: number;              // player 1 or 2
    
    public _isDead: boolean;                // dead or not
    
    constructor(game: GameScene, color: string, playerID: number)
    {
        this._gameScene = game;
        this._snakeParts = [];
        this._lastUpdateTime = Date.now();

        var diff = this._gameScene.getGame()._difficulty;
        this._updateTime = 250 / diff;
        
        this._color = color;
        this._playerID = playerID;
        
        this._isDead = false;
        
        this.init(3);
    }
    
    public getSnakeParts():SnakePart[] { return this._snakeParts; }
    
    public getPlayerID(): number { return this._playerID; }
    
    public getColor(): string { return this._color; }


    // initialize position for snake
    private init(count: number = 1):void
    {
        for (var i = 0; i < count; i += 1) {
            var x, y;

            if (this._playerID == 0) {
                x = 3 + Math.round(this._gameScene.getGridWH().width / 2) - i || 0;
                y = Math.round(this._gameScene.getGridWH().height / 2) || 0;
            } else {
                x = -3 + Math.round(this._gameScene.getGridWH().width / 2) + i || 0;
                y = Math.round(this._gameScene.getGridWH().height / 2) || 0;
            }

            var xid       = x,
                yid       = y,
                isHead    = (i > 0) ? false : true,
                direction = (this._playerID == 1) ? Direction.DIR_LEFT : Direction.DIR_RIGHT;

            var tail = new SnakePart(xid, yid, this._gameScene.getGrid(), this._gameScene.getGridSize(), direction, isHead, this._playerID);
            this._snakeParts.push(tail);
        }
    }
    
    // add new part according to last snake part's direction
    public addPart():void
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

        var tail = new SnakePart(x, y, this._gameScene.getGrid(), this._gameScene.getGridSize(), direction, false, this._playerID);
        this._snakeParts.push(tail);
    }

    // update snake direction and/or position
    public updateSnake():void
    {
        var curTime = Date.now(),
            diff    = curTime - this._lastUpdateTime,
            prevDir = this._snakeParts[0]._curDirection;

        // draw update snake position according to each part's direction
        for (var i = 0; i < this._snakeParts.length; i += 1)
        {
            this._snakeParts[i].draw();

            if (diff > this._updateTime) {
                // do not update snake head -- only the player is allowed to do this
                if (i > 0) {
                    // save current part's direction
                    var dir = this._snakeParts[i]._curDirection;

                    // add previous part's direction to current part
                    this._snakeParts[i]._curDirection = prevDir;

                    // add saved direction to variable, so we can give it to the next part
                    prevDir = dir;
                }

                // if next position is illegal, snake is dead
                if (!this._snakeParts[i].updatePosition()) this._isDead = true;
                if (this._snakeParts[0]._isBeyondMap) this._isDead = true;
            }
        }

        if (diff > this._updateTime) this._lastUpdateTime = curTime;
    }
}