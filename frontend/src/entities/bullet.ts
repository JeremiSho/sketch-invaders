import { BULLET_CONFIG } from '../config/constants'
import { Entity } from './entity';

export class Bullet extends Entity {
    private speed: number;

    constructor(startX: number, startY: number) {
        super(
            startX - (BULLET_CONFIG.width / 2),
            startY,
            BULLET_CONFIG.width,
            BULLET_CONFIG.height
        );
        this.speed = BULLET_CONFIG.speed;
    }

    public update(deltaTime: number): void {
        this.y -= this.speed * deltaTime;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = BULLET_CONFIG.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    public isOffScreen(): boolean {
        return this.y < -BULLET_CONFIG.height;
    }
}