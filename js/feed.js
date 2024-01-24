class Feed {
  constructor(arg1, arg2, arg3) {
    this.pos = createVector(arg1, arg2);
    this.rad = arg3 || 10;
    this.isEaten = 0;
    
    // food timer
    this.foodTime = 0;
    this.foodInc = 0.005;
    this.foodMag = 10;
  }

  getIsEaten() {
    return this.isEaten;
  }
  
  getPos() {
    return this.pos;
  }

  show() {
    this.foodTime += this.foodInc;
    const xPos = this.pos.x + map(noise(this.foodTime), 0, 1, -this.foodMag, this.foodMag);
    this.foodTime += this.foodInc;
    const yPos = this.pos.y + map(noise(this.foodTime), 0, 1, -this.foodMag, this.foodMag);
    
    fill(color(208, 207, 187));
    noStroke();
    ellipse(xPos, yPos, this.rad, this.rad);
  }

  update(arg1) {
    let distance;
    for (let i = 0; i < arg1.length; i++) {
      distance = p5.Vector.dist(arg1[i].getPos(), this.pos);
      //if (distance <= 15) {
      if (distance <= segSizes[0] * 2) {
        this.isEaten = 1;
        break;
      }
    }
  }
}