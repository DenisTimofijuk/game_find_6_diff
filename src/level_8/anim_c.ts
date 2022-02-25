import Layer from "../Layer";

export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const bufferLayer = new Layer(w, h);
    const cow = new Layer(80, 70);
    cow.ctx.drawImage(images[2], 0, 0);

    const pos = {
        x: w*2+1,
        y: 50
    };

    let rotationTime = 0;
    const rotationKoof = 0.1;
    const scale = 1;
    const velocity = 4;
    let time = 10;
    const koof = 0.005;

    return function update(deltaTime: number) {
        rotationTime += rotationKoof;
        time += koof;

        if( Math.sin(time) >= 0.999 && pos.x > w*2){
            pos.x = -cow.canv.width;
        }

        if(pos.x > w*2){
            return;
        }

        bufferLayer.clear();
        bufferLayer.ctx.setTransform(scale, 0, 0, scale, cow.canv.width / 2, cow.canv.height / 2);
        bufferLayer.ctx.rotate(rotationTime);
        bufferLayer.ctx.drawImage(cow.canv, -cow.canv.width / 2, -cow.canv.height / 2)
        bufferLayer.ctx.setTransform(1, 0, 0, 1, 0, 0);

        pos.x += velocity;

        compositor.screeenA.ctx.drawImage(bufferLayer.canv, pos.x, pos.y);
        compositor.screeenB.ctx.drawImage(bufferLayer.canv, pos.x - compositor.screeenB.canvas.width, pos.y);
        
    }
}