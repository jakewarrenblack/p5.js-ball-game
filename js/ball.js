class Ball{
    constructor(x,y,rad,speed,hSpeed,alive = true,accelerometerX){
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.speed = speed;
        this.hSpeed = hSpeed;
        this.alive = alive;
        // Values for mobile controls
        this.accelerometerX = accelerometerX;
    }

    applyGravity(){
        this.speed+=gravity;
        this.y += this.speed;
        // Airfriction constantly acting on the ball, reducing its speed as it moves
        this.speed -= (this.speed * airFriction);
    }

    bounceBottom(surface){
        this.y = surface-(this.rad/2);
        // Change direction
        this.speed*=-1;
        // Collision with a surface will reduce speed
        this.speed -= (this.speed * friction);
    }

    bounceTop(surface){
        this.y = surface+(this.rad/2);
        // Change direction
        this.speed*=-1;
        this.speed -= (this.speed * friction);
    }

    bounceLeft(surface){
        // Don't let ball intersect with side, just touch
        this.x = surface+(this.rad/2);
        // Apply force to reduce speed on collision
        this.hSpeed-=(this.hSpeed * friction);
    }

    bounceRight(surface){
        this.x = surface-(this.rad/2);
        this.hSpeed -= (this.hSpeed * friction);
    }
    

    remainOnScreen(){
        // if ball hit floor
        if(this.y+(this.rad/2) > height){
            this.bounceBottom(height);
        }
        // if ball hit ceiling
        if(this.y-(this.rad/2) <0){
            this.bounceTop(0);
        }

        if(this.x-(this.rad/2) < 0){
            this.bounceLeft(0);
        }
        // if ball hit right side
        if(this.x+(this.rad/2) > width){
            this.bounceRight(width);
        }
    }

    jump(){
        if(keyIsDown(UP_ARROW)){
            this.bounceBottom(this.y)
        }                            
    }

    roll_L(){
        if(keyIsDown(LEFT_ARROW) || this.accelerometerX > 0){
            this.x-=(this.hSpeed);
        }
    }

    roll_R(){
        if(keyIsDown(RIGHT_ARROW) || this.accelerometerX < 0){
            this.x+=(this.hSpeed);
        }
    }

    checkDeath(object){
        // If we've gone past the bottom OR we've hit the top
        if(this.y >= height-this.rad/2 || this.y <= 0+this.rad/2){
            this.alive = false;
        }
    }

}