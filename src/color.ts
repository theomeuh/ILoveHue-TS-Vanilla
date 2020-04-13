export interface Color {
    red: number,
    green: number,
    blue: number,
}

export interface GradientColors {
    topLeftColor: Color
    topRightColor: Color
    bottomRigthColor: Color
}

export function rgbStr(color: Color): string {
    return "rgb(" + color.red + "," + color.green + "," + color.blue + ")";
}


export function getColorLinearGradient(xRatio: number, yRatio: number, gColor: GradientColors): string {
    // first regression on one axis
    const xGradientedColor: Color = {
        red: linearReg(gColor.topLeftColor.red, gColor.topRightColor.red, xRatio),
        green: linearReg(gColor.topLeftColor.green, gColor.topRightColor.green, xRatio),
        blue: linearReg(gColor.topLeftColor.blue, gColor.topRightColor.blue, xRatio)
    };

    // then on the other axis
    const finalColor: Color = {
        red: Math.floor(linearReg(xGradientedColor.red, gColor.bottomRigthColor.red, yRatio)),
        green: Math.floor(linearReg(xGradientedColor.green, gColor.bottomRigthColor.green, yRatio)),
        blue: Math.floor(linearReg(xGradientedColor.blue, gColor.bottomRigthColor.blue, yRatio)),
    };
    return rgbStr(finalColor);
}

function linearReg(start: number, end: number, ratio: number): number {
    return ((end - start) * ratio + start)
}