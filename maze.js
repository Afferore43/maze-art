// https://github.com/Afferore43/maze-art

const gridX = 1000;
const gridY = 600;
// change noise scale for different noise field "zoom"
const noiseScl = 0.01;
let startHue;
let hueScale;

// maze generation
// adapted from https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker (without walls, therefore without step 2.1.3)
let current;
let visited = [];
let stack = [];
function setupMaze() {
    for(let x = 0; x < gridX; x++) {
        visited.push([]);
        for(let y = 0; y < gridY; y++) visited[x].push(false);
    }
}
function cellVisited(x,y) {
    if(x < 0 || y < 0 || x >= gridX || y >= gridY) return true;
    return visited[x][y];
}
function getNeighbours(x,y) {
    let n = [];
    if(!cellVisited(x-1,y)) n.push([x-1,y]);
    if(!cellVisited(x+1,y)) n.push([x+1,y]);
    if(!cellVisited(x,y-1)) n.push([x,y-1]);
    if(!cellVisited(x,y+1)) n.push([x,y+1]);
    return n;
}
function stepMaze() {
    visited[current[0]][current[1]] = true;
    let n = getNeighbours(current[0], current[1]);
    if(n.length > 0) {
        stack.push(current);
        current = random(n);
    }
    else if(stack.length > 0) current = stack.pop();
    else noLoop();
}

// setup and drawing stuff
function setup() {
    let c = createCanvas(gridX, gridY);
    c.position(max((windowWidth - width) / 2, 10), max((windowHeight - height) / 2, 10));
    
    colorMode(HSB, 255);
    noStroke();
    background(51);
    noSmooth();
    setupMaze();
    // change this for different start color (hue) and color progression speed (hue)
    startHue = random(256);
    hueScale = random(2500) + 100;
    
    current = [floor(random(gridX)), floor(random(gridY))];
}
function keyPressed() {
    if (keyCode == 83) saveCanvas('maze_art', 'png');
}
function draw() {
    for(let i = 0; i < 1000; i++) {
        stepMaze();
        
        // change stuff here for different color effects
        // current effects explained
        // hue = distance from start point (= stack lenght) (wraps around)
        // brightness = 2d noise value between ~60 % and 100 % depending on position (x and y) of current cell
        // saturation = 2d noise value between 0 % and 100 % with distance from start point as x and index of current draw loop as y
        let h = (startHue + stack.length / hueScale) % 256;
        let s = map(noise(current[0] * noiseScl, current[1] * noiseScl), 0, 1, 150, 256);
        let b = noise(stack.length * noiseScl / 3, i * noiseScl / 20) * 255;
        stroke(h, s, b);
        point(current[0], current[1]);
    }
}