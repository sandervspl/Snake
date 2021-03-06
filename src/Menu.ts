import {ctx, canvas} from "./Defines";
import Game from "./Game";

export default class Menu
{
    private _loop:      number;     // loop handle
    private _buttons:   any[];      // buttons array
    private _game:      Game;       // game controller

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
        canvas.addEventListener("mousemove", (e)=> { this.moveCollision(e) });
        canvas.addEventListener("mousedown", (e)=> { this.click(e) });
    }

    // set up button data
    private addButtons():void
    {
        var x1, y1, x2, y2;
        var fontSize = 40;

        var text = {
            title: "SNAKE",
            sp: "Single-player",
            mp: "Multi-player",
            opts_easy: "Slow",
            opts_medium: "Faster",
            opts_hard: "Fastest"
        };

        ctx.font = fontSize + "px Verdana";

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
    
    // render menu on canvas
    private drawMenu():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = "80px Verdana";
        ctx.fillStyle = "black";
        ctx.fillText("SNAKE", canvas.width/2 - ctx.measureText("SNAKE").width/2, canvas.height/2 - 80);

        for (var i = 0; i < this._buttons.length; i += 1) {
            var btn = this._buttons[i];

            if (i == this._game._difficulty + 1) btn.color = "white";

            ctx.font = btn.size + "px Verdana";
            ctx.fillStyle = btn.color;
            ctx.fillText(btn.text, btn.x1, btn.y1);
        }
    }

    // look for collision with clicked position and buttons
    private click(event: MouseEvent):void
    {
        if (this._game._hasGameStarted) return;

        var btn = this.moveCollision(event);
        if (btn != -1) {
            // sp button
            if (btn == 0) {
                this._game.startGame(false);
            }

            // mp button
            else if (btn == 1) {
                this._game.startGame(true);
            }

            // difficulty button
            else {
                this._game._difficulty = btn - 1;
                this._buttons[btn].color = "white";
            }
        }
    }

    // mouse move collision
    private moveCollision(event: MouseEvent):number
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

    // hitbox rendering (debug)
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
                btn.y1 - btn.y2     // text is drawn bottom-top instead of top-bottom
            );
            ctx.closePath();
        }
    }
    
    // cancel rendering
    public cancelAnimFrame():void { cancelAnimationFrame(this._loop); }

    private update():void
    {
        this.drawMenu();
        // this.drawHitbox();

        this._loop = requestAnimationFrame( () => this.update() );
    }
}

// collision check
function isCollision(ax, ay, bx1, bx2, by1, by2):boolean
{
    return  ax < bx2 &&
            ax > bx1 &&
            ay < by2 &&
            ay > by1;
}