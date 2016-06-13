import {ctx} from "./Defines";

export default class ___Object
{
    private _x: number;
    private _y: number;
    private _size: number;
    private _shape: string;
    
    constructor(x: number, y: number, size: number, shape: string)
    {
        this._x = x;
        this._y = y;
        this._size = size;
        this._shape = shape;
    }
    
    public getPositionX():number { return this._x; }

    public getPositionY():number { return this._y; }

    public getSize():number { return this._size; }

    // set position of unit
    public setPosition(x: number, y: number):void
    {
        this._x = Math.floor(x);
        this._y = Math.floor(y);
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
            ctx.arc(this._x, this._y, this._size, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
        }
    }
}