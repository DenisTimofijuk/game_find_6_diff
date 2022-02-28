import type Compositor from "./Compositor";
import Layer from "./Layer";


const TIME_TO_WAIT = 2000;
const RADIUS_MAX = 30;

export default class UserHelper {
    layer: Layer;
    pos: { x: number; y: number; };
    _radius: number;
    private _koef: number;
    private _rMax: number;
    timer: number;
    constructor(public compositor:Compositor) {
        this.layer = new Layer(compositor.screeenA.canvas.width, compositor.screeenA.canvas.height);
        this.pos = {
            x:100,
            y:100
        }
        this._radius = 1;
        this._koef = 0.5;
        this._rMax = RADIUS_MAX;
        this.layer.ctx.strokeStyle = 'yellow';
        this.layer.ctx.lineWidth = 2;
        this.timer = TIME_TO_WAIT;
    }

    get radius(){
        this._radius += this._koef;

        if(this._radius > this._rMax ){
            this.toggleKoef();
        }

        if(this._radius <= 0){
            this.toggleKoef();
            this._radius = 1;
        }       

        return this._radius;
    }

    toggleKoef(){
        this._koef *= -1;
    }

    update(){
        this.timer--;
        if(this.timer >= 0) return;
        
        this.animate();
        this.compositor.screeenA.ctx.drawImage(this.layer.canv, 0, 0);
        this.compositor.screeenB.ctx.drawImage(this.layer.canv, 0, 0);
    }


    animate(){
        this.layer.clear();
        this.layer.ctx.beginPath();
        this.layer.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
        this.layer.ctx.stroke();
        this.layer.ctx.closePath();
    }

    set([x, y, w, h]:number[]){
        this.pos.x = x + w/2;
        this.pos.y = y + h/2;
        this._radius = 1;
        this.timer = TIME_TO_WAIT;
    }
}