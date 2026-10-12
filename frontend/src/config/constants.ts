export const CANVAS_CONFIG = {
    width: 800,
    height: 600,
    color: '#fff',
}

export const PLAYER_CONFIG = {
    width: 32,
    height: 32,
    health: 1,
    speed: 0.5,
    fire_rate: 200,
    sprite: '/static/sprites/player.png',
}

export const BULLET_CONFIG = {
    width: 2,
    height: 8,
    health: 1,
    speed: 0.5,
    color: '#000',
}

export const ENEMY_CONFIG = {
    width: 32,
    height: 16,
    health: 1,
    speed: 0.05,
    frequency: 0.003,
    amplitude: 2.0,
    points: 10,
    spawn_interval: 2000,
    sprite: '/static/sprites/enemy.png',
}

export const BIG_ENEMY_CONFIG = {
    width: 32,
    height: 48,
    health: 3,
    speed: 0.025,
    frequency: 0.001,
    amplitude: 1.5,
    points: 30,
    sprites: [
        '/static/sprites/big_enemy_1.png',
        '/static/sprites/big_enemy_2.png',
        '/static/sprites/big_enemy_3.png',
    ],
}

export const OBSTACLE_CONFIG = {
    width: 16,
    height: 48,
    speed: 0.15,
    sprite: '/static/sprites/obstacle.png',
}

export const AUDIO_CONFIG = {
    bg_music: '/static/audio/bgm.mp3',
    moving: '/static/audio/moving.mp3',
    shot: '/static/audio/shot.mp3',
    explosion: '/static/audio/explosion.mp3',
    big_explosion: '/static/audio/big_explosion.mp3',
    pop: '/static/audio/pop.mp3',
}