interface ThemeJSON {
    "piano": string[];
}
interface Level_Config_JSON {
    "images": string[];
    "background-audio": string;
    "audio": JSON_audio;
    "pins": string[];
    "totalDiffs": number;
    "next-level": string;
    "animations": string[];
}

interface JSON_audio {
    [key: string]: string
}


// interface AnimationTrait {
//     update(currentGame: GameBody<Level_Config_JSON>, detlaTime:number): void;
//     init(currentGame: GameBody<Level_Config_JSON>): void;
// }

// interface ConfigFile_level_1 extends Level_Config_JSON {
//     "images": {
//         "image-alien": string;
//         "image-ship": string;
//     }
// }
interface GameScreenInterface {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    buffer: HTMLCanvasElement;
    bufferCtx: CanvasRenderingContext2D;
    clear(): void;
    drawBuffer(): void;
    saveBuffer(): void;
}
interface GameCompositor {
    screeenA: GameScreenInterface;
    screeenB: GameScreenInterface;
    drawScreens(images: HTMLImageElement[]): void;
    saveAllBuffers(): void;
    update(): void;
    redrawSegment([x, y, w, h]: number[]): void;
}

// interface GameBody<T extends Level_Config_JSON> {
//     compositor: GameCompositor;
//     images: HTMLImageElement[];
//     animations: UpdateAnimation[];
//     searchablePins: Array<number | string>;
//     bufferPins: Array<number | string>;
//     diffCount: number;
//     diffIndicationPlaceHolder: HTMLElement;
//     setImages(images:HTMLImageElement[]):void;
//     initScreens(): void;
//     clickHandler(ev: MouseEvent): void;
//     removeDiff(pins: number[]): void;
//     findPins(mouseX: number, mouseY: number): number[];
//     initEventListeners(): void;
//     levelFinished(loadNext: () => void): void;
//     displayDiffCount(): void;
//     addAnimation(animation:AnimationFunction): void;
// }

interface PinsHandlerClass {
    bufferPins: Array<number | string>;
    searchablePins: Array<number | string>;
    find(mouseX: number, mouseY: number): number[];
}

type UpdateAnimation = (deltaTime: number) => void;
type AnimationFunction = (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) => UpdateAnimation;