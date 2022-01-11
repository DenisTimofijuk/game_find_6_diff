interface JSON_object{
    "main-image-a":string;
    "main-image-b":string;
    "audio": JSON_audio;
    "pins": string[];
}

interface JSON_audio{
    "background-audio": string;
    [key:string]:string
}