import { GameAudio, loadAudioBoard } from "./AudioBoard";
import Compositor from "./Compositor";
import { loadAllIamgeFiles, loadJSON } from "./loaders";
import PinsHandler from "./PinsHandler";
import Timer from "./Timer";


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
    compositor.update();
    animations.forEach(update => update(deltaTime))
};


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


async function loadLevel(url: string) {
    const levelConfigData = await loadJSON<Level_Config_JSON>(url);
    let backgroundMusic: GameAudio | null = new GameAudio(levelConfigData["background-audio"]);
    backgroundMusic.audio.loop = true;
    const images = await loadAllIamgeFiles(levelConfigData);
    compositor.drawScreens(images);
    compositor.saveAllBuffers();
    let pinsHandler: PinsHandler | null = new PinsHandler(levelConfigData.pins);
    diffHandler.init = levelConfigData.totalDiffs;

    diffIndicationPlaceHolder.innerText = diffHandler.diffs + '';

    function addAnimation(animation: AnimationFunction,) {
        const update = animation(diffHandler, images, compositor, pinsHandler!);
        animations.push(update);
    }

    levelConfigData.animations.forEach(async url => {
        const { default: animation } = await import(`./${url}`);
        addAnimation(animation);
    })

    compositor.screeenA.canvas.removeEventListener('click', clickHandler);
    compositor.screeenB.canvas.removeEventListener('click', clickHandler);
    clickHandler = function (ev: MouseEvent) {
        ev.preventDefault();
        const pins = pinsHandler!.find(ev.offsetX, ev.offsetY);
        if (pins.length === 0) {
            return;
        }
        const audioName = audioBoard.buffers.size - diffHandler.diffs;
        audioBoard.playAudio(audioName + '');
        diffHandler.diffs--;
        pinsHandler!.searchablePins = pinsHandler!.bufferPins;
        compositor.redrawSegment(pins);
        diffIndicationPlaceHolder.innerText = diffHandler.diffs + '';

        if (diffHandler.diffs <= 3) {
            window.dispatchEvent(loadNextLevel);
        }
    }
    compositor.screeenA.canvas.addEventListener('click', clickHandler);
    compositor.screeenB.canvas.addEventListener('click', clickHandler);

    timer.start();
    backgroundMusic!.play();

    window.removeEventListener('nextlevel', loadHanlder);
    loadHanlder = function () {
        console.log('nextlevel');

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
    window.addEventListener('nextlevel', loadHanlder);
}


startButton.value = 'Start';
startButton.addEventListener('click', () => {
    gameScreen.style.display = 'block';
    startButton.style.display = 'none';
    loadLevel('/L-1/config.json');
})

document.getElementById('load-next')?.addEventListener('click', function handler() { loadLevel('/L-1/config.json') });