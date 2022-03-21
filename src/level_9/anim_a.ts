import Layer from "../Layer";

export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;

    const pos_a = {
        s_x: -400,
        s_y: 45,
        x: -400,
        y: 45,
        vel_x: 10,
        vel_y: 1
    };
    const pos_b = {
        s_x: -300,
        s_y: 45,
        x: -300,
        y: 45,
        vel_x: 10,
        vel_y: 1.3
    };
    const pos_c = {
        s_x: -600,
        s_y: 80,
        x: -600,
        y: 80,
        vel_x: 7.5,
        vel_y: 1
    }

    return function update(deltaTime: number) {
        anim_a();
        anim_b();
        anim_c();
    }

    function anim_a() {
        pos_a.x += pos_a.vel_x;
        pos_a.y -= pos_a.vel_y;
        if(pos_a.x > w) {
            pos_a.x = pos_a.s_x;
            pos_a.y = pos_a.s_y;
        }

        compositor.screeenA.ctx.drawImage(images[2], pos_a.x, pos_a.y);
        compositor.screeenB.ctx.drawImage(images[2], pos_a.x, pos_a.y);
    }

    function anim_b() {
        pos_b.x += pos_b.vel_x;
        pos_b.y -= pos_b.vel_y;
        if(pos_b.x > w) {
            pos_b.x = pos_b.s_x;
            pos_b.y = pos_b.s_y;
        }

        compositor.screeenA.ctx.drawImage(images[3], pos_b.x, pos_b.y);
        compositor.screeenB.ctx.drawImage(images[3], pos_b.x, pos_b.y);
    }

    function anim_c() {
        pos_c.x += pos_c.vel_x;
        pos_c.y -= pos_c.vel_y;
        if(pos_c.x > w) {
            pos_c.x = pos_c.s_x;
            pos_c.y = pos_c.s_y;
        }

        compositor.screeenA.ctx.drawImage(images[4], pos_c.x, pos_c.y);
        compositor.screeenB.ctx.drawImage(images[4], pos_c.x, pos_c.y);
    }
};