import { CANVAS_CONFIG, ENEMY_CONFIG, BIG_ENEMY_CONFIG } from '../config/constants';
import { Entity } from './entity';

export class Enemy extends Entity {
    public points: number;
    
    protected health: number;
    protected speedY: number;
    protected time: number = 0;
    protected frequency: number;
    protected amplitude: number;
    protected randomOffset: number;
    protected sprite: HTMLImageElement = new Image();

    constructor(startX: number, startY: number) {
        super(startX, startY, ENEMY_CONFIG.width, ENEMY_CONFIG.height);
        this.speedY = ENEMY_CONFIG.speed;
        this.health = ENEMY_CONFIG.health;
        this.points = ENEMY_CONFIG.points;
        this.frequency = ENEMY_CONFIG.frequency;
        this.amplitude = ENEMY_CONFIG.amplitude;
        this.randomOffset = Math.random() * 10000;
    }

    public takeDamage(): void {
        this.health -= 1;
    }

    public isDead(): boolean {
        return this.health <= 0;
    }

    public update(deltaTime: number): void {
        this.time += deltaTime;
        this.y += this.speedY * deltaTime;

        const timeWithOffset = this.time + this.randomOffset;
        this.x += Math.sin(timeWithOffset * this.frequency) * this.amplitude;
        
        if (this.x < 0)
            this.x = 0;
        else if (this.x > CANVAS_CONFIG.width - this.width)
            this.x = CANVAS_CONFIG.width - this.width;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.src = ENEMY_CONFIG.sprite;
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}

export class BigEnemy extends Enemy {
    constructor(startX: number, startY: number) {
        super(startX, startY);
        this.width = BIG_ENEMY_CONFIG.width;
        this.height = BIG_ENEMY_CONFIG.height;
        this.speedY = BIG_ENEMY_CONFIG.speed;
        this.health = BIG_ENEMY_CONFIG.health;
        this.points = BIG_ENEMY_CONFIG.points;
        this.frequency = BIG_ENEMY_CONFIG.frequency;
        this.amplitude = BIG_ENEMY_CONFIG.amplitude;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.src = BIG_ENEMY_CONFIG.sprites[BIG_ENEMY_CONFIG.health - this.health];
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}