export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const canvases:HTMLCanvasElement[]= [];
    const windowImages = images.slice(5, images.length - 1);
    windowImages.forEach((image, index) => {
        const canv = document.createElement('canvas');
        canv.width = compositor.screeenA.canvas.width;
        canv.height = compositor.screeenA.canvas.height;
        const ctx = canv.getContext('2d')!;
        ctx.drawImage(image, 0, 0);

        canvases.push(canv);
    })

    const dellay = 35;
    let counter = 0;
    let index = getRandomArbitrary(0, canvases.length);

    return function update(deltaTime: number) {
        counter++;
        if( counter > dellay ){
            counter = 0;
            index = getRandomArbitrary(0, canvases.length);
        }
        compositor.screeenA.ctx.drawImage(canvases[index], 0, 0);
        compositor.screeenB.ctx.drawImage(canvases[index], 0, 0);
    }
}

function getRandomArbitrary(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) + min);
}