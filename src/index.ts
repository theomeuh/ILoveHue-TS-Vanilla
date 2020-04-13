import { Shape, Square, Position } from "./shape";
import { gridGenerator } from "./gridGenerator";
import { GradientColors } from "./color";

import cloneDeep from 'lodash.clonedeep';


// canvas related vars
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = 500;
const canvasHeight = 500;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
document.body.appendChild(canvas);
canvas.style.border = '1px solid red';

// used to calc canvas position relative to window
function reOffset() {
    const BB = canvas.getBoundingClientRect();
    offset = { x: BB.top, y: BB.left };
}
var offset: Position;

reOffset();
window.onscroll = function (e) { reOffset(); }
window.onresize = function (e) { reOffset(); }
canvas.onresize = function (e) { reOffset(); }

// save relevant information about shapes drawn on the canvas
var shapes: Shape[] = [];
// keep track of canvas state before any move
var shapes_saved: Shape[];

// grid of all the same square
var square: Square = new Square(50, "rgb(255,0,0)", { x: 0, y: 0 }, 0);
const gColor: GradientColors = {
    topLeftColor: { red: 239, green: 252, blue: 84 },
    topRightColor: { red: 120, green: 239, blue: 197 },
    bottomRigthColor: { red: 74, green: 69, blue: 215 },
    bottomLeftColor: { red: 235, green: 66, blue: 205 },
}
shapes = gridGenerator([square], { dx: 50, dy: 50 }, { axisX: 10, axisY: 10 }, gColor);


// drag related vars
var isDragging: boolean = false;
var startPos: Position;

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
    startPos = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
    };
    const color = getPixelColor(startPos);
    // test mouse position against all shapes
    // post result if mouse is in a shape
    for (let i = 0; i < shapes.length; i++) {
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

    const mousePos: Position = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
    };
    // very rapid (re)draw to get the color under dragged shape
    drawAll(shapes_saved);
    const color = getPixelColor(mousePos);
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
    const selectedShape = shapes[selectedShapeIndex];
    selectedShape.position.x += diffPos.x;
    selectedShape.position.y += diffPos.y;
    // clear the canvas and redraw all shapes ...
    drawAll(shapes);
    // ... and redraw the selected shape so it appears above all other shapes
    selectedShape.draw(ctx);
    // update the starting drag position (== the current mouse position)
    startPos = mousePos;
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
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].draw(ctx);
    }
}
