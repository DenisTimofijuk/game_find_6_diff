const COOKIE_NAME = 'hide-intro';
const DAYS_TO_LIVE = 5;
enum COOKIE_VALUE {selected = 'true'};

export function handleIntroScreen() {
    initCloseButton();
    autoHide();
}

function autoHide() {
    if(getCookie(COOKIE_NAME) === COOKIE_VALUE.selected){
        hide();
    }
}

function hide() {
    document.getElementById('game-intro')!.style.display = "none";
}

function initCloseButton() {
    document.getElementById('close-game-intro')!.addEventListener('click', function () {
        hide();
        handleDoNotShow();
    })
}

function handleDoNotShow() {
    const checkbox = document.getElementById('hide-intro') as HTMLInputElement
    if(checkbox.checked){
        setCookie(COOKIE_NAME, COOKIE_VALUE.selected, DAYS_TO_LIVE);
    }
}


function getCookie(cname: string) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname:string, cvalue:string, exdays:number) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}