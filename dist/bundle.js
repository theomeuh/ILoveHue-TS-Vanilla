/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = __webpack_require__(/*! ./interface */ "./src/interface.ts");
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
var offsetX, offsetY;
reOffset();
window.onscroll = function (e) { reOffset(); };
window.onresize = function (e) { reOffset(); };
canvas.onresize = function (e) { reOffset(); };
// save relevant information about shapes drawn on the canvas
// var shapes = [];
// // define one circle and save it in the shapes[] array
// shapes.push({ x: 30, y: 30, radius: 15, color: "rgb(255,0,0)" });
// // define one rectangle and save it in the shapes[] array
// shapes.push({ x: 100, y: -1, width: 75, height: 35, color: "rgb(0,0,255)" });
var shapes = [];
var square = new interface_1.Square(30, "rgb(255,0,0)", { x: 10, y: 10 }, 0);
shapes.push(square);
// drag related vars
var isDragging = false;
var startX, startY;
// hold the index of the shape being dragged (if any)
var selectedShapeIndex;
// draw the shapes on the canvas
drawAll();
// listen for mouse events
canvas.onmousedown = handleMouseDown;
canvas.onmousemove = handleMouseMove;
canvas.onmouseup = handleMouseUp;
canvas.onmouseout = handleMouseOut;
function handleMouseDown(e) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position
    startX = (e.clientX - offsetX);
    startY = (e.clientY - offsetY);
    var color = getPixelColor(ctx, startX, startY);
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
function handleMouseUp(e) {
    // return if we're not dragging
    if (!isDragging) {
        return;
    }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging = false;
}
function handleMouseOut(e) {
    // return if we're not dragging
    if (!isDragging) {
        return;
    }
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging = false;
}
function handleMouseMove(e) {
    // return if we're not dragging
    if (!isDragging) {
        return;
    }
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
    var color = ctx.getImageData(mouseX, mouseY, 1, 1).data;
    return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
}
// clear the canvas and 
// redraw all shapes in their current positions
function drawAll() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        shape.draw(ctx);
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


/***/ }),

