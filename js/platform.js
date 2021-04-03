
class Platform{
    
    // If not otherwise set, speed is 2
    // 15s interval between speed increases
    // Up to a certain peak
    constructor(width,height,x,y,speed = 2,interval = 15000,lastAddition = 0, maxSpeed = 11,fill = 'rgb(0,200,255)',hasBeenReset = false){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;        
        this.speed = speed;
        this.interval = interval;
        this.lastAddition = lastAddition;
        this.maxSpeed = maxSpeed;
        this.fill = fill;
        this.hasBeenReset;
    }
    
    bounceBottom(surface){
        this.y = surface-(this.rad/2);
        // Change direction
        this.speed*=-1;
        // Collision with a surface will reduce speed
        this.speed -= (this.speed * friction);
    }

    checkCollision(object){
        if(object.x+(object.rad/2) > this.x-(this.width/2) && object.x-(object.rad/2) < this.x+(this.width/2)){
            // dist, p5 function to calculate distance from two xy points       
            // Check distance between object and platform now, we already know it's between the edges of the platform
            if (dist(object.x, object.y, object.x, this.y)<=(object.rad/2)){
                object.bounceBottom(this.y);            
            }     
        }
    }

    update(track,time){
        if(time-this.lastAddition > this.interval && this.speed<=this.maxSpeed){
            this.speed++;
            // Convert to decimal, value should be a float between 0 and 4
            track.rate+=this.speed-1/5;
            // Set lastAddition to time which has passed
            this.lastAddition = time;
        }

        if(this.speed == 3){
            //green
            this.fill = 'rgb(132,222,2)';
        }

        if(this.speed == 4){
            // yellow
            this.fill = 'rgb(255,255,51)';
        }

        if(this.speed == 5){
            //red
            this.fill = 'rgb(175,0,42)';   
        }
    }

    hide(object,context){
        // If ball has left the starter platform, hide it
        if(object.y > this.y+this.height/2){
            this.width = 0;
            this.height = 0;
            this.y = -50;
            if(!this.hasBeenReset){
                context.resetSketch();
                this.hasBeenReset = true;
            }
            return true;
        }
    }
}