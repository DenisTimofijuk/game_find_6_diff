import { GameAudio, loadAudioBoard } from "./AudioBoard";
import Compositor from "./Compositor";
import { exitFullScreen, isFullScreen, requestFullScreen } from "./fullscreen";
import Indicator from "./indicator";
import inspector from "./inspector";
import { loadAllIamgeFiles, loadJSON } from "./loaders";
import PinsHandler, { acceptRatio } from "./PinsHandler";
import Timer from "./Timer";

const DEBUGG = true;
const startButton = document.getElementById('start-game')! as HTMLInputElement;
const gameScreen = document.getElementById('gameScreen')!;
const fullscreenBtn = document.getElementById('enter-full-screen')!;
// @ts-ignore
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const timer = new Timer();
const compositor = new Compositor();
const indicate = new Indicator(compositor);
const themeConfigData = await loadJSON<ThemeJSON>('/theme/config.json');
const audioBoard = await loadAudioBoard(themeConfigData.piano, audioContext);
indicate.initBuffer(themeConfigData.numbers);
const animations: UpdateAnimation[] = [];
const loadNextLevel = new Event('nextlevel');

timer.update = function update(deltaTime: number) {
    compositor.draw();
    indicate.draw();
    animations.forEach(update => update(deltaTime));
};

compositor.screeenA.canvas.addEventListener('contextmenu', contextMenuHandler);
compositor.screeenB.canvas.addEventListener('contextmenu', contextMenuHandler);

const updateInspector = DEBUGG ? inspector(compositor) : ()=>{};

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
    let backgroundMusic: GameAudio[] = [];
    levelConfigData["background-audio"].forEach(async (element) => {
        const music = new GameAudio();
        backgroundMusic.push(music);
        await music.load(element.url);
        music.audio.loop = true;
        music.setVolume(element.volume);
    })
    const images = await loadAllIamgeFiles(levelConfigData.images);
    let pinsHandler: PinsHandler | null = new PinsHandler(levelConfigData.pins);
    let audioName = 0;
    
    diffHandler.init = levelConfigData.totalDiffs;

    compositor.initBuffers(images);
    indicate.setup(levelConfigData.indication);
    indicate.update(levelConfigData.totalDiffs);

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
        indicate.update(diffHandler.diffs);

        if (diffHandler.diffs === 0) {
            initNextLevelLoading();
        }
    }
    
    loadHanlder = function () {
        if (levelConfigData["next-level"]) {
            backgroundMusic.forEach(music => music.stop());
            timer.stop();
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
    backgroundMusic.forEach(music => music.play());

    async function addAnimation(animation: AnimationFunction,) {
        const update = await animation(diffHandler, images, compositor, pinsHandler!);
        animations.push(update);
    }
}


startButton.value = 'Start';
startButton.classList.remove('redButton');
startButton.classList.add('greenButton');

startButton.addEventListener('click', () => {
    gameScreen.classList.remove('hide');
    startButton.classList.add('hide');
    fullscreenBtn.classList.remove('hide');
    loadLevel('/L-8/config.json');
})

toggleFulscreen();

function contextMenuHandler(e:MouseEvent) {
    e.preventDefault();
}


function toggleFulscreen() {
    const screenElement = document.getElementById("gameScreen")! as HTMLDivElement;
    const button = document.getElementById("enter-full-screen")!;
    button.addEventListener('click', handler);

    function handler() {
        if (!isFullScreen()) {
            requestFullScreen(screenElement);
        } else {
            exitFullScreen(document);
        }
    }
}