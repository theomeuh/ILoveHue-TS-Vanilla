import { Shape } from "./shape";
import { GradientColors, getColorLinearGradient } from "./color";

import cloneDeep from 'lodash.clonedeep';


type Pattern = Shape[]; // Smallest pattern of a periodic grid. Colors set but not revelant
type Grid = Shape[];    // Repeated pattern. If sorted, colors create a gradient


interface Translation {
    dx: number;
    dy: number;
}
interface Repetition {
    axisX: number;
    axisY: number;
}

export function gridGenerator(
    unitPattern: Pattern,
    translation: Translation,
    repetition: Repetition,
    gColor: GradientColors
): Grid {
    let grid: Shape[] = [];
    for (let repX = 0; repX < repetition.axisX; repX++) {
        for (let repY = 0; repY < repetition.axisY; repY++) {
            // Deep copy and move the unit pattern in both directions
            const translatedPattern = cloneDeep(unitPattern);
            for (let shape of translatedPattern) {
                // change shape position
                shape.position.x += translation.dx * repX;
                shape.position.y += translation.dy * repY;
                // change color of the shape according to its position on the global grid
                const xRatio = shape.position.x / (translation.dx * repetition.axisX); // final grid is size of pattern * repetion width (or heigh)
                const yRatio = shape.position.y / (translation.dy * repetition.axisY);
                shape.color = getColorLinearGradient(xRatio, yRatio, gColor);
            }
            grid.push(...translatedPattern);
        }
    }
    return grid;
}

export function hexGridGenerator(
    unitPattern: Pattern,
    translation: Translation,
    repetition: Repetition,
    gColor: GradientColors
): Grid {
    let grid: Shape[] = [];
    for (let repX = 0; repX < repetition.axisX; repX++) {
        for (let repY = 0; repY < repetition.axisY; repY++) {
            // Deep copy and move the unit pattern in both directions
            const translatedPattern = cloneDeep(unitPattern);
            for (let shape of translatedPattern) {
                // change shape position

                shape.position = {
                    x: shape.position.x + translation.dx * repX - translation.dy * repY / 2,
                    y: shape.position.y + translation.dy * repY * Math.sqrt(3) / 2,
                }
                // change color of the shape according to its position on the global grid
                const xRatio = shape.position.x / (translation.dx * repetition.axisX); // final grid is size of pattern * repetion width (or heigh)
                const yRatio = shape.position.y / (translation.dy * repetition.axisY);
                shape.color = getColorLinearGradient(xRatio, yRatio, gColor);
            }
            grid.push(...translatedPattern);
        }
    }
    return grid;
}
