export {}
// import type { AudioBoard } from "../AudioBoard";
// import Compositor from "../Compositor";

// export default class Game<T extends Level_Config_JSON> {
//     compositor: Compositor;
//     images: HTMLImageElement[];
//     animations: AnimationFunctionReturn[];
//     diffCount: number;
//     diffIndicationPlaceHolder: HTMLElement;
//     constructor(public configData: T, public audioBoard:AudioBoard) {
//         this.compositor = new Compositor();
//         this.images = []
//         this.animations = [];
//         this.diffCount = configData.totalDiffs;
//         this.diffIndicationPlaceHolder = document.getElementById('diff-indicator')!;
//     }


 

//     update(detlaTime:number){
//         this.compositor.update();
//         this.animations.forEach(animation => animation(this, detlaTime));
//     }

  

//     addAnimation(animation:AnimationFunction ){
//         const update = animation(this);
//         this.animations.push(update);
//     }
// }