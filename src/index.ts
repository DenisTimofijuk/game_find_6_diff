import { GameAudio, loadAudioBoard } from "./AudioBoard";
import Compositor from "./Compositor";
import { exitFullScreen, isFullScreen, requestFullScreen } from "./fullscreen";
import UserHelper from "./userHelper";
import TotalIndicator from "./indicator";
import inspector from "./inspector";
import { loadAllIamgeFiles, loadJSON } from "./loaders";
import PinsHandler, { acceptRatio } from "./PinsHandler";
import Timer from "./Timer";

const DEBUGG = false;
const startButton = document.getElementById('start-game')! as HTMLInputElement;
const gameScreen = document.getElementById('gameScreen')!;
const fullscreenBtn = document.getElementById('enter-full-screen')!;
// @ts-ignore
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const timer = new Timer();
const compositor = new Compositor();
const indicateTotal = new TotalIndicator(compositor);
const helpUser = new UserHelper(compositor);
const themeConfigData = await loadJSON<ThemeJSON>('/theme/config.json');
const audioBoard = await loadAudioBoard(themeConfigData.piano, audioContext);
indicateTotal.initBuffer(themeConfigData.numbers);
const animations: UpdateAnimation[] = [];
const loadNextLevel = new Event('nextlevel');

timer.update = function update(deltaTime: number) {
    compositor.draw();
    indicateTotal.draw();
    animations.forEach(update => update(deltaTime));
    helpUser.update();
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

function updateDiffIndicator() {
    
    return function handler() {
        console.error('Unhandled.')
    }
}

let clickHandler = clickEventManager();
let loadHanlder = loadNextEventManager();
let updatediffIndi = updateDiffIndicator();

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
    window.removeEventListener('updatediffIndi', updatediffIndi);
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
    let pinsHandler: PinsHandler = new PinsHandler(levelConfigData.pins);
    let audioName = 0;
    
    diffHandler.init = levelConfigData.totalDiffs;

    compositor.initBuffers(images);
    indicateTotal.setup(levelConfigData.indication);
    indicateTotal.update(levelConfigData.totalDiffs);

    for(let url of levelConfigData.animations){
        const { default: animation } = await import(`./${url}`);
        await addAnimation(animation);
    }

    clickHandler = function (ev: MouseEvent) {
        ev.preventDefault();
        
        const x = acceptRatio(compositor, ev.offsetX);
        const y = acceptRatio(compositor, ev.offsetY);
        const pins = pinsHandler.find(x, y);

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
        indicateTotal.update(diffHandler.diffs);
        helpUser.set(pinsHandler!.getPins(0));

        if (diffHandler.diffs === 0) {
            initNextLevelLoading();
        }
    }
    
    loadHanlder = function () {
        if (levelConfigData["next-level"]) {
            backgroundMusic.forEach(music => music.stop());
            timer.stop();
            // @ts-ignore
            pinsHandler = null;
            animations.length = 0;
            loadLevel(levelConfigData["next-level"]);
        } else {
            console.warn('Next level not found.')
        }
    }

    updatediffIndi = function(){
        helpUser.set(pinsHandler!.getPins(0));    
    }

    helpUser.set(pinsHandler!.getPins(0));
    compositor.screeenA.canvas.addEventListener('click', clickHandler);
    compositor.screeenB.canvas.addEventListener('click', clickHandler);
    window.addEventListener('nextlevel', loadHanlder);
    window.addEventListener('updatediffIndi', updatediffIndi);

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
    loadLevel('/L-1/config.json');
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

// TODO: effect indentifikuot kai randamas elementas