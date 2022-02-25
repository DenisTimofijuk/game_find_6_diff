import { getRandomArbitrary } from "../helpers";
import Layer from "../Layer";

export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const bufferLayer = new Layer(w, h);

    const spost:Layer[] = [];

    const coords:{x:number, y:number}[] = [
        {
            x:70,
            y:480
        },
        {
            x:520,
            y:450
        },
        {
            x:380,
            y:420
        },
    ]

    coords.forEach(pos => {
        const spot = new Layer(w, h);
        spot.ctx.drawImage(images[5], pos.x, pos.y);
        spost.push(spot);
    })

    const elementToDraw:{time:number,index:number}[] = [];
    const setOfIndex = new Set();

    return function update(deltaTime: number) {
        bufferLayer.clear();
        const istime = getRandomArbitrary(0, 60) === 11;

        if(istime){
            const index = getRandomArbitrary(0, coords.length);
            if(!setOfIndex.has(index)){
                setOfIndex.add(index);
                elementToDraw.push({
                    index: index,
                    time: getRandomArbitrary(50, 100)
                }) 
            }            
        }
        

        if(elementToDraw.length === 0){
            return;
        }

        elementToDraw.forEach((settings, idx) => {
            bufferLayer.ctx.drawImage(spost[settings.index].canv, 0, 0);
            settings.time--;
            settings.time < 0 && elementToDraw.splice(idx, 1) && setOfIndex.delete(settings.index);
        })

        compositor.screeenB.ctx.drawImage(bufferLayer.canv, 0, 0);
        compositor.screeenA.ctx.drawImage(bufferLayer.canv, 0, 0);
    }
}