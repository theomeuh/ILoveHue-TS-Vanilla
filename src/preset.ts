import { GradientColors } from "./color";
import { gridGenerator, hexGridGenerator, Pattern } from "./gridGenerator";
import { Square, Triangle, TriangleRotation } from "./shape";

const gColor: GradientColors = {
    topLeftColor: { red: 239, green: 252, blue: 84 },
    topRightColor: { red: 120, green: 239, blue: 197 },
    bottomRigthColor: { red: 74, green: 69, blue: 215 },
    bottomLeftColor: { red: 235, green: 66, blue: 205 },
}

// grid of same square
export const squareGrid = (() => {
    const square: Square = new Square(50, "rgb(0,0,0)", { x: 0, y: 0 }, 0, 'square');
    const pattern: Pattern = [square];
    return gridGenerator(pattern, { dx: 50, dy: 50 }, { axisX: 10, axisY: 10 }, gColor);
})();

// grid of 2 kind of square
export const squareBigSmallGrid = (() => {
    const bigSquare: Square = new Square(50, "rgb(0,0,0)", { x: 0, y: 0 }, 0, 'bigSquare');
    const smallTopSquare: Square = new Square(25, "rgb(0,0,0)", { x: 50, y: 0 }, 0, 'smallSquare');
    const smallBottomSquare: Square = new Square(25, "rgb(0,0,0)", { x: 50, y: 25 }, 0, 'smallSquare');
    const pattern: Pattern = [bigSquare, smallTopSquare, smallBottomSquare];
    return gridGenerator(pattern, { dx: 75, dy: 50 }, { axisX: 10, axisY: 10 }, gColor);
})();

// grid of same triangle
export const triangleGrid = (() => {
    const triangleFlat: Triangle = new Triangle(50, "rgb(255,0,0)", { x: 0, y: 0 }, TriangleRotation.Flat, 'triangle');
    const trianglePointy: Triangle = new Triangle(50, "rgb(255,0,0)", { x: 50, y: 0 }, TriangleRotation.Pointy, 'triangle');
    const pattern: Pattern = [triangleFlat, trianglePointy];
    return hexGridGenerator(pattern, { dx: 50, dy: 50 }, { axisX: 10, axisY: 10 }, gColor);
})();