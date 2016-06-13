import {ctx} from "./Defines";
import GridNode from "./GridNode";

export default class ___Object
{
    private _x: number;
    private _y: number;
    private _gridPositionID: {x: number, y: number};
    private _grid: GridNode[][];
    private _size: number;
    private _shape: string;

    public _isBeyondMap: boolean;
    
    constructor(xid: number, yid: number, grid: GridNode[][], size: number, shape: string)
    {
        this._grid = grid;
        this._gridPositionID = { x: xid, y: yid };

        this._size = size;
        this._shape = shape;

        this._isBeyondMap = false;

        this.setPosition(xid, yid);
        this.draw();
    }
    
    public getPositionX():number { return this._x; }

    public getPositionY():number { return this._y; }

    public getGridPositionID() { return this._gridPositionID; }

    public getSize():number { return this._size; }

    public setPosition(xid: number, yid: number):void
    {
        if (this._grid[xid] == null || this._grid[xid][yid] == null) {
            this._isBeyondMap = true;
            return;
        }

        this._grid[this._gridPositionID.x][this._gridPositionID.y]._isOccupied = false;

        this._gridPositionID.x = xid;
        this._gridPositionID.y = yid;

        this._x = this._grid[xid][yid].getPosition().x;
        this._y = this._grid[xid][yid].getPosition().y;
        
        this._grid[xid][yid]._isOccupied = true;
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
            ctx.fillStyle = "orange";
            ctx.arc(this._x + this._size, this._y + this._size, this._size, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
        }
    }
}