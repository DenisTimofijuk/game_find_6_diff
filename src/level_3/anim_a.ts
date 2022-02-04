import { GIF } from "../GIF"

export default <AnimationFunction> async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const canv = document.createElement('canvas');
    canv.width = 100;
    canv.height = 95;
    const ctx = canv.getContext('2d')!;

    const gif = GIF();
    gif.load("/L-3/img/ezgif.com-gif-maker.gif");
    await new Promise(function(resolve: (value: unknown) => void, reject: (reason?: any) => void){
        // @ts-ignore
        gif.onload = function(event){
            resolve(true);
        }
    })
    const sc = {
        x: 0,
        y: 0,
        w: 100,
        h: 95
    };
    const dc = {
        x: 450,
        y: 0,
        w: 100,
        h: 95
    }

    let index = 0;
    let velocity = 0.2;
    
    return function update(deltaTime: number) {
        ctx.clearRect(0, 0, canv.width, canv.height);
        // @ts-ignore
        ctx.drawImage(gif.frames[Math.floor(index)].image, 0, 0);
        
        compositor.screeenA.ctx.drawImage(canv, sc.x, sc.y, sc.w, sc.h, dc.x, dc.y, dc.w, dc.h);
        compositor.screeenB.ctx.drawImage(canv, sc.x, sc.y, sc.w, sc.h, dc.x, dc.y, dc.w, dc.h);

        index += velocity;
        if(index >= gif.frames.length){
            index = 0;
        }
    }
}