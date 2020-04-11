export interface Shape {
    color: string,     // "rgb(255,45,0)"
    position: Position
    rotation: number
    draw(ctx: CanvasRenderingContext2D): void;
}

export class Square implements Shape {
    sideLength: number;
    color: string;
    position: Position;
    rotation: number;

    constructor(sideLength: number, color: string, position: Position, rotation: number) {
        this.sideLength = sideLength;
        this.color = color;
        this.position = position;
        this.rotation = rotation;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.sideLength, this.sideLength);
    }
}

export interface Position {
    x: number;
    y: number;
}