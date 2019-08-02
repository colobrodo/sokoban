type Cell = "wall" | "box" | "empty";

interface Vec2 {
    x: number
    y: number
}

type Direction = (startPoint: Vec2) => Vec2;

class Grid {
    goals = new Set<number>();
    
    private assert_valid_index({x, y}: Vec2) {
        if(x > this.width) {
            throw new Error("x index out of bound: the x coordinate is greater than the grid width");
        }

        const indexInBound = y * this.width + x in this.cells;
        if(!indexInBound) {
            throw new Error("index out of bound");
        }
    }

    constructor(
        private width: number,
        private cells: Cell[],
        goalSpots: Vec2[],
        public playerPosition: Vec2) {
            for(const {x, y} of goalSpots) {
                // store the goals spots with the raw index array
                // so we can use a Set data structure without worrying
                // about reference equality (we using the raw index as hash)
                this.goals.add(y * this.width + x);
            }    
        }

    get(pos: Vec2) {
        this.assert_valid_index(pos);

        const {x, y} = pos,
            index = y * this.width + x; 
        return this.cells[index];
    }

    private set(pos: Vec2, cell: Cell) {
        this.assert_valid_index(pos);

        const {x, y} = pos,
            index = y * this.width + x; 
        this.cells[index] = cell;
    }

    enumerate() {
        return this.cells.map((cell, i) => {
            const x = i % this.width,
                y = (i - x) / this.width;
            return {
                type: cell,
                x,
                y,
                isAGoal: this.goals.has(i), 
            };
        });
    }

    isComplete() {
        let goals = this.goals.values();
        
        for(const coord of goals) {
            // asserting on raw coordinate

            const goal = this.cells[coord];
            
            if(goal != "box") {
                return false;
            }
        }
        return true;
    }

    private tryMove(position: Vec2, direction: Direction): boolean {
        const currentCell = this.get(position)
        switch(currentCell) {
            case "wall": {
                return false;
            }
            case "empty": {
                return true;
            }
            case "box": {
                const nextDirection = direction(position),
                    success = this.tryMove(nextDirection, direction);
                if(success) {
                    this.set(nextDirection, currentCell);
                }
                return success;
            }
        }
    }

    movePlayer(direction: Direction) {
        const playerNextStep = direction(this.playerPosition);
        if(this.tryMove(playerNextStep, direction)) {
            this.set(playerNextStep, "empty");
            this.playerPosition = playerNextStep;
        } else {
            "cannot move in that direction";
        }
    }
}


function parseLevel(level: string): Grid {
    let cells: Cell[] = [],
        goals: Vec2[] = [],
        player_pos: Vec2 | null = null;
    
    const lines = level.split("\n"),
        width = lines
        .map(line => line.length)
        .reduce((a, b) => Math.max(a, b), -Infinity);
    
    for(let i = 0; i < lines.length; i += 1) {
        let row = lines[i]; 
        
        if(row.length < width) {
            // add the missing wall to the fill until the end of the map
            row += "#".repeat(width - row.length);
        }
        
        for(let j = 0; j < row.length; j += 1) {
            const cell = row[j],
                blockPosition = {x: j, y: i};
            
            switch(cell) {
                case "#": {
                    cells.push("wall");
                    break;
                }
                case "*": 
                    goals.push(blockPosition); 
                case "$": {
                    cells.push("box");
                    break;
                }
                case ".": 
                    goals.push(blockPosition); 
                case " ": {
                    cells.push("empty");
                    break;
                }
                case "+": 
                    goals.push(blockPosition); 
                case "@": {
                    cells.push("empty");
                    
                    if(player_pos == null) {
                        player_pos = blockPosition;
                    } else {
                        const error_message = `ERROR: error while parsing the level, a position for the player was setted two times, first in (${player_pos.x},${player_pos.y}) and then in (${blockPosition.x},${blockPosition.y}), only one allowed.`;
                        throw new Error(error_message);
                    }
                    
                    break;
                }
            }
        }
    }
    
    if(player_pos == null) {
        const error_message = "ERROR: malformed level: you have to set a position for the player, no position has been provided";
        throw new Error(error_message);        
    }
    
    return new Grid(
        width,
        cells,
        goals,
        player_pos
        );
}



const simpleLevel: string = 
`#####
## ##
#  .#
#$  #
# . #
#   #
#.$*#
# $@#
##  #
#####`,
    grid = parseLevel(simpleLevel);

const canvas = <HTMLCanvasElement> document.getElementById("canvas"),
    context = canvas.getContext("2d");

const DIRECTIONS = Object.freeze({
    up({x, y}: Vec2): Vec2 {
        return {x, y: y - 1};
    },
    down({x, y}: Vec2): Vec2 {
        return {x, y: y + 1};
    },
    left({x, y}: Vec2): Vec2 {
        return {x: x - 1, y};
    },
    right({x, y}: Vec2): Vec2 {
        return {x: x + 1, y};
    }
})


document.addEventListener("keyup", (event) => {
    event.preventDefault();

    if(event.code === "ArrowUp") {
        console.log("moving player up!!")
        grid.movePlayer(DIRECTIONS.up);
    } else if(event.code === "ArrowDown") {
        grid.movePlayer(DIRECTIONS.down);
    } else if(event.code === "ArrowLeft") {
        grid.movePlayer(DIRECTIONS.left);
    } else if(event.code === "ArrowRight") {
        grid.movePlayer(DIRECTIONS.right);
    }
});

function createTile(src: string) {
    const img = new Image();
    img.src = src;
    return img;
}

const tiles = {
    wall: createTile("/img/wall.png"),
    goal: createTile("/img/goal.png"),
    player: createTile("/img/player.png"),
    playerOnAGoal: createTile("/img/player-on-goal.png"),
    box: createTile("/img/box.png"),
    boxOnGoal: createTile("/img/box-on-goal.png"),
}


const cellSize = 35;
function render() {
    const {x: playerX, y: playerY} = grid.playerPosition;
    context.clearRect(0, 0, canvas.width, canvas.height);

    for(const {x, y, type, isAGoal} of grid.enumerate()) {
        let tile: HTMLImageElement | null = null;
        if (type == "wall") {
            tile = tiles.wall;       
        }
        else if (type == "box") {
            if(isAGoal) {
                tile = tiles.boxOnGoal;       
            } else {
                tile = tiles.box;       
            }
        }
        else if (type == "empty") {
            if(playerX === x && playerY === y) {
                if(isAGoal) {
                    tile = tiles.playerOnAGoal;
                } else {
                    tile = tiles.player;
                }


            } else if(isAGoal) {
                tile = tiles.goal;
            } 
            else {
                context.fillStyle = "#000";
                context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }

        if(tile != null) {
            context.drawImage(tile, x * cellSize, y * cellSize, cellSize, cellSize);
        }

        context.stroke();
    }

    requestAnimationFrame(render);
}

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

render();