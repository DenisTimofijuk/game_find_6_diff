import { GameAudio } from "../AudioBoard";

export const Level1AnimationA: AnimationFunction = function (currentGame: GameBody<JSON_object>) {
    const maxHeight = 30;
    const period = 50;
    const amplifier = 20;
    const step = 300;
    let shipPos_Y = 0;
    let animationEnabled = false;
    let animationFinished = false;
    const spaceShip = currentGame.images[3];
    let shipPos_X = -spaceShip.width;
    const screen_a = currentGame.compositor.screeenA;
    const screen_b = currentGame.compositor.screeenB;
    const myAudio = new GameAudio('/task-1/audio/ufo1.mp3'); 
    myAudio.audio.volume = 0.1;

    function flyship(deltaTime: number) {
        if (!animationEnabled) {
            return;
        }
        if (animationFinished) {            
            myAudio.fadeOut();
            return;
        };

        const incrementer = step * deltaTime;
        shipPos_X += incrementer;
        shipPos_Y = Math.round(Math.sin(shipPos_X / period) * amplifier) + maxHeight;
        if (shipPos_X <= screen_a.canvas.width + incrementer) {
            screen_a.ctx?.drawImage(spaceShip, Math.round(shipPos_X), Math.round(shipPos_Y));
        }

        if (shipPos_X >= screen_a.canvas.width - spaceShip.width && shipPos_X - screen_b.canvas.width <= screen_b.canvas.width + incrementer) {
            const x = shipPos_X - screen_b.canvas.width;
            screen_b.ctx?.drawImage(spaceShip, Math.round(x), Math.round(shipPos_Y));
        }

        if (shipPos_X - screen_b.canvas.width > screen_b.canvas.width) {
            animationFinished = true;
        }
     
        if (myAudio.audio.paused) {
            myAudio.play();
        }

        if(260 < Math.round(shipPos_X) && Math.round(shipPos_X) < 265 ){
            currentGame.searchablePins.push(...placeItem(currentGame));
        }
    }

    return function update(currentGame: GameBody<JSON_object>, deltaTime: number) {
        if (currentGame.diffCount === 3) {
            animationEnabled = true;
        }
        flyship(deltaTime);
    }
}

function placeItem(currentLevel: GameBody<ConfigFile_level_1>) {
    const screen_a = currentLevel.compositor.screeenA
    const star = {
        x: 400,
        y: 60,
        w: 50,
        h: 50
    };

    const x = star.x + star.w/2;
    const y = star.y + star.h/2;
    const r = star.w/25;

    screen_a.bufferCtx!.beginPath();
    screen_a.bufferCtx!.fillStyle = '#4e4e4e';
    screen_a.bufferCtx!.arc(x, y, r, 0, 2*Math.PI);
    screen_a.bufferCtx!.fill();
    screen_a.bufferCtx!.closePath();

    return [star.x, star.y, star.w, star.h];
}