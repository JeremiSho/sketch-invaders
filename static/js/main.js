"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/config/constants.ts
  var CANVAS_CONFIG, PLAYER_CONFIG, BULLET_CONFIG, ENEMY_CONFIG, BIG_ENEMY_CONFIG, OBSTACLE_CONFIG, AUDIO_CONFIG;
  var init_constants = __esm({
    "src/config/constants.ts"() {
      "use strict";
      CANVAS_CONFIG = {
        width: 800,
        height: 600,
        color: "#fff"
      };
      PLAYER_CONFIG = {
        width: 32,
        height: 32,
        health: 1,
        speed: 0.5,
        fire_rate: 200,
        sprite: "/static/sprites/player.png"
      };
      BULLET_CONFIG = {
        width: 2,
        height: 8,
        health: 1,
        speed: 0.5,
        color: "#000"
      };
      ENEMY_CONFIG = {
        width: 32,
        height: 16,
        health: 1,
        speed: 0.05,
        frequency: 3e-3,
        amplitude: 2,
        points: 10,
        spawn_interval: 2e3,
        sprite: "/static/sprites/enemy.png"
      };
      BIG_ENEMY_CONFIG = {
        width: 32,
        height: 48,
        health: 3,
        speed: 0.025,
        frequency: 1e-3,
        amplitude: 1.5,
        points: 30,
        sprites: [
          "/static/sprites/big_enemy_1.png",
          "/static/sprites/big_enemy_2.png",
          "/static/sprites/big_enemy_3.png"
        ]
      };
      OBSTACLE_CONFIG = {
        width: 16,
        height: 48,
        speed: 0.15,
        sprite: "/static/sprites/obstacle.png"
      };
      AUDIO_CONFIG = {
        bg_music: "/static/audio/bgm.mp3",
        moving: "/static/audio/moving.mp3",
        shot: "/static/audio/shot.mp3",
        explosion: "/static/audio/explosion.mp3",
        big_explosion: "/static/audio/big_explosion.mp3",
        pop: "/static/audio/pop.mp3"
      };
    }
  });

  // src/core/input_handler.ts
  var InputHandler;
  var init_input_handler = __esm({
    "src/core/input_handler.ts"() {
      "use strict";
      InputHandler = class {
        keys = /* @__PURE__ */ new Set();
        constructor() {
          window.addEventListener("keydown", (e) => {
            this.keys.add(e.code);
          });
          window.addEventListener("keyup", (e) => {
            this.keys.delete(e.code);
          });
        }
        isKeyPressed(keyCode) {
          return this.keys.has(keyCode);
        }
      };
    }
  });

  // src/entities/entity.ts
  var Entity;
  var init_entity = __esm({
    "src/entities/entity.ts"() {
      "use strict";
      Entity = class {
        x;
        y;
        width;
        height;
        constructor(x, y, width, height) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
        }
        collidesWith(other) {
          return this.x < other.x + other.width && this.x + this.width > other.x && this.y < other.y + other.height && this.y + this.height > other.y;
        }
      };
    }
  });

  // src/entities/bullet.ts
  var Bullet;
  var init_bullet = __esm({
    "src/entities/bullet.ts"() {
      "use strict";
      init_constants();
      init_entity();
      Bullet = class extends Entity {
        speed;
        constructor(startX, startY) {
          super(
            startX - BULLET_CONFIG.width / 2,
            startY,
            BULLET_CONFIG.width,
            BULLET_CONFIG.height
          );
          this.speed = BULLET_CONFIG.speed;
        }
        update(deltaTime) {
          this.y -= this.speed * deltaTime;
        }
        draw(ctx) {
          ctx.fillStyle = BULLET_CONFIG.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        isOffScreen() {
          return this.y < -BULLET_CONFIG.height;
        }
      };
    }
  });

  // src/entities/player.ts
  var Player;
  var init_player = __esm({
    "src/entities/player.ts"() {
      "use strict";
      init_constants();
      init_entity();
      init_bullet();
      Player = class extends Entity {
        speed;
        fire_rate;
        shootCooldown = 0;
        sprite = new Image();
        constructor() {
          super(
            CANVAS_CONFIG.width / 2 - PLAYER_CONFIG.width / 2,
            CANVAS_CONFIG.height - 2 * PLAYER_CONFIG.height,
            PLAYER_CONFIG.width,
            PLAYER_CONFIG.height
          );
          this.speed = PLAYER_CONFIG.speed;
          this.fire_rate = PLAYER_CONFIG.fire_rate;
        }
        update(deltaTime, input) {
          if (input.isKeyPressed("ArrowLeft"))
            this.x -= this.speed * deltaTime;
          if (input.isKeyPressed("ArrowRight"))
            this.x += this.speed * deltaTime;
          if (this.x < 0)
            this.x = 0;
          if (this.x > CANVAS_CONFIG.width - this.width)
            this.x = CANVAS_CONFIG.width - this.width;
          if (this.shootCooldown > 0)
            this.shootCooldown -= deltaTime;
          if (input.isKeyPressed("Space") && this.shootCooldown <= 0) {
            this.shootCooldown = this.fire_rate;
            return new Bullet(this.x + this.width / 2, this.y);
          }
          return null;
        }
        draw(ctx) {
          this.sprite.src = PLAYER_CONFIG.sprite;
          ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
      };
    }
  });

  // src/entities/enemy.ts
  var Enemy, BigEnemy;
  var init_enemy = __esm({
    "src/entities/enemy.ts"() {
      "use strict";
      init_constants();
      init_entity();
      Enemy = class extends Entity {
        points;
        health;
        speedY;
        time = 0;
        frequency;
        amplitude;
        randomOffset;
        sprite = new Image();
        constructor(startX, startY) {
          super(startX, startY, ENEMY_CONFIG.width, ENEMY_CONFIG.height);
          this.speedY = ENEMY_CONFIG.speed;
          this.health = ENEMY_CONFIG.health;
          this.points = ENEMY_CONFIG.points;
          this.frequency = ENEMY_CONFIG.frequency;
          this.amplitude = ENEMY_CONFIG.amplitude;
          this.randomOffset = Math.random() * 1e4;
        }
        takeDamage() {
          this.health -= 1;
        }
        isDead() {
          return this.health <= 0;
        }
        update(deltaTime) {
          this.time += deltaTime;
          this.y += this.speedY * deltaTime;
          const timeWithOffset = this.time + this.randomOffset;
          this.x += Math.sin(timeWithOffset * this.frequency) * this.amplitude;
          if (this.x < 0)
            this.x = 0;
          else if (this.x > CANVAS_CONFIG.width - this.width)
            this.x = CANVAS_CONFIG.width - this.width;
        }
        draw(ctx) {
          this.sprite.src = ENEMY_CONFIG.sprite;
          ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
      };
      BigEnemy = class extends Enemy {
        constructor(startX, startY) {
          super(startX, startY);
          this.width = BIG_ENEMY_CONFIG.width;
          this.height = BIG_ENEMY_CONFIG.height;
          this.speedY = BIG_ENEMY_CONFIG.speed;
          this.health = BIG_ENEMY_CONFIG.health;
          this.points = BIG_ENEMY_CONFIG.points;
          this.frequency = BIG_ENEMY_CONFIG.frequency;
          this.amplitude = BIG_ENEMY_CONFIG.amplitude;
        }
        draw(ctx) {
          this.sprite.src = BIG_ENEMY_CONFIG.sprites[BIG_ENEMY_CONFIG.health - this.health];
          ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
      };
    }
  });

  // src/entities/obstacle.ts
  var Obstacle;
  var init_obstacle = __esm({
    "src/entities/obstacle.ts"() {
      "use strict";
      init_constants();
      init_entity();
      Obstacle = class extends Entity {
        speed;
        sprite = new Image();
        constructor(startX, startY) {
          super(startX, startY, OBSTACLE_CONFIG.width, OBSTACLE_CONFIG.height);
          this.speed = OBSTACLE_CONFIG.speed;
        }
        update(deltaTime) {
          this.y += this.speed * deltaTime;
        }
        draw(ctx) {
          this.sprite.src = OBSTACLE_CONFIG.sprite;
          ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
        isOffScreen() {
          return this.y > CANVAS_CONFIG.height + OBSTACLE_CONFIG.height;
        }
      };
    }
  });

  // src/network/api_client.ts
  function getCsrfToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, 10) === "csrftoken=") {
          cookieValue = decodeURIComponent(cookie.substring(10));
          break;
        }
      }
    }
    return cookieValue;
  }
  var init_api_client = __esm({
    "src/network/api_client.ts"() {
      "use strict";
    }
  });

  // src/core/audio_manager.ts
  var AudioManager;
  var init_audio_manager = __esm({
    "src/core/audio_manager.ts"() {
      "use strict";
      init_constants();
      AudioManager = class {
        bgMusic;
        movingSound;
        isMovingSoundPlaying = false;
        shotSound;
        explosionSound;
        bigExplosionSound;
        popSound;
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
        playBgm() {
          this.bgMusic.play().catch((err) => console.log("Waiting for user input to play BGM"));
        }
        stopBgm() {
          this.bgMusic.pause();
        }
        startMovingSound() {
          if (!this.isMovingSoundPlaying) {
            this.movingSound.play().catch(() => {
            });
            this.isMovingSoundPlaying = true;
          }
        }
        stopMovingSound() {
          if (this.isMovingSoundPlaying) {
            this.movingSound.pause();
            this.isMovingSoundPlaying = false;
          }
        }
        playShot() {
          const sound = this.shotSound.cloneNode();
          sound.volume = 0.5;
          sound.play().catch(() => {
          });
        }
        playExplosion() {
          const sound = this.explosionSound.cloneNode();
          sound.volume = 0.5;
          sound.play().catch(() => {
          });
        }
        playBigExplosion() {
          const sound = this.bigExplosionSound.cloneNode();
          sound.volume = 0.5;
          sound.play().catch(() => {
          });
        }
        playPop() {
          const sound = this.popSound.cloneNode();
          sound.volume = 0.5;
          sound.play().catch(() => {
          });
        }
        playDeathSound(bigEnemy) {
          if (bigEnemy) {
            this.playBigExplosion();
          } else {
            this.playPop();
          }
        }
      };
    }
  });

  // src/core/game_engine.ts
  var GameEngine;
  var init_game_engine = __esm({
    "src/core/game_engine.ts"() {
      "use strict";
      init_constants();
      init_input_handler();
      init_player();
      init_enemy();
      init_obstacle();
      init_api_client();
      init_audio_manager();
      GameEngine = class {
        audioManager;
        canvas;
        ctx;
        inputHandler;
        isRunning = false;
        isGameOver = false;
        hasStarted = false;
        lastTime = 0;
        currentScore = 0;
        level;
        player;
        bullets = [];
        enemies = [];
        obstacles = [];
        timeSinceLastSpawn = 0;
        spawnInterval = ENEMY_CONFIG.spawn_interval;
        constructor(canvasId) {
          this.audioManager = new AudioManager();
          this.canvas = document.getElementById(canvasId);
          this.ctx = this.canvas.getContext("2d");
          this.inputHandler = new InputHandler();
          this.level = parseInt(this.canvas.dataset.level || "1", 10);
          this.player = new Player();
        }
        spawnRandomEnemy(deltaTime) {
          this.timeSinceLastSpawn += deltaTime;
          const currentInterval = Math.max(500, this.spawnInterval - this.currentScore * 2);
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
        checkCollisions() {
          for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            const enemyIndex = this.enemies.findIndex((e) => bullet.collidesWith(e));
            if (enemyIndex !== -1) {
              this.bullets.splice(i, 1);
              this.enemies[enemyIndex].takeDamage();
              if (this.enemies[enemyIndex].isDead()) {
                this.audioManager.playDeathSound(this.enemies[enemyIndex].points === BIG_ENEMY_CONFIG.points);
                this.currentScore += this.enemies[enemyIndex].points;
                this.enemies.splice(enemyIndex, 1);
              } else
                this.audioManager.playExplosion();
              continue;
            }
            if (this.obstacles.some((o) => bullet.collidesWith(o))) {
              this.bullets.splice(i, 1);
            }
          }
          const isPlayerHit = this.obstacles.some((o) => this.player.collidesWith(o)) || this.enemies.some((e) => this.player.collidesWith(e));
          const isEnemyAtBottom = this.enemies.some((e) => e.y + e.height >= CANVAS_CONFIG.height);
          if (isPlayerHit || isEnemyAtBottom) {
            this.handleGameOver();
          }
        }
        async handleGameOver() {
          this.isGameOver = true;
          this.isRunning = false;
          this.audioManager.stopBgm();
          this.audioManager.stopMovingSound();
          const overlay = document.getElementById("gameover-overlay");
          const finalScoreElement = document.getElementById("final-score");
          const btnRestart = document.getElementById("btn-restart");
          if (overlay && finalScoreElement && btnRestart) {
            finalScoreElement.innerText = this.currentScore.toString();
            overlay.style.display = "flex";
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
            const response = await fetch("/api/save-score/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
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
        start() {
          this.isRunning = true;
          const startGame = () => {
            this.hasStarted = true;
            this.audioManager.playBgm();
            document.removeEventListener("keydown", startGame);
          };
          document.addEventListener("keydown", startGame);
          document.addEventListener("visibilitychange", () => {
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
        update(deltaTime) {
          if (!this.hasStarted) return;
          if (this.isGameOver) return;
          this.spawnRandomEnemy(deltaTime);
          const isMovingLeft = this.inputHandler.isKeyPressed("ArrowLeft");
          const isMovingRight = this.inputHandler.isKeyPressed("ArrowRight");
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
          this.bullets.forEach((bullet) => bullet.update(deltaTime));
          this.enemies.forEach((enemy) => enemy.update(deltaTime));
          this.obstacles.forEach((obstacle) => obstacle.update(deltaTime));
          this.checkCollisions();
          this.bullets = this.bullets.filter((bullet) => !bullet.isOffScreen());
          this.obstacles = this.obstacles.filter((obstacle) => !obstacle.isOffScreen());
        }
        draw() {
          this.ctx.fillStyle = CANVAS_CONFIG.color;
          this.ctx.fillRect(0, 0, CANVAS_CONFIG.width, CANVAS_CONFIG.height);
          this.player.draw(this.ctx);
          this.bullets.forEach((bullet) => bullet.draw(this.ctx));
          this.enemies.forEach((enemy) => enemy.draw(this.ctx));
          this.obstacles.forEach((obstacle) => obstacle.draw(this.ctx));
          this.ctx.fillStyle = "#000000";
          this.ctx.font = '20px "Comic Sans MS"';
          this.ctx.fillText(`Score: ${this.currentScore}`, 10, 30);
        }
        gameLoop(timestamp) {
          if (!this.isRunning) return;
          const deltaTime = timestamp - this.lastTime;
          this.lastTime = timestamp;
          this.update(deltaTime);
          this.draw();
          requestAnimationFrame((timestamp2) => this.gameLoop(timestamp2));
        }
      };
    }
  });

  // src/network/score_stream.ts
  function setupLiveLeaderboard(level) {
    const listElement = document.getElementById("top-5-list");
    if (!listElement) return;
    const eventSource = new EventSource(`/api/scores/live/${level}/`);
    eventSource.onmessage = (event) => {
      const scores = JSON.parse(event.data);
      listElement.innerHTML = "";
      if (scores.length === 0) {
        listElement.innerHTML = '<li style="color: gray;">No scores yet. Be the first!</li>';
        return;
      }
      scores.forEach((scoreObj, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${index + 1}. ${scoreObj.username}</strong> - ${scoreObj.score} pts`;
        listElement.appendChild(li);
      });
    };
    eventSource.onerror = () => {
      listElement.innerHTML = '<li style="color: red;">Connection lost. Reconnecting...</li>';
    };
  }
  var init_score_stream = __esm({
    "src/network/score_stream.ts"() {
      "use strict";
    }
  });

  // src/main.ts
  var require_main = __commonJS({
    "src/main.ts"() {
      init_game_engine();
      init_score_stream();
      document.addEventListener("DOMContentLoaded", () => {
        console.log("Initializing Sketch Invaders...");
        const canvas = document.getElementById("game-canvas");
        if (!canvas) return;
        const levelId = parseInt(canvas.dataset.level || "1", 10);
        const engine = new GameEngine("game-canvas");
        engine.start();
        setupLiveLeaderboard(levelId);
      });
    }
  });
  require_main();
})();
//# sourceMappingURL=main.js.map
