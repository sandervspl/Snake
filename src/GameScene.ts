import {ctx, canvas} from "./defines";
import Object from "./Object";
import SnakeMgr from "./SnakeMgr";
import GridNode from "./GridNode";
import Game from "./Game";
import Grid from "./Grid";

export default class GameScene
{
    private _game:              Game;            // game controller
    private _grid:              Grid;            // grid
    private _candy:             Object;          // randomly added candy on field
    private _snakeMgr:          SnakeMgr[];      // manages all snake parts

    private _loop:              number;          // loop handle

    private _score:             number[];        // current score (single-player)
    private _isMultiplayer:     boolean;         // determines if we need 1 or 2 snakes

    public _isGameOver:         boolean;         // determines if we can keep playing

    constructor(game: Game, isMultiplayer: boolean)
    {
        this._game = game;
        this._grid = new Grid();
        
        this._isMultiplayer = isMultiplayer;

        this.setupScreen();

        if (this._grid.init()) {
            this.startGame();
        } else {
            errorMsg("GameScene", "constructor", "Unable to create grid for this canvas size and grid size combination.");
        }
    }
    
    public getGame():Game { return this._game; }
    public getGrid():Grid { return this._grid; }

    public cancelAnimFrame():void { cancelAnimationFrame(this._loop); }

    
    // set up score elements for single-player
    private setupScreen():void
    {
        var offsetY = 25;

        // player 1 score
        var el    = "score",
            score = document.getElementById(el),
            error = "Could not find element! Given: ";

        if (score) {
            score.style.color = "White";
            score.style.left = window.innerWidth / 2 + "px";
            score.style.top = window.innerHeight / 2 - canvas.height / 2 - offsetY + "px";

            // position is a bit offset in multi-player
            if (this._isMultiplayer) score.style.left = window.innerWidth / 2 + 50 + "px";

            score.style.position = "absolute";
        } else {
            errorMsg("GameScene", "setupScreen", error + el);
        }

        if (this._isMultiplayer) {
            // player 2 score
            el = "score2";
            var score2 = document.getElementById(el);

            if (score2) {
                score2.style.left = window.innerWidth / 2 - 50 + "px";
                score2.style.top = window.innerHeight / 2 - canvas.height / 2 - offsetY + "px";
                score2.style.position = "absolute";
            } else {
                errorMsg("GameScene", "setupScreen", error + el);
            }
        } else {
            // high score
            el = "highscore";
            var highscore = document.getElementById(el);

            if (highscore) {
                highscore.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
                highscore.style.top = window.innerHeight / 2 - canvas.height / 2 - offsetY + "px";
                highscore.style.position = "absolute";
            } else {
                errorMsg("GameScene", "setupScreen", error + el);
            }
        }
    }

    // give score elements some values
    public setupScore(clear: boolean = false):void
    {
        var el    = "score",
            score = document.getElementById(el),
            error = "Could not find element! Given: ";

        // player 1 score
        if (score) {
            score.innerHTML = (clear) ? "" : String(this._score[0]);
        } else {
            errorMsg("GameScene", "setupScore", error + el);
        }

        if (this._isMultiplayer) {
            // player 2 score
            el = "score2";
            var score2 = document.getElementById(el);

            if (score2) {
                score2.innerHTML = (clear) ? "" : String(this._score[1]);
            } else {
                errorMsg("GameScene", "setupScore", error + el);
            }
        } else {
            // high score
            el = "highscore";
            var highscore = document.getElementById(el);

            if (highscore) {
                highscore.innerHTML = (clear) ? "" : "Highscore: " + (localStorage.getItem("snake_highscore") || 0);
            } else {
                errorMsg("GameScene", "setupScore", error + el);
            }
        }
    }

    // update score depending on game difficulty
    private updateScore(playerID: number):void
    {
        if (!this._isMultiplayer) {
            this._score[0] += 10 * this._game._difficulty;
        } else {
            this._score[playerID] += 1;
        }

        var el = (playerID == 0) ? "score" : "score2",
            score = document.getElementById(el),
            error = "Could not find element! Given: ";

        if (score) {
            score.innerHTML = String(this._score[playerID]);
        } else {
            errorMsg("GameScene", "updateScore", error + el);
        }
    }

    // (re)start game with starting values
    public startGame():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this._grid.setNodeOccupation(false);

        this._isGameOver = false;

        this._score = [];
        this._score[0] = this._score[1] = 0;
        this.setupScore();

        this._snakeMgr = [];

