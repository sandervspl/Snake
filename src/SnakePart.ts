import __Object from "./Object";
import {Direction} from "./defines";

export default class SnakePart extends __Object
{
    public _direction: Direction;       // direction each snake individual part should go to (up, down, left or right)
    
    constructor(x: number, y: number, direction: Direction)
    {
        var sprite = "images/tail.png";
        super(x, y, sprite);
        
        this._direction = direction;
        super.update();
    }
    
    public updatePosition():void
    {
        var x = this.getPositionX(),
            y = this.getPositionY();
        
        switch (this._direction)
        {
            case Direction.DIR_UP:
                y -= this.getSprite().height;
                break;

            case Direction.DIR_RIGHT:
                x += this.getSprite().width;
                break;
            
            case Direction.DIR_DOWN:
                y += this.getSprite().height;
                break;

            case Direction.DIR_LEFT:
                x -= this.getSprite().width;
                break;
        }
        
        this.setPosition(x, y);
    }
    
    public update():void
    {
        this.updatePosition();
        super.update();
    }
}