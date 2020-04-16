import cloneDeep from 'lodash.clonedeep';
import { Grid } from "./gridGenerator";
import { levels as presetLevels } from "./preset";
import { Position, Shape } from "./shape";


// ### DOM object handle ###
// canvas related vars
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = 900;
const canvasHeight = 700;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
canvas.style.border = '1px solid red';
document.getElementById("canvasCol").appendChild(canvas);
// some shapes are not defined on positive side of the plane. The grid can slightly go backward
ctx.translate(150, 100);

// arrows related vars
const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');

// used to calc canvas position relative to window
var offset: Position;
function reOffset() {
    const BB = canvas.getBoundingClientRect();
    offset = { x: BB.left, y: BB.top };
}
reOffset();
window.onscroll = function (e) { reOffset(); }
window.onresize = function (e) { reOffset(); }
canvas.onresize = function (e) { reOffset(); }

// ### Handle grid ###
// save relevant information about shapes drawn on the canvas
var grid: Grid = [];
// keep track of canvas state before any move
var grid_saved: Grid;
// contains the original grid with color sorted on a gradient.
var grid_original: Grid;
// Store preset levels
const levels: Grid[] = presetLevels;
var levelIndex: number = 0;
levelSetUp();


// ### Mouse event stuff ###
// drag related vars
var isDragging: boolean = false;
var startPos: Position;

// hold the index of the shape being dragged (if any)
var selectedShapeIndex: number;

// listen for mouse events
canvas.onmousedown = handleMouseDown;
canvas.onmousemove = handleMouseMove;
canvas.onmouseup = handleMouseUp;
canvas.onmouseout = handleMouseOut;
leftArrow.addEventListener('click', handleClickLeftArrow)
rightArrow.addEventListener('click', handleClickRightArrow)

// ### Function zone ###
function handleMouseDown(e: MouseEvent) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // deep copy shapes before any move
    grid_saved = cloneDeep(grid);
    // calculate the current mouse position
    startPos = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
    };
    const color = getPixelColor(startPos);
    // test mouse position against all shapes
    // post result if mouse is in a shape
    for (let i = 0; i < grid.length; i++) {
        if (isMouseInShape(grid[i], color)) {
            // the mouse is inside this shape
            // select this shape
            selectedShapeIndex = i;
            // set the isDragging flag
            isDragging = true;
            // and return (==stop looking for 
            //     further shapes under the mouse)
            return;
        }
    }
}

function handleMouseUp(e: MouseEvent) {
    // return if we're not dragging
    if (!isDragging) { return; }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging = false;

    const mousePos: Position = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
    };
    // very rapid (re)draw to get the color under dragged shape
    drawAll(grid_saved);
    const color = getPixelColor(mousePos);
    drawAll(grid)

    const switchedShapeIndex: number = grid.findIndex((shape) => isMouseInShape(shape, color));
    // if there is a shape under the dragged shape and they belong to same switchClass
    if (switchedShapeIndex !== -1 &&
        grid_saved[selectedShapeIndex].switchClass === grid_saved[switchedShapeIndex].switchClass
    ) {
        // switch their color
        const color_selected = grid_saved[selectedShapeIndex].color;
        const color_switched = grid_saved[switchedShapeIndex].color;
        grid_saved[selectedShapeIndex].color = color_switched;
        grid_saved[switchedShapeIndex].color = color_selected;
    }

    // in any case, redraw
    grid = grid_saved;
    drawAll(grid);

    // is the grid sorted ?
    if (checkGrid(grid_original, grid)) {
        alert("gagné !!")
    }
}

function handleMouseOut(e: MouseEvent) {
    // return if we're not dragging
    if (!isDragging) { return; }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging = false;

    // shallow copy is ok to restore shapes
    grid = grid_saved;
    drawAll(grid);
}

function handleMouseMove(e: MouseEvent) {
    // return if we're not dragging
    if (!isDragging) { return; }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position         
    const mousePos = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
    };
    // how far has the mouse dragged from its previous mousemove position?
    const diffPos = {
        x: mousePos.x - startPos.x,
        y: mousePos.y - startPos.y
    };
    // move the selected shape by the drag distance
    const selectedShape = grid[selectedShapeIndex];
    selectedShape.position.x += diffPos.x;
    selectedShape.position.y += diffPos.y;
    // clear the canvas and redraw all shapes ...
    drawAll(grid);
    // ... and redraw the selected shape so it appears above all other shapes
    selectedShape.draw(ctx);
    // update the starting drag position (== the current mouse position)
    startPos = mousePos;
}

function handleClickLeftArrow(e: MouseEvent) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    levelIndex = (levelIndex - 1) % levels.length;
    levelSetUp();
}

function handleClickRightArrow(e: MouseEvent) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    levelIndex = (levelIndex + 1) % levels.length;
    levelSetUp();
}

// given a color (which is unique) and shape object
// return true/false whether mouse is inside the shape
function isMouseInShape(shape: Shape, color: string) {
    if (shape.color === color) {
        return (true);
    }
    // the mouse isn't in any of the shapes
    return (false);
}

function getPixelColor(mousePos: Position) {
    const color = ctx.getImageData(mousePos.x, mousePos.y, 1, 1).data
    return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")"
}

// clear the canvas and 
// redraw all shapes in their current positions
function drawAll(shapes: Shape[]) {
    ctx.clearRect(-canvasWidth, -canvasHeight, 2 * canvasWidth, 2 * canvasHeight);
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].draw(ctx);
    }
}

function gridShuffle(grid: Grid) {
    const tiles_count = grid.length;
    const switchClasses = [...new Set(grid.map(x => x.switchClass))] // list of distinct switch classes
    for (let switchClass of switchClasses) {
        let wip_shapes = grid.filter(x => x.switchClass === switchClass);
        for (let i = 0; i < 1; i++) {   // TODO change shuffle number;
            const index1 = Math.floor(Math.random() * wip_shapes.length);
            const index2 = Math.floor(Math.random() * wip_shapes.length);
            // switch colors with a destructuring pattern
            [wip_shapes[index1].color, wip_shapes[index2].color] = [wip_shapes[index2].color, wip_shapes[index1].color];
        }
    }
}

function checkGrid(grid_original: Grid, grid: Grid): boolean {
    for (let shape of grid) {
        const shape_original: Shape = grid_original.find(shape_original => shape_original.color === shape.color);
        if (shape_original.position.x !== shape.position.x || shape_original.position.y !== shape.position.y) {
            return false
        }
    }
    return true;
}

function levelSetUp() {
    grid_original = levels[levelIndex];

    grid = cloneDeep(grid_original);
    // modify grid
    gridShuffle(grid);
    // draw the shapes on the canvas
    drawAll(grid);
}