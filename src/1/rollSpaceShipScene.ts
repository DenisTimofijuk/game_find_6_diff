import type GameLevel from "src/GameLevel";

export function rollSpaceShipScene(currentLevel: GameLevel<ConfigFile>, spaceShip: HTMLImageElement, callback: () => void) {
    const maxHeight = 30;
    const period = 50;
    const amplifier = 20;
    const step = 15;
    const deltaTime = 70;
    let shipPos_X = -spaceShip.width;
    let shipPos_Y = 0;

    const screen_a = currentLevel.compositor.screen_a;
    const screen_b = currentLevel.compositor.screen_b;
    animation();
    function animation() {
        shipPos_X += step;
        shipPos_Y = Math.round(Math.sin(shipPos_X / period) * amplifier) + maxHeight;
        if (shipPos_X <= screen_a.canvas.width + step) {
            screen_a.clear();
            screen_a.drawBuffer();
            screen_a.context?.drawImage(spaceShip, shipPos_X, shipPos_Y);
        }

        if (shipPos_X >= screen_a.canvas.width - spaceShip.width && shipPos_X - screen_b.canvas.width <= screen_b.canvas.width + step) {
            const x = shipPos_X - screen_b.canvas.width;
            screen_b.clear();
            screen_b.drawBuffer();
            screen_b.context?.drawImage(spaceShip, x, shipPos_Y);
        }

        if (shipPos_X - screen_b.canvas.width > screen_b.canvas.width) {
            callback()
        } else {
            setTimeout(animation, deltaTime);
        }
    }
}


export function rollSpaceShipComeBackScene(currentLevel: GameLevel<ConfigFile>, spaceShip: HTMLImageElement, alien: HTMLImageElement, callback: (r:number[]) => void) {
    const screen_b = currentLevel.compositor.screen_b;
    const screen_a = currentLevel.compositor.screen_a;
    const ship = {
        x: screen_b.canvas.width,
        y: -10,
        velocity: 15,
        drag: 0.5
    }
    const deltaTime = 70;

    const drawAlien = dropAlien(currentLevel, alien, 350, 200);

    animation();
    function animation() {
        ship.velocity -= ship.drag;
        ship.x -= ship.velocity + 3;
        ship.y += ship.velocity + 1;

        screen_b.clear();
        screen_b.drawBuffer();
        screen_a.clear();
        screen_a.drawBuffer();
        let newCoordinates:number[] = []
        
        if (ship.velocity < 0) {
            newCoordinates = placeRock(currentLevel);
            drawAlien();
        }

        screen_b.context?.drawImage(spaceShip, ship.x, ship.y);
        screen_a.context?.drawImage(spaceShip, ship.x, ship.y);

        if (ship.x <= screen_b.canvas.width + spaceShip.width && ship.y >= -spaceShip.height) {
            setTimeout(animation, deltaTime);
        } else {
            callback(newCoordinates);
        }
    }
}

function dropAlien(currentLevel: GameLevel<ConfigFile>, alienImg: HTMLImageElement, dropPosX: number, dropPosY: number) {
    const screen_b = currentLevel.compositor.screen_b;
    const screen_a = currentLevel.compositor.screen_a;

    const alien = {
        x: dropPosX,
        y: dropPosY,
        velocity: -1.5,
        acceleration: 0.1
    };

    return function draw() {
        alien.velocity += alien.acceleration;
        alien.x -= alien.velocity;
        alien.y += alien.velocity;

        screen_b.context?.drawImage(alienImg, alien.x, alien.y);
        screen_a.context?.drawImage(alienImg, alien.x, alien.y);
    }
}

function placeRock(currentLevel: GameLevel<ConfigFile>) {
    const screen_b = currentLevel.compositor.screen_b;
    const rock = {
        x: 229,
        y: 341,
        w: 26,
        h: 16
    };

    screen_b.context?.drawImage(screen_b.canvas, rock.x, rock.y, rock.w, rock.h, 400, 280, rock.w, rock.h);

    return [400, 280, rock.w, rock.h];
}