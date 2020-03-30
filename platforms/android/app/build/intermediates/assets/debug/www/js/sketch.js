var gameMap;
var SCENE = {
    MENU: 'menu', SETTING: 'setting', GAME: 'game', PAUSED: 'paused',
    GAMEOVER: 'gameover'
}
var curScene;
var font;
var score;
function preload() {
    font = loadFont('assets/Azonix-1VB0.otf');
    initSound();
}
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.style('margin: 0px')
    textFont(font);
    colorMode(RGB, 255, 255, 255, 255);
    blendMode(DIFFERENCE);
    ortho(-width / 2, width / 2, height / 2, -height / 2, 1, 2000);

    cameraPosition = createVector(0, 0, 0);

    bgParticleSystem.init(mapSize.x / 2 * CUBE_SIZE, mapSize.y / 2 * CUBE_SIZE);
    curScene = SCENE.MENU;
    initSetting();
    initMenu();
    initPauseMenu();
    initGameOver();
    initIngameLayout();
}
function initGame(newGame) {
    gameMap = new GameMap(mapSize.x, mapSize.y, mapSize.z);
    cube.init(gameMap);
    if (newGame) {
        score = 0;
        cube.hp = 100;
        updateHp(cube.hp)
    } else
        score += 1;
    updateScore(score);
}
function loadGame(data) {
    gameMap = new GameMap(data.map, data.color);
    cube.init(gameMap);
    score = data.score;
    cube.hp = data.hp;
    cube.pos = data.cube_pos;
    updateHp(cube.hp)
    updateScore(score);
}
function gameUpdate() {
    t += 1;
    cameraPosition = p5.Vector.lerp(cameraPosition,
        createVector(cube.pos.x * CUBE_SIZE + cameraOffset[cameraOffsetIndex][0],
            cube.pos.y * CUBE_SIZE + cameraOffset[cameraOffsetIndex][1], cube.pos.z * CUBE_SIZE + cameraOffset[cameraOffsetIndex][2]), 0.2);
    let camFocus = {
        x: cameraPosition.x - cameraOffset[cameraOffsetIndex][0],
        y: cameraPosition.y - cameraOffset[cameraOffsetIndex][1],
        z: cameraPosition.z - cameraOffset[cameraOffsetIndex][2]
    }
    if (cameraChangingView) {
        camera(cameraPosition.x, cameraPosition.y, cameraPosition.z,
            // camFocus.x,camFocus.y,camFocus.z,
            cube.pos.x * CUBE_SIZE, cube.pos.y * CUBE_SIZE, cube.pos.z * CUBE_SIZE,
            0, 0, 1)
        // console.log(abs(camFocus.x - cube.pos.x * CUBE_SIZE) + "  " + abs(-camFocus.y + cube.pos.y * CUBE_SIZE) + "  " + abs(camFocus.z - cube.pos.z * CUBE_SIZE))
        if (abs(camFocus.x - cube.pos.x * CUBE_SIZE) < 1 && abs(-camFocus.y + cube.pos.y * CUBE_SIZE) < 1 && abs(camFocus.z - cube.pos.z * CUBE_SIZE) < 1) cameraChangingView = false;
    } else {
        camera(cameraPosition.x, cameraPosition.y, cameraPosition.z,
            camFocus.x, camFocus.y, camFocus.z,
            // cube.pos.x * CUBE_SIZE, cube.pos.y * CUBE_SIZE, cube.pos.z * CUBE_SIZE,
            0, 0, 1)
    }
    directionalLight(255, 255, 255, 1, 1, -1);
    directionalLight(255, 255, 255, -1, 1, -1);
    directionalLight(155, 255, 255, -1, -1, -1);
    directionalLight(255, 255, 155, 0.5, -1, -1);
    bgParticleSystem.draw();
    door.draw(gameMap.color);
    gameMap.draw();
    cube.update();
    cube.draw()
}
var renderTime;
function draw() {
    renderTime = Date.now();
    // setGradient(-2*width, -2*height, width*4, height*4, color(255,200,200,200), color(0,50,50,200), Y_AXIS);
    switch (curScene) {
        case SCENE.SETTING: {
            settingUpdate();
        }
        case SCENE.MENU: {
            setGradient(-4 * width, -4 * height, width * 8, height * 8, color(255, 200, 200, 255), color(0, 50, 50, 255));
            menuUpdate();
        } break;
        case SCENE.GAME: {
            setGradient(-4 * width, -4 * height, width * 8, height * 8, color(255, 200, 200, 255), color(0, 50, 50, 255));
            gameUpdate();
        } break;

    }
    fpsSpan.html(round(1000/(Date.now()-renderTime)));
}

var startMouseX;
var startMouseY;

function mousePressed() {
    startMouseX = mouseX;
    startMouseY = mouseY;
}

function mouseReleased() {
    if (curScene == SCENE.GAME) {
        let deltaX = mouseX - startMouseX;
        let deltaY = mouseY - startMouseY;
        if (Math.abs(deltaX) > windowWidth / 10 || Math.abs(deltaY) > windowHeight / 10) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {/*most significant*/
                if (deltaX < 0) {
                    console.log(deltaX + "  "+ deltaY)
                    /* left swipe */
                    cube.handleInput(LEFT_ARROW);
                } else {
                    /* right swipe */
                    cube.handleInput(RIGHT_ARROW);
                }
            } else {
                if (deltaY < 0) {
                    /* up swipe */
                    cube.handleInput(UP_ARROW);
                } else {
                    /* down swipe */
                    cube.handleInput(DOWN_ARROW);
                }
            }
        } else {
            if (mouseX < windowWidth / 4) {
                rotateCamera(1)
            }else
            if (mouseX > windowWidth - windowWidth / 4){
                rotateCamera(-1)
            }
        }
    }
}
let lastRotate;
function rotateCamera(dir){
    // added cooldown due to bug double click on android
    if(lastRotate && Date.now()-lastRotate<500) return; 
    lastRotate = Date.now();
    cameraOffsetIndex = (cameraOffsetIndex + dir + cameraOffset.length)%cameraOffset.length;
    cameraChangingView = true;
}
function keyPressed() {
    if (curScene == SCENE.GAME) {
        switch (keyCode) {
            case 90: // Z
                rotateCamera(1)
                break;
            case 88: //X
                rotateCamera(-1)
                break;
        }
        cube.handleInput(keyCode);
    }
}

function setGradient(x, y, w, h, c1, c2) {
    push();
    beginShape(TRIANGLE_FAN);
    fill(c1);
    vertex(x, y, -200);
    vertex(x+w, y, -200);
    fill(c2);
    vertex(x+w, y+h, -200);
    vertex(x, y+h, -200);
    endShape(CLOSE);
    pop();
}