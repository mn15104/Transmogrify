
var canvas = document.getElementById('left_particle'),
   can_w = parseInt(canvas.getAttribute('width')),
   can_h = parseInt(canvas.getAttribute('height')),
   ctx = canvas.getContext('2d');
var max_balls = 50;
// ctx.globalCompositeOperation='destination-over';

// console.log(typeof can_w);

var ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      alpha: 1,
      phase: 0
   },
   ball_color = {
       r: 207,
       g: 70,
       b: 70
   },
   R = 2,
   balls = [],
   alpha_f = 0.03,
   alpha_phase = 0,
    
// Line
   link_line_width = 0.8,
   dis_limit = 260,
   add_mouse_point = true,
   mouse_in = false,
   mouse_ball = {
      x: can_w/2,
      y: can_h/2,
      vx: 0,
      vy: 0,
      r: 0,
      type: 'mouse'
   }

// Random speed
function getRandomSpeed(pos){
    var  min = -2,
       max = 2;
    switch(pos){
        case 'top':
            return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
            break;
        case 'right':
            return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
            break;
        case 'bottom':
            return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
            break;
        case 'left':
            return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
            break;
        default:
            return;
            break;
    }
}
function randomArrayItem(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomNumFrom(min, max){
    return Math.random()*(max - min) + min;
}

// Random Ball
function getRandomBall(){
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch(pos){
        case 'top':
            return {
                x: randomSidePos(can_w),
                y: -R,
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'right':
            return {
                x: can_w + R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'bottom':
            return {
                x: randomSidePos(can_w),
                y: can_h + R,
                vx: getRandomSpeed('bottom')[0],
                vy: getRandomSpeed('bottom')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'left':
            return {
                x: -R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('left')[0],
                vy: getRandomSpeed('left')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
    }
}
function randomSidePos(length){
    return Math.ceil(Math.random() * length);
}
console.log(screen.width);
// Draw Ball
function renderBalls(){
    Array.prototype.forEach.call(balls, function(b){
       if(!b.hasOwnProperty('type')){
           ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
           ctx.beginPath();
           ctx.arc(b.x, b.y, R*1.4, 0, Math.PI*2, true);
           ctx.closePath();
           ctx.fill();
       }
    });
}

// Update balls
function updateBalls(){
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        b.x += b.vx;
        b.y += b.vy;
        
        if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
           new_balls.push(b);
        }
        
        // alpha change
        b.phase += alpha_f;
        b.alpha = Math.abs(Math.cos(b.phase));
        // console.log(b.alpha);
    });
    
    balls = new_balls.slice(0);
}

// loop alpha
function loopAlphaInf(){
    
}

// Draw lines
function renderLines(){
    var fraction, alpha;
    for (var i = 0; i < balls.length; i++) {
        for (var j = i + 1; j < balls.length; j++) {
           
           fraction = getDisOf(balls[i], balls[j]) / dis_limit;
            
           if(fraction < 1){
               alpha = (1 - fraction).toString();
             
               if(balls[i].x <= can_w/2 && balls[j].x > can_w/2) {
                    iy_greater = balls[i].y > balls[j].y;    
                    y_diff = (balls[j].y - balls[i].y);
                    if(iy_greater){
                        y_diff = (balls[j].y - balls[i].y);
                    }
                    line_width = link_line_width * ((can_w/2 - balls[i].x)/(balls[j].x - balls[i].x));
                    x_frac = ((can_w/2 - balls[i].x)/(balls[j].x - balls[i].x));
                    //173, 68, 27
                    ctx.strokeStyle = 'rgba(255,255,255,'+255+')';
                    ctx.lineWidth = link_line_width * ((can_w/2 - balls[i].x)/(balls[j].x - balls[i].x));
                    ctx.beginPath();    
                    ctx.moveTo(balls[i].x, balls[i].y);
                    ctx.lineTo(can_w/2, balls[i].y + x_frac * y_diff );
                    ctx.stroke();
                    ctx.closePath();
                    
                    ctx.strokeStyle = 'rgba(173, 68, 27,'+255+')';
                    ctx.lineWidth =  link_line_width - link_line_width * ((can_w/2 - balls[i].x)/(balls[j].x - balls[i].x));
                    ctx.beginPath();  
                    ctx.moveTo(can_w/2, balls[i].y + x_frac * y_diff);
                    ctx.lineTo(balls[j].x, balls[j].y);
                    ctx.stroke();
                    ctx.closePath();
               }
               else if(balls[j].x <= can_w/2 && balls[i].x > can_w/2) {
                    jy_greater = balls[i].y < balls[j].y;    
                    y_diff = (balls[i].y - balls[j].y);
                    if(jy_greater){
                        y_diff = (balls[j].y - balls[i].y);
                    }
                    line_width = link_line_width * ((can_w/2 - balls[j].x)/(balls[i].x - balls[j].x));
                    x_frac = ((can_w/2 - balls[j].x)/(balls[i].x - balls[j].x));
                    ctx.strokeStyle = 'rgba(255,255,255,'+255+')';
                    ctx.lineWidth = line_width;
                    ctx.beginPath();    
                    ctx.moveTo(balls[j].x, balls[j].y);
                    ctx.lineTo(can_w/2, balls[j].y + x_frac * y_diff );
                    ctx.stroke();
                    ctx.closePath();
                    
                    ctx.strokeStyle = 'rgba(173, 68, 27,'+255+')';
                    ctx.lineWidth = link_line_width - line_width;
                    ctx.beginPath();  
                    ctx.moveTo(can_w/2, balls[j].y + x_frac * y_diff );
                    ctx.lineTo(balls[i].x, balls[i].y);
                    ctx.stroke();
                    ctx.closePath();
               }
               else if(balls[j].x <= can_w/2 && balls[i].x <= can_w/2){
                    ctx.strokeStyle = 'rgba(255,255,255,'+255+')';
                    ctx.lineWidth = link_line_width;
                    ctx.beginPath();
                    ctx.moveTo(balls[i].x, balls[i].y);
                    ctx.lineTo(balls[j].x, balls[j].y);
                    ctx.stroke();
                    ctx.closePath();
               }
               else{
                    ctx.strokeStyle = 'rgba(190, 88, 47,'+255+')';
                    ctx.lineWidth = link_line_width;
                    ctx.beginPath();
                    ctx.moveTo(balls[i].x, balls[i].y);
                    ctx.lineTo(balls[j].x, balls[j].y);
                    ctx.stroke();
                    ctx.closePath();
               }
           }
        }
    }
}

// calculate distance between two points
function getDisOf(b1, b2){
    var  delta_x = Math.abs(b1.x - b2.x),
       delta_y = Math.abs(b1.y - b2.y);
    
    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}

// add balls if there a little balls
function addBallIfy(){
    if(balls.length < max_balls){
        balls.push(getRandomBall());
    }
}

// Render
function render(){
    ctx.clearRect(0, 0, can_w, can_h);
    
    renderBalls();
    
    renderLines();
    
    updateBalls();
    
    addBallIfy();
    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num){
    for(var i = 1; i <= num; i++){
        balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        });
    }
}
// Init Canvas
function initCanvas(){
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    
    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));
}
window.addEventListener('resize', function(e){
    initCanvas();
});

function goMovie(){
    initCanvas();
    initBalls(max_balls);
    window.requestAnimationFrame(render);
}
goMovie();

// Mouse effect
canvas.addEventListener('mouseenter', function(){
    mouse_in = true;
    balls.push(mouse_ball);
});
canvas.addEventListener('mouseleave', function(){
    console.log('mouseleave');
    mouse_in = false;
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        if(!b.hasOwnProperty('type')){
            new_balls.push(b);
        }
    });
    balls = new_balls.slice(0);
});
canvas.addEventListener('mousemove', function(e){
    var e = e || window.event;
    mouse_ball.x = e.pageX;
    mouse_ball.y = e.pageY;
    // console.log(mouse_ball);
});
