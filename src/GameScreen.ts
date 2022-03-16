export default class GameScreen {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    buffer: HTMLCanvasElement;
    bufferCtx: CanvasRenderingContext2D;
    constructor(id: string) {
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.buffer = document.createElement('canvas');
        this.buffer.width = this.canvas.width;
        this.buffer.height = this.canvas.height;
        this.bufferCtx = this.buffer.getContext('2d')!;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBuffer() {
        this.ctx.drawImage(this.buffer, 0, 0);
    }

    saveBuffer() {
        this.bufferCtx.drawImage(this.canvas, 0, 0);
    }

    initBuffer(img:HTMLImageElement){
        this.bufferCtx.drawImage(img, 0, 0);
    }
}