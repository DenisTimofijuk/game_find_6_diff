class Marker {
    endY: number;
    startX: number;
    startY: number;
    endX: number;
    constructor(private ctx:CanvasRenderingContext2D) {
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
    }

    start(x:number, y:number){
        this.startX = x;
        this.startY = y;
    }

    end(x:number, y:number){
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'yellow';
        this.ctx.rect(this.startX, this.startY, Math.abs(this.startX-x), Math.abs(this.startY-y));
        this.ctx.stroke();
        this.ctx.closePath();
        console.log('[mark]', 'x:', this.startX, 'y:', this.startY, 'w:', Math.abs(this.startX-x), 'h:', Math.abs(this.startY-y))
    }
}

class Screen {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | null;
    mark: Marker;
    originalImage?: HTMLImageElement;
    bufferCanv: HTMLCanvasElement;
    constructor(id: string) {
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');
        this.bufferCanv = document.createElement('canvas');
        this.bufferCanv.width = this.canvas.width;
        this.bufferCanv.height = this.canvas.height;

        this.mark = new Marker(this.context!);
    }

    init(image: HTMLImageElement){
        this.saveOriginalImage(image);
        this.draw(image);
    }

    saveOriginalImage(image: HTMLImageElement){
        this.originalImage = image;
    }

    draw(image: HTMLImageElement) {
        this.context?.drawImage(image, 0, 0)
    }

    saveBuffer(){
        const ctx = this.bufferCanv.getContext('2d');
        ctx?.drawImage(this.canvas, 0, 0);
    }

    drawBuffer(){
        this.context?.drawImage(this.bufferCanv, 0, 0);
    }

    clear(){
        this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    listenEvent(flag:boolean, callback:(ev: MouseEvent)=>void){
        const self = this;
        this.canvas.addEventListener('click', function(this: HTMLCanvasElement, ev: MouseEvent) { callback(ev) });

        this.canvas.addEventListener('contextmenu', function(this, ev){
            ev.preventDefault()
            flag && self.draw(self.originalImage!);
        });

        if(flag){
            this.canvas.addEventListener('mousedown', function(this, ev) {self.mark.start(ev.offsetX, ev.offsetY)});
            this.canvas.addEventListener('mouseup', function(this, ev) {self.mark.end(ev.offsetX, ev.offsetY)});        
        }        
    }

}

export default class Compositor {
    screen_b: Screen;
    screen_a: Screen;

    constructor() {
        this.screen_a = new Screen('screen-1');
        this.screen_b = new Screen('screen-2');
    }

    removeDiff(x:number, y:number, w:number, h:number){
        this.screen_a.context?.drawImage(this.screen_b.canvas, x, y, w, h, x, y, w, h);
        this.screen_a.saveBuffer();
        this.screen_b.saveBuffer();
    }
}
