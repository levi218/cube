var SOUND = {
    BACKGROUND: 0,
    ROLL: 1
}
var sounds = []
let bgVolume;
let effVolume;
function initSound() {
    let bg = loadSound('assets/bg.mp3');
    bg.playMode('restart')
    sounds.push(bg);
    let rolled = loadSound('assets/rolled.wav');
    rolled.playMode('sustain')
    sounds.push(rolled)
    bgVolume = localStorage.getItem('bgVolume')
    if (bgVolume) bgVolume = parseInt(bgVolume);
    else {
        bgVolume = 50;
    }
    effVolume = localStorage.getItem('effVolume')
    if (effVolume) effVolume = parseInt(effVolume);
    else {
        effVolume = 50;
    }
}

function changeBgVolume(val) {
    bgVolume = val;
    localStorage.setItem('bgVolume', val);
}

function changeEffVolume(val) {
    effVolume = val;
    localStorage.setItem('effVolume', val);
}
function playSound(trackId, volume, loop) {
    sounds[trackId].setVolume(volume / 100.0)
    sounds[trackId].setLoop(loop)
    sounds[trackId].play();
}
