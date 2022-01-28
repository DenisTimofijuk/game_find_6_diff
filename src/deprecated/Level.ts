export {}
// import { GameAudio, loadAudioBoard } from "../AudioBoard";
// import Game from "./Game";
// import { loadJSON, loadAllIamgeFiles } from "../loaders";
// import Timer from "../Timer";

// export async function initLevel<T extends Level_Config_JSON>(url:string) {
//     const startButton = document.getElementById('start-game')! as HTMLInputElement;
//     const gameScreen = document.getElementById('gameScreen')!;

//     const timer = new Timer();
//     const audioContext = new AudioContext();
//     const themeConfigData = await loadJSON<ThemeJSON>('/theme/config.json');
//     const levelConfigData = await loadJSON<T>(url);
//     const backgroundMusic = new GameAudio(levelConfigData["background-audio"]);
//     const audioBoard = await loadAudioBoard(getPianoClicks(themeConfigData.piano, levelConfigData.totalDiffs), audioContext);
//     const images = await loadAllIamgeFiles(levelConfigData);    
//     backgroundMusic.audio.loop = true;
//     const currentLevel = new Game<T>(levelConfigData, audioBoard);
//     currentLevel.displayDiffCount();
//     currentLevel.setImages(images);
//     currentLevel.initScreens();
//     currentLevel.initEventListeners();
    
//     timer.update = function update(deltaTime: number) {
//         currentLevel.update(deltaTime);
//     };
    
//     startButton.value = 'Start';
//     startButton.addEventListener('click', ()=>{
//         gameScreen.style.display = 'block';
//         startButton.style.display = 'none';
//         timer.start();
//         backgroundMusic.play();
//     })

//     return function addCustomAnimation(animation: AnimationFunction){
//         currentLevel.addAnimation(animation);
//     }
// }

// function getPianoClicks(pianoSounds:string[], totalDiffs:number) {
//     const themeAudioURLs = [];
//     for(let i = 0; i<totalDiffs; i++){
//         if(i === totalDiffs-1){
//             themeAudioURLs.push(pianoSounds[pianoSounds.length-1]);
//         }else{
//             themeAudioURLs.push(pianoSounds[i]);
//         }        
//     }
//     return themeAudioURLs;
// }

