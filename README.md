# Ludo Web Game

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)



---

## About the Project

Ludo Web recreates the fun of the traditional Ludo board game digitally. Players can play together locally (local multiplayer) or challenge the artificial intelligence (AI) with multiple difficulty levels. The project is designed modularly to be easy to maintain, extend, and integrate with new features in the future.

---

## Key Features

- **Flexible Game Modes**: Supports local multiplayer for 2 to 4 players, as well as a Single Player mode against the computer (AI).
- **Smart AI with 3 Difficulty Levels**: Computer opponents with Easy (random), Medium (balanced), and Hard (tactical) settings to provide a proper challenge.
- **Premium Visuals & Animations**: High-definition scalable vector (SVG) board layout, confetti particle effects on victory, visual effects during token captures, and smooth 2D/3D dice rolling animations.
- **Immersive Thematic Audio**: Complete with background music (BGM) and sound effects (SFX) for key actions (dice roll, token movement, landing on safe zones, victory, defeat). All audio assets feature fallback `.ogg` formats to ensure browser compatibility.
- **Customizable Settings**: Control music and SFX volume, player count, and player colors, which are stored locally (persistent settings).
- **Authentic Ludo Rules Engine**: Precise implementation of classic rules including the requirement of rolling a 6 to release a token from the base, safe squares, opponent captures, and the home path.

---

## Technology Stack

This project prioritizes code simplicity and fast page loading speeds by utilizing the following stack:

1. **HTML5**: Semantic structure acting as the foundation of the application and the game container.
2. **Vanilla CSS3 (Modular)**: Split stylesheet modules to simplify the maintenance of the layout, board grid, token placement, animations, responsiveness, and modal overlay.
3. **JavaScript (ES6+)**: Robust, object-oriented state management without external frameworks (No React/Vue/Angular), guaranteeing instant performance.
4. **SVG & Custom Typography**: Vector graphics for clean board rendering at any screen resolution, complemented by custom web fonts.

---

## Directory Structure

Below is the directory tree of the Ludo Web project:

```text
ludo-game/
├── index.html
├── css/
│   ├── style.css              # Main layout & responsiveness
│   ├── board.css              # Board & grid styling
│   ├── pieces.css             # Token styling & positioning
│   ├── dice.css               # Dice styling & roll animation
│   ├── animations.css         # Movement, particle, & victory animations
│   └── modal.css              # Popup/modal styling (menu, settings, win screen)
├── js/
│   ├── main.js                # Entry point, game initialization
│   ├── game.js                # Main state manager (game loop)
│   ├── board.js               # Board rendering & grid coordinates
│   ├── path.js                # Routh definition for each color (coordinate arrays)
│   ├── dice.js                # Dice logic & animation
│   ├── piece.js               # Token logic (movement, position, state)
│   ├── player.js              # Player data & turn management
│   ├── ai.js                  # Opponent AI logic (easy/medium/hard)
│   ├── rules.js               # Rules engine (safe square, capture, finish, six-rule)
│   ├── audio.js               # Audio & BGM manager
│   ├── ui.js                  # UI updates, scoreboard, toast notifications
│   ├── modal.js               # Controls popup menus, settings, & win screen
│   ├── settings.js            # Saves preferences (volume, players, mode)
│   └── utils.js               # Helper functions (random, delay, etc.)
├── assets/
│   ├── images/
│   │   ├── board.png              # Rasterized main board image
│   │   ├── board.svg              # Scalable SVG board (HD)
│   │   ├── logo.png               # Game logo
│   │   ├── favicon.ico
│   │   ├── dice/
│   │   │   ├── dice-1.png to dice-6.png
│   │   │   └── dice-rolling.gif   # Rolling dice animation
│   │   ├── pieces/
│   │   │   ├── piece-red.png, piece-blue.png, etc.
│   │   │   └── piece-shadow.png   # Drop shadow effect under tokens
│   │   ├── ui/
│   │   │   ├── btn-roll.png       # Roll dice button
│   │   │   ├── icon-sound-on.png / icon-sound-off.png
│   │   │   ├── icon-settings.png, icon-restart.png, icon-home.png
│   │   │   └── star-safe.png      # Safe square icon
│   │   └── effects/
│   │       ├── confetti.png       # Victory confetti particle sprite
│   │       └── capture-effect.png # Visual effect when a token is captured
│   └── audio/
│       ├── *.mp3 / *.ogg          # Complete background music & SFX files
├── data/
│   └── config.json            # Default game configurations
├── fonts/
│   ├── game-font.woff2        # Primary thematic font
│   └── game-font.woff         # Fallback font
└── README.md
```

---

## Component & File Descriptions

To make it easier to understand the workflow and code integration, the tables below outline the purpose of each file in this project.

### 1. Styling (CSS Stylesheets)

