export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const canv = document.createElement('canvas');
    canv.width = compositor.screeenA.canvas.width;
    canv.height = compositor.screeenA.canvas.height;
    const ctx = canv.getContext('2d')!;

    ctx.drawImage(compositor.screeenA.buffer, 464,250,36,19, 464,250-19,36,19);

    let period = randomDellay();

    return function update(deltaTime: number) {
        period--;
        if(period > 0 && period < 60){
            compositor.screeenA.ctx.drawImage(canv, 0, 0);
            compositor.screeenB.ctx.drawImage(canv, 0, 0);
        }else{
            period = randomDellay();
        }        
    }
}

function randomDellay() {
    return Math.floor(Math.random() * 100 )
}