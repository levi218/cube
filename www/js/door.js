
var door = {
    x: 0,
    y: 7,
    z: 0,
    particles: [],
    init: function (x0, y0, z0) {
        this.x = x0;
        this.y = y0;
        this.z = z0;
    },
    draw: function (colorId) {
        push();
        translate(this.x * CUBE_SIZE, this.y * CUBE_SIZE, this.z * CUBE_SIZE);
        noStroke();
        ambientMaterial(primaryColor[colorId][0], primaryColor[colorId][1], primaryColor[colorId][2]);
        box(CUBE_SIZE);

        // PAD
        translate(0, 0, CUBE_SIZE / 2);
        ambientMaterial(123, 177, 32);
        // box(CUBE_SIZE*1.2,CUBE_SIZE*1.2,4)
        // rotate(PI/4);
        // box(CUBE_SIZE*1.2,CUBE_SIZE*1.2,4)

        // ambientMaterial(222, 177, 32);
        box(CUBE_SIZE * 0.7, CUBE_SIZE * 0.7, 7)
        // rotate(PI/4);
        // box(CUBE_SIZE*0.7,CUBE_SIZE*0.7,7)

        ambientMaterial(123, 222, 99);
        box(CUBE_SIZE * 0.3, CUBE_SIZE * 0.3, 10)
        // rotate(PI/4);
        // box(CUBE_SIZE*0.3,CUBE_SIZE*0.3,10)
        // GATE
        // ambientMaterial(125, 123, 80);
        // translate(-CUBE_SIZE/2+5,0,CUBE_SIZE/2);
        // box(9,CUBE_SIZE-1, CUBE_SIZE*2);
        // translate(CUBE_SIZE-10, 0, 0);
        // box(9,CUBE_SIZE-1, CUBE_SIZE*2);
        // // first roof
        // translate(-CUBE_SIZE/2+5, 0, CUBE_SIZE);
        // box(CUBE_SIZE-1,CUBE_SIZE-1, 10);
        // translate(0, 0, CUBE_SIZE/3.0);
        // box(CUBE_SIZE*2.0/3,CUBE_SIZE*2.0/3, 2*CUBE_SIZE/3.0);
        // translate(0, 0, CUBE_SIZE/3.0);
        // box(CUBE_SIZE*1.0/3,CUBE_SIZE*1.0/3, 1*CUBE_SIZE/3.0);

        // PORTAL
        // translate(0, 0, CUBE_SIZE)
        // this.particles.forEach(p => {
        //     p.update();
        //     p.draw();
        // })
        // pop();

        // TURNING CUBE
        ambientMaterial(123, 177, 32);
        translate(0, 0, CUBE_SIZE * (1.5 + sin(t / 50.0) / 2));
        rotateZ(t / 50.0);
        rotateX(PI / 4);
        rotateY(PI / 4);
        box(CUBE_SIZE / 2);
        pop();
    }
}