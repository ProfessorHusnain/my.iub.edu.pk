// Click to trigger ripple 
// Inspired by https://dribbble.com/shots/1847752-L-forms and https://www.openprocessing.org/sketch/446986
let forms = [];
let ripples = [];
let dots = [];
let cellSize;
let pos;
let active = false;
let pulseAnim = false;
let displayRipple = false;

function setup() {
  var c = createCanvas(windowWidth, windowHeight).id("lForms");

  background(0);
  noStroke();
  rectMode(CENTER);

  // setup forms
  pos = createVector(windowWidth / 2, windowHeight / 2, 0);
  forms.push(new Form(pos.x, pos.y));
  cellSize = forms[0].rectSize * 0.353125;

  document.getElementById("lForms").addEventListener("mouseleave", function(event) {
    pos.z = -1;
  });
  document.getElementById("lForms").addEventListener("mouseenter", function(event) {
    pos.z = 0;
  });

  // setup dots
  var index = 0;
  var x = 0;
  while (x < windowWidth) {
    var y = 0;
    while (y < windowHeight) {
      dots.push(new Dot(x, y, index));
      y += cellSize;
      index++;
    }
    x += cellSize;
  }
  
  ripples.push(new Ripple(pos.x, pos.y));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  blendMode(BLEND);
  background(0);

  // create forms
  createForms();

  // draw forms
  for (let i = 0; i < forms.length; i++) {
    if (forms[i].isAlive == true) {
      forms[i].display();
      forms[i].update();
    } else {
      forms.splice(i, 0);
    }
  }

  // draw ripples
  for (let i = 0; i < ripples.length; i++) {
    ripples[i].update();
    if (displayRipple) ripples[i].display();
  }

  // draw dots
  for (let i = 0; i < dots.length; i++) {
    dots[i].calcDiff(ripples);
    dots[i].display();
  }
}

function createForms() {
  var x = 0;
  while (x < windowWidth) {
    var y = 0;
    while (y < windowHeight) {
      if (mouseX < x + cellSize / 2 && mouseX > x - cellSize / 2 && mouseY < y + cellSize / 2 && mouseY > y - cellSize / 2) {
        let newPos = createVector(x, y);
        if (pos.x == newPos.x && pos.y == newPos.y) {} else {
          if (mouseX > 0 && mouseY > 0) {
            pos = newPos;
            forms.push(new Form(pos.x, pos.y));
          }
        }
      }
      y += cellSize;
    }
    x += cellSize;
  }
}

class Form {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.rectSize = 80;
    this.rectSizeUpdate = 0;

    this.c1 = color(0, 21, 26);
    this.c2 = color(0, 74, 89);
    this.rectColor = this.c1;
    this.rectColorUpdate = 0;

    this.rectCorner = Math.sqrt(Math.pow(this.rectSize, 2) * 2) / 2;
    this.rectCornerUpdate = 0;

    this.dotCornerSize = 3;
    this.dotCornerSizeUpdate = 0;

    this.dotCenterSize = 6;
    this.dotCenterSizeUpdate = 0;

    this.openComp1Duration = 20;
    this.openComp2Duration = 20;
    this.openCompsDuration = this.openComp1Duration + this.openComp2Duration;
    this.openTime = 0;

    this.closeComp1Duration = 20;
    this.closeComp2Duration = 20;
    this.closeComp2DotCornerDelay = 10;
    this.closeCompsDuration = this.closeComp1Duration + this.closeComp2Duration;
    this.closeTime = 0;
    this.isClosing = false;

    this.isAlive = true;

