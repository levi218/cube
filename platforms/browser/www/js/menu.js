// all GUI elements are initiated in this file
var divMenu;
var divSetting;
var divPauseMenu;
var divIngameLayout;
var divGameOver;
let spanHpInner;
let spanScore;
let spanHighscore;
let fpsSpan;
let btnResumeGame;
function initIngameLayout() {
    divIngameLayout = createDiv();
    divIngameLayout.size(width, height);
    divIngameLayout.position(0, 0);

    let btnPause = createButton("|||");
    btnPause.size(windowWidth/10>50?50:windowWidth/10, windowWidth/10>50?50:windowWidth/10);
    btnPause.position(30, 30);
    btnPause.addClass('btn');
    btnPause.mousePressed(function () {
        divPauseMenu.show();
        divIngameLayout.hide();
        curScene = SCENE.PAUSED;
    });
    btnPause.parent(divIngameLayout)

    spanScore = createSpan("|||");
    spanScore.size(100, 50);
    spanScore.position(width / 2 - 50, 30);
    spanScore.parent(divIngameLayout)

    let spanHpOuter = createSpan();
    spanHpOuter.size(width / 2+4, 10);
    spanHpOuter.position(width / 4-2, 60);
    spanHpOuter.style('background: #DDD')
    spanHpOuter.parent(divIngameLayout)

    spanHpInner = createSpan();
    spanHpInner.size(width / 2, 8);
    spanHpInner.position(2, 1);
    spanHpInner.style('background: #B11')
    spanHpInner.parent(spanHpOuter)

    fpsSpan = createSpan("|||");
    fpsSpan.size(100, 50);
    fpsSpan.style('text-align: right')
    fpsSpan.position(width - 120, 30);
    fpsSpan.parent(divIngameLayout)

    divIngameLayout.hide();
}
function updateHp(value) {
    spanHpInner.size(width / 2.0 * value / 100.0, 8);
    if (value <= 0) {
        // save high score and update highscore on menu
        if (score > getHighscore()) {
            updateHighscore(score);
        }
        if (localStorage.getItem('saved_game')) localStorage.removeItem('saved_game')
        divGameOver.show();
        divIngameLayout.hide();
        curScene = SCENE.GAMEOVER;
    }
}
function updateScore(value) {
    spanScore.html("Stage " + (value + 1));
}

function initGameOver() {
    divGameOver = createDiv();
    divGameOver.size(width, height);
    divGameOver.position(0, 0);
    divGameOver.style('backdrop-filter: blur(8px);')

    let offset = height / 3
    let opsHeight = height / 12
    let opsWidth = width / 2

    let btnRestart = createButton(LABELS.START_OVER);
    btnRestart.size(opsWidth, opsHeight);
    btnRestart.position(width / 2 - opsWidth / 2, offset + 1 * opsHeight);
    btnRestart.addClass('btn');
    btnRestart.mousePressed(function () {
        divGameOver.hide();
        divIngameLayout.show();
        curScene = SCENE.GAME;
        initGame(true);
    });
    btnRestart.parent(divGameOver)

    let btnBack = createButton(LABELS.BACK_TO_MENU);
    btnBack.size(opsWidth, opsHeight);
    btnBack.position(width / 2 - opsWidth / 2, offset + 2 * opsHeight + 10);
    btnBack.addClass('btn');
    btnBack.mousePressed(function () {
        divGameOver.hide();
        divMenu.show();
        curScene = SCENE.MENU;
        if (localStorage.getItem('saved_game')) btnResumeGame.show()
        else {
            btnResumeGame.hide();
        }
    });
    btnBack.parent(divGameOver)

    divGameOver.hide();
}

function initPauseMenu() {
    // btn resume + btn back to menu
    divPauseMenu = createDiv();
    divPauseMenu.size(width, height);
    divPauseMenu.position(0, 0);
    divPauseMenu.style('backdrop-filter: blur(8px);')

    let offset = height / 3
    let opsHeight = height / 12
    let opsWidth = width / 2

    let btnResume = createButton(LABELS.RESUME);
    btnResume.size(opsWidth, opsHeight);
    btnResume.position(width / 2 - opsWidth / 2, offset + 1 * opsHeight);
    btnResume.addClass('btn');
    btnResume.mousePressed(function () {
        divPauseMenu.hide();
        divIngameLayout.show();
        curScene = SCENE.GAME;
    });
    btnResume.parent(divPauseMenu)

    let btnBack = createButton(LABELS.BACK_TO_MENU);
    btnBack.size(opsWidth, opsHeight);
    btnBack.position(width / 2 - opsWidth / 2, offset + 2 * opsHeight + 10);
    btnBack.addClass('btn');
    btnBack.mousePressed(function () {
        // save current map in local storage if hp>0
        if (cube.hp > 0) {
            localStorage.setItem("saved_game", JSON.stringify({
                score: score,
                map: gameMap.arr,
                hp: cube.hp,
                cube_pos: cube.pos,
                color: gameMap.color // TODO: make this works
            }))
        }
        divPauseMenu.hide();
        divMenu.show();
        if (localStorage.getItem('saved_game')) btnResumeGame.show()
        else {
            btnResumeGame.hide();
        }
        curScene = SCENE.MENU;
    });
    btnBack.parent(divPauseMenu)

    divPauseMenu.hide();
}

