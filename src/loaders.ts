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