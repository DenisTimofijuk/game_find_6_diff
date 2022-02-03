export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    // await new Promise((resolve, reject)=>{
    //     resolve(true);
    // });

    const canv = document.createElement('canvas');
    canv.width = compositor.screeenA.canvas.width;
    canv.height = compositor.screeenA.canvas.height;
    const ctx = canv.getContext('2d')!;

    const layer1 = document.createElement('canvas');
    layer1.width = canv.width;
    layer1.height = canv.height;
    const layer1ctx = layer1.getContext('2d')!;
    layer1ctx.drawImage(images[2], 0, 0);

    const layer2 = document.createElement('canvas');
    layer2.width = canv.width;
    layer2.height = canv.height;
    const layer2ctx = layer2.getContext('2d')!;
    layer2ctx.drawImage(images[2], 0, 0);
    

    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    let velocity = 0.5;
    let dellay1 = randomDellay();
    let dellay2 = randomDellay();    

    return function update(deltaTime: number) {
        ctx.clearRect(0,0, canv.width, canv.height);

        if(dellay1 < 0){
            x1 += velocity + 1.2;
            y1 += velocity;
            ctx.drawImage(layer1, x1, y1);
        }

        if(dellay2 < 0){
            x2 += velocity + 1.2;
            y2 += velocity;
            ctx.drawImage(layer2, x2, y2);
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

        compositor.screeenA.ctx.drawImage(canv, 0, 0);
        compositor.screeenB.ctx.drawImage(canv, 0, 0);
    }
}


function randomDellay() {
    return Math.floor(Math.random() * 500 )
}