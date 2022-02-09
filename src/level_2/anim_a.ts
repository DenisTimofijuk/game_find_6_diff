import Layer from "../Layer";

export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    // await new Promise((resolve, reject)=>{
    //     resolve(true);
    // });
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const mainLayer = new Layer(w, h);
    const buffer1 = new Layer(w, h);
    const buffer2 = new Layer(w, h);

    buffer1.ctx.drawImage(images[2], 0, 0);
    buffer2.ctx.drawImage(images[2], 0, 0);
    

    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    let velocity = 0.5;
    let dellay1 = randomDellay();
    let dellay2 = randomDellay();    

    return function update(deltaTime: number) {
        mainLayer.clear();

        if(dellay1 < 0){
            x1 += velocity + 1.2;
            y1 += velocity;
            mainLayer.ctx.drawImage(buffer1.canv, x1, y1);
        }

        if(dellay2 < 0){
            x2 += velocity + 1.2;
            y2 += velocity;
            mainLayer.ctx.drawImage(buffer2.canv, x2, y2);
        }

        
        if(y1 > compositor.screeenA.canvas.height/3){
            x1 = 0;
            y1 = 0;
            dellay1 = randomDellay();
        }

        if(y2 > compositor.screeenA.canvas.height/3){
            x2 = 0;
            y2 = 0;
            dellay2 = randomDellay();
        }


        dellay1--;
        dellay2--;

        compositor.screeenA.ctx.drawImage(mainLayer.canv, 0, 0);
        compositor.screeenB.ctx.drawImage(mainLayer.canv, 0, 0);
    }
}


function randomDellay() {
    return Math.floor(Math.random() * 500 )
}