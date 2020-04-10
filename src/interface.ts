export interface Shape {
    readonly color: string,     // "rgb(255,45,0)"
    position: { x: number, y: number }
    rotation: number
    draw(ctx: CanvasRenderingContext2D): void;
}

export class Square implements Shape {
    sideLength: number;
    color: string;
    position: { x: number, y: number };
    rotation: number;

    constructor(sideLength: number, color: string, position: { x: number, y: number }, rotation: number) {
        this.sideLength = sideLength;
        this.color = color;
        this.position = position;
        this.rotation = rotation;
    }

    /// No method because of deep copy bullshit
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.sideLength, this.sideLength);
    }
}
