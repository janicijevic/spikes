let p, but;
let dead, paused, jumped, side, shape;
let grav, jumpSpeed, a, score, spike, buff, nSpikes, deadfr, frLim, jumpfr, highScore;
let path, candy, candies, hitwall;
let customizing = false;
let tOff = 50;
let lOff = 20;
let rOff = 20;
let bOff = 100;
let scr = {width: 300, height: 450};
let pkr = {x: 0, y: 0, w: 0, y2:this.w/3};
let color = {r: 255, g: 40, b: 40, h:0, s:0.84, v:1, hx:0, x:0, y:0};
let darken = 20;


function init(){
    p = {
        x: scr.width/2,
        y: scr.height/2-10,
        r: 15,
        dx: 3,
        dy: 0,
        corner: 10
    }
    but = {
        x:scr.width/4,
        y:scr.height/5 - p.r*2,
        w:scr.width/2,
        h:p.r*2
    }
    grav = 0.3;
    jumpSpeed = 7;
    dead = false;
    frLim = 80;
    jumped = -1;
    paused = true;
    a = 0;
    score = 0;
    hitWall = true;
    spike = scr.height/15;
    spikeH = spike*2/3;
    buff = spike/3;
    side = 1; //right
    shape = 0; //rect
    wall = [0,0,0,0,0,0,0,0,0,0];
    path = [];
    candy = {
        x:scr.width-scr.width/10,
        y:buff*3+Math.floor(Math.random()*10)*(spike+buff),
        r:p.r/2,
        side: 1
    }
}

function setup() {
    createCanvas(lOff + scr.width + rOff, tOff + scr.height + bOff);
    document.getElementsByTagName("canvas")[0].addEventListener("click", (e) => {e.preventDefault()});
    rectMode(CENTER);
    textAlign(CENTER);
    highScore = 0;
    candies = 0;
    init();
    noStroke();

    pkr.x = width/15;
    pkr.w = width/2 - 2*pkr.x;
    pkr.y2 = pkr.w/4;
    pkr.y = height - height/5 - pkr.w - pkr.y2*2;
}

