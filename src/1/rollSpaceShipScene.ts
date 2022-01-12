import type GameLevel from "src/GameLevel";

export function rollSpaceShipScene(currentLevel: GameLevel<ConfigFile>, spaceShip: HTMLImageElement) {
    const maxHeight = 30;
    const period = 50;
    const amplifier = 20;
    const step = 10;
    const deltaTime = 80;
    let shipPos_X = -spaceShip.width;
    let shipPos_Y = 0;

    const screen_a = currentLevel.compositor.screen_a;
    const screen_b = currentLevel.compositor.screen_b;
    animation();
    function animation() {
        shipPos_X += step;
        shipPos_Y = Math.round(Math.sin(shipPos_X / period) * amplifier) + maxHeight;
        if (shipPos_X <= screen_a.canvas.width+step) {
            screen_a.clear();
            screen_a.drawBuffer();
            screen_a.context?.drawImage(spaceShip, shipPos_X, shipPos_Y);
        }

        if (shipPos_X >= screen_a.canvas.width - spaceShip.width && shipPos_X - screen_b.canvas.width <= screen_b.canvas.width+step) {
            const x = shipPos_X - screen_b.canvas.width;
            screen_b.clear();
            screen_b.drawBuffer();
            screen_b.context?.drawImage(spaceShip, x, shipPos_Y);
        } 

        if (shipPos_X - screen_b.canvas.width > screen_b.canvas.width) {
            return;
        }
        setTimeout(animation, deltaTime);
    }
}