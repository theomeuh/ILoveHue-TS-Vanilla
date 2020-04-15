import cloneDeep from 'lodash.clonedeep';
import { getColorLinearGradient, GradientColors } from "./color";
import { Position, Shape } from "./shape";



export type Pattern = Shape[]; // Smallest pattern of a periodic grid. Colors set but not revelant
export type Grid = Shape[];    // Repeated pattern. If sorted, colors create a gradient


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
                shape.colorPoint.x += translation.dx * repX;
                shape.colorPoint.y += translation.dy * repY;
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
                shape.position = hexMove(shape.position, translation, { repX, repY })
                shape.colorPoint = hexMove(shape.colorPoint, translation, { repX, repY })
                // change color of the shape according to its position on the global grid   // TODO change color computation: repX * dx / dx * axisX ?
                const xRatio = shape.colorPoint.x / (translation.dx * repetition.axisX); // final grid is size of pattern * repetion width (or heigh)
                const yRatio = shape.colorPoint.y / (translation.dy * repetition.axisY * Math.sqrt(3) / 2);
                shape.color = getColorLinearGradient(xRatio, yRatio, gColor);
            }
            grid.push(...translatedPattern);
        }
    }
    return grid;
}

function hexMove(pos: Position, translation: Translation, step: { repX: number, repY: number }): Position {
    // This normalized term avoids the natural shear of hex grids. 
    // The regular term would be "- translation.dy * step.repY / 2"
    const lignAlignementTerm = step.repY % 2 === 0 ? 0 : - translation.dy / 2
    pos = {
        x: pos.x + translation.dx * step.repX + lignAlignementTerm,
        y: pos.y + translation.dy * step.repY * Math.sqrt(3) / 2,
    }
    return pos;
}
