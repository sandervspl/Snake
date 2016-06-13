import {ctx} from "./Defines";

export default class GridNode
{
    private _Position: { x: number, y: number };
    private _PositionID: { x: number, y: number };
    private _gridSize: number;
    
    public _isOccupied: boolean;
    
    constructor(gridSize: number, positionID: {x:number, y:number})
    {
        this._gridSize = gridSize;
        this._PositionID = positionID;
        
        this._Position = { 
            x: gridSize * this._PositionID.x, 
            y: gridSize * this._PositionID.y
        };
        
        this._isOccupied = false;
    }
    
    public getPosition():{x:number, y:number} { return this._Position; }
    
    public getPositionID() { return this._PositionID; }
    
    public draw():void
    {
        var fillColor = (this._isOccupied) ? 'green' : 'black';
        var lineWidth = (this._isOccupied) ? 3 : 1;
        
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = fillColor;
        ctx.strokeRect(
            this._Position.x,
            this._Position.y,
            this._gridSize,
            this._gridSize
        );
        ctx.closePath();
    }
}