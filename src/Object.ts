import {ctx} from "./defines";
export default class ___Object 
{
    private _x: number;
    private _y: number;
    private _sprite: HTMLImageElement;
    
    constructor(x: number, y: number, sprite: string)
    {
        this._x = x;
        this._y = y;
        this.loadSprite(sprite);
    }
    
    public getPositionX():number { return this._x; }

    public getPositionY():number { return this._y; }
    
    public getSprite():HTMLImageElement { return this._sprite; }

    private loadSprite(src):void {
        this._sprite = new Image();
        this._sprite.src = src;
    }

    // set position of unit
    public setPosition(x: number, y: number):void
    {
        this._x = Math.floor(x);
        this._y = Math.floor(y);
    }

    private draw():void { ctx.drawImage(this._sprite, this._x, this._y); }

    public update():void { this.draw(); }
}