interface JSON_object{
    "main-image-a":string;
    "main-image-b":string;
    "images": {[key:string]:string};
    "audio": JSON_audio;
    "pins": string[];
    "totalDiffs": number;
}

interface JSON_audio{
    "background-audio": string;
    [key:string]:string
}


interface AnimationTrait {
    update(currentGame: GameBody<JSON_object>, detlaTime:number): void;
    init(currentGame: GameBody<JSON_object>): void;
}

interface ConfigFile_level_1 extends JSON_object {
    "images": {
        "image-alien": string;
        "image-ship": string;
    }
}
interface GameScreenInterface {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    buffer: HTMLCanvasElement;
    bufferCtx: CanvasRenderingContext2D;
    clear(): void;
    drawBuffer(): void;
    saveBuffer(): void;
    click(handler: (ev: MouseEvent) => void): void;
    rightClick(handler: (ev: MouseEvent) => void): void;
}
interface GameCompositor {
    screeenA: GameScreenInterface;
    screeenB: GameScreenInterface;
    drawScreens(images: HTMLImageElement[]): void;
    saveAllBuffers(): void;
    update(): void;
    removeDiff([x, y, w, h]: number[]): void;
}

interface GameBody<T extends JSON_object> {
    compositor: GameCompositor;
    images: HTMLImageElement[];
    animations: AnimationFunctionReturn[];
    searchablePins: Array<number | string>;
    bufferPins: Array<number | string>;
    diffCount: number;
    diffIndicationPlaceHolder: HTMLElement;
    setImages(images:HTMLImageElement[]):void;
    initScreens(): void;
    clickHandler(ev: MouseEvent): void;
    removeDiff(pins: number[]): void;
    findPins(mouseX: number, mouseY: number): number[];
    initEventListeners(): void;
    levelFinished(loadNext: () => void): void;
    displayDiffCount(): void;
    addAnimation(animation:AnimationFunction): void;
}

type AnimationFunctionReturn = (currentGame: GameBody<JSON_object>, deltaTime:number)=>void;
type AnimationFunction = (currentGame: GameBody<JSON_object>)=> AnimationFunctionReturn;