/***/ "./src/interface.ts":
/*!**************************!*\
  !*** ./src/interface.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// export interface Square extends Shape {
//     readonly sideLength: number;
// }
var Square = /** @class */ (function () {
    function Square(sideLength, color, position, rotation) {
        this.sideLength = sideLength;
        this.color = color;
        this.position = position;
        this.rotation = rotation;
    }
    Square.prototype.draw = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.sideLength, this.sideLength);
    };
    return Square;
}());
exports.Square = Square;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9pbnRlcmZhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBLCtFQUE0QztBQUU1QyxzQkFBc0I7QUFDdEIsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QyxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDL0IsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNqQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FB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QkFBMEI7UUFDMUIsbUNBQW1DO1FBQ25DLGlFQUFpRTtRQUNqRSxJQUFJO0tBQ1A7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNySkQsMENBQTBDO0FBQzFDLG1DQUFtQztBQUNuQyxJQUFJO0FBR0o7SUFNSSxnQkFBWSxVQUFrQixFQUFFLEtBQWEsRUFBRSxRQUFrQyxFQUFFLFFBQWdCO1FBQy9GLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxxQkFBSSxHQUFKLFVBQUssR0FBNkI7UUFDOUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzNCLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUNMLGFBQUM7QUFBRCxDQUFDO0FBakJZLHdCQUFNIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IHsgU2hhcGUsIFNxdWFyZSB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xuXG4vLyBjYW52YXMgcmVsYXRlZCB2YXJzXG52YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbnZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xudmFyIGNhbnZhc1dpZHRoID0gY2FudmFzLndpZHRoO1xudmFyIGNhbnZhc0hlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG5jYW52YXMuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCByZWQnO1xuXG4vLyB1c2VkIHRvIGNhbGMgY2FudmFzIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHdpbmRvd1xuZnVuY3Rpb24gcmVPZmZzZXQoKSB7XG4gICAgdmFyIEJCID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIG9mZnNldFggPSBCQi5sZWZ0O1xuICAgIG9mZnNldFkgPSBCQi50b3A7XG59XG52YXIgb2Zmc2V0WDogbnVtYmVyLCBvZmZzZXRZOiBudW1iZXI7XG5yZU9mZnNldCgpO1xud2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24gKGUpIHsgcmVPZmZzZXQoKTsgfVxud2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24gKGUpIHsgcmVPZmZzZXQoKTsgfVxuY2FudmFzLm9ucmVzaXplID0gZnVuY3Rpb24gKGUpIHsgcmVPZmZzZXQoKTsgfVxuXG4vLyBzYXZlIHJlbGV2YW50IGluZm9ybWF0aW9uIGFib3V0IHNoYXBlcyBkcmF3biBvbiB0aGUgY2FudmFzXG4vLyB2YXIgc2hhcGVzID0gW107XG5cbi8vIC8vIGRlZmluZSBvbmUgY2lyY2xlIGFuZCBzYXZlIGl0IGluIHRoZSBzaGFwZXNbXSBhcnJheVxuLy8gc2hhcGVzLnB1c2goeyB4OiAzMCwgeTogMzAsIHJhZGl1czogMTUsIGNvbG9yOiBcInJnYigyNTUsMCwwKVwiIH0pO1xuLy8gLy8gZGVmaW5lIG9uZSByZWN0YW5nbGUgYW5kIHNhdmUgaXQgaW4gdGhlIHNoYXBlc1tdIGFycmF5XG4vLyBzaGFwZXMucHVzaCh7IHg6IDEwMCwgeTogLTEsIHdpZHRoOiA3NSwgaGVpZ2h0OiAzNSwgY29sb3I6IFwicmdiKDAsMCwyNTUpXCIgfSk7XG5cblxudmFyIHNoYXBlczogU2hhcGVbXSA9IFtdO1xudmFyIHNxdWFyZTogU3F1YXJlID0gbmV3IFNxdWFyZSgzMCwgXCJyZ2IoMjU1LDAsMClcIiwgeyB4OiAxMCwgeTogMTAgfSwgMCk7XG5zaGFwZXMucHVzaChzcXVhcmUpXG5cbi8vIGRyYWcgcmVsYXRlZCB2YXJzXG52YXIgaXNEcmFnZ2luZyA9IGZhbHNlO1xudmFyIHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlcjtcblxuLy8gaG9sZCB0aGUgaW5kZXggb2YgdGhlIHNoYXBlIGJlaW5nIGRyYWdnZWQgKGlmIGFueSlcbnZhciBzZWxlY3RlZFNoYXBlSW5kZXg6IG51bWJlcjtcblxuLy8gZHJhdyB0aGUgc2hhcGVzIG9uIHRoZSBjYW52YXNcbmRyYXdBbGwoKTtcblxuLy8gbGlzdGVuIGZvciBtb3VzZSBldmVudHNcbmNhbnZhcy5vbm1vdXNlZG93biA9IGhhbmRsZU1vdXNlRG93bjtcbmNhbnZhcy5vbm1vdXNlbW92ZSA9IGhhbmRsZU1vdXNlTW92ZTtcbmNhbnZhcy5vbm1vdXNldXAgPSBoYW5kbGVNb3VzZVVwO1xuY2FudmFzLm9ubW91c2VvdXQgPSBoYW5kbGVNb3VzZU91dDtcblxuXG5mdW5jdGlvbiBoYW5kbGVNb3VzZURvd24oZTogTW91c2VFdmVudCkge1xuICAgIC8vIHRlbGwgdGhlIGJyb3dzZXIgd2UncmUgaGFuZGxpbmcgdGhpcyBldmVudFxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIC8vIGNhbGN1bGF0ZSB0aGUgY3VycmVudCBtb3VzZSBwb3NpdGlvblxuICAgIHN0YXJ0WCA9IChlLmNsaWVudFggLSBvZmZzZXRYKTtcbiAgICBzdGFydFkgPSAoZS5jbGllbnRZIC0gb2Zmc2V0WSk7XG4gICAgdmFyIGNvbG9yID0gZ2V0UGl4ZWxDb2xvcihjdHgsIHN0YXJ0WCwgc3RhcnRZKVxuICAgIC8vIHRlc3QgbW91c2UgcG9zaXRpb24gYWdhaW5zdCBhbGwgc2hhcGVzXG4gICAgLy8gcG9zdCByZXN1bHQgaWYgbW91c2UgaXMgaW4gYSBzaGFwZVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpc01vdXNlSW5TaGFwZShzaGFwZXNbaV0sIGNvbG9yKSkge1xuICAgICAgICAgICAgLy8gdGhlIG1vdXNlIGlzIGluc2lkZSB0aGlzIHNoYXBlXG4gICAgICAgICAgICAvLyBzZWxlY3QgdGhpcyBzaGFwZVxuICAgICAgICAgICAgc2VsZWN0ZWRTaGFwZUluZGV4ID0gaTtcbiAgICAgICAgICAgIC8vIHNldCB0aGUgaXNEcmFnZ2luZyBmbGFnXG4gICAgICAgICAgICBpc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIGFuZCByZXR1cm4gKD09c3RvcCBsb29raW5nIGZvciBcbiAgICAgICAgICAgIC8vICAgICBmdXJ0aGVyIHNoYXBlcyB1bmRlciB0aGUgbW91c2UpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1vdXNlVXAoZTogTW91c2VFdmVudCkge1xuICAgIC8vIHJldHVybiBpZiB3ZSdyZSBub3QgZHJhZ2dpbmdcbiAgICBpZiAoIWlzRHJhZ2dpbmcpIHsgcmV0dXJuOyB9XG4gICAgLy8gdGVsbCB0aGUgYnJvd3NlciB3ZSdyZSBoYW5kbGluZyB0aGlzIGV2ZW50XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgLy8gdGhlIGRyYWcgaXMgb3ZlciAtLSBjbGVhciB0aGUgaXNEcmFnZ2luZyBmbGFnXG4gICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVNb3VzZU91dChlOiBNb3VzZUV2ZW50KSB7XG4gICAgLy8gcmV0dXJuIGlmIHdlJ3JlIG5vdCBkcmFnZ2luZ1xuICAgIGlmICghaXNEcmFnZ2luZykgeyByZXR1cm47IH1cbiAgICAvLyB0ZWxsIHRoZSBicm93c2VyIHdlJ3JlIGhhbmRsaW5nIHRoaXMgZXZlbnRcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAvLyB0aGUgZHJhZyBpcyBvdmVyIC0tIGNsZWFyIHRoZSBpc0RyYWdnaW5nIGZsYWdcbiAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1vdXNlTW92ZShlOiBNb3VzZUV2ZW50KSB7XG4gICAgLy8gcmV0dXJuIGlmIHdlJ3JlIG5vdCBkcmFnZ2luZ1xuICAgIGlmICghaXNEcmFnZ2luZykgeyByZXR1cm47IH1cbiAgICAvLyB0ZWxsIHRoZSBicm93c2VyIHdlJ3JlIGhhbmRsaW5nIHRoaXMgZXZlbnRcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAvLyBjYWxjdWxhdGUgdGhlIGN1cnJlbnQgbW91c2UgcG9zaXRpb24gICAgICAgICBcbiAgICB2YXIgbW91c2VYID0gKGUuY2xpZW50WCAtIG9mZnNldFgpO1xuICAgIHZhciBtb3VzZVkgPSAoZS5jbGllbnRZIC0gb2Zmc2V0WSk7XG4gICAgLy8gaG93IGZhciBoYXMgdGhlIG1vdXNlIGRyYWdnZWQgZnJvbSBpdHMgcHJldmlvdXMgbW91c2Vtb3ZlIHBvc2l0aW9uP1xuICAgIHZhciBkeCA9IG1vdXNlWCAtIHN0YXJ0WDtcbiAgICB2YXIgZHkgPSBtb3VzZVkgLSBzdGFydFk7XG4gICAgLy8gbW92ZSB0aGUgc2VsZWN0ZWQgc2hhcGUgYnkgdGhlIGRyYWcgZGlzdGFuY2VcbiAgICB2YXIgc2VsZWN0ZWRTaGFwZSA9IHNoYXBlc1tzZWxlY3RlZFNoYXBlSW5kZXhdO1xuICAgIHNlbGVjdGVkU2hhcGUucG9zaXRpb24ueCArPSBkeDtcbiAgICBzZWxlY3RlZFNoYXBlLnBvc2l0aW9uLnkgKz0gZHk7XG4gICAgLy8gY2xlYXIgdGhlIGNhbnZhcyBhbmQgcmVkcmF3IGFsbCBzaGFwZXNcbiAgICBkcmF3QWxsKCk7XG4gICAgLy8gdXBkYXRlIHRoZSBzdGFydGluZyBkcmFnIHBvc2l0aW9uICg9PSB0aGUgY3VycmVudCBtb3VzZSBwb3NpdGlvbilcbiAgICBzdGFydFggPSBtb3VzZVg7XG4gICAgc3RhcnRZID0gbW91c2VZO1xuXG4gICAgY29uc29sZS5sb2coZ2V0UGl4ZWxDb2xvcihjdHgsIG1vdXNlWCwgbW91c2VZKSk7XG59XG5cbi8vIGdpdmVuIGEgY29sb3IgKHdoaWNoIGlzIHVuaXF1ZSkgYW5kIHNoYXBlIG9iamVjdFxuLy8gcmV0dXJuIHRydWUvZmFsc2Ugd2hldGhlciBtb3VzZSBpcyBpbnNpZGUgdGhlIHNoYXBlXG5mdW5jdGlvbiBpc01vdXNlSW5TaGFwZShzaGFwZSwgY29sb3IpIHtcbiAgICBpZiAoc2hhcGUuY29sb3IgPT09IGNvbG9yKSB7XG4gICAgICAgIHJldHVybiAodHJ1ZSk7XG4gICAgfVxuICAgIC8vIHRoZSBtb3VzZSBpc24ndCBpbiBhbnkgb2YgdGhlIHNoYXBlc1xuICAgIHJldHVybiAoZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBnZXRQaXhlbENvbG9yKGN0eCwgbW91c2VYLCBtb3VzZVkpIHtcbiAgICBjb25zdCBjb2xvciA9IGN0eC5nZXRJbWFnZURhdGEobW91c2VYLCBtb3VzZVksIDEsIDEpLmRhdGFcbiAgICByZXR1cm4gXCJyZ2IoXCIgKyBjb2xvclswXSArIFwiLFwiICsgY29sb3JbMV0gKyBcIixcIiArIGNvbG9yWzJdICsgXCIpXCJcbn1cblxuLy8gY2xlYXIgdGhlIGNhbnZhcyBhbmQgXG4vLyByZWRyYXcgYWxsIHNoYXBlcyBpbiB0aGVpciBjdXJyZW50IHBvc2l0aW9uc1xuZnVuY3Rpb24gZHJhd0FsbCgpIHtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzaGFwZSA9IHNoYXBlc1tpXTtcbiAgICAgICAgc2hhcGUuZHJhdyhjdHgpXG4gICAgICAgIC8vIGlmIChzaGFwZS5yYWRpdXMpIHtcbiAgICAgICAgLy8gICAgIC8vIGl0J3MgYSBjaXJjbGVcbiAgICAgICAgLy8gICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgLy8gICAgIGN0eC5hcmMoc2hhcGUueCwgc2hhcGUueSwgc2hhcGUucmFkaXVzLCAwLCBNYXRoLlBJICogMik7XG4gICAgICAgIC8vICAgICBjdHguZmlsbFN0eWxlID0gc2hhcGUuY29sb3I7XG4gICAgICAgIC8vICAgICBjdHguZmlsbCgpO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGlmIChzaGFwZS53aWR0aCkge1xuICAgICAgICAvLyAgICAgLy8gaXQncyBhIHJlY3RhbmdsZVxuICAgICAgICAvLyAgICAgY3R4LmZpbGxTdHlsZSA9IHNoYXBlLmNvbG9yO1xuICAgICAgICAvLyAgICAgY3R4LmZpbGxSZWN0KHNoYXBlLngsIHNoYXBlLnksIHNoYXBlLndpZHRoLCBzaGFwZS5oZWlnaHQpO1xuICAgICAgICAvLyB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBTaGFwZSB7XG4gICAgcmVhZG9ubHkgY29sb3I6IHN0cmluZywgICAgIC8vIFwicmdiKDI1NSw0NSwwKVwiXG4gICAgcG9zaXRpb246IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfVxuICAgIHJvdGF0aW9uOiBudW1iZXJcbiAgICBkcmF3KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZDtcbn1cblxuLy8gZXhwb3J0IGludGVyZmFjZSBTcXVhcmUgZXh0ZW5kcyBTaGFwZSB7XG4vLyAgICAgcmVhZG9ubHkgc2lkZUxlbmd0aDogbnVtYmVyO1xuLy8gfVxuXG5cbmV4cG9ydCBjbGFzcyBTcXVhcmUgaW1wbGVtZW50cyBTaGFwZSB7XG4gICAgc2lkZUxlbmd0aDogbnVtYmVyO1xuICAgIGNvbG9yOiBzdHJpbmc7XG4gICAgcG9zaXRpb246IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcbiAgICByb3RhdGlvbjogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3Ioc2lkZUxlbmd0aDogbnVtYmVyLCBjb2xvcjogc3RyaW5nLCBwb3NpdGlvbjogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCByb3RhdGlvbjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2lkZUxlbmd0aCA9IHNpZGVMZW5ndGg7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb247XG4gICAgfVxuXG4gICAgZHJhdyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55LCB0aGlzLnNpZGVMZW5ndGgsIHRoaXMuc2lkZUxlbmd0aCk7XG4gICAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0=