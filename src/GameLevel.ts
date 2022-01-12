import Compositor from "./Compositor";
import { loadImage } from "./loaders";

export default class GameLevel<T extends JSON_object> {
    compositor: Compositor;
    totlaDiffs: number;
    indicationPlaceHolder: HTMLElement;
    bufferPins: string[];
    searchablePins: string[];
    constructor(public configData: T) {
        this.compositor = new Compositor();
        this.totlaDiffs = 6;
        this.indicationPlaceHolder = document.getElementById('diff-indicator')!;
        this.bufferPins = ([] as any[]).concat(configData.pins);
        this.searchablePins = ([] as any[]).concat(configData.pins);
    }

    async loadIamgeFiles(){
        const jobs = [
            loadImage(this.configData["main-image-a"]),
            loadImage(this.configData["main-image-b"])
        ];

        for(let key in this.configData.images){
            jobs.push(loadImage(this.configData.images[key]));
        };

        return Promise.all(jobs)       
    }

    drawMainScreen(img_a:HTMLImageElement, img_b:HTMLImageElement){
        this.compositor.screen_a.init(img_a);
        this.compositor.screen_b.init(img_b);
    }

    initEventListener(flag:boolean){
        this.compositor.screen_a.listenEvent(flag, this.clickHandler.bind(this));
        this.compositor.screen_b.listenEvent(flag, this.clickHandler.bind(this));
    }

    clickHandler(ev: MouseEvent){
        ev.preventDefault();

        const place = [];
        for (let i = 0; i < this.searchablePins.length; i += 4) {
            if (place.length > 0) continue;

            const x = Number(this.searchablePins[i]);
            const y = Number(this.searchablePins[i + 1]);
            const w = Number(this.searchablePins[i + 2]);
            const h = Number(this.searchablePins[i + 3]);

            if (isInTheRightPlace(ev.offsetX, ev.offsetY, x, y, w, h)) {
                place.push(x, y, w, h);
                this.bufferPins.splice(i, 4);
            }
        }

        if (place.length > 0) {
            this.totlaDiffs--;
            this.searchablePins = this.bufferPins;
            this.compositor.removeDiff(place[0], place[1], place[2], place[3]);
            this.indicationPlaceHolder.innerText = '' + this.totlaDiffs;
        }

        this.customHanlder();
    }

    customHanlder(){

    }
}

function isInTheRightPlace(offsetX: number, offsetY: number, x: number, y: number, w: number, h: number) {
    return offsetX >= x && offsetX <= x + w && offsetY >= y && offsetY <= y + h;
}
