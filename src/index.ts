import { loadAudioBoard } from "./AudioBoard";
import Game from "./Game";
import {Level1AnimationA} from "./Level 1/animationA";
import { Level1AnimationB } from "./Level 1/animationB";
import { loadAllIamgeFiles, loadJSON } from "./loaders";
import Timer from "./Timer";


async function initLevel<T extends JSON_object>(url:string) {
    const timer = new Timer();
    const audioContext = new AudioContext();
    const themeConfigData = await loadJSON<ThemeJSON>('/theme/config.json');
    const levelConfigData = await loadJSON<T>(url);
    const images = await loadAllIamgeFiles(levelConfigData);
    const audioBoard = await loadAudioBoard(getPianoClicks(themeConfigData.piano, levelConfigData.totalDiffs), audioContext);
    const backgroundMusic = new Audio(levelConfigData["background-audio"]);
    backgroundMusic.loop = true;
    backgroundMusic.currentTime = 0;
    const currentLevel = new Game<T>(levelConfigData, audioBoard);
    currentLevel.displayDiffCount();
    currentLevel.setImages(images);
    currentLevel.initScreens();
    currentLevel.initEventListeners();
    
    timer.update = function update(deltaTime: number) {
        currentLevel.update(deltaTime);
    };
    timer.start();
    backgroundMusic.play();

    return function addCustomAnimation(animation: AnimationFunction){
        currentLevel.addAnimation(animation);
    }
}


const addCustomAnimation = await initLevel<ConfigFile_level_1>('./task-1/config.json');
addCustomAnimation(Level1AnimationA);
addCustomAnimation(Level1AnimationB);

function getPianoClicks(pianoSounds:string[], totalDiffs:number) {
    const themeAudioURLs = [];
    for(let i = 0; i<totalDiffs; i++){
        if(i === totalDiffs-1){
            themeAudioURLs.push(pianoSounds[pianoSounds.length-1]);
        }else{
            themeAudioURLs.push(pianoSounds[i]);
        }        
    }
    return themeAudioURLs;
}