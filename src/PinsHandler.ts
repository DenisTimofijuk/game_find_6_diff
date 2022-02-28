import type Compositor from "./Compositor";

export default class PinsHandler implements PinsHandlerClass {
    bufferPins: Array<number | string>;
    searchablePins: Array<number | string>;
    constructor(pins: string[]) {
        this.bufferPins = ([] as any[]).concat(pins);
        this.searchablePins = ([] as any[]).concat(pins);
    }

    find(mouseX: number, mouseY: number) {
        const pins = [];
        for (let i = 0; i < this.searchablePins.length; i += 4) {
            if (pins.length > 0) continue;

            const [x, y, w, h] = this.getPins(i);

            if (this.isInTheRightPlace(mouseX, mouseY, x, y, w, h)) {
                pins.push(x, y, w, h);
                this.bufferPins.splice(i, 4);
            }
        }

        return pins;
    }

    getPins(index: number) {
        const x = Number(this.searchablePins[index]);
        const y = Number(this.searchablePins[index + 1]);
        const w = Number(this.searchablePins[index + 2]);
        const h = Number(this.searchablePins[index + 3]);

        return [x, y, w, h];
    }

    private isInTheRightPlace(offsetX: number, offsetY: number, x: number, y: number, w: number, h: number) {
        return offsetX >= x && offsetX <= x + w && offsetY >= y && offsetY <= y + h;
    }
}


export function acceptRatio(compositor:Compositor, value:number) {
    const screen1 = document.getElementById('screen-1') as HTMLElement;
    const w = screen1.clientWidth;
    const originalWidth = compositor.screeenA.canvas.width;
    const ratio = originalWidth / w;

    return Math.round(value * ratio);
}