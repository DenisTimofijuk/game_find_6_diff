import GameScreen from "./GameScreen";
export default class Compositor {
    screeenA: GameScreen;
    screeenB: GameScreen;
    constructor() {
        this.screeenA = new GameScreen('screen-1');
        this.screeenB = new GameScreen('screen-2');
    }

    drawScreens(images:HTMLImageElement[]){
        this.screeenA.ctx.drawImage(images[0], 0, 0);
        this.screeenB.ctx.drawImage(images[1], 0, 0);
    }

    saveAllBuffers(){
        this.screeenA.saveBuffer();
        this.screeenB.saveBuffer();
    }

    update(){
        this.screeenA.clear();
        this.screeenA.drawBuffer();
        this.screeenB.clear();
        this.screeenB.drawBuffer();
    }

    redrawSegment([x, y, w, h]:number[]){
        this.screeenA.bufferCtx.drawImage(this.screeenB.buffer, x, y, w, h, x, y, w, h);
    }

    displayLoading(){
        this.screeenA.clear();
        this.screeenA.inidcateLoading();
        this.screeenA.drawBuffer();
        this.screeenB.clear();
        this.screeenB.inidcateLoading();
        this.screeenB.drawBuffer();
    }
}
