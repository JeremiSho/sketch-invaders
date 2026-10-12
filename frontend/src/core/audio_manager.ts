import { AUDIO_CONFIG } from "../config/constants";

export class AudioManager {
    private bgMusic: HTMLAudioElement;

    private movingSound: HTMLAudioElement;
    private isMovingSoundPlaying: boolean = false;

    private shotSound: HTMLAudioElement;
    private explosionSound: HTMLAudioElement;
    private bigExplosionSound: HTMLAudioElement;
    private popSound: HTMLAudioElement;


    constructor() {
        this.bgMusic = new Audio(AUDIO_CONFIG.bg_music);
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.3;

        this.movingSound = new Audio(AUDIO_CONFIG.moving);
        this.movingSound.loop = true;
        this.movingSound.volume = 0.5;

        this.shotSound = new Audio(AUDIO_CONFIG.shot);
        this.explosionSound = new Audio(AUDIO_CONFIG.explosion);
        this.bigExplosionSound = new Audio(AUDIO_CONFIG.big_explosion);
        this.popSound = new Audio(AUDIO_CONFIG.pop);
    }

    public playBgm(): void {
        this.bgMusic.play().catch(err => console.log("Waiting for user input to play BGM"));
    }

    public stopBgm(): void {
        this.bgMusic.pause();
    }

    public startMovingSound(): void {
        if (!this.isMovingSoundPlaying) {
            this.movingSound.play().catch(() => {});
            this.isMovingSoundPlaying = true;
        }
    }

    public stopMovingSound(): void {
        if (this.isMovingSoundPlaying) {
            this.movingSound.pause();
            this.isMovingSoundPlaying = false;
        }
    }

    public playShot(): void {
        const sound = this.shotSound.cloneNode() as HTMLAudioElement;
        sound.volume = 0.5;
        sound.play().catch(() => {});
    }

    public playExplosion(): void {
        const sound = this.explosionSound.cloneNode() as HTMLAudioElement;
        sound.volume = 0.5;
        sound.play().catch(() => {});
    }

    private playBigExplosion(): void {
        const sound = this.bigExplosionSound.cloneNode() as HTMLAudioElement;
        sound.volume = 0.5;
        sound.play().catch(() => {});
    }

    private playPop(): void {
        const sound = this.popSound.cloneNode() as HTMLAudioElement;
        sound.volume = 0.5;
        sound.play().catch(() => {});
    }

    public playDeathSound(bigEnemy: Boolean): void {
        if (bigEnemy) {
            this.playBigExplosion();
        } else {
            this.playPop();
        }
    }
}