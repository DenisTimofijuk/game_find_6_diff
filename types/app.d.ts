interface ThemeJSON {
    "piano": string[];
}
interface Level_Config_JSON {
    "images": string[];
    "background-audio":{
        "url":string;
        "volume": number
    };
    "audio": JSON_audio;
    "pins": string[];
    "totalDiffs": number;
    "next-level": string;
    "animations": string[];
}

interface JSON_audio {
    [key: string]: string
}

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