import { GameAudio, loadAudioBoard } from "./AudioBoard";
import Compositor from "./Compositor";
import inspector from "./inspector";
import { loadAllIamgeFiles, loadJSON } from "./loaders";
import PinsHandler, { acceptRatio } from "./PinsHandler";
import Timer from "./Timer";

const DEBUGG = true;
const startButton = document.getElementById('start-game')! as HTMLInputElement;
const gameScreen = document.getElementById('gameScreen')!;
const diffIndicationPlaceHolder = document.getElementById('diff-indicator')!;
const audioContext = new AudioContext();
const timer = new Timer();
const compositor = new Compositor();
const themeConfigData = await loadJSON<ThemeJSON>('/theme/config.json');
const audioBoard = await loadAudioBoard(getPianoClicks(themeConfigData.piano), audioContext);
const animations: UpdateAnimation[] = [];
const loadNextLevel = new Event('nextlevel');

timer.update = function update(deltaTime: number) {
    compositor.draw();
    animations.forEach(update => update(deltaTime))
};

compositor.screeenA.canvas.addEventListener('contextmenu', contextMenuHandler);
compositor.screeenB.canvas.addEventListener('contextmenu', contextMenuHandler);

const updateInspector = DEBUGG ? inspector(compositor) : ()=>{};

function getPianoClicks(pianoSounds: string[]) {
    const themeAudioURLs = [];
    for (let i = 0; i < pianoSounds.length; i++) {
        themeAudioURLs.push(pianoSounds[i]);
    }
    return themeAudioURLs;
}

function clickEventManager() {

    return function hanlder(ev: MouseEvent) {
        console.error('Unhandled.')
    }
}

function loadNextEventManager() {

    return function handler() {
        console.error('Unhandled.')
    }
}

let clickHandler = clickEventManager();
let loadHanlder = loadNextEventManager();

const diffHandler = {
    set init(total: number) {
        this.diffs = total;
    },
    diffs: 0
}

function initNextLevelLoading() {
    window.setTimeout(()=>window.dispatchEvent(loadNextLevel), 3000);
}

async function loadLevel(url: string) {
    animations.push(updateInspector);
    compositor.screeenA.canvas.removeEventListener('click', clickHandler);
    compositor.screeenB.canvas.removeEventListener('click', clickHandler);
    window.removeEventListener('nextlevel', loadHanlder);
    compositor.displayLoading();
    const levelConfigData = await loadJSON<Level_Config_JSON>(url);
    let backgroundMusic: GameAudio | null = new GameAudio();
    await backgroundMusic.load(levelConfigData["background-audio"].url);
    const images = await loadAllIamgeFiles(levelConfigData);
    let pinsHandler: PinsHandler | null = new PinsHandler(levelConfigData.pins);
    let audioName = 0;

    diffHandler.init = levelConfigData.totalDiffs;
    backgroundMusic.audio.loop = true;
    backgroundMusic.setVolume(levelConfigData["background-audio"].volume);
    diffIndicationPlaceHolder.innerText = diffHandler.diffs + '';

    compositor.initBuffers(images);

    for(let url of levelConfigData.animations){
        const { default: animation } = await import(`./${url}`);
        await addAnimation(animation);
    }

    clickHandler = function (ev: MouseEvent) {
        ev.preventDefault();
        
        const x = acceptRatio(compositor, ev.offsetX);
        const y = acceptRatio(compositor, ev.offsetY);
        const pins = pinsHandler!.find(x, y);

        if (pins.length === 0) {
            return;
        }

        audioName++;
        if(audioName === levelConfigData.totalDiffs){
            audioName = audioBoard.buffers.size - 1;
        }

        audioBoard.playAudio(audioName + '');
        diffHandler.diffs--;
        pinsHandler!.searchablePins = pinsHandler!.bufferPins;
        compositor.redrawSegment(pins);
        diffIndicationPlaceHolder.innerText = diffHandler.diffs + '';

        if (diffHandler.diffs === 0) {
            initNextLevelLoading();
        }
    }
    
    loadHanlder = function () {
        if (levelConfigData["next-level"]) {
            backgroundMusic!.stop();
            timer.stop();
            backgroundMusic = null;
            pinsHandler = null;
            animations.length = 0;
            loadLevel(levelConfigData["next-level"]);
        } else {
            console.warn('Next level not found.')
        }
    }


    compositor.screeenA.canvas.addEventListener('click', clickHandler);
    compositor.screeenB.canvas.addEventListener('click', clickHandler);
    window.addEventListener('nextlevel', loadHanlder);

    timer.start();
    backgroundMusic!.play();

    async function addAnimation(animation: AnimationFunction,) {
        const update = await animation(diffHandler, images, compositor, pinsHandler!);
        animations.push(update);
    }
}


startButton.value = 'Start';
startButton.addEventListener('click', () => {
    gameScreen.style.display = 'block';
    startButton.style.display = 'none';
    loadLevel('/L-1/config.json');
})

function contextMenuHandler(e:MouseEvent) {
    e.preventDefault();
}