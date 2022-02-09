import Layer from "../Layer";

export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const lights:{time:number; buffer:Layer}[] = []
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const mainLayer = new Layer(w, h);


    for(let i= 3; i< images.length; i++){
        const buffer = new Layer(w, h);
        buffer.ctx.drawImage(images[i], 0, 0);

        lights.push({
            buffer: buffer,
            time: 0
        });
    };

    function draw(){
        mainLayer.clear();
        lights.forEach(element => {
            if(element.time > 20){
                mainLayer.ctx.drawImage(element.buffer.canv, 0, 0);
            }
            if(element.time < 0){
                element.time = getTime();
            }
            element.time--;
        })
    }

    return function update(deltaTime: number) {
        draw();
        compositor.screeenA.ctx.drawImage(mainLayer.canv, 0, 0);
        compositor.screeenB.ctx.drawImage(mainLayer.canv, 0, 0);
    }
}

function getTime() {
    return Math.floor(Math.random() * 30 )
}