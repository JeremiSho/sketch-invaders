import { CANVAS_CONFIG, OBSTACLE_CONFIG } from '../config/constants';
import { Entity } from './entity';

export class Obstacle extends Entity {
    private speed: number; 
    private sprite: HTMLImageElement = new Image();

    constructor(startX: number, startY: number) {
        super(startX, startY, OBSTACLE_CONFIG.width, OBSTACLE_CONFIG.height);
        this.speed = OBSTACLE_CONFIG.speed;
    }

    public update(deltaTime: number): void {
        this.y += this.speed * deltaTime;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.src = OBSTACLE_CONFIG.sprite;
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }

    public isOffScreen(): boolean {
        return this.y > CANVAS_CONFIG.height + OBSTACLE_CONFIG.height; 
    }
}