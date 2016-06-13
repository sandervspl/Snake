import __Object from "./Object";
import {Direction} from "./defines";
import GridNode from "./GridNode";

export default class SnakePart extends __Object
{
    private _isHead: boolean;
    
    public _curDirection: Direction;       // direction each snake individual part should go to (up, down, left or right)
    public _nextDirection: Direction;      // button presses are saved into this variable and compared to curdirection
    
    constructor(x: number, y: number, grid: GridNode[][], size: number, direction: Direction, isHead: boolean)
    {
        super(x, y, grid, size, "rect");
        
        this._isHead = isHead;
        this._curDirection = direction;
        this._nextDirection = this._curDirection;

        if (this._isHead) this.addEventHandlers();
        this.draw();
    }

    // add keyboard event handlers
    private addEventHandlers():void { window.addEventListener('keydown', (e)=> { this.keyboardInput(e) }); }

    // update direction flags with keyboard input
    private keyboardInput(event: KeyboardEvent):any
    {
        switch (event.keyCode)
        {
            case 38:
            case 87:
                if (this._curDirection != Direction.DIR_DOWN)
                    this._nextDirection = Direction.DIR_UP;
                break;

            case 39:
            case 68:
                if (this._curDirection != Direction.DIR_LEFT)
                    this._nextDirection = Direction.DIR_RIGHT;
                break;

            case 40:
            case 83:
                if (this._curDirection != Direction.DIR_UP)
                    this._nextDirection = Direction.DIR_DOWN;
                break;

            case 37:
            case 65:
                if (this._curDirection != Direction.DIR_RIGHT)
                    this._nextDirection = Direction.DIR_LEFT;
                break;
        }
    }

    public updatePosition():void
    {
        if (this._isHead) this._curDirection = this._nextDirection;

        var x = this.getGridPosition().x,
            y = this.getGridPosition().y;
        
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

        this.setPosition(x, y);
    }
}