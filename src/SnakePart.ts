import __Object from "./Object";
import {Direction} from "./defines";
import GridNode from "./GridNode";

export default class SnakePart extends __Object
{
    private _isHead: boolean;
    
    public _curDirection: Direction;   // direction each snake individual part should go to (up, down, left or right)
    public _nextDirection: Direction;  // button presses are saved into this variable and compared to curdirection
    
    constructor(x: number, y: number, grid: GridNode[][], size: number, direction: Direction, isHead: boolean, playerID: number)
    {
        var color = (playerID) ? "black" : "white";
        super(x, y, grid, size, "rect", color);
        
        this._isHead = isHead;
        this._curDirection = direction;
        this._nextDirection = this._curDirection;

        if (this._isHead) this.addEventHandlers(playerID);
        this.draw();
    }

    // add keyboard event handlers
    private addEventHandlers(player: number):void
    {
        window.addEventListener('keydown', (e)=> { this.keyboardInput(e, player) });
    }

    // update direction flags with keyboard input
    private keyboardInput(event: KeyboardEvent, player: number):any
    {
        if (player == 1) {
            switch (event.keyCode) {
                case 87:
                    event.preventDefault();
                    if (this._curDirection != Direction.DIR_DOWN)
                        this._nextDirection = Direction.DIR_UP;
                    break;

                case 68:
                    event.preventDefault();
                    if (this._curDirection != Direction.DIR_LEFT)
                        this._nextDirection = Direction.DIR_RIGHT;
                    break;

                case 83:
                    event.preventDefault();
                    if (this._curDirection != Direction.DIR_UP)
                        this._nextDirection = Direction.DIR_DOWN;
                    break;

                case 65:
                    event.preventDefault();
                    if (this._curDirection != Direction.DIR_RIGHT)
                        this._nextDirection = Direction.DIR_LEFT;
                    break;
            }
        } else {
            switch (event.keyCode) {
                case 38:
                    event.preventDefault();
                    if (this._curDirection != Direction.DIR_DOWN)
                        this._nextDirection = Direction.DIR_UP;
                    break;

                case 39:
                    event.preventDefault();
                    if (this._curDirection != Direction.DIR_LEFT)
                        this._nextDirection = Direction.DIR_RIGHT;
                    break;

                case 40:
                    event.preventDefault();
                    if (this._curDirection != Direction.DIR_UP)
                        this._nextDirection = Direction.DIR_DOWN;
                    break;

                case 37:
                    event.preventDefault();
                    if (this._curDirection != Direction.DIR_RIGHT)
                        this._nextDirection = Direction.DIR_LEFT;
                    break;
            }
        }
    }

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