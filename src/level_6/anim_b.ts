import { getRandomArbitrary } from "../helpers";
import Layer from "../Layer";

interface FlairElement {
    pos: {
        x: number;
        y: number
    };
    vel: {
        x: number;
        y: number;
    };
    buffer: Layer
}

export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const flairs: FlairElement[] = []
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const mainLayer = new Layer(w, h);
    const flairCount = 15;
    const flairImage = images[2];

    for (let i = 0; i < flairCount; i++) {
        const size = getRandomArbitrary(10, 50);
        const buffer = new Layer(size, size);
        buffer.ctx.drawImage(flairImage, 0, 0, w, h, 0, 0, size, size);
        flairs.push({
            buffer: buffer,
            pos: {
                x: getRandomArbitrary(0, w),
                y: getRandomArbitrary(0, h)
            },
            vel: {
                x: getRandomArbitrary(10, 100) / 100,
                y: getRandomArbitrary(10, 100) / 100
            }
        })
    };

    function draw() {
        mainLayer.clear();
        flairs.forEach(element => {
            element.pos.x += element.vel.x;
            element.pos.y += element.vel.y;
            if (element.pos.x > (w - element.buffer.canv.width)) {
                element.vel.x = - element.vel.x;
                element.pos.x = (w - element.buffer.canv.width);
            } else if (element.pos.x < 0) {
                element.vel.x = - element.vel.x;
                element.pos.x = 0;
            }

            if (element.pos.y > (h - element.buffer.canv.height)) {
                element.vel.y = - element.vel.y;
                element.pos.y = (h - element.buffer.canv.height);
            } else if (element.pos.y < 0) {
                element.vel.y = - element.vel.y;
                element.pos.y = 0;
            }
            mainLayer.ctx.drawImage(element.buffer.canv, element.pos.x, element.pos.y);
        })
    }

    return function update(deltaTime: number) {
        draw();
        compositor.screeenA.ctx.drawImage(mainLayer.canv, 0, 0);
        compositor.screeenB.ctx.drawImage(mainLayer.canv, 0, 0);
    }
}

