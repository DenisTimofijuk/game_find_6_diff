import type Compositor from "./Compositor";

const CLICKS_LIMIT = 3;
const DELTA_TIME = 1000;
const BLUR_LIMIT = 20;
const VELOCITY = 0.1;

export default class Penelty {
    private flag: boolean;
    private previousTime: number;
    private counter: number;
    blurAmount: number;
    velocity: number;
    constructor(private compositor: Compositor) {
        this.flag = false;
        this.previousTime = new Date().getTime();
        this.counter = 0;
        this.blurAmount = 0;
        this.velocity = VELOCITY;
    }

    update(){
        this.flag && this.animate();
    }

    animate(){        
        this.blurAmount += this.velocity;

        if(this.blurAmount > BLUR_LIMIT){
            this.velocity *= -1;
            this.blurAmount = BLUR_LIMIT;
        };

        if(this.blurAmount < 0){
            this.blurAmount = 0;
            this.velocity *= -1;
            this.flag = false;
        }

        const pixels = Math.floor(this.blurAmount);
        this.compositor.screeenA.ctx.filter = `blur(${pixels}px)`;
        this.compositor.screeenB.ctx.filter = `blur(${pixels}px)`;
    }

    trigger(){
        const time = new Date().getTime();
        if(time - this.previousTime <= DELTA_TIME){
            this.counter++;
        }else{
            this.counter = 0;
        }

        this.previousTime = time;
        if(this.counter >= CLICKS_LIMIT){
            this.flag = true;
            this.counter = 0;
        }
    }
}