
var CUBE_SIZE = 50;

const LABELS = {
    BACK_TO_MENU: "BACK TO MENU",
    EFFECT: "EFFECT",
    START_OVER: "START OVER",
    RESUME: 'RESUME',
    HIGHSCRORE: 'HIGHSCORE',
    START: 'START',
    SETTING: 'SETTING',
    SOUND: 'SOUND',

}
const CELL = {
    EMPTY: 'empt',
    FILL: 'fill',
    STAIR: 'stair',
    PATH_END: 'end'
}
const DIR = {
    UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3
}
let t = 0;
var mapSize = { x: 12, y: 12, z: 4 };
var secondlayer;
var cameraPosition;
var cameraOffset = [
    [400, -400, 400],
    [-400, -400, 400],
    [-400, 400, 400],
    [400, 400, 400],
]
var cameraOffsetIndex = 1;
var angle = { x: 0, y: 0 };
var axisOffset = {
    forward: { x: 0, y: CUBE_SIZE / 2, z: -CUBE_SIZE / 2 },
    backward: { x: 0, y: -CUBE_SIZE / 2, z: -CUBE_SIZE / 2 },
    left: { x: -CUBE_SIZE / 2, y: 0, z: -CUBE_SIZE / 2 },
    right: { x: CUBE_SIZE / 2, y: 0, z: -CUBE_SIZE / 2 },
}
var cameraChangingView = false;
var primaryColor = [
    [104,179,125,255],
    [121,179,170,255],
    [255,122,122,255],
    [130,160,179,255],
    [183,116,232,255]
]