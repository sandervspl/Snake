import {canvas, ctx} from "./Defines";
import GameScene from "./GameScene";
import Menu from "./Menu";

export default class Game
{
    private _gameScene: GameScene;
    private _menu: Menu;
    
    public _difficulty: number;

    public _hasGameStarted: boolean;
    public _debug: boolean;

    constructor()
    {
        this._hasGameStarted = false;
        this._gameScene = null;
        this._menu = null;
        
        this._difficulty = 2; // 2, 3, 4
        
        this._debug = true;

        this.setupScreen();
        this.startMenu();
    }
    
    public getMenu():Menu { return this._menu; }

    private setupScreen():void
    {
        canvas.width = 1000;
        canvas.height = 500;

        canvas.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
        canvas.style.top = window.innerHeight / 2 - canvas.height / 2 + "px";
        canvas.style.position = "absolute";
        
        var controls = document.getElementById("controls");
        controls.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
        controls.style.top = window.innerHeight / 2 + canvas.height / 2  + 20 + "px";
        controls.style.position = "absolute";
    }

    public startMenu():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this._hasGameStarted = false;
        this._menu = new Menu(this);
    }

    public startSPGame():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this._hasGameStarted = true;
        this._gameScene = new GameScene(this, false);
    }
    
    public startMPGame():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this._hasGameStarted = true;
        this._gameScene = new GameScene(this, true);
    }
}