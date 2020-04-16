import { Position } from "./shape";

export interface Color {
    red: number,
    green: number,
    blue: number,
}

export interface GradientColors {
    topLeftColor: Color,
    topRightColor: Color,
    bottomRigthColor: Color,
    bottomLeftColor: Color,
}

export function rgbStr(color: Color): string {
    return "rgb(" + color.red + "," + color.green + "," + color.blue + ")";
}


export function getColorLinearGradient(xRatio: number, yRatio: number, gColor: GradientColors): string {
    const finalColor: Color = {
        red: Math.floor(bilinearReg(
            { x: xRatio, y: yRatio },
            gColor.topLeftColor.red,     // f00
            gColor.topRightColor.red,    // f10
            gColor.bottomLeftColor.red,  // f01
            gColor.bottomRigthColor.red, // f11
        )),
        green: Math.floor(bilinearReg(
            { x: xRatio, y: yRatio },
            gColor.topLeftColor.green,     // f00
            gColor.topRightColor.green,    // f10
            gColor.bottomLeftColor.green,  // f01
            gColor.bottomRigthColor.green, // f11
        )),
        blue: Math.floor(bilinearReg(
            { x: xRatio, y: yRatio },
            gColor.topLeftColor.blue,     // f00
            gColor.topRightColor.blue,    // f10
            gColor.bottomLeftColor.blue,  // f01
            gColor.bottomRigthColor.blue, // f11
        )),
    }
    // correct out of boudaries value
    for (let colorValue of Object.values(finalColor)) {
        // if color value outside [0,255], bring it back in that interval
        colorValue = colorValue < 0 ? 0 : colorValue;
        colorValue = colorValue > 255 ? 255 : colorValue;
    }
    return rgbStr(finalColor);
}

function bilinearReg(point: Position, f00: number, f10: number, f01: number, f11: number): number {
    /// return the bilinear regression of function f at point (x,y)
    /// given 4 values of f at the 4 corners of the unit square
    /// https://en.wikipedia.org/wiki/Bilinear_interpolation#Unit_square
    const value = (
        f00 * (1 - point.x) * (1 - point.y) +
        f10 * point.x * (1 - point.y) +
        f01 * (1 - point.x) * point.y +
        f11 * point.x * point.y
    );
    return value;
}

const gRainbow: GradientColors = {
    topLeftColor: { red: 239, green: 252, blue: 84 },
    topRightColor: { red: 120, green: 239, blue: 197 },
    bottomRigthColor: { red: 74, green: 69, blue: 215 },
    bottomLeftColor: { red: 235, green: 66, blue: 205 },
}

const gFadedDream: GradientColors = {
    topLeftColor: { red: 70, green: 239, blue: 200 },
    topRightColor: { red: 216, green: 224, blue: 227 },
    bottomRigthColor: { red: 235, green: 90, blue: 193 },
    bottomLeftColor: { red: 91, green: 57, blue: 195 },
}

const gDarkRainbow: GradientColors = {
    topLeftColor: { red: 232, green: 67, blue: 65 },
    topRightColor: { red: 28, green: 48, blue: 52 },
    bottomRigthColor: { red: 0, green: 221, blue: 229 },
    bottomLeftColor: { red: 211, green: 235, blue: 115 },
}

const gEspresso: GradientColors = {
    topLeftColor: { red: 241, green: 216, blue: 245 },
    topRightColor: { red: 98, green: 90, blue: 255 },
    bottomRigthColor: { red: 154, green: 50, blue: 103 },
    bottomLeftColor: { red: 194, green: 109, blue: 44 },
}

const gSunset: GradientColors = {
    topLeftColor: { red: 15, green: 29, blue: 38 },
    topRightColor: { red: 106, green: 115, blue: 102 },
    bottomRigthColor: { red: 89, green: 57, blue: 50 },
    bottomLeftColor: { red: 217, green: 129, blue: 78 },
}

const gCreamCoffee: GradientColors = {
    topLeftColor: { red: 235, green: 238, blue: 242 },      // white
    topRightColor: { red: 237, green: 190, blue: 149 },     // cream
    bottomRigthColor: { red: 13, green: 0, blue: 0 },       // black
    bottomLeftColor: { red: 115, green: 47, blue: 23 },     // caramel
}

export function randomGradientColor(): GradientColors {
    return gColors[Math.floor(Math.random() * gColors.length)];
}

export const gColors: GradientColors[] = [
    gRainbow,
    gFadedDream,
    gDarkRainbow,
    gEspresso,
    gSunset,
    gCreamCoffee,
];
