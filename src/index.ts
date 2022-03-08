import "../public/index.css";
import "../public/checkbox.css";

import { GameAudio, loadAudioBoard } from "./AudioBoard";
import Compositor from "./Compositor";
import { exitFullScreen, isFullScreen, requestFullScreen } from "./fullscreen";
import UserHelper from "./userHelper";
import TotalIndicator from "./indicator";
import inspector from "./inspector";
import { loadAllIamgeFiles, loadJSON } from "./loaders";
import PinsHandler, { acceptRatio } from "./PinsHandler";
import Timer from "./Timer";
import Vortex from "./Vortex";
import Penelty from "./penelty";

const DEBUGG = true;
const difficulty = document.getElementById('difficulty') as HTMLSelectElement;
const bgmusicInput = document.getElementById('bg-music-enabled') as HTMLInputElement;
let difficultyKey: DifficultyName;
// @ts-ignore
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const timer = new Timer();
const compositor = new Compositor();
const penelty = new Penelty(compositor);
const helpUser = new UserHelper(compositor);
const indicateTotal = new TotalIndicator(compositor);
const themeConfigData = await loadJSON<ThemeJSON>('/theme/config.json');
const audioBoard = await loadAudioBoard(themeConfigData.piano, audioContext);
const vortex = new Vortex(compositor);
await indicateTotal.initBuffer(themeConfigData.numbers);
await vortex.initBuffer(themeConfigData.vortex);
const animations: UpdateAnimation[] = [];
const loadNextLevel = new Event('nextlevel');
let currentProgress = 0;

timer.update = function update(deltaTime: number) {
    penelty.update();
    compositor.draw();
    indicateTotal.draw();
    animations.forEach(update => update(deltaTime));
    helpUser.update();
    vortex.update();
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
    window.setTimeout(()=>window.dispatchEvent(loadNextLevel), 2000);
}

async function loadLevel(url: string) {
    currentProgress++;
    animations.push(updateInspector);
    compositor.screeenA.canvas.removeEventListener('click', clickHandler);
    compositor.screeenB.canvas.removeEventListener('click', clickHandler);
    window.removeEventListener('nextlevel', loadHanlder);
    window.removeEventListener('updatediffIndi', updatediffIndi);
    compositor.displayLoading();
    const levelConfigData = await loadJSON<Level_Config_JSON>(url);
    let backgroundMusic: GameAudio[] = [];
    if(bgmusicInput.checked){
        levelConfigData["background-audio"].forEach(async (element) => {
            const music = new GameAudio();
            backgroundMusic.push(music);
            await music.load(element.url);
            music.audio.loop = true;
            music.setVolume(element.volume);
        })
    }    
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
        
        if(penelty.active){
            return;
        }

        const x = acceptRatio(compositor, ev.offsetX);
        const y = acceptRatio(compositor, ev.offsetY);
        const pins = pinsHandler.find(x, y);

        if (pins.length === 0) {
            penelty.trigger();
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
        vortex.set(pins);
        helpUser.set(pinsHandler!.getPins(0));
        
        if (diffHandler.diffs === 0) {
            helpUser.hide();
            initNextLevelLoading();
        }
    }
    
    loadHanlder = function () {
        if (themeConfigData.difficulty[difficultyKey].levels[currentProgress]) {
            backgroundMusic.forEach(music => music.stop());
            timer.stop();
            // @ts-ignore
            pinsHandler = null;
            animations.length = 0;
            loadLevel(themeConfigData.difficulty[difficultyKey].levels[currentProgress]);
        } else {
            console.log('Resetting game.')
            currentProgress = 0;
            loadHanlder();
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

    penelty.reset();
    document.getElementById('level-name')!.innerHTML = levelConfigData.name;
    document.getElementById('players-progress')!.innerHTML = `${currentProgress} / ${themeConfigData.difficulty[difficultyKey].levels.length}`
    timer.start();
    backgroundMusic.forEach(music => music.play());

    async function addAnimation(animation: AnimationFunction,) {
        const update = await animation(diffHandler, images, compositor, pinsHandler!);
        animations.push(update);
    }
}

const startButton = document.getElementById('start-game')! as HTMLInputElement;
startButton.value = 'Start';
startButton.classList.remove('redButton');
startButton.classList.add('greenButton');

startButton.addEventListener('click', () => {
    document.getElementById('gameScreen')!.classList.remove('hide');
    document.getElementById('level-info')!.classList.remove('hide');
    document.getElementById('enter-full-screen')!.classList.remove('hide');
    document.getElementById('settings-screen')!.classList.add('hide');

    difficultyKey = difficulty.value as DifficultyName;
    helpUser.setDellay(themeConfigData.difficulty[difficultyKey]["help-time-to-wait"]);
    loadLevel(themeConfigData.difficulty[difficultyKey].levels[currentProgress]);
})

toggleFulscreen();

function contextMenuHandler(e:MouseEvent) {
    e.preventDefault();
}


function toggleFulscreen() {
    const screenElement = document.getElementById("game-screen-wrapper")! as HTMLDivElement; //gameScreen
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

handleDisclamer();
function handleDisclamer() {
    const element = document.querySelector('div.disclaimer');
    if(!element) return;
    const heigtht = element!.clientHeight;
    const footer = document.getElementsByTagName('footer')[0];
    footer.style.marginBottom = (10 + heigtht) + 'px';
}