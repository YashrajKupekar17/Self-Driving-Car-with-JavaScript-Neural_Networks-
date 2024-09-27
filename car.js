class Car{
    constructor(x, y, width, height,constrolType,maxSpeed=3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.acceleration = 0.3;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;
        if(constrolType === "KEYS"){
            this.sensor = new Sensor(this);
        }
        this.controls = new Controls(constrolType);
    }

    update(RoadBorders,traffic) {
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(RoadBorders,traffic);
        }
        if(this.sensor){
            this.sensor.update(RoadBorders,traffic);
        }
    }
    #assessDamage(RoadBorders,traffic){
        for(let i=0;i<RoadBorders.length;i++){
            if(polyIntersect(this.polygon,RoadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polyIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }
    #move(){

        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        // Limiting speed
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed <-this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        // Applying friction
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed<0) {
            this.speed +=this.friction;
        }

        // Stop car if speed is too low
        if (Math.abs(this.speed)<this.friction) {
            this.speed = 0;
        }

        // Turning logic
        // Check if the car is moving
        if (this.speed != 0) {
            const flip = this.speed>0 ? 1:-1;
            const turningSpeed = Math.min(0.05,1/Math.abs(this.speed+0.1));  // Slower turns at higher speeds

            // Turn left if the left control is pressed
            if (this.controls.left) {
            this.angle += turningSpeed*flip;
            }

            // Turn right if the right control is pressed
            if (this.controls.right) {
            this.angle -= turningSpeed*flip;
            }
        }

        // Update car's position
        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
    }
    #createPolygon(){
        const points  = [];
        const rad = Math.hypot(this.width,this.height)/2;
        const alpha = Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI +this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI +this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI + this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI + this.angle+alpha)*rad
        });
        console.log("Polygon points:", points);  // Debugging line
        return points;
    }

    draw(ctx,color) {
        if(this.damaged){
            ctx.fillStyle = "gray";
        }
        else{
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if(this.sensor){
            this.sensor.draw(ctx);
        }
    }
}
