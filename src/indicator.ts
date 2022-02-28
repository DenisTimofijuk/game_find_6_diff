import type Compositor from "./Compositor";
import { loadAllIamgeFiles } from "./loaders";

interface LevelOptions {
    x: number; y: number; size: number; globalCompositeOperation:string; globalAlpha:number;
}

export default class TotalIndicator {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    digits: Map<string, HTMLCanvasElement>;
    size: number;
    globalCompositeOperation: string;
    globalAlpha: number;
    constructor(public compositor:Compositor) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = compositor.screeenA.canvas.width;
        this.canvas.height = compositor.screeenA.canvas.height;
        this.ctx = this.canvas.getContext('2d')!;
        this.x = 0;
        this.y = 0;
        this.size = 50;
        this.globalCompositeOperation = "luminosity";
        this.globalAlpha = 1;
        this.digits = new Map();
    }

    draw(){
        this.compositor.screeenA.ctx.drawImage(this.canvas, 0, 0);
        this.compositor.screeenB.ctx.drawImage(this.canvas, 0, 0);
    }

    update(value:number){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const number = this.digits.get(value.toString());
        if(number){
            this.ctx.drawImage(this.compositor.screeenA.buffer, this.x, this.y, this.size, this.size, this.x, this.y, this.size, this.size);
            this.ctx.globalCompositeOperation = this.globalCompositeOperation;
            this.ctx.globalAlpha = this.globalAlpha;
            this.ctx.drawImage(number, 0, 0, number.width, number.height, this.x, this.y, this.size, this.size);
        }else{
            console.warn('Number was not found in the buffer:', value);
        }        
    }

    setup(options:LevelOptions){
        this.x = options.x;
        this.y = options.y;
        this.size = options.size;
        this.globalCompositeOperation = options.globalCompositeOperation;
        this.globalAlpha = options.globalAlpha;
    }

    async initBuffer(urls:string[]){
        const images = await loadAllIamgeFiles(urls);
        images.forEach(image => {
            const canv = document.createElement('canvas');
            canv.width = image.width;
            canv.height = image.height;
            const ctx = canv.getContext('2d');
            ctx?.drawImage(image, 0, 0);
            const key = image.src.slice(-5, -4);
            this.digits.set(key, canv);
        })
    }
}