| File Name | Path | Responsibility & Function |
| :--- | :--- | :--- |
| `style.css` | `css/style.css` | Controls the main container layout, responsive designs (media queries), and basic background decorations. |
| `board.css` | `css/board.css` | Handles the layout grid of the 15x15 Ludo board and visualizes each player base area. |
| `pieces.css` | `css/pieces.css` | Handles token styling and manages coordinates when multiple tokens occupy the same cell. |
| `dice.css` | `css/dice.css` | Styles the dice container, active roll button, and controls 3D/2D roll animations. |
| `animations.css`| `css/animations.css`| Manages global animation classes like hopping token movements, success particle bursts, and turn indicators. |
| `modal.css` | `css/modal.css` | Handles styling for overlay popups (Main Menu, Settings, Win Screen, Credits). |

### 2. Game Logic (JavaScript Modules)

| File Name | Path | Responsibility & Function |
| :--- | :--- | :--- |
| `main.js` | `js/main.js` | **Main Entry Point**. Pre-loads game configurations, initializes active modules, and handles initial page event listeners. |
| `game.js` | `js/game.js` | **Main Game Loop / State Manager**. Coordinates player turns, maintains game state (Start, Playing, Pause, Game Over), and bridges other modules. |
| `board.js` | `js/board.js` | Translates logical board coordinates to absolute CSS/grid positions for visual rendering. |
| `path.js` | `js/path.js` | **Route Definition**. Holds coordinate sequences for Red, Green, Yellow, and Blue tracks from base exits to the home stretch. |
| `dice.js` | `js/dice.js` | Controls dice randomization (1-6) and triggers the graphical rolling animation. |
| `piece.js` | `js/piece.js` | Handles individual token data: current coordinates, states (home base, active, safe, finished), and transition animations. |
| `player.js` | `js/player.js` | Manages player profiles (name, color, type: human or AI) and tracks owned tokens. |
| `ai.js` | `js/ai.js` | **Artificial Intelligence Engine**. Decides the optimal token move for the computer based on chosen difficulty settings. |
| `rules.js` | `js/rules.js` | **Validation Engine**. Ensures move compliance with traditional Ludo rules (six-rules, captures, safe squares, finished paths). |
| `audio.js` | `js/audio.js` | **Audio Controller**. Handles ambient background music looping and triggers appropriate sound effects (SFX) on events. |
| `ui.js` | `js/ui.js` | Updates DOM elements in real-time, displays current scores, updates turn markers, and shows toast notifications. |
| `modal.js` | `js/modal.js` | Manages the display transitions and processes selections in UI dialog overlays. |
| `settings.js`| `js/settings.js` | Synchronizes user game options (volume settings, player count, custom colors) with browser local storage. |
| `utils.js` | `js/utils.js` | Stores globally accessible utility routines such as custom random generators, sleep/delay promises, and converters. |

### 3. Game Configuration (Data)

| File Name | Path | Responsibility & Function |
| :--- | :--- | :--- |
| `config.json` | `data/config.json` | Stores initial game variables editable without touching JavaScript, such as player colors, base coordinates, and transition times. |

---

## How to Run the Game

Since this game is built using native web standards, no compilation or build process is required. You can run the game locally using either of the following methods:

### Method A: Direct Execution (Quick Play)
1. Download or clone this repository.
2. Navigate to the `ludo-game` folder.
3. Double-click the `index.html` file to open it in your preferred browser.
> [!NOTE]
> Some modern web browsers restrict automatic audio playback or loading external JSON resources (`data/config.json`) over file URLs (`file://`) due to CORS policies. If configuration files fail to load, use **Method B**.

### Method B: Local Server (Recommended)
For full performance and security compliance, serve the game locally using a lightweight server:

- **Option 1: Visual Studio Code (Live Server Extension)**
  - Open the project folder in VS Code.
  - Install the **Live Server** extension.
  - Click the **"Go Live"** button in the bottom-right status bar.

- **Option 2: Using Node.js http-server**
  Run this command in your terminal from the project directory:
  ```bash
  npx http-server .
  ```
  Open `http://localhost:8080` in your web browser.

- **Option 3: Using Python**
  If you have Python installed, execute the following command:
  ```bash
  python -m http.server 8000
  ```
  Open `http://localhost:8000` in your web browser.

---

## Configuration Guide (config.json)

You can instantly tweak game variables by editing `data/config.json`. Below is an example structure of the supported parameters:

```json
{
  "gameSettings": {
    "defaultPlayersCount": 4,
    "startingPlayerIndex": 0,
    "animationDelayMs": 300,
    "enableAudioDefault": true,
    "defaultBgmVolume": 0.5,
    "defaultSfxVolume": 0.8
  },
  "playerColors": {
    "red": "#FF0000",
    "green": "#00FF00",
    "yellow": "#FFFF00",
    "blue": "#0000FF"
  }
}
```

---



Enjoy playing!
