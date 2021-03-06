import {ctx} from "./Defines";

export default class GridNode
{
    private _PositionID:    { x: number, y: number };      // position on grid
    private _Position:      { x: number, y: number };      // position on canvas
    private _size:          number;                        // grid node size
    
    public _isOccupied:     boolean;                       // free or occupied by candy or snake
    
    constructor(size: number, positionID: {x:number, y:number})
    {
        this._size = size;
        this._PositionID = positionID;
        
        this._Position = { 
            x: size * this._PositionID.x, 
            y: size * this._PositionID.y
        };
        
        this._isOccupied = false;
    }
    
    public getPosition():{x:number, y:number} { return this._Position; }
    
    public getPositionID() { return this._PositionID; }
    
    public draw():void
    {
        var fillColor = (this._isOccupied) ? 'lightgreen' : 'black';
        var lineWidth = (this._isOccupied) ? 3 : 1;
        
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = fillColor;
        ctx.strokeRect(
            this._Position.x,
            this._Position.y,
            this._size,
            this._size
        );
        ctx.closePath();
    }
}