import GameScene from './GameScene'
import {canvas} from './Defines'

// START
// adjust canvas size to screen
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

// initialize and start game scene
var gameScene = new GameScene();