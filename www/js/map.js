
class Cell {
    constructor(x, y, z, type = CELL.EMPTY, phase = Math.random() * PI) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.type = type;
        this.phase = phase;
    }
    get height() {
        switch (this.type) {
            case CELL.EMPTY:
                return 0;
            case CELL.FILL:
                return CUBE_SIZE;
            case CELL.STAIR:
                return CUBE_SIZE * abs(sin(this.phase))
        }
    }
    draw(colorId) {
        push();
        translate(this.x * CUBE_SIZE, this.y * CUBE_SIZE, this.z * CUBE_SIZE);
        noStroke()
        switch (this.type) {
            case CELL.EMPTY:
                break;
            case CELL.FILL:
                ambientMaterial(primaryColor[colorId][0], primaryColor[colorId][1], primaryColor[colorId][2]); // TODO: color to global array
                box(CUBE_SIZE);
                break;
            case CELL.STAIR:
                ambientMaterial(primaryColor[colorId][0]-30, primaryColor[colorId][1]-30, primaryColor[colorId][2]-30);
                let offset = (CUBE_SIZE - this.height) / 2
                translate(0, 0, -offset);
                box(CUBE_SIZE, CUBE_SIZE, this.height);// ;
                this.phase += 0.02;
                break;
        }
        pop();
    }
}
function randInt(limit) {
    return Math.floor(Math.random() * limit);
}
class GameMap {
    constructor(sizeX, sizeY, sizeZ) {
        if (typeof sizeX == 'number') {
            // random color mode
            this.color = randInt(primaryColor.length);
            this.size = {
                x: sizeX,
                y: sizeY,
                z: sizeZ
            }
            if(!score) score = 0;
            let destinatedPathLength = (10 + score) > 50?50:(10 + score);
            this.clearMap();
            this.travelMap(0, 0, 0, { value: 0 }, 0, destinatedPathLength);
            this.finalizeMap();
        } else {
            let mapData = sizeX;
            // load color
            this.color = sizeY;
            this.arr = mapData;
            this.size = {
                z: mapData.length,
                x: mapData[0].length,
                y: mapData[0][0].length
            }
            for (let z = 0; z < this.size.z; z++) {
                for (let x = 0; x < this.size.x; x++) {
                    for (let y = 0; y < this.size.y; y++) {
                        this.arr[z][x][y] =
                            new Cell(
                                this.arr[z][x][y].x,
                                this.arr[z][x][y].y,
                                this.arr[z][x][y].z,
                                this.arr[z][x][y].type,
                                this.arr[z][x][y].phase
                            )
                    }
                }
            }
        }
    }
    clearMap() {
        this.arr = [];
        for (let z = 0; z < this.size.z; z++) {
            let layer = []
            for (let x = 0; x < this.size.x; x++) {
                let col = [];
                for (let y = 0; y < this.size.y; y++) {
                    col.push(new Cell(x, y, z));
                }
                layer.push(col)
            }
            this.arr.push(layer)
        }
        this.arr[0][0][0].type = CELL.FILL;
    }
    // init() {

    //     // let destinatedPathLength = 40
    //     this.clearMap();
    //     this.travelMap(0, 0, 0, { value: 0 }, 0,destinatedPathLength);
    //     this.finalizeMap();
    // }
    isValidCoordinate(x, y, z) {
        return x >= 0 && y >= 0 && z >= 0 && x < this.size.x && y < this.size.y && z < this.size.z;
    }
    isValidCoordinateBlock(x, y, z) {
        return x >= 0 && y >= 0 && z >= 0 && x < this.size.x && y < this.size.y && z < this.size.z - 1;
    }
    isEmpty(x, y, z) {
        return this.arr[z][x][y].type == CELL.EMPTY;
    }
    isSolid(x, y, z) {
        return this.arr[z][x][y].type == CELL.FILL;
    }
    isStair(x, y, z) {
        return this.arr[z][x][y].type == CELL.STAIR;
    }

