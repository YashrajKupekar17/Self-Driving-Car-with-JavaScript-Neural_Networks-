class Car{
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.acceleration = 0.3;
        this.maxSpeed = 5;
        this.friction = 0.05;
        this.angle = 0;
        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(RoadBorders) {
        this.#move();
        this.sensor.update(RoadBorders);
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

    draw(ctx) {
        // Save the current canvas state
        ctx.save();

        // Translate the canvas origin to the car's position
        ctx.translate(this.x,this.y);

        // Rotate the canvas by the negative angle of the car
        ctx.rotate(-this.angle);

        // Start drawing the car
        ctx.beginPath();
        ctx.rect(
            -this.width/2,  // Fix to center the car correctly
            -this.height/2, // Fix to center the car correctly
            this.width,
            this.height
        );
        ctx.fill();

        // Restore the canvas state
        ctx.restore();
        this.sensor.draw(ctx);
    }
}
