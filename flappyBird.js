var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

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

var gap = 150;
var constant;
var bX = 10;
var bY = 150;
var gravity = 1.5;
var score = 0;
var highScore = localStorage.getItem('high_score');
var currentScore = 0;
var game_mode = 'prestart';  
var xConstant = 25;

var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

document.addEventListener("keydown",moveUp);  
document.addEventListener("mousedown", moveUp);  

function moveUp(){
    game_mode = 'running';
    if(game_mode === 'running') {
        bY -= 25;
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
    ctx.fillText("Press, touch or click to start", cvs.width / 2 + xConstant, cvs.height / 4);  
}

 function over() {         
    ctx.font= "30px Arial";
    ctx.fillStyle= "red";
    ctx.textAlign="center";
    ctx.fillText("Game Over", cvs.width / 2 + xConstant, 50);  
    ctx.fillText("High Score: " + highScore, cvs.width / 2 + xConstant, 100);  
    ctx.fillText("Current Score: " + currentScore, cvs.width / 2 + xConstant, 150);  
    ctx.font= "20px Arial";
    ctx.fillText("Click, touch, or press to play again", cvs.width / 2 + xConstant, 300);  
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
             
        pipe[i].x--;
        
        if( pipe[i].x === 500){
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
            }); 
        }
        
        if( bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY+bird.height >= pipe[i].y+constant) || bY + bird.height >=  cvs.height - fg.height){
            if(score > highScore) {
                highScore = score;
                localStorage.setItem('high_score', highScore);
            }
            game_mode = 'over';
            currentScore = score;
            score = 0;
            over();
        }
        
        if(pipe[i].x == 5){
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
























