export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

export async function loadJSON<T>(url: string): Promise<T> {
    const r = await fetch(url);
    return await r.json();
}

export function loadAllIamgeFiles(images: string[]) {
    const jobs = [];

    for (let url of images) {
        jobs.push(loadImage(url));
    };

    return Promise.all(jobs);
}