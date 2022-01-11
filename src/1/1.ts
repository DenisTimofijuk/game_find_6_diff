import { loadImage, loadJSON } from "../loaders";
import Compositor from "../Compositor";

const DEBUGGER = false;
const URL = '/task-1/config.json';

interface ConfigFile extends JSON_object {
    "image-alien": string;
    "image-ship": string;
}

export default async function task_1(callback: CallableFunction) {
    const compositor = new Compositor();

    const configData = await loadJSON<ConfigFile>(URL);

    Promise.all([
        loadImage(configData["main-image-a"]),
        loadImage(configData["main-image-b"]),
        loadImage(configData["image-alien"]),
        loadImage(configData["image-ship"])
    ]).then(([milda_img_a, milda_img_b, alien_img, ship_img]) => {
        compositor.screen_a.init(milda_img_a);
        compositor.screen_b.init(milda_img_b);

        const clickHandler = main(configData.pins, compositor);
        compositor.screen_a.listenEvent(DEBUGGER, clickHandler);
        compositor.screen_b.listenEvent(DEBUGGER, clickHandler);
    })
}

function main(pins: string[], compositor: Compositor) {
    let totlaDiffs = 6;
    const placeHolder = document.getElementById('diff-indicator')!;
    let bufferPins = ([] as any[]).concat(pins);
    let searchablePins = ([] as any[]).concat(pins);

    placeHolder.innerText = '' + totlaDiffs;

    return function clickHandler(this: HTMLCanvasElement, ev: MouseEvent) {
        ev.preventDefault();

        const place = [];
        for (let i = 0; i < searchablePins.length; i += 4) {
            if (place.length > 0) continue;

            const x = Number(searchablePins[i]);
            const y = Number(searchablePins[i + 1]);
            const w = Number(searchablePins[i + 2]);
            const h = Number(searchablePins[i + 3]);

            if (isInTheRightPlace(ev.offsetX, ev.offsetY, x, y, w, h)) {
                place.push(x, y, w, h);
                bufferPins.splice(i, 4);
            }
        }

        if (place.length > 0) {
            totlaDiffs--;
            searchablePins = bufferPins;
            compositor.removeDiff(place[0], place[1], place[2], place[3]);
            placeHolder.innerText = '' + totlaDiffs;
        }
    }
}

function isInTheRightPlace(offsetX: number, offsetY: number, x: number, y: number, w: number, h: number) {
    return offsetX >= x && offsetX <= x + w && offsetY >= y && offsetY <= y + h;
}


// we can create backend api to get img data url, then we will draw image on fron end.
// https://stackoverflow.com/questions/44698967/requesting-blob-images-and-transforming-to-base64-with-fetch-api