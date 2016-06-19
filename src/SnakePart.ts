import __Object from "./Object";
import {Direction} from "./defines";
import GridNode from "./GridNode";

export default class SnakePart extends __Object
{
    private _isHead:        boolean;        // determines if this is a head or tail piece

    // keyboard inputs
    private _keys:          {up:number, right:number, down:number, left:number}; 
        
    private _nextDirection: Direction;      // next direction for head piece
    public _curDirection:   Direction;      // current direction snake piece is heading towards
    
    constructor(x: number, y: number, grid: GridNode[][], size: number, direction: Direction, 
                isHead: boolean, playerID: number)
    {
        var color = (playerID) ? "black" : "white";
        super(x, y, grid, size, "rect", color);
        
        this._isHead = isHead;
        this._curDirection = direction;
        this._nextDirection = this._curDirection;

        if (this._isHead) {
            this.initKeys(playerID);
            this.addEventHandlers();
        }
        
        this.draw();
    }
    
    // set up keys depending on player
    private initKeys(playerID: number):void
    {
        if (playerID == 0) {
            // Arrow Keys
            this._keys = {
                up:    38,
                right: 39,
                down:  40,
                left:  37
            }
        } else {
            // WASD
            this._keys = {
                up:    87,
                right: 68,
                down:  83,
                left:  65
            }
        }
    }

    // add keyboard event handlers (only to head piece)
    private addEventHandlers():void
    {
        window.addEventListener('keydown', (e)=> { this.keyboardInput(e) });
    }

    // update direction flags with keyboard input
    private keyboardInput(event: KeyboardEvent):any
    {
        switch (event.keyCode) {
            case this._keys.up:
                event.preventDefault();
                if (this._curDirection != Direction.DIR_DOWN)
                    this._nextDirection = Direction.DIR_UP;
                break;

            case this._keys.right:
                event.preventDefault();
                if (this._curDirection != Direction.DIR_LEFT)
                    this._nextDirection = Direction.DIR_RIGHT;
                break;

            case this._keys.down:
                event.preventDefault();
                if (this._curDirection != Direction.DIR_UP)
                    this._nextDirection = Direction.DIR_DOWN;
                break;

            case this._keys.left:
                event.preventDefault();
                if (this._curDirection != Direction.DIR_RIGHT)
                    this._nextDirection = Direction.DIR_LEFT;
                break;
        }
    }

    // update position to next node on grid
    public updatePosition():boolean
    {
        if (this._isHead) this._curDirection = this._nextDirection;

        var x = this.getGridPositionID().x,
            y = this.getGridPositionID().y;
        
        switch (this._curDirection)
        {
            case Direction.DIR_UP:
                y -= 1;
                break;

            case Direction.DIR_RIGHT:
                x += 1;
                break;
            
            case Direction.DIR_DOWN:
                y += 1;
                break;

            case Direction.DIR_LEFT:
                x -= 1;
                break;
        }

        return this.setPosition(x, y);
    }
}