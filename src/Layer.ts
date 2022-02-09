export default class Layer {
    canv: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(width:number, height:number) {
        this.canv = document.createElement('canvas');
        this.canv.width = width;
        this.canv.height = height;
        this.ctx = this.canv.getContext('2d')!;
    }

    clear(){
        this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
    }
}