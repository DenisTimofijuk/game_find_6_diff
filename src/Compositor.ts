import GameScreen from "./GameScreen";
export default class Compositor {
    screeenA: GameScreen;
    screeenB: GameScreen;
    constructor() {
        this.screeenA = new GameScreen('screen-1');
        this.screeenB = new GameScreen('screen-2');
    }

    initBuffers(images:HTMLImageElement[]){
        this.screeenA.initBuffer(images[0]);
        this.screeenB.initBuffer(images[1]);
    }

    draw(){
        this.screeenA.clear();
        this.screeenA.drawBuffer();
        this.screeenB.clear();
        this.screeenB.drawBuffer();
    }

    redrawSegment([x, y, w, h]:number[]){
        this.screeenA.bufferCtx.drawImage(this.screeenB.buffer, x, y, w, h, x, y, w, h);
    }
}
