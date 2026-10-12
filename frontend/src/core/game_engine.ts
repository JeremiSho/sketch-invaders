import { BIG_ENEMY_CONFIG, CANVAS_CONFIG, ENEMY_CONFIG, OBSTACLE_CONFIG } from '../config/constants'
import { InputHandler } from './input_handler';
import { Player } from '../entities/player';
import { Bullet } from '../entities/bullet';
import { Enemy, BigEnemy } from '../entities/enemy';
import { Obstacle } from '../entities/obstacle'
import { getCsrfToken } from '../network/api_client';
import { AudioManager } from './audio_manager';

export class GameEngine {
    private audioManager: AudioManager;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private inputHandler: InputHandler;
    
    private isRunning: boolean = false;
    private isGameOver: boolean = false;
    private hasStarted: boolean = false;
    private lastTime: number = 0;
    private currentScore: number = 0;
    private level: number;

    private player: Player;
    private bullets: Bullet[] = [];
    private enemies: Enemy[] = [];
    private obstacles: Obstacle[] = [];
    private timeSinceLastSpawn: number = 0;
    private spawnInterval: number = ENEMY_CONFIG.spawn_interval;

    constructor(canvasId: string) {
        this.audioManager = new AudioManager();
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.inputHandler = new InputHandler();
        this.level = parseInt(this.canvas.dataset.level || '1', 10);
        this.player = new Player();
    }

    private spawnRandomEnemy(deltaTime: number): void {
        this.timeSinceLastSpawn += deltaTime;
        const currentInterval = Math.max(500, this.spawnInterval - (this.currentScore * 2));

        if (this.timeSinceLastSpawn > currentInterval) {
            const randomX = Math.random() * (CANVAS_CONFIG.width - BIG_ENEMY_CONFIG.width); 
            const rand = Math.random();

            if (this.level === 3) {
                if (rand < 0.3)
                    this.enemies.push(new BigEnemy(randomX, -BIG_ENEMY_CONFIG.height));
                else if (rand < 0.6)
                    this.obstacles.push(new Obstacle(randomX, -OBSTACLE_CONFIG.height));
                else
                    this.enemies.push(new Enemy(randomX, -ENEMY_CONFIG.height));
            } else if (this.level === 2) {
                if (rand < 0.25)
                    this.obstacles.push(new Obstacle(randomX, -OBSTACLE_CONFIG.height));
                else
                    this.enemies.push(new Enemy(randomX, -ENEMY_CONFIG.height));
            } else {
                this.enemies.push(new Enemy(randomX, -ENEMY_CONFIG.height));
            }
            
            this.timeSinceLastSpawn = 0;
        }
    }

    private checkCollisions(): void {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];

            const enemyIndex = this.enemies.findIndex(e => bullet.collidesWith(e));
            if (enemyIndex !== -1) {
                this.bullets.splice(i, 1);
                this.enemies[enemyIndex].takeDamage();
                
                if (this.enemies[enemyIndex].isDead()) {
                    this.audioManager.playDeathSound(this.enemies[enemyIndex].points === BIG_ENEMY_CONFIG.points);
                    this.currentScore += this.enemies[enemyIndex].points;
                    this.enemies.splice(enemyIndex, 1);
                }
                else
                    this.audioManager.playExplosion();
                continue; 
            }

            if (this.obstacles.some(o => bullet.collidesWith(o))) {
                this.bullets.splice(i, 1);
            }
        }

        const isPlayerHit =
            this.obstacles.some(o => this.player.collidesWith(o)) || 
            this.enemies.some(e => this.player.collidesWith(e));
        const isEnemyAtBottom = this.enemies.some(e => e.y + e.height >= CANVAS_CONFIG.height);

        if (isPlayerHit || isEnemyAtBottom) {
            this.handleGameOver();
        }
    }

    private async handleGameOver(): Promise<void> {
        this.isGameOver = true;
        this.isRunning = false; 

        this.audioManager.stopBgm();
        this.audioManager.stopMovingSound();
        
        const overlay = document.getElementById('gameover-overlay');
        const finalScoreElement = document.getElementById('final-score');
        const btnRestart = document.getElementById('btn-restart');

        if (overlay && finalScoreElement && btnRestart) {
            finalScoreElement.innerText = this.currentScore.toString();
            overlay.style.display = 'flex';

            btnRestart.onclick = () => {
                window.location.reload();
            };
        }
        
        console.log("Game Over! Sending score to server...");

        if (this.currentScore === 0) {
            return; 
        }
        
        const csrfToken = getCsrfToken();
        if (!csrfToken) return;

        try {
            const response = await fetch('/api/save-score/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({
                    level: this.level,
                    score: this.currentScore
                })
            });

            if (response.ok) {
                console.log("Score saved successfully!");
            }
        } catch (error) {
            console.error("Failed to save score:", error);
        }
    }

    public start(): void {
        this.isRunning = true;
        const startGame = () => {
            this.hasStarted = true;
            this.audioManager.playBgm();
            document.removeEventListener('keydown', startGame);
        };
        document.addEventListener('keydown', startGame);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.audioManager.stopBgm();
                this.audioManager.stopMovingSound();
            } else {
                if (this.hasStarted && !this.isGameOver) {
                    this.audioManager.playBgm();
                }
            }
        });

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    private update(deltaTime: number): void {
        if (!this.hasStarted) return;
        if (this.isGameOver) return;

        this.spawnRandomEnemy(deltaTime);

        const isMovingLeft = this.inputHandler.isKeyPressed('ArrowLeft');
        const isMovingRight = this.inputHandler.isKeyPressed('ArrowRight');

        if (isMovingLeft || isMovingRight) {
            this.audioManager.startMovingSound();
        } else {
            this.audioManager.stopMovingSound();
        }

        const newBullet = this.player.update(deltaTime, this.inputHandler);
        if (newBullet) {
            this.bullets.push(newBullet);
            this.audioManager.playShot();
        }

        this.bullets.forEach(bullet => bullet.update(deltaTime));
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        this.obstacles.forEach(obstacle => obstacle.update(deltaTime));

        this.checkCollisions();

        this.bullets = this.bullets.filter(bullet => !bullet.isOffScreen());
        this.obstacles = this.obstacles.filter(obstacle => !obstacle.isOffScreen());
    }

    private draw(): void {
        this.ctx.fillStyle = CANVAS_CONFIG.color
        this.ctx.fillRect(0, 0, CANVAS_CONFIG.width, CANVAS_CONFIG.height);

        this.player.draw(this.ctx);
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));

        this.ctx.fillStyle = '#000000';
        this.ctx.font = '20px "Comic Sans MS"';
        this.ctx.fillText(`Score: ${this.currentScore}`, 10, 30);
    }

    private gameLoop(timestamp: number): void {
        if (!this.isRunning) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
}