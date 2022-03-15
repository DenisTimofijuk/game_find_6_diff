import type Compositor from "./Compositor";
import Layer from "./Layer";

export default class LoaderIndicator {
    buffer: Layer;
    line: number;
    y: number;
    x: number;
    constructor(private compositor: Compositor, color="red") {
        this.buffer = new Layer(compositor.screeenA.canvas.width, compositor.screeenA.canvas.height);
        this.line = 1;
        this.buffer.ctx.fillStyle = color;
        this.buffer.ctx.textAlign = "center";
        this.y = this.buffer.canv.height / 4;
        this.x = this.buffer.canv.width / 2;
    }

    showProgress(text:string){
        this.line++;
        this.write(18, text, this.x, this.y + 19*this.line);
    }

    init(){
        this.buffer.clear();
        this.line = 1;
        this.write(60, "Loading...", this.x, this.y);
    }

    write(fontSize:number, text:string, x:number, y:number){
        this.buffer.ctx.font = `${fontSize}px Comic Sans MS`;
        this.buffer.ctx.fillText(text, x, y);
        this.display();
    }

    display(){
        this.compositor.screeenA.ctx.drawImage(this.buffer.canv, 0, 0);
        this.compositor.screeenB.ctx.drawImage(this.buffer.canv, 0, 0);
    }
}