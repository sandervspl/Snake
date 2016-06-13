import {ctx} from "./Defines";

export default class GridNode
{
    private _Position: { x: number, y: number };
    private _PositionID: { x: number, y: number };
    private _gridSize: number;
    
    constructor(gridSize: number, positionID: {x:number, y:number})
    {
        this._gridSize = gridSize;
        this._PositionID = positionID;
        
        this._Position = { 
            x: gridSize * this._PositionID.x, 
            y: gridSize * this._PositionID.y
        };
    }
    
    public getPosition():{x:number, y:number} { return this._Position; }
    
    public draw():void
    {
        ctx.beginPath();
        ctx.lineWidth = 3.0;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.0;
        ctx.strokeRect(
            this._Position.x,
            this._Position.y,
            this._gridSize,
            this._gridSize
        );
        ctx.closePath();
    }
}