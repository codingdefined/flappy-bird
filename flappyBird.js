var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var play = document.getElementById("play-button");
var sendHighScore = document.getElementById("send-highscore");
var pipeSpeed = 2;
var pipePast = 2;
currentHighScoreSent = false;

var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

var gap = 100;
var constant;
var bX = 10;
var bY = 150;
var gravity = 2;
var score = 0;
var highScore = 0;
var currentScore = 0;
var game_mode = 'prestart';  
var xConstant = 25;

var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

play.addEventListener("click", function() {
    score = 0;
    moveUp();
});
sendHighScore.addEventListener("click", function(){
    if(!currentHighScoreSent) {
        alert("High Score of " + highScore + " sent to server");
        currentHighScoreSent = true;
    }
})

function moveUp(){
    game_mode = 'running';
    if(game_mode === 'running') {
        bY -= 50;
        fly.play();
    }   
}

var pipe = [];
function addInitialPipes() {
    pipe[0] = {
        x : 250,
        y : 0
    };
    pipe[1] = {
        x : 650,
        y : 0
    };
    constant = pipeNorth.height+gap;
    for(var i = 0; i < pipe.length; i++){
        ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
        ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);
    }
}


function intro() {
    ctx.font= "25px Arial";
    ctx.fillStyle= "red";
    ctx.textAlign="center";
    ctx.fillText("Click on Play To Start", cvs.width / 2 + xConstant, 50);  
    play.style.display = 'block';
}

 function over() {       
    document.removeEventListener("keydown",moveUp);  
    document.removeEventListener("mousedown", moveUp);   
    ctx.font= "30px Arial";
    ctx.fillStyle= "red";
    ctx.textAlign="center";
    ctx.fillText("Game Over", cvs.width / 2 + xConstant, 50);  
    ctx.fillText("High Score: " + highScore, cvs.width / 2 + xConstant, 100);  
    ctx.fillText("Current Score: " + currentScore, cvs.width / 2 + xConstant, 150);  
    ctx.font= "20px Arial";
    play.style.display = 'block';
    sendHighScore.style.display = 'block';
    pipeSpeed = 2;
    pipePast = 2;
}

function reset() {
    pipe = [];
    addInitialPipes();
    bX = 10;
    bY = 150;
}

function running() {
    for(var i = 0; i < pipe.length; i++){
        constant = pipeNorth.height+gap;
        ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
        ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);
             
        pipe[i].x -= pipeSpeed;
        
        if((pipeSpeed === 2 && pipe[i].x ===500) || (pipeSpeed === 4 && (pipe[i].x === 499 || pipe[i].x === 500 || pipe[i].x === 501 ||
            pipe[i].x === 502))){
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
            }); 
        }
        
        if( bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY+bird.height >= pipe[i].y+constant) || bY + bird.height >=  cvs.height - fg.height){
            if(score > highScore) {
                highScore = score;
                currentHighScoreSent = false;
            }
            game_mode = 'over'
            currentScore = score;
            over();
        }
        
        if((pipePast === 2 && (pipe[i].x === pipePast || pipe[i].x === pipePast - 1)) || (pipePast === 4 && (pipe[i].x === pipePast-1 || pipe[i].x === pipePast-2 ||
            pipe[i].x === pipePast-3 || pipe[i].x === pipePast-4))){
            score++;
            scor.play();
        }
    }
    bY += gravity;
    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : "+score,cvs.width/2,cvs.height-20);
}

function draw(){
    ctx.drawImage(bg,0,0);
    ctx.drawImage(fg,0,cvs.height - fg.height);
    ctx.drawImage(bird,bX,bY);
    
    if(game_mode === 'running') {
        play.style.display = 'none';
        sendHighScore.style.display = 'none';
        document.addEventListener("keydown",moveUp);  
        document.addEventListener("mousedown", moveUp);  
        if(pipe.length > 10) {
            pipeSpeed = 4;
            pipePast = 4;
        }
        running();
    }
    switch (game_mode) {
        case 'prestart': {
            intro();
            addInitialPipes();
            break;
        } 
        case 'over': {
            over();
            reset();
            break;
        } 
    }
    requestAnimationFrame(draw);
}
draw();
























