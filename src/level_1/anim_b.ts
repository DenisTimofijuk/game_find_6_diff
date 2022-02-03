import { GameAudio } from "../AudioBoard";

export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {

    const screen_b = compositor.screeenB;
    const screen_a = compositor.screeenA;
    const spaceShip = images[3];
    const alien = images[2];
    const ship = {
        x: screen_b.canvas.width,
        y: -10,
        vel: 3.4,
        drag: 0.05
    }
    let animationEnabled = false;
    let animationFinished = false;
    let rockPlaced = false;
    const myAudio = new GameAudio('/L-1/audio/ufo3.mp3');
    myAudio.audio.volume = 0.2

    const drawAlien = dropAlien(compositor, alien, 350, 200);

    function runAnimation(deltatime: number) {
        if (!animationEnabled) {
            return;
        }
        if (animationFinished) {
            myAudio.fadeOut();
            return;
        };

        if (myAudio.audio.paused) {
            myAudio.play()
        }

        let x = 0;
        let y = 0;
        ship.vel -= ship.drag;
        ship.x -= (ship.vel + 2.0);
        ship.y += (ship.vel + 1.6);
        let newCoordinates: number[] = []

        if (ship.vel < 0) {
            if (!rockPlaced) {
                newCoordinates = placeRock(compositor);
                pinsHandler.searchablePins.push(...newCoordinates);
                rockPlaced = true;
            }

            [x, y] = drawAlien();
        }

        screen_b.ctx?.drawImage(spaceShip, Math.round(ship.x), Math.round(ship.y));
        screen_a.ctx?.drawImage(spaceShip, Math.round(ship.x), Math.round(ship.y));

        if (ship.x <= screen_b.canvas.width + spaceShip.width && ship.y >= -spaceShip.height) {

        } else {
            animationFinished = true;
            saveAlien(compositor, alien, x, y);
        }
    }


    return function update(deltaTime: number) {
        if (levelData.diffs === 1) {
            animationEnabled = true;
        }
        runAnimation(deltaTime);
    }
}


function saveAlien(compositor: GameCompositor, alienImg: HTMLImageElement, x: number, y: number) {
    const screen_b = compositor.screeenB;
    const screen_a = compositor.screeenA;

    screen_b.bufferCtx?.drawImage(alienImg, Math.round(x), Math.round(y));
    screen_a.bufferCtx?.drawImage(alienImg, Math.round(x), Math.round(y));
}

function dropAlien(compositor: GameCompositor, alienImg: HTMLImageElement, dropPosX: number, dropPosY: number) {
    const screen_b = compositor.screeenB;
    const screen_a = compositor.screeenA;

    const alien = {
        x: dropPosX,
        y: dropPosY,
        velocity: -0.4,
        acceleration: 0.01
    };

    return function draw() {
        alien.velocity += alien.acceleration;
        alien.x -= alien.velocity + 0.1;
        alien.y += alien.velocity;

        screen_b.ctx?.drawImage(alienImg, Math.round(alien.x), Math.round(alien.y));
        screen_a.ctx?.drawImage(alienImg, Math.round(alien.x), Math.round(alien.y));

        return [alien.x, alien.y];
    }
}

function placeRock(compositor: GameCompositor) {
    const screen_b = compositor.screeenB
    const rock = {
        x: 229,
        y: 341,
        w: 26,
        h: 16
    };

    const newPos = {
        x: 425,
        y: 280
    }

    screen_b.bufferCtx?.drawImage(screen_b.canvas, rock.x, rock.y, rock.w, rock.h, newPos.x, newPos.y, rock.w, rock.h);

    return [newPos.x, newPos.y, rock.w, rock.h];
}