function updateHighscore(val) {
    spanHighscore.html(LABELS.HIGHSCRORE+': ' + val);
    localStorage.setItem('highscore', val);
}
function getHighscore() {
    let highscore = localStorage.getItem('highscore');
    highscore = highscore ? parseInt(highscore) : 0;
    return highscore;
}
function initMenu() {
    divMenu = createDiv();
    divMenu.size(width, height);
    divMenu.position(0, 0);
    divMenu.mousePressed(function () {
        if (!sounds[SOUND.BACKGROUND].isPlaying())
            console.log(bgVolume)
        playSound(SOUND.BACKGROUND, bgVolume, true);
    })

    let offset = 5 * height / 12
    let opsHeight = height / 12
    let opsWidth = width / 2

    let divBtnContainer = createSpan();
    divBtnContainer.size(opsWidth, height / 2);
    divBtnContainer.position(width / 2 - opsWidth / 2, offset);

    // get highscore from localstorage, show 0 if not available
    spanHighscore = createSpan(LABELS.HIGHSCRORE+": " + getHighscore());
    spanHighscore.size(opsWidth, opsHeight);
    spanHighscore.parent(divBtnContainer)

    btnResumeGame = createButton(LABELS.RESUME);
    btnResumeGame.size(opsWidth, opsHeight);
    btnResumeGame.addClass('btn');
    btnResumeGame.mousePressed(function () {
        divMenu.hide();
        divIngameLayout.show();
        curScene = SCENE.GAME;
        // load game
        let saved_game = localStorage.getItem('saved_game')
        if (saved_game) {
            saved_game = JSON.parse(saved_game);
            loadGame(saved_game);
        }
    });
    btnResumeGame.parent(divBtnContainer)
    if (!localStorage.getItem('saved_game')) btnResumeGame.hide();

    let btnStart = createButton(LABELS.START);
    btnStart.size(opsWidth, opsHeight);
    btnStart.addClass('btn');
    btnStart.mousePressed(function () {
        divMenu.hide();
        divIngameLayout.show();
        curScene = SCENE.GAME;
        // clear map in localstorage
        initGame(true);
    });
    btnStart.parent(divBtnContainer)

    let btnSetting = createButton(LABELS.SETTING);
    btnSetting.size(opsWidth, opsHeight);
    btnSetting.addClass('btn');
    btnSetting.mousePressed(function () {
        divMenu.hide();
        divSetting.show();
        curScene = SCENE.SETTING;
    });
    btnSetting.parent(divBtnContainer)

    divBtnContainer.parent(divMenu)
}

function menuUpdate() {
    cameraPosition = p5.Vector.lerp(cameraPosition,
        createVector(0, 0, 100), 0.2);
    camera(cameraPosition.x, cameraPosition.y, cameraPosition.z,
        0, 0, 0,
        0, 1, 0)
    push()
    bgParticleSystem.draw();
    textSize(width / 8);
    fill(255);
    translate(0, height / 5, 0)
    rotateZ(PI);
    rotateY(PI);
    text("C", -4 * width / 20, 0);
    text('U', -2 * width / 20, 0);
    text('B', 0 * width / 20, 0);
    text('E', 2 * width / 20, 0);
    push()
    translate(0, 0, 100)
    rotateX(PI / 4);
    rotateY(PI / 4);
    noFill()
    stroke(123, 255, 123);
    strokeWeight(2);
    box(width / 6)
    pop()
    pop();
}


let sliderSound;
let sliderEffect
function initSetting() {
    divSetting = createDiv();
    divSetting.size(width, height);
    divSetting.position(0, 0);
    let offset = 5 * height / 12
    let opsHeight = height / 12
    let opsWidth = width / 2

    let divBtnContainer = createSpan();
    divBtnContainer.size(opsWidth, height / 2);
    divBtnContainer.position(width / 2 - opsWidth / 2, offset);

    let div1 = createSpan();
    div1.size(width / 3, height / 10);
    // div1.position(width / 2 - opsWidth / 2, offset + 1 * opsHeight);

    let lbl1 = createSpan(LABELS.SOUND);
    lbl1.addClass('setting-lbl')
    lbl1.parent(div1)

    sliderSound = createSlider(0, 100, bgVolume);
    sliderSound.addClass('slider')
    sliderSound.parent(div1)

    div1.parent(divBtnContainer)

    let div2 = createSpan();
    div2.size(width / 3, height / 10);
    // div2.position(width / 2 - opsWidth / 2, offset + 2 * opsHeight);

    let lblEff = createSpan(LABELS.EFFECT);
    lblEff.addClass('setting-lbl')
    lblEff.parent(div2)

    sliderEffect = createSlider(0, 100, effVolume);
    sliderEffect.addClass('slider')
    sliderEffect.parent(div2)

    div2.parent(divBtnContainer)

    let btnBack = createButton(LABELS.BACK_TO_MENU);
    btnBack.size(opsWidth, opsHeight);
    // btnBack.position(width / 2 - opsWidth / 2, offset + + 4 * opsHeight);
    btnBack.addClass('btn');
    btnBack.mousePressed(function () {
        divSetting.hide();
        divMenu.show();
        curScene = SCENE.MENU;
    });
    btnBack.parent(divBtnContainer)

    divBtnContainer.parent(divSetting)
    divSetting.hide();
}

function settingUpdate() {
    changeEffVolume(sliderEffect.value());
    if (sliderSound.value() != bgVolume) {
        sounds[SOUND.BACKGROUND].pause();
        playSound(SOUND.BACKGROUND, sliderSound.value(), true)
    }
    changeBgVolume(sliderSound.value());
}