# Quasar Multi-Platform App with Supabase

A responsive Quasar Framework project that can be deployed as a website, PWA, iOS app, Android app, and desktop app. This project uses Supabase for the backend, which can be run locally using Docker.

## Project Overview

This project demonstrates how to create a multi-platform application using Quasar Framework with Vue.js and Supabase as the backend. The app features:

- Responsive layouts that adapt to desktop, tablet, and mobile screens
- Authentication system using Supabase
- PWA support for offline capabilities
- Native mobile app capabilities via Capacitor

## Quick Start

To start both the Quasar development server and local Supabase instance:

```bash
./start-dev.sh
```

Or start them separately:

```bash
# Start local Supabase
cd supabase-local
docker-compose up -d

# Start Quasar development server
cd quasar-project
npm run dev
```

## Development Modes

The project includes scripts for different development modes:

```bash
# Web development
npm run dev

# PWA development
npm run dev:pwa

# Android development
npm run dev:android

# iOS development
npm run dev:ios
```

## Building for Production

```bash
# Web application
npm run build

# PWA
npm run build:pwa

# Android app
npm run build:android

# iOS app
npm run build:ios
```

## Project Structure

- `quasar-project/` - Main Quasar application
  - `src/` - Vue.js source files
  - `src-pwa/` - PWA specific files
  - `src-capacitor/` - Capacitor configuration for native apps
- `supabase-local/` - Docker configuration for local Supabase instance

For more details, see the README in the quasar-project directory. 