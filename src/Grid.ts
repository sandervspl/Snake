import GridNode from "./GridNode";
import {canvas} from "./Defines";

export default class Grid
{
    private _grid:              GridNode[][];    // grid array
    private _nodeSize:          number;          // size of grid nodes
    private _gridWidth:         number;          // grid node width
    private _gridHeight:        number;          // grid node height
    
    public _showGrid:           boolean;         // grid show toggle
    
    constructor()
    {
        this.init();
    }

    public getNodeSize():number { return this._nodeSize; }

    public getGridSize() {
        return {
            width: this._gridWidth,
            height: this._gridHeight
        }
    }
    
    public getGridNodes():GridNode[][] { return this._grid; }
    
    // create a grid with nodes on which we position our sprites
    public init():boolean
    {
        this._grid = [];
        this._nodeSize = 50;
        this._gridWidth = Math.round(canvas.width / this._nodeSize);
        this._gridHeight = Math.round(canvas.height / this._nodeSize);

        for (var x = 0; x < this._gridWidth; x += 1) {
            this._grid[x] = [];

            for (var y = 0; y < this._gridHeight; y += 1) {
                var posId = {x: x, y: y};

                this._grid[x][y] = new GridNode(this._nodeSize, posId);
            }
        }

        return true;
    }

    // set all nodes to empty or occupied
    public setNodeOccupation(occupation: boolean)
    {
        for (var x = 0; x < this._gridWidth; x += 1) {
            for (var y = 0; y < this._gridHeight; y += 1) {
                this._grid[x][y]._isOccupied = occupation;
            }
        }
    }

    // draw grid nodes on screen
    private drawGrid():void
    {
        for (var x = 0; x < this._gridWidth; x += 1) {
            for (var y = 0; y < this._gridHeight; y += 1) {
                this._grid[x][y].draw();
            }
        }
    }
    
    public update():void 
    {
        if (this._showGrid) this.drawGrid();
    }
}