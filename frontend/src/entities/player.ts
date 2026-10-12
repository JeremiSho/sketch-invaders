import { CANVAS_CONFIG, PLAYER_CONFIG } from '../config/constants';
import { Entity } from './entity';
import { Bullet } from './bullet';
import { InputHandler } from '../core/input_handler';

export class Player extends Entity {
    private speed: number;
    private fire_rate: number;
    private shootCooldown: number = 0;
    private sprite: HTMLImageElement = new Image();

    constructor() {
        super(
            (CANVAS_CONFIG.width / 2) - (PLAYER_CONFIG.width / 2),
            CANVAS_CONFIG.height - (2 * PLAYER_CONFIG.height),
            PLAYER_CONFIG.width,
            PLAYER_CONFIG.height
        );
        this.speed = PLAYER_CONFIG.speed;
        this.fire_rate = PLAYER_CONFIG.fire_rate;
    }

    public update(deltaTime: number, input: InputHandler): Bullet | null {
        if (input.isKeyPressed('ArrowLeft'))
            this.x -= this.speed * deltaTime;
        if (input.isKeyPressed('ArrowRight'))
            this.x += this.speed * deltaTime;

        if (this.x < 0)
            this.x = 0;
        if (this.x > CANVAS_CONFIG.width - this.width)
            this.x = CANVAS_CONFIG.width - this.width;

        if (this.shootCooldown > 0)
            this.shootCooldown -= deltaTime;

        if (input.isKeyPressed('Space') && this.shootCooldown <= 0) {
            this.shootCooldown = this.fire_rate;
            return new Bullet(this.x + (this.width / 2), this.y); 
        }

        return null;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.src = PLAYER_CONFIG.sprite;
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}