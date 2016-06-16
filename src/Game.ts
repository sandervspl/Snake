import {canvas, ctx} from "./Defines";
import GameScene from "./GameScene";
import Menu from "./Menu";

export default class Game
{
    private _gameScene: GameScene;
    private _menu: Menu;

    private _hasGameStarted: boolean;
    
    public _difficulty: number;
    public _debug: boolean;

    constructor()
    {
        this._hasGameStarted = false;
        this._gameScene = null;
        this._menu = null;
        
        this._difficulty = 2; // 2, 3, 4
        
        this._debug = true;

        this.addEventHandlers();
        this.setupScreen();
        this.startMenu();
    }
    
    public getMenu():Menu { return this._menu; }

    private addEventHandlers():void { window.addEventListener('keyup', (e)=> { this.keyboardInput(e) }); }

    private keyboardInput(event: KeyboardEvent):any
    {
        if (!this._hasGameStarted) return;

        // ESCAPE
        if (event.keyCode == 27) {
            if (!this._gameScene._isGameOver) return;
            
            this.startMenu();
        }

        // G
        if (event.keyCode == 71) {
            this._gameScene._showGrid = (this._gameScene._showGrid) ? false : true;
        }

        // R
        if (event.keyCode == 82) {
            if (!this._gameScene._isGameOver) return;

            this._gameScene.cancelAnimFrame();
            this._gameScene.startGame();
        }
    }

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

        if (this._gameScene != null) {
            this._gameScene.cancelAnimFrame();
            this._gameScene.setupScore(true);
        }
        
        this._gameScene = null;
        this._menu = new Menu(this);
    }

    public startSPGame():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this._menu.cancelAnimFrame();

        this._hasGameStarted = true;
        this._gameScene = null;
        this._gameScene = new GameScene(this, false);
    }
    
    public startMPGame():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this._menu.cancelAnimFrame();

        this._hasGameStarted = true;
        this._gameScene = null;
        this._gameScene = new GameScene(this, true);
    }
}