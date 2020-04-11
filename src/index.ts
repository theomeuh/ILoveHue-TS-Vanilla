import { Shape, Square } from "./interface";

import cloneDeep from 'lodash.clonedeep';


// canvas related vars
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
document.body.appendChild(canvas);
canvas.style.border = '1px solid red';

// used to calc canvas position relative to window
function reOffset() {
    var BB = canvas.getBoundingClientRect();
    offsetX = BB.left;
    offsetY = BB.top;
}
var offsetX: number, offsetY: number;
reOffset();
window.onscroll = function (e) { reOffset(); }
window.onresize = function (e) { reOffset(); }
canvas.onresize = function (e) { reOffset(); }

// save relevant information about shapes drawn on the canvas
var shapes: Shape[] = [];
// keep track of canvas state before any move
var shapes_saved: Shape[];

// Add a square to shapes
var square: Square = new Square(30, "rgb(255,0,0)", { x: 10, y: 10 }, 0);
shapes.push(square)

// Add another square to shapes
var square: Square = new Square(30, "rgb(0,255,0)", { x: 50, y: 50 }, 0);
shapes.push(square)

// drag related vars
var isDragging: boolean = false;
var startX: number, startY: number;

// hold the index of the shape being dragged (if any)
var selectedShapeIndex: number;

// draw the shapes on the canvas
drawAll(shapes);

// listen for mouse events
canvas.onmousedown = handleMouseDown;
canvas.onmousemove = handleMouseMove;
canvas.onmouseup = handleMouseUp;
canvas.onmouseout = handleMouseOut;


function handleMouseDown(e: MouseEvent) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // deep copy shapes before any move
    shapes_saved = cloneDeep(shapes);
    // calculate the current mouse position
    startX = (e.clientX - offsetX);
    startY = (e.clientY - offsetY);
    var color = getPixelColor(startX, startY)
    // test mouse position against all shapes
    // post result if mouse is in a shape
    for (var i = 0; i < shapes.length; i++) {
        if (isMouseInShape(shapes[i], color)) {
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


    var mouseX = (e.clientX - offsetX);
    var mouseY = (e.clientY - offsetY);
    // Very rapid (re)draw to get the color under the mouse 
    drawAll(shapes_saved);
    const color = getPixelColor(mouseX, mouseY)
    drawAll(shapes)

    const switchedShapeIndex: number = shapes.findIndex((shape) => isMouseInShape(shape, color));

    // if there is a shape under the dragged shape
    if (switchedShapeIndex !== -1) {
        // switch their color
        const color_selected = shapes_saved[selectedShapeIndex].color;
        const color_switched = shapes_saved[switchedShapeIndex].color;
        shapes_saved[selectedShapeIndex].color = color_switched;
        shapes_saved[switchedShapeIndex].color = color_selected;
    }

    // in any case, redraw
    shapes = shapes_saved;
    drawAll(shapes);
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
    shapes = shapes_saved;
    drawAll(shapes);
}

function handleMouseMove(e: MouseEvent) {
    // return if we're not dragging
    if (!isDragging) { return; }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position         // TODO export2
    var mouseX = (e.clientX - offsetX);
    var mouseY = (e.clientY - offsetY);
    // how far has the mouse dragged from its previous mousemove position?
    var dx = mouseX - startX;
    var dy = mouseY - startY;
    // move the selected shape by the drag distance
    var selectedShape = shapes[selectedShapeIndex];
    selectedShape.position.x += dx;
    selectedShape.position.y += dy;
    // clear the canvas and redraw all shapes ...
    drawAll(shapes);
    // ... and redraw the selected shape so it appears above all other shapes
    selectedShape.draw(ctx);
    // update the starting drag position (== the current mouse position)
    startX = mouseX;
    startY = mouseY;
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

function getPixelColor(mouseX: number, mouseY: number) {
    const color = ctx.getImageData(mouseX, mouseY, 1, 1).data
    return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")"
}

// clear the canvas and 
// redraw all shapes in their current positions
function drawAll(shapes: Shape[]) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (var i = 0; i < shapes.length; i++) {
        shapes[i].draw(ctx);
    }
}
