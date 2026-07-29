# CubeZila

The ultimate speedcubing training platform.

## Features

- **Timer** - Full-featured speedcubing timer with inspection time, DNF, +2, and more
- **Algorithm Library** - Browse and practice OLL, PLL, F2L, and other algorithms
- **Analytics** - Track your solve times and progress over time
- **Scramble Generator** - Generate random scrambles for all cube types
- **User Accounts** - Save your solves, favorites, and settings
- **Themes** - Multiple color themes including dark mode
- **PWA** - Install as a native app on any device

## Tech Stack

- Vite
- Vanilla JavaScript
- Firebase (Auth & Firestore)
- Font Awesome
- Cubing.net API

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Configuration

### Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Google & Email/Password)
3. Enable Firestore Database
4. Copy `js/firebase.example.js` to `js/firebase.js` and add your config

### Google Analytics

Create `js/analytics.js`:

```js
// Add your Google Analytics ID
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');
```

## Free Software

CubeZila is free and open source. Use it however you like.

---

Made with ❤️ for the cubing community