    this.activeSize = 0.5;
    this.activeDuration = 5;
    this.activeTime = 0;
    this.activeUpdate = 0;
    this.pressed = false;
    this.released = true;
  }

  update() {
    // trigger trail anim
    if (this.openTime < this.openCompsDuration) {
      this.openTime++;
      this.open();
    } else if (this.openTime == this.openCompsDuration && pos.x != this.x || pos.y != this.y || pos.z == -1) {
      this.isClosing = true;
    }

    if (this.isClosing) {
      this.closeTime++;
      this.close();
    }

    // trigger active anim
    if (active == true && this.openTime == this.openCompsDuration && this.closeTime == 0) this.shrink();
    else if (active == false && this.openTime == this.openCompsDuration && this.closeTime == 0) this.grow();
  }

  open() {
    if (this.openTime <= this.openComp1Duration) {
      this.dotCenterSizeUpdate = easeOutQuad(this.openTime, 0, this.dotCenterSize, this.openComp1Duration);
    }
    if (this.openTime > this.openComp1Duration && this.openTime <= this.openCompsDuration) {
      this.rectSizeUpdate = easeOutQuad(this.openTime - this.openComp1Duration, 0, this.rectSize, this.openComp2Duration);
      this.rectCornerUpdate = easeOutQuad(this.openTime - this.openComp1Duration, 0, this.rectCorner, this.openComp2Duration);
      if (this.dotCornerSizeUpdate !== this.dotCornerSize) {
        this.dotCornerSizeUpdate = this.dotCornerSize;
      }
    }
  }

  close() {
    if (this.closeTime <= this.closeComp1Duration) {
      this.rectSizeUpdate = easeInQuad(this.closeTime, this.rectSizeUpdate, -this.rectSizeUpdate, this.closeComp1Duration);
      this.rectCornerUpdate = easeInQuad(this.closeTime, this.rectCornerUpdate, -this.rectCornerUpdate, this.closeComp1Duration);
    }
    if (this.closeTime > this.closeComp1Duration && this.closeTime <= this.closeCompsDuration) {
      this.dotCenterSizeUpdate = easeInQuad(this.closeTime - this.closeComp1Duration, this.dotCenterSizeUpdate, -this.dotCenterSizeUpdate, this.closeComp2Duration);
      if (this.dotCornerSizeUpdate !== 0 && this.closeTime == this.closeComp1Duration + this.closeComp2DotCornerDelay) {
        this.dotCornerSizeUpdate = 0;
      }
    }
    if (this.closeTime == this.closeCompsDuration) {
      this.isAlive = false;
    }
  }

  shrink() {
    if (!this.pressed) {
      this.pressed = true;
      this.released = false;
    }
    if (this.activeTime < this.activeDuration) {
      this.activeTime++;
      this.rectSizeUpdate = easeOutQuad(this.activeTime, this.rectSize, -this.rectSize * this.activeSize, this.activeDuration);
      this.rectCornerUpdate = easeOutQuad(this.activeTime, this.rectCorner, -this.rectCorner * this.activeSize, this.activeDuration);
      this.rectColorUpdate = easeInQuad(this.activeTime, 0, 1, this.activeDuration);
      this.rectColor = lerpColor(this.c1, this.c2, this.rectColorUpdate);
    }
  }

  grow() {
    if (!this.released) {
      this.released = true;
      this.pressed = false;
    }
    if (this.activeTime > 0) {
      this.activeTime--;
      this.rectSizeUpdate = easeInQuad(this.activeTime, this.rectSize, -this.rectSize * this.activeSize, this.activeDuration);
      this.rectCornerUpdate = easeInQuad(this.activeTime, this.rectCorner, -this.rectCorner * this.activeSize, this.activeDuration);
      this.rectColorUpdate = easeOutQuad(this.activeTime, 1, -1, this.activeDuration);
      this.rectColor = lerpColor(this.c2, this.c1, this.rectColorUpdate);
    }
  }

  display() {
    push();

    translate(this.x, this.y);

    // square
    blendMode(SCREEN);
    fill(this.rectColor);
    push();
    rotate(PI / 4);
    rect(0, 0, this.rectSizeUpdate, this.rectSizeUpdate);
    rotate(-PI / 4);
    pop();

    // dots
    fill(255);
    ellipse(0, 0, this.dotCenterSizeUpdate, this.dotCenterSizeUpdate); // center
    ellipse(0, -this.rectCornerUpdate, this.dotCornerSizeUpdate, this.dotCornerSizeUpdate); // top
    ellipse(this.rectCornerUpdate, 0, this.dotCornerSizeUpdate, this.dotCornerSizeUpdate); // right
    ellipse(0, this.rectCornerUpdate, this.dotCornerSizeUpdate, this.dotCornerSizeUpdate); // bottom
    ellipse(-this.rectCornerUpdate, 0, this.dotCornerSizeUpdate, this.dotCornerSizeUpdate); // left

    pop();
  }
}

class Ripple {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = 2 * Math.sqrt(Math.pow(windowWidth, 2) + Math.pow(windowWidth, 2));
    this.radiusUpdate = 0;
    this.scale = 1;

    this.rippleTime = 0;
    this.rippleDuration = 300;

    this.dists = [];
    this.angles = [];
  }

  update() {
    if (this.rippleTime < this.rippleDuration) {
      this.rippleTime++;
      this.radiusUpdate = easeOutQuad(this.rippleTime, 0, this.radius, this.rippleDuration);
    } else {
      ripples.splice(ripples.indexOf(this), 1);
    }
  }

  display() {
    push();

    translate(this.pos.x, this.pos.y);

    fill(255, 0, 0, 20)
    ellipse(0, 0, this.radiusUpdate, this.radiusUpdate);

    pop();
  }
}

class Dot {
  constructor(x, y, id) {
    this.pos = createVector(x, y);
    this.id = id;
    this.radius = 0;
    this.amp = 0;
    this.moveDistance = 50;
    this.moveRange = 300;
    this.scale = 0.2;
  }

  calcDiff(ripples) {
    this.diff = createVector(0, 0);
    this.amp = 0;

    ripples.forEach((ripple, i) => {
      if (!ripple.dists[this.id]) {
        ripple.dists[this.id] = dist(this.pos.x, this.pos.y, ripple.pos.x, ripple.pos.y);
      }
      let distance = ripple.dists[this.id] - ripple.radiusUpdate;
      if (distance < 0 && distance > -this.moveRange * 2) {
        if (!ripple.angles[this.id]) {
          ripple.angles[this.id] = p5.Vector.sub(this.pos, ripple.pos).heading();
        }
        const angle = ripple.angles[this.id];
        const localAmp = cubicInOut(-abs(this.moveRange + distance) + this.moveRange, 0, this.moveDistance, ripple.rippleDuration) * ripple.scale;
        this.amp += localAmp;
        const movement = p5.Vector.fromAngle(angle).mult(localAmp);
        this.diff.add(movement);
      }
    });
  }

  display() {
    fill(255);
    ellipse(this.pos.x + this.diff.x, this.pos.y + this.diff.y, (this.radius + this.amp * this.scale), (this.radius + this.amp * this.scale));
  }
}

function mousePressed() {
  if (!active) {
    active = true;
    rippleAnim = true;
    createForms();
    ripples.push(new Ripple(pos.x, pos.y));
  }
}

function mouseReleased() {
  if (active) {
    active = false;
  }
}

// Penner easeing functions
function easeOutQuad(t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
}

function easeInQuad(t, b, c, d) {
  return c * (t /= d) * t + b;
}

function cubicInOut(t, b, c, d) {
  if (t <= 0) return b;
  else if (t >= d) return b + c;
  else {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }
}