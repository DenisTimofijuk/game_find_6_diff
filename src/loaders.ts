import AudioBoard from "./AudioBoard";

export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

export async function loadJSON<T extends JSON_object>(url: string): Promise<T> {
    const r = await fetch(url);
    return await r.json();
  }
  

export function createAudioLoader(context:AudioContext) {
    return function loadAudio(url:string) {
        return fetch(url)
        .then(response => {
            return response.arrayBuffer();
        })
        .then(arrayBuffer => {
            return context.decodeAudioData(arrayBuffer);
        })
    }
}

export function loadAudioBoard<T extends JSON_audio>(config: T, audioContext:AudioContext) {
    const loadAudio = createAudioLoader(audioContext);
    
        const audioBoard = new AudioBoard();
        const jobs:Array<Promise<void>> = [];
        Object.keys(config).forEach( key => {
            const url = config[key];
            const job = loadAudio(url).then(buffer => {
                audioBoard.addAudio(key, buffer);
            })
            jobs.push(job);
        });
        return Promise.all(jobs).then(() => audioBoard);
};

export function loadAllIamgeFiles(configData: JSON_object) {
    const jobs = [
        loadImage(configData["main-image-a"]),
        loadImage(configData["main-image-b"])
    ];

    for (let key in configData.images) {
        jobs.push(loadImage(configData.images[key]));
    };

    return Promise.all(jobs);
}