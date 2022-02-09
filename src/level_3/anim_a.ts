import Layer from "../Layer";
import { GIF } from "../GIF"

export default <AnimationFunction> async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const buffer = new Layer(100, 95);
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
        buffer.clear();
        // @ts-ignore
        buffer.ctx.drawImage(gif.frames[Math.floor(index)].image, 0, 0);
        
        compositor.screeenA.ctx.drawImage(buffer.canv, sc.x, sc.y, sc.w, sc.h, dc.x, dc.y, dc.w, dc.h);
        compositor.screeenB.ctx.drawImage(buffer.canv, sc.x, sc.y, sc.w, sc.h, dc.x, dc.y, dc.w, dc.h);

        index += velocity;
        if(index >= gif.frames.length){
            index = 0;
        }
    }
}