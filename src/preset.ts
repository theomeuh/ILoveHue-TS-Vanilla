import { gColors, randomGradientColor, GradientColors } from "./color";
import { gridGenerator, hexGridGenerator, Pattern, Translation, Grid } from "./gridGenerator";
import { Square, Triangle, TriangleRotation, Hexagon, Rectangle } from "./shape";




// grid of same square
const squareGrid = (() => {
    const sideLength = 50;
    const square: Square = new Square(sideLength, "rgb(0,0,0)", { x: 0, y: 0 }, 0, 'square');

    const pattern: Pattern = [square];
    const translation: Translation = { dx: sideLength, dy: sideLength };
    const gColor = randomGradientColor();
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
    const gColor = randomGradientColor();
    return gridGenerator(pattern, translation, { axisX: 8, axisY: 10 }, gColor);
})();

// grid of same triangle
const triangleGrid = (() => {
    const sideLength = 50;
    const triangleFlat: Triangle = new Triangle(sideLength, "rgb(255,0,0)", { x: 0, y: 0 }, TriangleRotation.Flat, 'triangle');
    const trianglePointy: Triangle = new Triangle(sideLength, "rgb(255,0,0)", { x: sideLength, y: 0 }, TriangleRotation.Pointy, 'triangle');

    const pattern: Pattern = [triangleFlat, trianglePointy];
    const translation: Translation = { dx: sideLength, dy: sideLength };
    const gColor = randomGradientColor();
    return hexGridGenerator(pattern, translation, { axisX: 10, axisY: 10 }, gColor);
})();

// grid of same hexagon
const hexagonGrid = (() => {
    const sideLength = 40;
    const hexagon: Hexagon = new Hexagon(sideLength, "rgb(255,0,0", { x: 0, y: 0 }, 0, 'hexagon');

    const pattern: Pattern = [hexagon];
    const translation: Translation = { dx: sideLength * Math.sqrt(3), dy: sideLength * Math.sqrt(3) };
    const gColor = randomGradientColor();
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
    const gColor: GradientColors = gColors[0];
    return gridGenerator(pattern, translation, { axisX: 10, axisY: 5 }, gColor);
})();

// grid of dissected hexagon
const dissectedHexagonGrid = (() => {
    const sideLength = 50;
    /// Pattern definitions. All hexagon touch the origin. The pattern overflows on negative x and y axis
    // hexagons
    const bottomHexagon: Hexagon = new Hexagon(sideLength, "rgb(255,0,0", { x: 0, y: 0 }, 0, 'hexagon');
    const leftHexagon: Hexagon = new Hexagon(sideLength, "rgb(255,0,0", { x: - sideLength * Math.sqrt(3) / 2, y: - sideLength * 3 / 2 }, 0, 'hexagon');
    const rigthHexagon: Hexagon = new Hexagon(sideLength, "rgb(255,0,0", { x: sideLength * Math.sqrt(3) / 2, y: - sideLength * 3 / 2 }, 0, 'hexagon');
    // top triangles
    const topLeftTriangle: Triangle = new Triangle(sideLength, "rgb(255,0,0", { x: 0, y: -2 * sideLength }, TriangleRotation.Left, 'triangle');
    const topRightTriangle: Triangle = new Triangle(sideLength, "rgb(255,0,0", { x: 0, y: -2 * sideLength }, TriangleRotation.Right, 'triangle');
    // left triangles
    const leftTopTriangle: Triangle = new Triangle(sideLength, "rgb(255,0,0", { x: -Math.sqrt(3) * sideLength, y: 0 }, TriangleRotation.Right, 'triangle');
    const leftBottomTriangle: Triangle = new Triangle(sideLength, "rgb(255,0,0", { x: -Math.sqrt(3) * sideLength / 2, y: sideLength / 2 }, TriangleRotation.Left, 'triangle');
    // right triangles
    const rightTopTriangle: Triangle = new Triangle(sideLength, "rgb(255,0,0", { x: Math.sqrt(3) * sideLength, y: 0 }, TriangleRotation.Left, 'triangle');
    const rightBottomTriangle: Triangle = new Triangle(sideLength, "rgb(255,0,0", { x: Math.sqrt(3) * sideLength / 2, y: sideLength / 2 }, TriangleRotation.Right, 'triangle');

    const pattern: Pattern = [
        bottomHexagon, leftHexagon, rigthHexagon,
        topLeftTriangle, topRightTriangle,
        leftTopTriangle, leftBottomTriangle,
        rightTopTriangle, rightBottomTriangle,
    ];
    // Prevent pattern overflow on negative 
    const posOffset: Translation = { dx: Math.sqrt(3) * sideLength, dy: 2 * sideLength };
    for (let shape of pattern) {
        // TODO define a setter for a shape position 
        shape.position.x += posOffset.dx;
        shape.position.y += posOffset.dy;
        shape.colorPoint.x += posOffset.dx;
        shape.colorPoint.y += posOffset.dy;
    }

    const translation: Translation = { dx: sideLength * 2 * Math.sqrt(3), dy: sideLength * 2 * Math.sqrt(3) };
    const gColor = randomGradientColor();
    return hexGridGenerator(pattern, translation, { axisX: 3, axisY: 3 }, gColor);
})();


export const levels: Grid[] = [
    squareGrid,
    triangleGrid,
    hexagonGrid,
    dissectedHexagonGrid,
    brickWallGrid,
    squareBigSmallGrid,
];