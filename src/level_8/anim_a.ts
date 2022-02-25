import Layer from "../Layer";

export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const bufferLayer = new Layer(w, h);
    const bulbLayer_a = new Layer(20, 20);
    const bulbLayer_b = new Layer(20, 20);

    initBulb(bulbLayer_a);
    initBulb(bulbLayer_b);

    let timer = 0;
    let energy = 0.01;

    return function update(deltaTime: number) {
        bufferLayer.clear();
        timer += energy;

        if(Math.round(timer)%2){
            bufferLayer.ctx.drawImage(bulbLayer_a.canv, 152, 185);
            bufferLayer.ctx.drawImage(bulbLayer_b.canv, 105, 185, 10, 10);
        }else{
            bufferLayer.ctx.drawImage(bulbLayer_b.canv, 100, 180);
            bufferLayer.ctx.drawImage(bulbLayer_a.canv, 155, 190, 10, 10);
        }

        compositor.screeenA.ctx.drawImage(bufferLayer.canv, 0, 0);
        compositor.screeenB.ctx.drawImage(bufferLayer.canv, 0, 0);
    }
}


function initBulb(layer:Layer) {
    layer.ctx.beginPath();
    layer.ctx.arc(10,10, 2, 0, 2*Math.PI);
    layer.ctx.strokeStyle = 'yellow';
    layer.ctx.fillStyle = 'red';
    layer.ctx.stroke();
    layer.ctx.fill();
    layer.ctx.closePath();
}