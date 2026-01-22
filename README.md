# Teklynk Pug Project

This project is a static site generator built using Vite and Pug templates. It is great for blogs and portfolio websites, and leverages `vite-plugin-pug-i18n` for handling internationalization within Pug files.

## Deployment 
Since this project generates static assets (HTML, CSS, JavaScript, images), it can be easily deployed on Cloudflare Pages, GitHub Pages, or other JAMstack environments. 

Simply configure your deployment provider to serve the dist directory after running the build command.

## Features

- **Vite**: Fast development server and build tool.
- **Pug**: Robust template engine for Node.js.
- **i18n Support**: Multi-language support via `vite-plugin-pug-i18n`.
- **RSS Feed**: Includes RSS feed generation.
- **Cross-Platform Scripts**: Uses `cross-env` to ensure scripts run on Windows and POSIX systems.
- **Supports**: Layouts, includes, variables, scss, template logic, plugins, multiple pages.

## Prerequisites

- Node.js (version 14 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Navigate to the project directory:
   ```bash
   cd teklynk-pug
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Server

To start the local development server with hot module replacement:

```bash
npm run dev
```

### Building for Production

To build the project for production:

```bash
npm run build
```

The output files will be generated in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```