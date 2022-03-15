import { GameAudio } from "../AudioBoard";
import Layer from "../Layer";

export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const bufferLayer = new Layer(w, h);

    const audio = new GameAudio();
    audio.load('/L-8/audio/light.ogg').then(()=>{
        audio.audio.volume = 0.4;
    });    

    const light = initLightening(bufferLayer, images[3], images[4], audio);

    let time = 0;
    const koef = 0.005;


    return function update(deltaTime: number) {
        time += koef;
        bufferLayer.clear();

        light( Math.sin(time) > 0.9999 );        

        compositor.screeenA.ctx.drawImage(bufferLayer.canv, 0, 0);
        compositor.screeenB.ctx.drawImage(bufferLayer.canv, 0, 0);
    }
}

function initLightening(bufferLayer:Layer, a:HTMLImageElement, b:HTMLImageElement, audio:GameAudio) {
    const animation = [
        b,b,
        a,a,a,a,a,
        b,b,b,
        a,a,a,
        b,b,b,b,
    ];

    let index = 0;

    return function light(start:boolean){
        if(start){
            index = 0;
            audio.audio.paused && audio.play();
        }

        if(index >= animation.length){
            return;
        }
        
        bufferLayer.ctx.drawImage(animation[index], 0, 0);
        index++;
    }
}