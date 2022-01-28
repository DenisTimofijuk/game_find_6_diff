export default <AnimationFunction>function (levelData: {
    init: number;
    diffs: number;
}, images:HTMLImageElement[], compositor:GameCompositor, pinsHandler:PinsHandlerClass) {
    console.log('animation a')

    return function update(deltaTime:number){
        console.log(levelData.diffs, pinsHandler.searchablePins.length)
    }
}