        this.init();
        this.spawnCandy();
        this.update();
    }

    // initialize snake manager(s)
    private init():void
    {
        var players = (this._isMultiplayer) ? 2 : 1;
        for (var i = 0; i < players; i += 1) {
            var snakeMgr = new SnakeMgr(this, (i) ? "Black" : "White", i);
            this._snakeMgr.push(snakeMgr);
        }
    }

    // spawn new candy randomly on field
    private spawnCandy():void
    {
        this._candy = null;
        
        // look for nodes that are free
        var freeNodes: GridNode[][] = [];
        for (var x = 0, i = 0; x < this._grid.getGridSize().width; x += 1) {
            freeNodes[i] = [];

            for (var y = 0, j = 0; y < this._grid.getGridSize().height; y += 1) {
                var node = this._grid.getGridNodes()[x][y];
                
                if (!node._isOccupied) {
                    freeNodes[i][j] = node;
                    j += 1;
                }
            }

            i += 1;
        }

        // get random node on x and y axis
        var x = getRandomInt(0, freeNodes.length - 1),
            y = getRandomInt(0, freeNodes[x].length - 1);

        // hack fix for a rare undefined bug
        if (freeNodes[x][y] == null) {
            this.spawnCandy();
            return;
        }

        if (!freeNodes[x][y]._isOccupied) {
            var xid = freeNodes[x][y].getPositionID().x,
                yid = freeNodes[x][y].getPositionID().y;

            this._candy = new Object(xid, yid, this._grid, "circle", "orange");
        } else {
            this.spawnCandy();
        }
    }
    
    // game over screen
    private gameOver():void
    {
        // game can be won by having the biggest snake
        // or surviving until the other snake hits the wall or you
        // it's a draw when both snakes hit the wall or a snake on the same update and are of equal length
        if (this._isMultiplayer) {
            var winnerText = "";
            var playersCount = this._snakeMgr.length,
                count = 0,
                title = "";

            for (var i = 0; i < playersCount; i += 1) {
                var index = (i > 0) ? 0 : 1;
                if (this._snakeMgr[i]._isDead) {
                    title = this._snakeMgr[index].getColor();
                    count += 1;
                }
            }

            if (playersCount != count) {
                winnerText = title + " wins!";
            } else {
                var winner    = -1,
                    snakeSize = 0,
                    isDraw    = false;

                for (var i = 0; i < playersCount; i += 1) {
                    var size = this._snakeMgr[i].getSnakeParts().length;
                    if (size > snakeSize) {
                        snakeSize = size;
                        winner = i;
                        continue;
                    }

                    isDraw = (size == snakeSize);
                }

                if (!isDraw) {
                    title = this._snakeMgr[winner].getColor();
                    winnerText = title + " wins!";
                } else {
                    winnerText = "Draw!";
                }
            }
        }

        // game over message
        var msg  = (this._isMultiplayer) ? winnerText : "Game Over!",
            msg2 = "Press R to play again",
            msg3 = "Press ESCAPE to go to menu";

        // background
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.rect(0, canvas.height/3, canvas.width, canvas.height * 0.4);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.restore();

        // game over text
        ctx.font = "60px Verdana";
        ctx.fillStyle = "black";
        ctx.fillText(msg, canvas.width/2 - ctx.measureText(msg).width/2, canvas.height/2);

        // Press R...
        ctx.font = "30px Verdana";
        ctx.fillText(msg2, canvas.width/2 - ctx.measureText(msg2).width/2, canvas.height/2 + 40);

        // Press ESC...
        ctx.fillText(msg3, canvas.width/2 - ctx.measureText(msg3).width/2, canvas.height/2 + 80);

        // high score tracking
        var item = "snake_highscore",
            hs   = localStorage.getItem(item);

        if (hs) {
            if (!this._isMultiplayer && this._score[0] > hs)
                localStorage.setItem(item, String(this._score[0]));
        } else {
            errorMsg("GameScene", "gameOver", "Could not find localStorage item. Given: " + item);
        }

        cancelAnimationFrame(this._loop);
    }

    // check for collision with candy, another snake and ourselves
    private collisionCheck():void
    {
        for (var i = 0; i < this._snakeMgr.length; i += 1) {
            var snakeMgr   = this._snakeMgr[i],
                snakeParts = snakeMgr.getSnakeParts();

            var headXid  = snakeParts[0].getGridPositionID().x,
                headYid  = snakeParts[0].getGridPositionID().y,
                playerID = snakeMgr.getPlayerID();

            // look through all bodies, even our own
            for (var j = 0; j < this._snakeMgr.length; j += 1) {
                for (var k = 0; k < this._snakeMgr[j].getSnakeParts().length; k += 1) {
                    // skip our own head part
                    if (k == 0 && playerID == this._snakeMgr[j].getPlayerID())
                        continue;

                    // look through body parts
                    var part = this._snakeMgr[j].getSnakeParts()[k];
                    var tailXid = part.getGridPositionID().x,
                        tailYid = part.getGridPositionID().y;

                    // check if we hit bodypart
                    if (headXid == tailXid && headYid == tailYid) {
                        snakeMgr._isDead = true;
                        this._isGameOver = true;
                    }
                }
            }

            // candy
            var candy = this._candy;
            if (candy != null) {
                var candyXid = candy.getGridPositionID().x,
                    candyYid = candy.getGridPositionID().y;

                if (headXid == candyXid && headYid == candyYid) {
                    this.updateScore(i);

                    this._snakeMgr[i].addPart();
                    this.spawnCandy();
                }
            }
        }
    }

    // update sprites
    public update():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.collisionCheck();

        for (var i = 0; i < this._snakeMgr.length; i += 1) {
            this._snakeMgr[i].updateSnake();
        }

        if (this._candy != null) this._candy.draw();
        
        this._grid.update();

        if (this._isGameOver) {
            this.gameOver();
            return;
        }

        this._loop = requestAnimationFrame( () => this.update() );
    }
}


// random number between x and y
function getRandomInt(min:number, max:number):number
{
    return Math.floor(Math.random() * (1 + max - min)) + min;
}

// informative error messages
function errorMsg(className: string, methodName: string, ...text: string[]):void
{
    if (!this._game._debug) return;

    var msg = "ERROR! " + className + "::" + methodName + " | ";
    for (let t of text) {
        msg += t + " ";
    }
    console.log(msg);
}