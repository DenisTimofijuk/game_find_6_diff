import type Compositor from "./Compositor";
import Layer from "./Layer";
import { loadAllIamgeFiles } from "./loaders";

const SIZE_DIVIDER = 2;
let layer_w = 1
let layer_h = 1;
const DELTA_TIME = 0.5;

export default class Vortex {
    frames: Layer[];
    frameIndex: number;
    pos: { x: number; y: number; };
    bufferIndex: number;
    constructor(public compositor:Compositor) {
        this.frames = [];
        this.frameIndex = 999;
        this.bufferIndex = 999;
        this.pos = {
            x:0,
            y:0
        }
    }

    update(){
        if(this.frameIndex >= this.frames.length) return;
        this.draw();
        this.frameIndex = Math.floor(this.bufferIndex += DELTA_TIME);
    }

    draw(){
        this.compositor.screeenA.ctx.drawImage(this.frames[this.frameIndex].canv, this.pos.x, this.pos.y);
        this.compositor.screeenB.ctx.drawImage(this.frames[this.frameIndex].canv, this.pos.x, this.pos.y);
    }

    set([x, y, w, h]:number[]){
        this.pos.x = (x + w/2) - layer_w/2;
        this.pos.y = (y + h/2) - layer_h/2;
        this.frameIndex = 0;
        this.bufferIndex = 0;
    }

    async initBuffer(urls:string[]){
        const images = await loadAllIamgeFiles(urls);
        images.forEach(image => {
            layer_w = Math.round(image.width / SIZE_DIVIDER);
            layer_h = Math.round(image.height / SIZE_DIVIDER)
            const layer = new Layer(layer_w , layer_h);
            layer.ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, layer_w, layer_h);
            this.frames.push(layer);
        })
    }
}