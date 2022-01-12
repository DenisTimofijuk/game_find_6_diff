import { loadJSON } from "../loaders";
import GameLevel from "../GameLevel";
import { rollSpaceShipScene } from "./rollSpaceShipScene";

// @ts-ignore
// import rsBase64  from 'encrypter-js';
// console.log( rsBase64.decrypt(rsBase64.encrypt("Hello World!")) )


const DEBUGGER = false;



export async function level1(){
    const configData = await loadJSON<ConfigFile>('/task-1/config.json');
    const level1 = new GameLevel<ConfigFile>(configData);

    const [a, b, c, d] = await level1.loadIamgeFiles();
    level1.customHanlder = levelCustomBehaviour(level1, d, c);
    level1.drawMainScreen(a, b);
    level1.initEventListener(DEBUGGER);   
}

function levelCustomBehaviour(currentLevel:GameLevel<ConfigFile>, spaceShip:HTMLImageElement, alien:HTMLImageElement) {
    let hasAnimationInitiated = false;

    return function customHanlder(){
        if(currentLevel.searchablePins.length === 0 && !hasAnimationInitiated){
            rollSpaceShipScene(currentLevel, spaceShip);
            hasAnimationInitiated = true;
        }
    }
}