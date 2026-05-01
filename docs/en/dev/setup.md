# Setup

This guide will help you set up the Yumeri development environment.

## Requirements

- **Node.js**: LTS version (v18+ recommended)
- **Package Manager**: Yarn (recommended) or NPM

## Installation

### 1. Using Scaffold (Recommended)
```bash
yarn create yumeri
# or
npm init yumeri
```

### 2. Manual Installation
```bash
mkdir my-yumeri-app && cd my-yumeri-app
yarn init -y
yarn add yumeri
```

### 3. Use as Component
```typescript
import { Core } from 'yumeri';

const core = new Core();
core.start();
```

## Directory Structure

```text
yumeri-app/
├── plugins/          # Plugin directory
├── config.yml        # Configuration file
├── package.json      # Project configuration
└── tsconfig.json     # TypeScript configuration
```

## Start Development

```bash
yarn dev
```
Default listening at `http://localhost:14510`.
