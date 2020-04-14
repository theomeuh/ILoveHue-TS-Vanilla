export interface Position {
    x: number;
    y: number;
}

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

export class Triangle implements Shape {
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
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.position.x + this.sideLength, this.position.y);
        ctx.lineTo(this.position.x + this.sideLength / 2, this.position.y + this.sideLength * Math.sqrt(3) / 2);
        ctx.fill();
    }
}
