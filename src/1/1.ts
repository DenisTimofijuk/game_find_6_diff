import { loadJSON } from "../loaders";
import GameLevel from "../GameLevel";
import { rollSpaceShipComeBackScene, rollSpaceShipScene } from "./rollSpaceShipScene";

// @ts-ignore
// import rsBase64  from 'encrypter-js';
// console.log( rsBase64.decrypt(rsBase64.encrypt("Hello World!")) )


const DEBUGGER = false;



export async function level1(){
    const configData = await loadJSON<ConfigFile>('/task-1/config.json');
    const level1 = new GameLevel<ConfigFile>(configData, 4);

    const [a, b, c, d] = await level1.loadIamgeFiles();
    level1.customHanlder = levelCustomBehaviour(level1, d, c);
    level1.drawMainScreen(a, b);
    level1.initEventListener(DEBUGGER);   
}

function levelCustomBehaviour(currentLevel:GameLevel<ConfigFile>, spaceShip:HTMLImageElement, alien:HTMLImageElement) {
    const animationMarker = {
        phase_1: true,
        phase_1_finished: true,
        phase_2: true,
        phase_2_finished: true,
    }
    const pinStep = 4;

    return function customHanlder(constinueClickHandling:()=>void){
        if(animationMarker.phase_1_finished && animationMarker.phase_2_finished){
            constinueClickHandling();
        }

        if(currentLevel.searchablePins.length / pinStep === 1 && animationMarker.phase_1){
            animationMarker.phase_1_finished = false;
            rollSpaceShipScene(currentLevel, spaceShip, ()=>animationMarker.phase_1_finished = true);
            animationMarker.phase_1 = false;
        }

        if(currentLevel.searchablePins.length / pinStep === 0 && animationMarker.phase_2){
            animationMarker.phase_2_finished = false;
            rollSpaceShipComeBackScene(currentLevel, spaceShip, alien, (r)=>{
                currentLevel.searchablePins.push(...r);
                animationMarker.phase_2_finished = true
            });   
            animationMarker.phase_2 = false;
        }
    }
}