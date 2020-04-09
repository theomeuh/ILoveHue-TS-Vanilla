import { Shape, Square } from "./interface";

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
// var shapes = [];

// // define one circle and save it in the shapes[] array
// shapes.push({ x: 30, y: 30, radius: 15, color: "rgb(255,0,0)" });
// // define one rectangle and save it in the shapes[] array
// shapes.push({ x: 100, y: -1, width: 75, height: 35, color: "rgb(0,0,255)" });


var shapes: Shape[] = [];
var square: Square = new Square(30, "rgb(255,0,0)", { x: 10, y: 10 }, 0);
shapes.push(square)

// drag related vars
var isDragging = false;
var startX: number, startY: number;

// hold the index of the shape being dragged (if any)
var selectedShapeIndex: number;

// draw the shapes on the canvas
drawAll();

// listen for mouse events
canvas.onmousedown = handleMouseDown;
canvas.onmousemove = handleMouseMove;
canvas.onmouseup = handleMouseUp;
canvas.onmouseout = handleMouseOut;


function handleMouseDown(e: MouseEvent) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position
    startX = (e.clientX - offsetX);
    startY = (e.clientY - offsetY);
    var color = getPixelColor(ctx, startX, startY)
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
}

function handleMouseOut(e: MouseEvent) {
    // return if we're not dragging
    if (!isDragging) { return; }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging = false;
}

function handleMouseMove(e: MouseEvent) {
    // return if we're not dragging
    if (!isDragging) { return; }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position         
    var mouseX = (e.clientX - offsetX);
    var mouseY = (e.clientY - offsetY);
    // how far has the mouse dragged from its previous mousemove position?
    var dx = mouseX - startX;
    var dy = mouseY - startY;
    // move the selected shape by the drag distance
    var selectedShape = shapes[selectedShapeIndex];
    selectedShape.position.x += dx;
    selectedShape.position.y += dy;
    // clear the canvas and redraw all shapes
    drawAll();
    // update the starting drag position (== the current mouse position)
    startX = mouseX;
    startY = mouseY;

    console.log(getPixelColor(ctx, mouseX, mouseY));
}

// given a color (which is unique) and shape object
// return true/false whether mouse is inside the shape
function isMouseInShape(shape, color) {
    if (shape.color === color) {
        return (true);
    }
    // the mouse isn't in any of the shapes
    return (false);
}

function getPixelColor(ctx, mouseX, mouseY) {
    const color = ctx.getImageData(mouseX, mouseY, 1, 1).data
    return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")"
}

// clear the canvas and 
// redraw all shapes in their current positions
function drawAll() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        shape.draw(ctx)
        // if (shape.radius) {
        //     // it's a circle
        //     ctx.beginPath();
        //     ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        //     ctx.fillStyle = shape.color;
        //     ctx.fill();
        // }
        // if (shape.width) {
        //     // it's a rectangle
        //     ctx.fillStyle = shape.color;
        //     ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        // }
    }
}
