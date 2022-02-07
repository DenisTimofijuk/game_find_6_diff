export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const canv = document.createElement('canvas');
    canv.width = 220;
    canv.height = 220;
    const ctx = canv.getContext('2d')!;

    ctx.drawImage(images[2], 180, 180, 210, 220, 0, 0, 210, 220);

    const startPos = {
        y: compositor.screeenA.canvas.height,
        x: -canv.width
    }
    let x = startPos.x;
    let y = startPos.y;
    const velocity = 0.2;

    return function update(deltaTime: number) {
        compositor.screeenA.ctx.drawImage(canv, x, y);
        compositor.screeenB.ctx.drawImage(canv, x, y);

        compositor.screeenA.ctx.drawImage(images[4], 0, 0);
        compositor.screeenB.ctx.drawImage(images[4], 0, 0);

        x += velocity * 0.5;
        y -= velocity;

        if (y < -canv.height) {
            x = startPos.x;
            y = startPos.y;
        }
    }
}