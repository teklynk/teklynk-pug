# Teklynk Pug Project

This project is a web application built using [Vite](https://vitejs.dev/) and [Pug](https://pugjs.org/) templates. It leverages `vite-plugin-pug-i18n` for handling internationalization within Pug files.

## Features

- **Vite**: Fast development server and build tool.
- **Pug**: Robust template engine for Node.js.
- **i18n Support**: Multi-language support via `vite-plugin-pug-i18n`.
- **Cross-Platform Scripts**: Uses `cross-env` to ensure scripts run on Windows and POSIX systems.

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