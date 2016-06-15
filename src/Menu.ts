import {ctx, canvas} from "./Defines";
import Game from "./Game";

export default class Menu
{
    private _loop: any;
    private _buttons: any[];
    private _game: Game;

    constructor(game: Game)
    {
        this._game = game;

        this._buttons = [];

        this.addButtons();
        this.addEventHandlers();
        this.update();
    }

    private addEventHandlers():void
    {
        canvas.addEventListener("mousemove", (e)=> { this.collision(e) });
        canvas.addEventListener("mousedown", (e)=> { this.click(e) });
    }

    private addButtons():void
    {
        var x1, y1, x2, y2;
        var fontSize = 40;

        ctx.font = fontSize + "px Verdana";

        var text = {
            title: "SNAKE",
            sp: "Single-player",
            mp: "Multi-player",
            opts_easy: "Slow",
            opts_medium: "Faster",
            opts_hard: "Fastest"
        };

        x1 = canvas.width/2 - ctx.measureText(text.sp).width/2;
        y1 = canvas.height/2 + fontSize;
        x2 = x1 + ctx.measureText(text.sp).width;
        y2 = y1 + fontSize;
        this._buttons[0] = {
            size: 40,
            color: "black",
            text: text.sp,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        };

        x1 = canvas.width/2 - ctx.measureText(text.mp).width/2;
        y1 = canvas.height/2 + fontSize * 2.25;
        x2 = x1 + ctx.measureText(text.mp).width;
        y2 = y1 + fontSize;
        this._buttons[1] = {
            size: 40,
            color: "black",
            text: "Multi-player",
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        };

        x1 = canvas.width/2 - ctx.measureText(text.opts_easy).width/2 - ctx.measureText(text.opts_medium).width * 1.5;
        y1 = canvas.height/2 + 200;
        x2 = x1 + ctx.measureText(text.opts_easy).width;
        y2 = y1 + fontSize;
        this._buttons[2] = {
            size: 40,
            color: "black",
            text: "Slow",
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        };

        x1 = canvas.width/2 - ctx.measureText(text.opts_medium).width/2;
        y1 = canvas.height/2 + 200;
        x2 = x1 + ctx.measureText(text.opts_medium).width;
        y2 = y1 + fontSize;
        this._buttons[3] = {
            size: 40,
            color: "black",
            text: "Faster",
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        };

        x1 = canvas.width/2 - ctx.measureText(text.opts_hard).width/2 + ctx.measureText(text.opts_medium).width * 1.5;
        y1 = canvas.height/2 + 200;
        x2 = x1 + ctx.measureText(text.opts_hard).width;
        y2 = y1 + fontSize;
        this._buttons[4] = {
            size: 40,
            color: "black",
            text: "Fastest",
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        };
    }
    
    private drawMenu():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = "80px Verdana";
        ctx.fillStyle = "black";
        ctx.fillText("SNAKE", canvas.width/2 - ctx.measureText("SNAKE").width/2, canvas.height/2 - 80);

        for (var i = 0; i < this._buttons.length; i += 1) {
            var btn = this._buttons[i];

            if (i == this._game._difficulty) {
                btn.color = "white";
            }

            ctx.font = btn.size + "px Verdana";
            ctx.fillStyle = btn.color;
            ctx.fillText(btn.text, btn.x1, btn.y1);
        }
    }

    private click(event: MouseEvent):void
    {
        if (this._game._hasGameStarted) return;

        var btn = this.collision(event);
        console.log(btn);

        if (btn != -1) {
            if (btn == 0) {
                cancelAnimationFrame(this._loop);
                this._game.startSPGame();
            }

            else if (btn == 1) {
                cancelAnimationFrame(this._loop);
                this._game.startMPGame();
            }

            else {
                this._game._difficulty = btn;
                this._buttons[btn].color = "white";
            }
        }
    }

    private collision(event: MouseEvent):number
    {
        var rect = canvas.getBoundingClientRect(),
            mx   = event.clientX - rect.left,
            my   = event.clientY - rect.top;

        var result = -1;

        for (var i = 0; i < this._buttons.length; i += 1) {
            var btn = this._buttons[i];

            var bx1 = btn.x1,
                by1 = btn.y1 - btn.size,
                bx2 = btn.x2,
                by2 = btn.y2 - btn.size;

            if (isCollision(mx, my, bx1, bx2, by1, by2)) {
                btn.color = "white";
                return i;
            } else {
                btn.color = "black";
            }
        }

        return result;
    }

    private drawHitbox():void
    {
        ctx.lineWidth = 1.0;

        for (var i = 0; i < this._buttons.length; i += 1) {
            var btn = this._buttons[i];

            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.strokeRect(
                btn.x1,
                btn.y1,
                btn.x2 - btn.x1,
                btn.y1 - btn.y2
            );
            ctx.closePath();
        }
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