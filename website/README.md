# KoKoroMichi Website

Full-stack web application for the KoKoroMichi Discord RPG bot.

## Features

- **React Frontend**: Modern, responsive UI with Tailwind CSS
- **5-Element Theme System**: Water, Fire, Earth, Metal, Wood themes
- **Dynamic Content**: Live server stats, character database, commands
- **Discord Integration**: Server widget, FAQ webhook
- **Mobile Responsive**: Optimized for all device sizes

## Pages

1. **Home**: Bot overview, live stats, invite button
2. **Commands**: Interactive command browser with usage stats
3. **Waifus**: Character database with rarity system and summon simulator
4. **Features**: Comprehensive game mechanics explanation
5. **FAQ**: Searchable FAQ with submission form

## Quick Start

### Development
```bash
cd website
npm run install:all
npm run dev
```

### Production
```bash
cd website
npm run build
npm start
```

## Environment Variables

- `DISCORD_TOKEN`: Bot token for server stats (optional)
- `DISCORD_FAQ_WEBHOOK`: Webhook URL for FAQ submissions
- `PORT`: Backend port (default: 3001)
- `NODE_ENV`: Environment mode

## Architecture

- **Frontend**: React + Vite + Tailwind CSS (Port 5000)
- **Backend**: Node.js + Express (Port 3001)
- **Data**: JSON files from Discord bot project

## Deployment

This project is configured for Replit deployment with automatic setup.