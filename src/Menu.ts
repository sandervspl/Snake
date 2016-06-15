import {ctx, canvas} from "./Defines";
import Game from "./Game";

export default class Menu
{
    private _loop: any;
    private _text: any;
    private _buttons: any;
    private _game: Game;

    constructor(game: Game)
    {
        this._game = game;

        this._text = {
            title: "SNAKE",
            sp: "Single-player",
            mp: "Multi-player"
        };

        ctx.font = "40px Verdana";
        this._buttons = {
            sp: {
                size: 40,
                color: "black",
                x1: canvas.width/2 - ctx.measureText(this._text.sp).width/2,
                y1: canvas.height/2 + 40,
                x2: canvas.width/2 - ctx.measureText(this._text.sp).width/2 + ctx.measureText(this._text.sp).width,
                y2: canvas.height/2 + 40 + 40
            },

            mp: {
                size: 40,
                color: "black",
                x1: canvas.width/2 - ctx.measureText(this._text.mp).width/2,
                y1: canvas.height/2 + 100,
                x2: canvas.width/2 - ctx.measureText(this._text.mp).width/2 + ctx.measureText(this._text.mp).width,
                y2: canvas.height/2 + 100 + 40
            }
        };

        this.addEventHandlers();
        this.update();
    }

    private addEventHandlers():void
    {
        canvas.addEventListener("mousemove", (e)=> { this.collision(e) });
        canvas.addEventListener("mousedown", (e)=> { this.click(e) });
    }
    
    private drawMenu():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = "80px Verdana";
        ctx.fillStyle = "black";
        ctx.fillText(this._text.title, canvas.width/2 - ctx.measureText(this._text.title).width/2, canvas.height/2 - 80);

        ctx.font = this._buttons.sp.size + "px Verdana";
        ctx.fillStyle = this._buttons.sp.color;
        ctx.fillText(this._text.sp, this._buttons.sp.x1, this._buttons.sp.y1);

        ctx.font = this._buttons.mp.size + "px Verdana";
        ctx.fillStyle = this._buttons.mp.color;
        ctx.fillText(this._text.mp, this._buttons.mp.x1, this._buttons.mp.y1);
    }

    private click(event: MouseEvent):void
    {
        if (this._game._hasGameStarted) return;

        var btn = this.collision(event);

        if (btn) {
            if (btn == 1) {
                cancelAnimationFrame(this._loop);
                this._game.startSPGame();
            } else {
                cancelAnimationFrame(this._loop);
                this._game.startMPGame();
            }
        }
    }

    private collision(event: MouseEvent):number
    {
        var rect = canvas.getBoundingClientRect();

        var mx = event.clientX - rect.left,
            my = event.clientY - rect.top;

        var bx1 = this._buttons.sp.x1,
            by1 = this._buttons.sp.y1 - this._buttons.sp.size,
            bx2 = this._buttons.sp.x2,
            by2 = this._buttons.sp.y2 - this._buttons.sp.size;

        if (isCollision(mx, my, bx1, bx2, by1, by2)) {
            this._buttons.sp.color = "white";
            return 1;
        } else {
            this._buttons.sp.color = "black";
        }

        bx1 = this._buttons.mp.x1;
        by1 = this._buttons.mp.y1 - this._buttons.mp.size;
        bx2 = this._buttons.mp.x2;
        by2 = this._buttons.mp.y2 - this._buttons.mp.size;

        if (isCollision(mx, my, bx1, bx2, by1, by2)) {
            this._buttons.mp.color = "white";
            return 2;
        } else {
            this._buttons.mp.color = "black";
        }

        return 0;
    }

    private drawHitbox():void
    {
        ctx.lineWidth = 1.0;

        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.strokeRect(
            this._buttons.sp.x1,
            this._buttons.sp.y1,
            this._buttons.sp.x2 - this._buttons.sp.x1,
            this._buttons.sp.y1 - this._buttons.sp.y2
        );
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = "orange";
        ctx.strokeRect(
            this._buttons.mp.x1,
            this._buttons.mp.y1,
            this._buttons.mp.x2 - this._buttons.mp.x1,
            this._buttons.mp.y1 - this._buttons.mp.y2
        );
        ctx.closePath();
    }

    private update():void
    {
        this._loop = requestAnimationFrame( () => this.update() );

        this.drawMenu();
        // this.drawHitbox();
    }
}


function isCollision(ax, ay, bx1, bx2, by1, by2):boolean
{
    return  ax < bx2 &&
            ax > bx1 &&
            ay < by2 &&
            ay > by1;
}