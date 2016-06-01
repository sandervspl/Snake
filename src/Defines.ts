// canvas 
export var canvas = <HTMLCanvasElement> document.getElementById('canvas');
export var ctx: CanvasRenderingContext2D = canvas.getContext('2d');

export enum Direction {
    DIR_UP = 0,
    DIR_RIGHT,
    DIR_LEFT,
    DIR_DOWN
}