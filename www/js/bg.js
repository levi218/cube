class Particle {
    constructor(x, y, z, color, updateFunc) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;
        this.update = updateFunc;
        this.radius = random(1000)
        this.phase = random(TWO_PI);
    }
    draw() {
        push();
        translate(this.x, this.y, this.z);
        rotateX(this.phase);
        rotateY(this.phase);
        rotateZ(this.phase);
        noStroke();
        emissiveMaterial(this.color);
        box(10);
        stroke(255);
        noFill();
        box(15);
        pop();
    }
}
var bgParticleSystem = {
    init: function (x,y) {
        this.x = x;
        this.y = y;
        this.z = -CUBE_SIZE * 2;
        this.particles = [];
        for (let i = 0; i < 20; i++) {
            this.particles.push(new Particle(0, random(CUBE_SIZE), 0, color(200 + random(55), 200 + random(55), 200 + random(55), 125), function () {
                let dScale = 3;
                this.radius += 0.1;
                this.phase+=0.001;
                if (this.radius > 1000) { this.radius = random(1000) }
                this.x = this.radius * sin(t / 2000.0 + this.phase);
                this.y = this.radius * cos(t / 2000.0 + this.phase);
            }));
        }
    },
    draw() {
        push();
        translate(this.x, this.y, this.z);
        this.particles.forEach(p => {
            p.update();
            p.draw();
        })
        pop();
    }
}