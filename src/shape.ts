export interface Position {
    x: number;
    y: number;
}

export interface Shape {
    color: string;     // "rgb(255,45,0)"
    position: Position;
    colorPoint: Position;    // point, relatively to position, where to take the color: barycenter is ideal
    rotation: number | string;
    draw(ctx: CanvasRenderingContext2D): void;
}

export class Square implements Shape {
    sideLength: number;
    color: string;
    position: Position;
    colorPoint: Position;
    rotation: number;   // TODO implement flat and pointy

    constructor(sideLength: number, color: string, position: Position, rotation: number) {
        this.sideLength = sideLength;
        this.color = color;
        this.position = position;
        this.rotation = rotation;

        this.colorPoint = {
            x: this.position.x + sideLength / 2,
            y: this.position.y + sideLength / 2,
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.sideLength, this.sideLength);

        this.drawColorPoint(ctx);
    }
    drawColorPoint(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.colorPoint.x, this.colorPoint.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}

export class Triangle implements Shape {
    /// flat trianges have their horizontal segment on top. Top left is on origin. No symmetry
    /// pointy triangles have their horizontal segment at bottom. Top point is origin. Their is symmetry with vertical axis
    sideLength: number;
    color: string;
    position: Position;
    colorPoint: Position;
    rotation: TriangleRotation;

    constructor(sideLength: number, color: string, position: Position, rotation: TriangleRotation) {
        this.sideLength = sideLength;
        this.color = color;
        this.position = position;
        this.rotation = rotation;

        if (this.rotation === TriangleRotation.Flat) {
            this.colorPoint = {
                x: this.position.x + this.sideLength / 2,
                y: this.position.y + (1 / 3) * (Math.sqrt(3) / 2) * this.sideLength,    // y: 1/3 of the triangle height
            }
        } else {
            this.colorPoint = {
                x: this.position.x,
                y: this.position.y + (2 / 3) * (Math.sqrt(3) / 2) * this.sideLength,  // y: 2/3 of the triangle height 
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.rotation === TriangleRotation.Flat) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(this.position.x + this.sideLength, this.position.y);
            ctx.lineTo(this.position.x + this.sideLength / 2, this.position.y + this.sideLength * Math.sqrt(3) / 2);
            ctx.fill();
        }
        else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(this.position.x + this.sideLength / 2, this.position.y + this.sideLength * Math.sqrt(3) / 2);
            ctx.lineTo(this.position.x - this.sideLength / 2, this.position.y + this.sideLength * Math.sqrt(3) / 2);
            ctx.fill();
        }
        this.drawColorPoint(ctx);
    }
    drawColorPoint(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.colorPoint.x, this.colorPoint.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}



export enum TriangleRotation {
    Flat = "flat",
    Pointy = "pointy",
}