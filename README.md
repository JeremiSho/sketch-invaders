# Sketch Invaders :space_invader: :pencil2:

A hand-drawn, arcade-style browser game inspired by classic Space Invaders, built with TypeScript and powered by a Django web backend.

## :video_game: Overview

**Sketch Invaders** challenges players to defend against waves of invading sketches across multiple levels. As difficulty scales with each stage, players earn points and compete for a spot on the live leaderboard.

## :skull: Enemies & Obstacles

| Enemy / Obstacle | Durability | Strategy / Behavior |
| :--- | :--- | :--- |
| **Erasers** | 1 Hit | Basic frontline enemies; easily cleared with a single shot. |
| **Exams** | 3 Hits | Tougher obstacles; absorb multiple shots before being destroyed. |
| **Pencils** | Indestructible | Hazardous obstacles that cannot be eliminated; players must dodge them. |

## :joystick: Controls

| Key | Function |
| :--- | :--- |
| **Arrow Left** | Move Left |
| **Arrow Right** | Move Right |
| **Spacebar** | Shoot |

## :sparkles: Features

- **TypeScript Arcade Engine**: Fast, responsive 2D canvas gameplay featuring custom sketch-styled sprites.
- **Progression & Scoring**: Enemy waves, increasing speed and difficulty with each level, and replayability.
- **User Authentication**: Secure registration, login, and session handling powered by Django's auth framework.
- **Live Leaderboard (Server-Sent Events)**: Real-time top 5 high-score streaming per level without needing to refresh the page.

## :hammer_and_wrench: Tech Stack

- **Client**: TypeScript, HTML5 Canvas, CSS3
- **Server**: Python, Django (Views, StreamingHttpResponse for SSE, ORM)
- **Database**: SQLite (local development)

## :file_folder: Project Structure

```text
sketch_invaders/
├── frontend/         # TypeScript source code and build configs
├── game_app/         # Django application (views, models, routing)
├── server/           # Django project settings and WSGI/ASGI configuration
├── static/           # Static assets (compiled JS, sprites, audio effects)
├── templates/        # HTML templates (auth forms, game container)
├── manage.py         # Django CLI utility
└── requirements.txt  # Python package dependencies
```

## :rocket: How to Run

Follow these steps to set up and run the project locally:

### 1. Build the TypeScript Game
Before starting the backend, compile the TypeScript source files:

```bash
cd frontend
npm install
npm run build
cd ..
```

### 2. Set Up Python & Django Backend
From the project root (`sketch_invaders/`):
  
```bash
# 1. Activate the virtual environment:
# - Windows (PowerShell):
.venv\Scripts\Activate.ps1
# - Windows (Command Prompt):
.venv\Scripts\activate.bat
# - macOS / Linux:
source .venv/bin/activate

# 2. Install backend dependencies:
pip install -r requirements.txt

# 3. Apply database migrations:
python manage.py makemigrations
python manage.py migrate

# 4. (Optional) Create an admin user:
python manage.py createsuperuser
```

### 3. Start the Server
Run the local Django development server:

```bash
python manage.py runserver
```

Open your browser and navigate to:
http://127.0.0.1:8000/

- Register a new account or log in.
- The game canvas and the real-time SSE Top 5 leaderboard will load automatically after choosing a level.