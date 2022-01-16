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

    function flyship(deltaTime: number) {
        if (!animationEnabled) {
            return;
        }
        if (animationFinished) {
            return;
        };

        const incrementer = step * deltaTime;
        shipPos_X += incrementer;
        shipPos_Y = Math.round(Math.sin(shipPos_X / period) * amplifier) + maxHeight;
        if (shipPos_X <= screen_a.canvas.width + incrementer) {
            screen_a.ctx?.drawImage(spaceShip, shipPos_X, shipPos_Y);
        }

        if (shipPos_X >= screen_a.canvas.width - spaceShip.width && shipPos_X - screen_b.canvas.width <= screen_b.canvas.width + incrementer) {
            const x = shipPos_X - screen_b.canvas.width;
            screen_b.ctx?.drawImage(spaceShip, x, shipPos_Y);
        }

        if (shipPos_X - screen_b.canvas.width > screen_b.canvas.width) {
            animationFinished = true;
        }
    }

    return function update(currentGame: GameBody<JSON_object>, deltaTime: number) {
        if (currentGame.diffCount === 3) {
            animationEnabled = true;
        }
        flyship(deltaTime);
    }
}

