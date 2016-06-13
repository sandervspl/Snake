import {ctx} from "./Defines";
import GridNode from "./GridNode";

export default class ___Object
{
    private _x: number;
    private _y: number;
    private _gridPosition: {x: number, y: number};
    private _grid: GridNode[][];
    private _size: number;
    private _shape: string;

    public _isBeyondMap: boolean;
    
    constructor(x: number, y: number, grid: GridNode[][], size: number, shape: string)
    {
        this._grid = grid;
        this._gridPosition = { x: x, y: y };

        this.setPosition(x, y);

        // this._x = this._grid[x][y].getPosition().x;
        // this._y = this._grid[x][y].getPosition().y;

        this._size = size;
        this._shape = shape;

        this._isBeyondMap = false;
    }
    
    public getPositionX():number { return this._x; }

    public getPositionY():number { return this._y; }

    public getGridPosition() { return this._gridPosition; }

    public getSize():number { return this._size; }

    // set position of unit
    public setPosition(x: number, y: number):void
    {
        if (this._grid[x] == null || this._grid[x][y] == null) {
            this._isBeyondMap = true;
            return;
        }

        this._grid[this._gridPosition.x][this._gridPosition.y]._isOccupied = false;

        this._gridPosition.x = x;
        this._gridPosition.y = y;

        this._x = this._grid[x][y].getPosition().x;
        this._y = this._grid[x][y].getPosition().y;
        
        this._grid[x][y]._isOccupied = true;
    }

    public draw():void 
    {
        if (this._shape == "rect") {
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(this._x, this._y, this._size, this._size);
            ctx.closePath();
        }
        
        if (this._shape == "circle") {
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(this._x + this._size, this._y + this._size, this._size, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
        }
    }
}