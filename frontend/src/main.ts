import { GameEngine } from './core/game_engine';
import { setupLiveLeaderboard } from './network/score_stream';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Sketch Invaders...");
    
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    // Retrieve level ID from HTML dataset (set by Django in game.html)
    const levelId = parseInt(canvas.dataset.level || '1', 10);
    
    // Start the game engine
    const engine = new GameEngine('game-canvas');
    engine.start();

    // Start listening to the live leaderboard
    setupLiveLeaderboard(levelId);
});