function draw() {
    background(150);
    if(customizing) {
        customize()
        return;
    }
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
        p.y = scr.height/2 + scr.width/25*sin(frameCount/15);
        if(cos(frameCount/15)>0) jumped = 1;
        else jumped = -1;
    }

    //Side
    if(p.x > scr.width - p.r || p.x < p.r){
        if(!dead){
            score += 1;
            side = -side;
            if(hitWall == false){
                hitWall = true;
            }
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
    if(p.y < p.r){
        p.dy = jumpSpeed/2;
        p.y = p.r;
    }

    if(dead){
        a+= 0.2*sgn(p.dx);
    }

    //Spike collision
    for(let i = 0; i<10; i++){
        if(wall[i] == 1){
            let x = side == 1 ? scr.width : 0;
            let y = buff*3 + spike*i + buff*(i+1) + spike/2;
            let rad = spikeH + p.r*3/4;
            //fill(100, 100, 0);
            //ellipse(x, y, rad, rad);
            if(sq(p.x - x) + sq(p.y - y) < sq(rad)){
                die()
            }

        }
    }

    //Candy
    if(sq(candy.x - p.x) + sq(candy.y - p.y) < sq(candy.r*3/2+p.r) && hitWall){
        candies++;
        hitWall = false;
        candy.side = -sgn(p.dx);
        if(candy.side == 1)
            candy.x = scr.width-scr.width/10;
        else
            candy.x = scr.width/10;
        candy.y = scr.height/10+Math.random()*scr.height*4/5;
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
        text("Candy: "+candies, scr.width/2, scr.height*4/5+30)
    }

    //Customization button
    if(paused && !customizing){
        fill(255);
        rect(but.x+but.w/2, but.y+but.h/2, but.w, but.h, 10);
        textSize(20);
        fill(150);
        text("Customize", but.x+but.w/2, but.y+but.h*3/4);
    }

    poop();
    //Bird
    push();
    translate(p.x, p.y);
    rotate(a);
    drawSprite();
    pop();

    //Candy
    if(!dead && !paused && hitWall){
        fill(255, 204, 0);
        ellipse(candy.x, candy.y+scr.width/25*sin(frameCount/15), candy.r*2, candy.r*2);
        triangle(candy.x, candy.y+scr.width/25*sin(frameCount/15), 
                candy.x-candy.r*2, candy.y+scr.width/25*sin(frameCount/15)-5,
                candy.x-candy.r*2, candy.y+scr.width/25*sin(frameCount/15)+5);
        
        triangle(candy.x, candy.y+scr.width/25*sin(frameCount/15), 
                candy.x+candy.r*2, candy.y+scr.width/25*sin(frameCount/15)-5,
                candy.x+candy.r*2, candy.y+scr.width/25*sin(frameCount/15)+5);
    }
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
    translate(buff/2, 0);
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
    rect(scr.width/2, scr.height+tOff/2, scr.width, tOff);
}


function touchStarted(){
    if(paused && !customizing){
        if(mouseX < but.x+but.w+lOff && mouseX > but.x+lOff && mouseY < but.y+but.h+tOff && mouseY > but.y+tOff){
            customizing = true;
            return;
        }
    }
    if(!customizing){
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
    else {
        //Bottom White part
        if(mouseY > height-height/5){
            customizing = false;
        }
        //Color picker
        else if(mouseX > pkr.x && mouseX < pkr.x+pkr.w){
            if(mouseY < pkr.y+pkr.w && mouseY > pkr.y){
                //Gornji color picker
                color.s = (mouseX-pkr.x)/pkr.w;
                color.v = 1-(mouseY-pkr.y)/pkr.w;
                let c = HSVtoRGB(color.h, color.s, color.v);
                color.r = c.r; color.g = c.g; color.b = c.b;
            }
            else if(mouseY < pkr.y+pkr.w+pkr.y2+7 && mouseY > pkr.y+pkr.w+pkr.y2-7){
                //Hue slider
                color.h = (mouseX-pkr.x)/pkr.w;
                let c = HSVtoRGB(color.h, color.s, color.v);
                color.r = c.r; color.g = c.g; color.b = c.b;
            }
        }
        //Shape
        else {
            let widthX = width/6;
            if(mouseX < width/2+widthX+p.r && mouseX > width/2+widthX-p.r && mouseY < pkr.y+p.r*2 && mouseY > pkr.y){
                //Rect
                shape = 0;
            }
            else if(sq(width/2+widthX*2 - mouseX) + sq(pkr.y+p.r - mouseY) < sq(p.r*2)){
                //Circle
                shape = 1;
            }
        }
    }
}

function touchEnded(event){
    event.preventDefault();
}

function sgn(x){
    return x > 0 ? 1 : -1;
}

function poop(){
    if(!dead){
        //Poops
        if(frameCount-jumpfr < 25){
            if(frameCount%6 == 0){
                //New poop
                path.push({x: p.x, y: p.y, r: p.r});
            }
        }
    }
    
    if(path.length > 0){
        if(path[0].r <= 0){
            path.splice(0,1);
        }
    }
    for(let i = 0; i<path.length; i++){
        fill(color.r, color.g, color.b);
        ellipse(path[i].x, path[i].y, path[i].r, path[i].r);
        path[i].r -= 0.7;
    }
}

function drawSprite(){
    fill(90);

    
    noStroke();
    //Body ------
    //rect(0, 0, p.r*2, p.r*2, 5)   unicolor
    //255, 40, 40 dobra crvena
    if(!dead)fill(color.r, color.g, color.b);
    if(shape == 0){
        rect(0, 0, p.r*2, p.r*2, p.corner);
    }
    else{
        ellipse(0, 0, p.r*2, p.r*2, p.corner);
    }
    //Tail
    triangle(-side*p.r*2/3, p.r*2/3, -side*p.r/2, -p.r/2, -side*p.r*3/2, -p.r/2);
    //Bottom half
    if(shape == 0){
        if(!dead)fill(color.r-darken, color.g-darken, color.b-darken);
        rect(0, p.r/2, p.r*2, p.r, 0, 0, p.corner, p.corner);
    }
    //Wing ------
    //fill(207, 25, 25)
    if(!dead) fill(color.r-darken*3, color.g-darken*3, color.b-darken*3);
    triangle(0, 0, -side*p.r*2/3, 0, -side*p.r*2/3, -jumped*p.r*2/3); //poslednje menjaj za gore dole

    //Beak ------
    push();
    if(shape == 1) translate(-side*p.r/10, 0);
    if(!dead)fill(255, 220, 0);
    triangle(side*p.r, -p.r/2, side*p.r, 0, side*p.r*3/2, 0);
    if(!dead)fill(240, 200, 0);
    triangle(side*p.r, p.r/2, side*p.r, 0, side*p.r*3/2, 0);
    pop();

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

function customize(){
    let bottom = scr.heigth/5;
    //fill(0);
    //rect(pkr.x+pkr.w/2, pkr.y+pkr.w/2, pkr.w, pkr.w);
    for(let i = 0; i<pkr.w; i+=10){
        for(let j = 0; j<pkr.w; j+=10){
            let s = (i/pkr.w);
            let v = 1-(j/pkr.w);
            let col = HSVtoRGB(color.h, s, v);
            fill(col.r, col.g, col.b);
            rect(pkr.x+i, pkr.y+j, 15, 15);
        }
    }

    fill(color.r, color.g, color.b);
    stroke(0);
    ellipse(pkr.x+color.s*pkr.w, pkr.y+pkr.w*(1-color.v), 15, 15);
    noStroke();

    //fill(0);
    //rect(pkr.x+pkr.w/2, pkr.y+pkr.w+pkr.y2, pkr.w, pkr.y2/2);
    for(let i = 0; i<pkr.w; i+=5){
        let col = HSVtoRGB(i/pkr.w, 1, 1);
        fill(col.r, col.g, col.b);
        rect(pkr.x+i, pkr.y+pkr.w+pkr.y2, 15, 15);
    }
    fill(255);
    rect(pkr.x+color.h*pkr.w, pkr.y+pkr.w+pkr.y2, 5, pkr.y2/2);


    //Choose shape
    let widthX = width/6;
    //Rect
        fill(190);
        if(shape == 0) fill(color.r, color.g, color.b);
        rect(width/2+widthX, pkr.y+p.r, p.r*2, p.r*2, p.corner);
    //Circle
        fill(190);
        if(shape == 1) fill(color.r, color.g, color.b);
        ellipse(width/2+widthX*2, pkr.y+p.r, p.r*2, p.r*2);


    //Bottom where i wanna put the preview and its the back button
    fill(240);
    rect(width/2, height-height/10, width, height/5);
    
    textSize(20);
    fill(150);
    text("Back", 40, height-15);

    push();
    translate(width/2, height-height/10+scr.width/25*sin(frameCount/15));
    if(cos(frameCount/15)>0) jumped = 1;
    else jumped = -1;
    drawSprite();
    pop();

}



function HSVtoRGB(h, s, v) {
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
