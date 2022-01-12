import { loadJSON } from "../loaders";
import GameLevel from "../GameLevel";

// @ts-ignore
// import rsBase64  from 'encrypter-js';
// console.log( rsBase64.decrypt(rsBase64.encrypt("Hello World!")) )


const DEBUGGER = false;

interface ConfigFile extends JSON_object {
    "images": {
        "image-alien": string;
        "image-ship": string;
    }
}

export async function level1(){
    const configData = await loadJSON<ConfigFile>('/task-1/config.json');
    const level1 = new GameLevel<ConfigFile>(configData);

    const [a, b, c, d] = await level1.loadIamgeFiles();
    level1.drawMainScreen(a, b);
    level1.initEventListener(DEBUGGER);
    
}