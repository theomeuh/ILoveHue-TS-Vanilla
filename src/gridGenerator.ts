import { Shape } from "./interface";

import cloneDeep from 'lodash.clonedeep';

export interface Grid {
    pattern: Pattern
}


type Pattern = Shape[]; // Smallest pattern of a periodic grid


interface Translation {
    dx: number;
    dy: number;
}
interface Repetition {
    axisX: number;
    axisY: number;
}

export function gridGenerator(unitPattern: Pattern, translation: Translation, repetition: Repetition): Shape[] {
    let grid: Shape[] = [];
    for (let repX = 0; repX < repetition.axisX; repX++) {
        for (let repY = 0; repY < repetition.axisY; repY++) {
            // Deep copy and move the unit pattern in both direction
            let translatedPattern = cloneDeep(unitPattern);
            for (let shape of translatedPattern) {
                shape.position.x += translation.dx * repX
                shape.position.y += translation.dy * repY
            }
            grid = grid.concat(translatedPattern);
        }
    }
    return grid;
}