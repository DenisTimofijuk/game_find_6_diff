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
    timer!: number;
    time_to_wait!: number;
    ready: boolean;
    progressbarr: HTMLElement;
    constructor(public compositor:Compositor) {
        this.ready = false;
        this.progressbarr = document.getElementById('progress-barr')!;
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

        document.querySelector('#progress-barr-wrapper')!.addEventListener('click', this.clickHandler.bind(this));
    }

    setDellay(value:number){
        this.time_to_wait = value;
        this.timer = value;
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

    get progress(){
        return this.timer < 0 ? 100 : Math.round((this.time_to_wait - this.timer) * 100 / this.time_to_wait);
    }


    toggleKoef(){
        this._koef *= -1;
    }

    handleProgressBarr(){
        if(this.progress < 100){
            this.progressbarr.style.width = `${this.progress}%`;
            if(!this.progressbarr.classList.contains('progress-bar-loading')){
                this.progressbarr.classList.remove('progress-bar-ready');
                this.progressbarr.classList.add('progress-bar-loading');
            }            
        }else{
            if(!this.progressbarr.classList.contains('progress-bar-ready')){
                this.progressbarr.classList.remove('progress-bar-loading');
                this.progressbarr.classList.add('progress-bar-ready');
                this.progressbarr.style.width = `${this.progress}%`;
            }            
        }        
    }

    update(){
        this.timer--;
        this.handleProgressBarr();
        if(!this.ready) return;
        
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
        this.timer = this.time_to_wait;
        this.ready = false;
        this.show();
    }

    clickHandler(){
        if(this.timer >= 0) return;
        this.ready = true;
    }

    hide(){
        this.progressbarr.classList.add('hide');
    }

    show(){
        this.progressbarr.classList.remove('hide');
    }
}