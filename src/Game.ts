import {canvas, ctx, Difficulty} from "./Defines";
import GameScene from "./GameScene";
import Menu from "./Menu";

export default class Game
{
    private _gameScene: GameScene;      // controls all game elements
    private _menu: Menu;                // controls all menu elements

    public _hasGameStarted: boolean;    // determines if there is a game being played
    public _difficulty: number;         // game update interval speed
    public _debug: boolean;             // debug information into console

    constructor()
    {
        this._hasGameStarted = false;
        this._gameScene = null;
        this._menu = null;
        
        this._difficulty = Difficulty.DIF_EASY;
        
        this._debug = false;

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

    // set up canvas position
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

    // set up menu screen
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

    // start single-player game
    public startSPGame():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this._menu != null) this._menu.cancelAnimFrame();

        this._hasGameStarted = true;
        this._gameScene = null;
        this._gameScene = new GameScene(this, false);
    }
    
    // start multi-player game
    public startMPGame():void
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this._menu != null) this._menu.cancelAnimFrame();

        this._hasGameStarted = true;
        this._gameScene = null;
        this._gameScene = new GameScene(this, true);
    }
}