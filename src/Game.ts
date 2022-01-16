import Compositor from "./Compositor";
import { loadImage } from "./loaders";



export default class Game<T extends JSON_object> implements GameBody<JSON_object> {
    compositor: Compositor;
    images: HTMLImageElement[];
    animations: AnimationFunctionReturn[];
    searchablePins: Array<number | string>;
    bufferPins: Array<number | string>;
    diffCount: number;
    diffIndicationPlaceHolder: HTMLElement;
    constructor(public configData: T) {
        this.compositor = new Compositor();
        this.images = []
        this.animations = [];
        this.bufferPins = ([] as any[]).concat(configData.pins);
        this.searchablePins = ([] as any[]).concat(configData.pins);
        this.diffCount = configData.totalDiffs;
        this.diffIndicationPlaceHolder = document.getElementById('diff-indicator')!;
    }

    async loadIamgeFiles() {
        const jobs = [
            loadImage(this.configData["main-image-a"]),
            loadImage(this.configData["main-image-b"])
        ];

        for (let key in this.configData.images) {
            jobs.push(loadImage(this.configData.images[key]));
        };

        this.images = await Promise.all(jobs);
    }

    initScreens() {
        this.compositor.drawScreens(this.images);
        this.compositor.saveAllBuffers();
    }

    clickHandler(ev: MouseEvent) {
        ev.preventDefault();

        const pins = this.findPins(ev.offsetX, ev.offsetY);
        this.removeDiff(pins);
    }

    removeDiff(pins: number[]) {
        if (pins.length === 0) {
            return;
        }
        this.diffCount--;
        this.searchablePins = this.bufferPins;
        this.compositor.removeDiff(pins);
        this.displayDiffCount();
    }

    findPins(mouseX: number, mouseY: number) {
        const pins = [];
        for (let i = 0; i < this.searchablePins.length; i += 4) {
            if (pins.length > 0) continue;

            const [x, y, w, h] = getPins(this.searchablePins, i);

            if (isInTheRightPlace(mouseX, mouseY, x, y, w, h)) {
                pins.push(x, y, w, h);
                this.bufferPins.splice(i, 4);
            }
        }

        return pins;
    }

    initEventListeners() {
        this.compositor.screeenA.click(this.clickHandler.bind(this));
        this.compositor.screeenB.click(this.clickHandler.bind(this));
    }

    run() {
        window.requestAnimationFrame(this.run.bind(this));
    }

    update(detlaTime:number){
        this.compositor.update();
        this.animations.forEach(animation => animation(this, detlaTime));
    }

    levelFinished(loadNext: () => void) {
        // TODO add custom event listener to trigger loadNext callback from anuwhere.
    }

    displayDiffCount(){
        this.diffIndicationPlaceHolder.innerText = this.diffCount+'';
    }

    addAnimation(animation:AnimationFunction ){
        const update = animation(this);
        this.animations.push(update);
    }
}

function isInTheRightPlace(offsetX: number, offsetY: number, x: number, y: number, w: number, h: number) {
    return offsetX >= x && offsetX <= x + w && offsetY >= y && offsetY <= y + h;
}

function getPins(pinList:Array<string|number>, index:number) {
    const x = Number(pinList[index]);
    const y = Number(pinList[index + 1]);
    const w = Number(pinList[index + 2]);
    const h = Number(pinList[index + 3]);

    return [x, y, w, h];
}