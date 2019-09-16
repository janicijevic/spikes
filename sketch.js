let p;
let dead, paused;
let grav, jumpSpeed, a, score, spike, side, buff, nSpikes, deadfr, frLim, jumped, jumpfr, highScore;

let tOff = 50;
let lOff = 20;
let rOff = 20;
let bOff = 100;
let scr = {width: 300, height: 450};


function init(){
    p = {
        x: scr.width/2,
        y: scr.height/2-10,
        r: 15,
        dx: 4,
        dy: 0
    }
    grav = 0.4;
    jumpSpeed = 7;
    dead = false;
    frLim = 80;
    jumped = -1;
    paused = true;
    a = 0;
    score = 0;
    spike = scr.height/15;
    spikeH = spike*2/3;
    buff = spike/3;
    side = 1; //right
    //nSpikes = 2;
    wall = [0,0,0,0,0,0,0,0,0,0]
}

function setup() {
    createCanvas(lOff + scr.width + rOff, tOff + scr.height + bOff);
    document.getElementsByTagName("canvas")[0].addEventListener("click", (e) => {e.preventDefault()});
    rectMode(CENTER);
    textAlign(CENTER);
    highScore = 0;
    init();
    noStroke();
}

function draw() {
    background(150);
    translate(rOff, tOff);
    fill(230);
    rect(scr.width/2, scr.height/2, scr.width, scr.height);
    fill(255);
    ellipse(scr.width/2, scr.height/2, scr.width*2/3, scr.width*2/3);

    if(frameCount-jumpfr > 15 && jumped == 1) jumped = -1;

    //update
    if(!paused){
        p.x += p.dx;
        p.dy+= grav;
        p.y += p.dy;
    }
    else{
        p.y += sin(frameCount/10);
    }

    //Side
    if(p.x > scr.width - p.r || p.x < p.r){
        if(!dead){
            score += 1;
            side = -side;
            genSide();
        }
        p.dx = -p.dx;
    }

    //Bottom
    if(p.y > scr.height-p.r-spikeH || p.y < p.r+spikeH){
        die()
    }
    if(p.y > scr.height-p.r){
        p.dy = -jumpSpeed*5/4;
        p.y = scr.height-p.r;
    }

    if(dead){
        a+= 0.2*sgn(p.dx);
    }

    for(let i = 0; i<10; i++){
        if(wall[i] == 1){
            let x = side == 1 ? scr.width : 0;
            let y = buff*3 + spike*i + buff*(i+1) + spike/2;
            let rad = spikeH + p.r*3/4;
            //push();
            //fill(100, 100, 0);
            //ellipse(x, y, rad, rad);
            //pop();
            if(sq(p.x - x) + sq(p.y - y) < sq(rad)){
                die()
            }

        }
    }

    //Score
    if(!paused){
    textSize(150);
    fill(190);
    text(("0"+score).slice(-2), scr.width/2, scr.height/2+50);
    }
    if(paused || dead){
        textSize(30);
        fill(150);
        text("Best score: "+highScore, scr.width/2, scr.height*4/5);
    }

    //Bird
    push();
    translate(p.x, p.y);
    rotate(a);
    drawSprite();
    pop();

    //Spikes
    push();
    translate(0, buff*3);
    if(side == 1)translate(scr.width, 0);
    for(let i=0; i<10; i++){
        translate(0, buff);
        if(wall[i]){
            fill(150);
            if(side == 1){ //Desni zid
                triangle(0, i*spike, 0, (i+1)*spike, -spikeH, (i+1/2)*spike);
            }
            else{         //Levi zid
                triangle(0, i*spike, 0, (i+1)*spike, spikeH, (i+1/2)*spike); 
            }
        }
    }
    pop();

    push();
    fill(150);
    translate(buff, 0);
    for(let i = 0; i<7; i++){
        translate(buff, 0);
        triangle(i*spike, 0, (i+1)*spike, 0, (i+1/2)*spike, spikeH);
        translate(0, scr.height);
        triangle(i*spike, 0, (i+1)*spike, 0, (i+1/2)*spike, -spikeH);
        translate(0, -scr.height);
    }
    pop();


    //Walls
    fill(150);
    rect(-lOff/2, scr.height/2, lOff, scr.height);
    rect(scr.width+rOff/2, scr.height/2, rOff, scr.height);
    rect(scr.width/2, -tOff/2, scr.width, tOff);
    rect(scr.width/2, scr.height+bOff/2, scr.width, tOff);
}


function touchStarted(){
    if(paused) paused = false;
    if(!dead){
        jumped = 1;
        jumpfr = frameCount;
        p.dy = -jumpSpeed;
    }
    else{
        if(frameCount - deadfr > frLim){
            init();
        }
    }

}
function touchEnded(event){
    event.preventDefault();

}


function sgn(x){
    return x > 0 ? 1 : -1;
}

function drawSprite(){
    fill(90);
    
    noStroke();
    //Body ------
    //rect(0, 0, p.r*2, p.r*2, 5)   unicolor
    if(!dead)fill(255, 40, 40);
    rect(0, 0, p.r*2, p.r*2, 10);
    //Tail
    triangle(-side*p.r, 0, -side*p.r, -p.r/2, -side*p.r*3/2, -p.r/2);
    if(!dead)fill(247, 40, 40);
    rect(0, p.r/2, p.r*2, p.r, 0, 0, 10, 10);

    //Wing ------
    if(!dead) fill(207, 25, 25);
    triangle(0, 0, -side*p.r*2/3, 0, -side*p.r*2/3, -jumped*p.r*2/3); //poslednje menjaj za gore dole

    //Beak ------
    if(!dead)fill(255, 220, 0);
    triangle(side*p.r, -p.r/2, side*p.r, 0, side*p.r*3/2, 0);
    if(!dead)fill(240, 200, 0);
    triangle(side*p.r, p.r/2, side*p.r, 0, side*p.r*3/2, 0);

    fill(255);
    ellipse(side*p.r/2, -p.r/2, p.r/4+2, p.r/4+2);

    // fill(255, 220, 0);
    // triangle(p.r, -p.r/2, p.r, 0, p.r*3/2, 0);
    // fill(240, 200, 0);
    // triangle(p.r, p.r/2, p.r, 0, p.r*3/2, 0);

    //ellipse(0, 0, p.r, p.r);
}

function genSide(){
    nSpikes = newN(score);
    wall = [0,0,0,0,0,0,0,0,0,0];
    for(let i = 0; i<nSpikes; i++){
        let index = Math.floor(Math.random()*10);
        while(wall[index] == 1){
            index = Math.floor(Math.random()*10);
        }
        wall[index] = 1;
    }
}

function newN(score){
    let n = Math.floor(Math.sqrt(score+3));
    return n>8 ? 8 : n;
}

function die(){
    if(!dead) deadfr = frameCount;
    dead = true;
    if(score > highScore) highScore = score;
}




/*function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
*/