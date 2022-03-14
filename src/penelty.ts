import type Compositor from "./Compositor";

const CLICKS_LIMIT = 2;
const DELTA_TIME = 1000;
const BLUR_LIMIT = 15;
const VELOCITY = 0.2;

export default class Penelty {
    active: boolean;
    private previousTime: number;
    private counter: number;
    blurAmount: number;
    velocity: number;
    constructor(private compositor: Compositor) {
        this.active = false;
        this.previousTime = new Date().getTime();
        this.counter = 0;
        this.blurAmount = 0;
        this.velocity = VELOCITY;
    }

    update(){
        this.active && this.animate();
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
            this.active = false;
        }

        const blurPixels = Math.floor(this.blurAmount);
        const opacity = 1 - blurPixels*2/100;

        this.compositor.screeenA.ctx.filter = `blur(${blurPixels}px) grayscale(${blurPixels}) opacity(${opacity})`;
        this.compositor.screeenB.ctx.filter = `blur(${blurPixels}px) grayscale(${blurPixels}) opacity(${opacity})`;
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
            this.active = true;
            this.counter = 0;
        }
    }

    reset(){
        this.active = false;
        this.blurAmount = 0;
        this.counter = 0;
        this.previousTime = new Date().getTime();
        this.compositor.screeenA.ctx.filter = 'none';
        this.compositor.screeenB.ctx.filter = 'none';
    }
}