import type Compositor from "./Compositor";

interface LevelOptions {
    x: number; y: number; font: string; style: string; 
}

export default class Indicator {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    constructor(public compositor:Compositor) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = compositor.screeenA.canvas.width;
        this.canvas.height = compositor.screeenA.canvas.height;
        this.ctx = this.canvas.getContext('2d')!;
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "yellow";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.x = 0;
        this.y = 0;
    }

    draw(){
        this.compositor.screeenA.ctx.drawImage(this.canvas, 0, 0);
        this.compositor.screeenB.ctx.drawImage(this.canvas, 0, 0);
    }

    update(value:number){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillText(value.toString(), this.x, this.y)
    }

    setup(options:LevelOptions){
        this.ctx.fillStyle = options.style;
        this.ctx.font = options.font;
        this.x = options.x;
        this.y = options.y
    }
}


/**
 * draw digits with photoshop
 * make globalalpha available in cofig.json
 * set size and position in cofig.json
 */