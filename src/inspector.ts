import type Compositor from "./Compositor";

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
        console.log([x, y, w, h].join(','));

        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(x, y, w, h);
        ctx.closePath();
    }

    return function update() {
        compositor.screeenA.ctx.drawImage(canv, 0, 0);
        compositor.screeenB.ctx.drawImage(canv, 0, 0);
    }
}