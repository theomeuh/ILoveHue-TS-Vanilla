import { GradientColors } from "./color";
import { gridGenerator, hexGridGenerator, Pattern, Translation, Grid } from "./gridGenerator";
import { Square, Triangle, TriangleRotation, Hexagon, Rectangle } from "./shape";


const gColor: GradientColors = {
    topLeftColor: { red: 239, green: 252, blue: 84 },
    topRightColor: { red: 120, green: 239, blue: 197 },
    bottomRigthColor: { red: 74, green: 69, blue: 215 },
    bottomLeftColor: { red: 235, green: 66, blue: 205 },
}

// grid of same square
const squareGrid = (() => {
    const sideLength = 50;
    const square: Square = new Square(sideLength, "rgb(0,0,0)", { x: 0, y: 0 }, 0, 'square');

    const pattern: Pattern = [square];
    const translation: Translation = { dx: sideLength, dy: sideLength };
    return gridGenerator(pattern, translation, { axisX: 10, axisY: 10 }, gColor);
})();

// grid of 2 kind of square
const squareBigSmallGrid = (() => {
    const sideLength = 50;
    const bigSquare: Square = new Square(sideLength, "rgb(0,0,0)", { x: 0, y: 0 }, 0, 'bigSquare');
    const smallTopSquare: Square = new Square(sideLength / 2, "rgb(0,0,0)", { x: sideLength, y: 0 }, 0, 'smallSquare');
    const smallBottomSquare: Square = new Square(sideLength / 2, "rgb(0,0,0)", { x: sideLength, y: sideLength / 2 }, 0, 'smallSquare');

    const pattern: Pattern = [bigSquare, smallTopSquare, smallBottomSquare];
    const translation: Translation = { dx: 3 * sideLength / 2, dy: sideLength };
    return gridGenerator(pattern, translation, { axisX: 8, axisY: 10 }, gColor);
})();

// grid of same triangle
const triangleGrid = (() => {
    const sideLength = 50;
    const triangleFlat: Triangle = new Triangle(sideLength, "rgb(255,0,0)", { x: 0, y: 0 }, TriangleRotation.Flat, 'triangle');
    const trianglePointy: Triangle = new Triangle(sideLength, "rgb(255,0,0)", { x: sideLength, y: 0 }, TriangleRotation.Pointy, 'triangle');

    const pattern: Pattern = [triangleFlat, trianglePointy];
    const translation: Translation = { dx: sideLength, dy: sideLength };
    return hexGridGenerator(pattern, translation, { axisX: 10, axisY: 10 }, gColor);
})();

// grid of same hexagon
const hexagonGrid = (() => {
    const sideLength = 40;
    const hexagon: Hexagon = new Hexagon(sideLength, "rgb(255,0,0", { x: 0, y: 0 }, 0, 'hexagon');

    const pattern: Pattern = [hexagon];
    const translation: Translation = { dx: sideLength * Math.sqrt(3), dy: sideLength * Math.sqrt(3) };
    return hexGridGenerator(pattern, translation, { axisX: 8, axisY: 8 }, gColor);
})();

// brick wall grid
const brickWallGrid = (() => {
    const longLength = 65;
    const shortLength = longLength * 2 / (1 + Math.sqrt(5));
    const rectangle1: Rectangle = new Rectangle(shortLength, longLength, "rgb(255,0,0", { x: 0, y: 0 }, 0, 'hexagon');
    const rectangle2: Rectangle = new Rectangle(shortLength, longLength, "rgb(255,0,0", { x: -longLength / 2, y: shortLength }, 0, 'hexagon');

    const pattern: Pattern = [rectangle1, rectangle2];
    const translation: Translation = { dx: longLength, dy: 2 * shortLength };
    return gridGenerator(pattern, translation, { axisX: 10, axisY: 5 }, gColor);
})();


export const levels: Grid[] = [squareGrid, hexagonGrid, brickWallGrid, squareBigSmallGrid, triangleGrid];