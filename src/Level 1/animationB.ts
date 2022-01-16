export const Level1AnimationB: AnimationFunction = function (currentGame: GameBody<ConfigFile_level_1>) {
    const screen_b = currentGame.compositor.screeenB;
    const screen_a = currentGame.compositor.screeenA;
    const spaceShip = currentGame.images[3];
    const alien = currentGame.images[2];
    const ship = {
        x: screen_b.canvas.width,
        y: -10,
        velocity: 15,
        drag: 0.5
    }
    let animationEnabled = false;
    let animationFinished = false;

    const drawAlien = dropAlien(currentGame, alien, 350, 200);

    function runAnimation(deltatime:number){
        if (!animationEnabled) {
            return;
        }
        if (animationFinished) {
            return;
        };

        let x = 0;
        let y = 0;
        ship.velocity -= ship.drag;
        ship.x -= (ship.velocity + 3);
        ship.y += (ship.velocity + 1);
        let newCoordinates:number[] = []
        
        if (ship.velocity < 0) {
            newCoordinates = placeRock(currentGame);
            [x, y] = drawAlien();
            currentGame.searchablePins.push(...newCoordinates);
        }

        screen_b.ctx?.drawImage(spaceShip, ship.x, ship.y);
        screen_a.ctx?.drawImage(spaceShip, ship.x, ship.y);

        if (ship.x <= screen_b.canvas.width + spaceShip.width && ship.y >= -spaceShip.height) {
            
        }else{
            animationFinished = true;
            saveAlien(currentGame, alien, x, y);
        }
    }

    return function update(currentGame: GameBody<ConfigFile_level_1>, deltaTime: number) {
        if (currentGame.diffCount === 1) {
            animationEnabled = true;
        }
        runAnimation(deltaTime);
    }
}

function saveAlien(currentLevel: GameBody<ConfigFile_level_1>, alienImg: HTMLImageElement, x: number, y: number) {
    const screen_b = currentLevel.compositor.screeenB;
    const screen_a = currentLevel.compositor.screeenA;

    screen_b.bufferCtx?.drawImage(alienImg, x, y);
    screen_a.bufferCtx?.drawImage(alienImg, x, y);
}

function dropAlien(currentLevel: GameBody<ConfigFile_level_1>, alienImg: HTMLImageElement, dropPosX: number, dropPosY: number) {
    const screen_b = currentLevel.compositor.screeenB;
    const screen_a = currentLevel.compositor.screeenA;

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

        screen_b.ctx?.drawImage(alienImg, alien.x, alien.y);
        screen_a.ctx?.drawImage(alienImg, alien.x, alien.y);

        return [alien.x, alien.y];
    }
}

function placeRock(currentLevel: GameBody<ConfigFile_level_1>) {
    const screen_b = currentLevel.compositor.screeenB
    const rock = {
        x: 229,
        y: 341,
        w: 26,
        h: 16
    };

    screen_b.bufferCtx?.drawImage(screen_b.canvas, rock.x, rock.y, rock.w, rock.h, 400, 280, rock.w, rock.h);

    return [400, 280, rock.w, rock.h];
}