// p5.disableFriendlyErrors = true;
var time;
var score= 0;
var highScore = 0;
var time_flash;
let track;

function preload() {
    // Issues with this on mobile, Chrome/Firefox seem to depend on some input for sound to play correctly
    // But this game technically does not require any input, as movement is controlled using gyroscope
    // This also means the device will keep going to sleep
    soundFormats('wav','mp3');
    track = loadSound('assets/soundtrack.wav','assets/sountrack.mp3');
    font = loadFont('assets/Audiowide-Regular.ttf');
}

var gameinplay;
var timer_start;

var pFill;
var gameState = 1;
var gravity = 0.5;
// Air friction is applied constantly
var airFriction = 0.01;
// Friction is applied on collision with a surface
var friction = 0.02;
var ball;

//mobile vars
var mobileX;

// Initialise platforms which will be reused continuously
var platformL;
var platform1;
var platform2;
var platform3;
var platform4;
var platform5;
var platform6;
var platform7;
var platform8;
var platform9;
var platforms = [];

function setup() {
    createCanvas(1000, 1000);
    rectMode(CENTER);
    textFont(font);
    // our initial timer
    timer_start = millis();
    start();
}

function start(){
    mobileX = 0;
    lastAddition = 0;
    time_flash = millis();
    ball = new Ball(width/4,0,40,2,5,mobileX);  
    // Platform must be at least wide enough to hold the ball
    minWidth=ball.rad;
    // Max width of a platform is half the screen minus a gap for the ball to fit through
    maxWidth=(width/3-ball.rad);

    // Static - height/8 = 125 (+height/2 = 137.5)
    platformL = new Platform(width/2-ball.rad,25,width/5,50);

    var platformHeight = 25;

    // remaining height = 862.5
    var remainingHeight = height-(platformL.y+platformL.height);

    var y1 = round(random(platformL.y+platformL.height,remainingHeight/9));
    var y2 = round(random(remainingHeight/9+platformHeight,(remainingHeight/9)*2));
    var y3 = round(random(remainingHeight/9*2+platformHeight,remainingHeight/9*3));
    var y4 = round(random(remainingHeight/9*3+platformHeight,remainingHeight/9*4));
    var y5 = round(random(remainingHeight/9*4+platformHeight,remainingHeight/9*5));
    var y6 = round(random(remainingHeight/9*5+platformHeight,remainingHeight/9*6));
    var y7 = round(random(remainingHeight/9*6+platformHeight,remainingHeight/9*7));
    var y8 = round(random(remainingHeight/9*7+platformHeight,remainingHeight/9*8));
    var y9 = round(random(remainingHeight/9*8+platformHeight,remainingHeight));

    //row1
    platform1 = new Platform(round(random(minWidth,maxWidth)),25,round(random(0,width/3)),y1);
    platform2 = new Platform(round(random(minWidth,maxWidth)),25,round(random(width/3,width/3*2)),y2);
    platform3 = new Platform(round(random(minWidth,maxWidth)),25,round(random(width/3*2,width)),y3);

    //row2
    platform4 = new Platform(round(random(minWidth,maxWidth)),25,round(random(0,width/3)),y4);
    platform5 = new Platform(round(random(minWidth,maxWidth)),25,round(random(width/3,width/3*2)),y5);
    platform6 = new Platform(round(random(minWidth,maxWidth)),25,round(random(width/3*2,width)),y6);

    //row3
    platform7 = new Platform(round(random(minWidth,maxWidth)),25,round(random(0,width/3)),y7);
    platform8 = new Platform(round(random(minWidth,maxWidth)),25,round(random(width/3,width/3*2)),y8);
    platform9 = new Platform(round(random(minWidth,maxWidth)),25,round(random(width/3*2,width)),y9);

    // pass all platforms into an array - movement and collision checks will be called through forEach in play()
    platforms = [platform1,platform2,platform3,platform4,platform5,platform6,platform7,platform8,platform9];

    pFill = platform1.fill;
}

function home(){
    background(0);
    let s = 'Click to start game.';
    fill(255);
    
    textSize(30)
    text(s, width/1.65,height/2, width/2, 50); // Text wraps within

    if (mouseIsPressed) {
        if (mouseButton === LEFT) {
            track.loop();
            ball.alive = true;
            gameState = 2;
        }
    }
}

// Final stage of platform colour change. All stages prior to this are handled within the Platform class.
function flash(){
    platforms.forEach(element => element.fill = 'rgb(0,0,0)');
    var passedMillis = millis() - time_flash;
    if(passedMillis >=250){
        time_flash = millis();
        platforms.forEach(element => element.fill = 'rgb(255,0,0)');
    }
}

function getTime(){
    time = millis() - timer_start;
    var t;
    var s = round(time/1000)
    // We don't want to round this, or 90 seconds would make 2 minutes...
    var m = Math.floor(s/60);

    if(s < 60){
        t = s + " seconds";
    }
    else{
        if(s <= 120){
            // Seconds returns modulo of minute
            t = m + " minute " + s%60 + " seconds";
        }
        else{
            t = m + " minutes " + s%60 + " seconds";
        }
    }
    return t;
}

