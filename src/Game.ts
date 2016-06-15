import {canvas} from "./Defines";
import GameScene from "./GameScene";
import Menu from "./Menu";

export default class Game
{
    private _gameScene: GameScene;
    private _menu: Menu;

    public _hasGameStarted: boolean;

    constructor()
    {
        this._hasGameStarted = false;
        this._gameScene = null;
        this._menu = null;

        this.setupScreen();
        this.drawMenu();
        // this.startGame();
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

    private drawMenu():void
    {
        this._menu = new Menu(this);
    }

    public startSPGame():void
    {
        this._hasGameStarted = true;
        this._menu = null;
        this._gameScene = new GameScene();
    }
    
    public startMPGame():void
    {
        this._hasGameStarted = true;
        this._menu = null;
        // this._gameScene = new GameScene();
    }
}