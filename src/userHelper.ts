import "../public/progress.css";
import type Compositor from "./Compositor";
import Layer from "./Layer";

const RADIUS_MAX = 40;
const HINT_LABEL = 'Hint is ready';

export default class UserHelper {
    layer: Layer;
    pos: { x: number; y: number; };
    _radius: number;
    private _koef: number;
    private _rMax: number;
    active: boolean;
    clicksPerLevel: number;
    availableHelps: number;
    wrapper: HTMLDivElement;
    maxHelps: number;
    constructor(public compositor:Compositor) {
        this.active = false;
        this.clicksPerLevel = 1;
        this.availableHelps = 1;
        this.maxHelps = 1;
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

        this.wrapper = document.getElementById('progress-barr-wrapper') as HTMLDivElement
        this.wrapper.addEventListener('click', this.clickHandler.bind(this));
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
        if(!this.active) return;
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
        this.active = false;
    }

    clickHandler(){
        if(this.active) return;

        if(this.availableHelps > 0){
            this.active = true;
            this.clicksPerLevel++;
            this.availableHelps--;
            this.removeIcon();
        }
    }

    initOnLevel(){
        if(this.clicksPerLevel === 0){
            this.addHelp();
        }else{
            this.clicksPerLevel = 0;
        };
    }

    addHelp(){
        if(this.availableHelps >= this.maxHelps){
            return;
        }
        this.availableHelps++;
        this.addIcon();
    }

    addIcon(){
        const element = document.createElement('span');
        element.classList.add('help-ico');
        this.wrapper.appendChild(element);
    }

    removeIcon(){
        this.wrapper.removeChild(this.wrapper.childNodes[0]);
    }

    initOnGame(availableHelps:number, maxHelps:number){
        this.availableHelps = availableHelps;
        this.maxHelps = maxHelps;
        for(let i=0; i<availableHelps; i++){
            this.addIcon();
        }
    }
}