    isUnblockedVertically(x, y, z) {
        return (!this.isValidCoordinateBlock(x, y, z - 1) || (this.isEmpty(x, y, z - 1) && !this.isStair(x, y, z - 1))) && (!this.isValidCoordinateBlock(x, y, z + 1) || (this.isEmpty(x, y, z + 1) && !this.isStair(x, y, z + 1)))
    }
    isTravelable(x, y, z) {
        return this.isValidCoordinateBlock(x, y, z) && this.isEmpty(x, y, z) //&& isUnblockedVertically(x,y,z);
    }

    travelMap(x, y, z, pathLength, sameLayerLength, destinatedPathLength) {
        let possibleMoves = [];
        if(!pathLength) pathLength = {value:0};
        if (pathLength.value >= destinatedPathLength && sameLayerLength>=1)
            this.arr[z][x][y].type = CELL.PATH_END;
        else
        while (true) {
            possibleMoves = [];
            if (this.isTravelable(x + 1, y, z) && this.isUnblockedVertically(x + 1, y, z)) possibleMoves.push({ x: x + 1, y: y, z: z });
            if (this.isTravelable(x, y + 1, z) && this.isUnblockedVertically(x, y + 1, z)) possibleMoves.push({ x: x, y: y + 1, z: z });
            if (this.isTravelable(x - 1, y, z) && this.isUnblockedVertically(x - 1, y, z)) possibleMoves.push({ x: x - 1, y: y, z: z });
            if (this.isTravelable(x, y - 1, z) && this.isUnblockedVertically(x, y - 1, z)) possibleMoves.push({ x: x, y: y - 1, z: z });
            if (sameLayerLength > 4) {
                // up
                if (this.isTravelable(x, y, z + 1)
                    && (!this.isValidCoordinateBlock(x, y, z + 2) || (this.isEmpty(x, y, z + 2) && !this.isStair(x, y, z + 2)))
                ) possibleMoves.push({ x: x, y: y, z: z + 1 });
                // down
                if (this.isTravelable(x, y, z - 1)
                    && (!this.isValidCoordinateBlock(x, y, z - 2) || (this.isEmpty(x, y, z - 2) && !this.isStair(x, y, z - 2)))
                ) possibleMoves.push({ x: x, y: y, z: z - 1 });
            }
            if (possibleMoves.length == 0) return false;
            let move = possibleMoves[randInt(possibleMoves.length)];
            pathLength.value += 1;
            this.arr[move.z][move.x][move.y].id = pathLength.value;
            if (move.z > z) { // up
                this.arr[move.z][move.x][move.y].type = CELL.STAIR;
                this.travelMap(move.x, move.y, move.z, pathLength, 0,destinatedPathLength);
            } else if (move.z < z) { // down
                this.arr[z][x][y].type = CELL.STAIR;
                this.arr[move.z][move.x][move.y].type = CELL.FILL;
                this.travelMap(move.x, move.y, move.z, pathLength, 0,destinatedPathLength);
            }
            else {
                this.arr[move.z][move.x][move.y].type = CELL.FILL;
                this.travelMap(move.x, move.y, move.z, pathLength, sameLayerLength + 1,destinatedPathLength);
            }
        }

    }
    finalizeMap() {
        for (let z = 0; z < this.size.z; z++) {
            for (let x = 0; x < this.size.x; x++) {
                for (let y = 0; y < this.size.y; y++) {
                    switch (this.arr[z][x][y].type) {
                        case CELL.PATH_END:
                            this.arr[z][x][y].type = CELL.FILL;
                            door.init(x, y, z);
                            break;

                    }
                }
            }
        }
    }
    draw() {
        // draw map
        for (let z = 0; z < this.size.z; z++) {
            for (let x = 0; x < this.size.x; x++) {
                for (let y = 0; y < this.size.y; y++) {
                    this.arr[z][x][y].draw(this.color);
                }
            }
        }

    }
}