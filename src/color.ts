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
    if (finalColor.red < 0 || finalColor.red > 255 ||
        finalColor.green < 0 || finalColor.green > 255 ||
        finalColor.blue < 0 || finalColor.blue > 255) {
        console.log("Color regressed outside boundaries. The color will display but will not be draggable");
        console.log(finalColor);
        console.log(rgbStr(finalColor));
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