function play(){
    background(240,250,255);              
    noStroke();  
    // Hide cursor while game is in play
    noCursor();

    // Initialise innerHTML to 0 seconds
    document.getElementById("playerTime").innerHTML = "0 Seconds";
    
    // Constant platform (starter platform)
    rect(platformL.x,platformL.y,platformL.width,platformL.height,20);
    //moving platforms
    rect(platform1.x,platform1.y,platform1.width,platform1.height,20);
    rect(platform2.x,platform2.y,platform2.width,platform2.height,20);
    rect(platform3.x,platform3.y,platform3.width,platform3.height,20);
    rect(platform4.x,platform4.y,platform4.width,platform4.height,20);
    rect(platform5.x,platform5.y,platform5.width,platform5.height,20);
    rect(platform6.x,platform6.y,platform6.width,platform6.height,20);
    rect(platform7.x,platform7.y,platform7.width,platform7.height,20);
    rect(platform8.x,platform8.y,platform8.width,platform8.height,20);
    rect(platform9.x,platform9.y,platform9.width,platform9.height,20);

    fill(0,200,55);
    circle(ball.x,ball.y,ball.rad);  
    ball.applyGravity(); 
    ball.remainOnScreen();  
    ball.accelerometerX = mobileX;

    ball.roll_L();
    ball.roll_R();

    platformL.checkCollision(ball);
    fill(pFill);
    // Wait until we've jumped off the starter platform
    // platform's 'hide' function will also reset our timer, so it won't start counting until after we've dropped into the main game
    if(platformL.hide(ball,this)){
        var myTime = getTime();  
        document.getElementById("playerTime").innerHTML = myTime;
        platforms.forEach(element => element.checkCollision(ball));
        platforms.forEach(element => element.moveUp());
        platforms.forEach(element => element.checkY(this));
        platforms.forEach(element => element.update(track,time));
        // Means we'll only check if the ball has collided with the ceiling AFTER the game has begun (it's okay to hit the ceiling while you're on the starter platform)
        // This was important at first, but I've since removed the ability to 'jump', so this will never happen
        ball.checkDeath(platformL);
        pFill = platform1.fill;
    }

    if(platform1.speed == 6){
        flash();
    }

    if(!ball.alive){
        // only when you die, check the time you died at and set that as your score for this game
        storeItem('score',getTime());
        setScore();
        gameState = 3;
    }
}

function spliceOne(array,index){
    array.splice(index,1);
    return array;
}

function stringifyScore(scoreValue){
    //split string value of score/highscore into array, split by spaces
    var scoreArr = scoreValue.toString().split(" ");
    
    //eg '30 seconds'
    if(scoreArr.length == 2){
        var s = parseInt(scoreArr[0]);
        sTotal = s;
    }
    //eg '1 minute 30 seconds'
    if(scoreArr.length == 4){
        var m = (parseInt(scoreArr[0]))*60;
        var s = (parseInt(scoreArr[2]));
        sTotal = m+s;
    }
    // value returned will be integer representation of '30 seconds' or '1 minute 30 seconds', means we can compare the integer values
    // before doing this, a score of over 1 minute would not register as a highscore
    return sTotal;
}

function setScore(){
    // I'm stripping out the 'minutes' and 'seconds' to make sure we have an int to compare with our score (which is derived from 'getTime()')
    if(parseInt(getItem('highScore'))!=null && getItem('highScore')!=null){
        var score_int = stringifyScore(getItem('score'));
        var highScore_int = stringifyScore(getItem('highScore'));

        if(score_int > highScore_int){
            storeItem('highScore',getItem('score'));
        }
    }
    else{
        storeItem('highScore',getItem('score'));
    }
}

function resetSketch(){
    timer_start = millis();
}

function death(){
    score = getTime();
    resetSketch();
    // Cursor is hidden while in play, so show it
    cursor();
    track.pause();
    background(255,0,0);
    
    let s = 'You died! Click to play again.';
    let scoreText = 'Your score was: ' + getItem('score');

    let highScoreText = 'High score: ' + getItem('highScore');
    text(highScoreText,width/1.7,height/2+300,width/2,80)
    
    fill(0);
    textSize(30)
    text(s, width/1.8,height/3, width/2, 50); // Text wraps within
    text(scoreText,width/1.8,height/2,width/2,80);

    if (mouseIsPressed) {
        if (mouseButton === LEFT) {
            track.loop();
            resetSketch();
            start();
            ball.alive = true;
            gameState = 2;
        }
    }
}

function checkState(){
    getTime();
    if(gameState == 1){
        home();
    }
    if(gameState == 2){
        play();
    }
    if(gameState == 3){
        death();
    }
}

function draw() {
    checkState(); 
}

window.addEventListener('devicemotion',function(e){
        mobileX = parseInt(e.accelerationIncludingGravity.x);
    });