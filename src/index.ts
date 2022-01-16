import Game from "./Game";
import {Level1AnimationA} from "./Level 1/animationA";
import { Level1AnimationB } from "./Level 1/animationB";
import { loadJSON } from "./loaders";
import Timer from "./Timer";


async function initLevel<T extends JSON_object>(url:string) {
    const timer = new Timer();
    

    const configData = await loadJSON<T>(url);
    const currentLevel = new Game<T>(configData);
    currentLevel.displayDiffCount();
    await currentLevel.loadIamgeFiles();
    currentLevel.initScreens();
    currentLevel.initEventListeners();
    
    timer.update = function update(deltaTime: number) {
        currentLevel.update(deltaTime);
    };
    timer.start();

    return function addCustomAnimation(animation: AnimationFunction){
        currentLevel.addAnimation(animation);
    }
}


const addCustomAnimation = await initLevel<ConfigFile_level_1>('./task-1/config.json');
addCustomAnimation(Level1AnimationA);
addCustomAnimation(Level1AnimationB);
