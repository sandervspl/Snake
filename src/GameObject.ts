import {ctx} from "./Defines";
import GridNode from "./GridNode";
import Grid from "./Grid";

export default class ___Object
{
    private _position:          {x: number, y: number};    // position on canvas
    private _gridPositionID:    {x: number, y: number};    // position on grid
    private _grid:              GridNode[][];              // grid nodes array
    private _size:              number;                    // size/radius of object
    private _shape:             string;                    // rectangle or circle
    private _color:             string;                    // rendering color
    private _tick:              number;                    // sin ticker

    public _isBeyondMap:        boolean;                   // determines if object is on a legal grid position

    constructor(xid: number, yid: number, grid: Grid, shape: string, color: string)
    {
        this._grid = grid.getGridNodes();

        this._gridPositionID = { x: xid, y: yid };
        this._position = {
            x: this._grid[xid][yid].getPosition().x || 0,
            y: this._grid[xid][yid].getPosition().y || 0
        };

        this._shape = shape || "rect";
        this._color = color || "Purple";
        this._size = (this._shape === "rect") ? grid.getNodeSize() : grid.getNodeSize()/2 || 10;
        this._tick = 0;
        this._isBeyondMap = false;

        this.setPosition(xid, yid);
        this.draw();
    }

    public getPosition():{x: number, y: number} { return this._position; }

    public getGridPositionID():{x: number, y: number} { return this._gridPositionID; }

    public getSize():number { return this._size; }

    // set position on canvas according to grid node information
    public setPosition(xid: number, yid: number):boolean
    {
        if (this._grid[xid] == null || this._grid[xid][yid] == null) {
            this._isBeyondMap = true;
            return false;
        }

        this._grid[this._gridPositionID.x][this._gridPositionID.y]._isOccupied = false;

        this._gridPositionID.x = xid;
        this._gridPositionID.y = yid;

        this._position.x = this._grid[xid][yid].getPosition().x;
        this._position.y = this._grid[xid][yid].getPosition().y;

        this._grid[xid][yid]._isOccupied = true;

        return true;
    }

    // render object on canvas
    public draw():void
    {
        if (this._shape == "rect") {
            ctx.beginPath();
            ctx.fillStyle = this._color;
            ctx.fillRect(
                this._position.x,
                this._position.y,
                this._size * 0.98,
                this._size * 0.98
            );
            ctx.closePath();
        }

        if (this._shape == "circle") {
            var baseRadius = { min: this._size * 0.95, max: this._size };
            var osc = 0.5 + Math.sin(this._tick / 13);
            var radius = baseRadius.min + ((baseRadius.max - baseRadius.min) * osc);
            this._tick += 1;

            ctx.beginPath();
            ctx.fillStyle = this._color;
            ctx.arc(
                this._position.x + this._size,
                this._position.y + this._size,
                radius, 0,
                Math.PI * 2,
                false
            );
            ctx.fill();
            ctx.closePath();
        }
    }
}