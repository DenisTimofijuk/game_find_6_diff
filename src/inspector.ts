import type Compositor from "./Compositor";
import { acceptRatio } from "./PinsHandler";

export default function inspector(compositor:Compositor) {
    const canv = document.createElement('canvas');
    canv.width = compositor.screeenA.canvas.width;
    canv.height = compositor.screeenA.canvas.height;
    const ctx = canv.getContext('2d')!;

    let startX = 0;
    let startY = 0;

    compositor.screeenA.canvas.addEventListener('mousedown', setStartCoordinates);
    compositor.screeenB.canvas.addEventListener('mousedown', setStartCoordinates);

    compositor.screeenA.canvas.addEventListener('mouseup', setEndCoordinates);
    compositor.screeenB.canvas.addEventListener('mouseup', setEndCoordinates);

    compositor.screeenA.canvas.addEventListener('contextmenu', clear);
    compositor.screeenB.canvas.addEventListener('contextmenu', clear);

    function clear() {
        ctx.clearRect(0, 0, canv.width, canv.height);
    }

    function setStartCoordinates(e:MouseEvent) {
        startX = e.offsetX;
        startY = e.offsetY;
    }

    function setEndCoordinates(e:MouseEvent) {
        draw(startX, startY, e.offsetX-startX, e.offsetY-startY)
    }

    function draw(x:number, y:number, w:number, h:number) {
        
        const converted = {
            x: acceptRatio(compositor, x),
            y: acceptRatio(compositor, y),
            w: acceptRatio(compositor, w),
            h: acceptRatio(compositor, h)
        }
        
        console.log([converted.x, converted.y, converted.w, converted.h].join(','));

        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(converted.x, converted.y, converted.w, converted.h);
        ctx.closePath();
    }

    return function update() {
        compositor.screeenA.ctx.drawImage(canv, 0, 0);
        compositor.screeenB.ctx.drawImage(canv, 0, 0);
    }
}