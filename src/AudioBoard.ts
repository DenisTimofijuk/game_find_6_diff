export class AudioBoard {
  buffers: Map<string, AudioBuffer>;

  constructor(public context: AudioContext) {
    this.buffers = new Map();
  }

  addAudio(name: string, buffer: AudioBuffer) {
    this.buffers.set(name, buffer);
  }

  playAudio(name: string) {
    if (this.buffers.has(name)) {
      const source = this.context.createBufferSource();
      source.connect(this.context.destination);
      source.buffer = this.buffers.get(name)!;
      source.start(0);
    } else {
      console.warn(`Audio [${name}] was not found.`);
    }
  }
}



function createAudioLoader(context:AudioContext) {
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

export function loadAudioBoard<T extends JSON_audio>(audioURLs: string[], audioContext:AudioContext) {
    const loadAudio = createAudioLoader(audioContext);
    
    const audioBoard = new AudioBoard(audioContext);
    const jobs:Array<Promise<void>> = [];
    audioURLs.forEach( (url, index) => {
        const job = loadAudio(url).then(buffer => {
            audioBoard.addAudio(index+'', buffer);
        })
        jobs.push(job);
    });
    return Promise.all(jobs).then(() => audioBoard);
};