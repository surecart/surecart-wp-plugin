# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SureCart is a WordPress e-commerce plugin built on the WP Emerge framework. It provides a headless e-commerce platform with features like checkout forms, customer dashboards, product management, subscriptions, and more.

## Development Commands

### Initial Setup
```bash
# Install composer dependencies
composer install

# Install JavaScript dependencies
yarn

# Bootstrap the build (required before development)
yarn bootstrap
```

### Development Workflow
```bash
# Start development mode with file watching
yarn dev

# Build for production
yarn plugin:release

# Run PHP tests
yarn test:php

# Run E2E tests
yarn test:e2e

# Run E2E tests with UI
yarn test:e2e:ui
```

### Code Quality
```bash
# PHP code standards check
./vendor/bin/phpcs

# PHP static analysis
./vendor/bin/phpstan analyse

# JavaScript linting
yarn lint:js

# CSS linting
yarn lint:css
```

## Architecture

### Core Structure
- **WP Emerge Framework**: The plugin is built on WP Emerge, providing MVC structure with service providers, routing, and dependency injection
- **Service Providers**: Located in `app/src/`, they bootstrap different features (e.g., `AccountServiceProvider`, `BlockServiceProvider`)
- **Models**: Located in `app/src/Models/`, represent data structures (e.g., `Product`, `Customer`, `Order`)
- **Controllers**: Handle routing logic for admin, web, and AJAX requests
- **REST API**: Extensive REST endpoints defined in `app/src/Rest/` for API operations

### Key Directories
- `packages/`: Monorepo structure containing blocks, components, admin interfaces
- `packages/blocks/`: Gutenberg block definitions
- `packages/components/`: Web components library (Stencil.js based)
- `packages/admin/`: React-based admin interfaces
- `dist/`: Built assets (do not edit directly)

### Block System
- Server-side rendered blocks defined in `config.php` under `'blocks'`
- Legacy Block PHP controllers in `packages/blocks/Blocks/`
- New Block PHP controllers and views in `packages/blocks-next`
- Components preloaded per block for performance (see `'preload'` in config)

### Middleware System
- Request middleware defined in `app/src/Middleware/`
- Configured in `config.php` under `'middleware'`
- Handles authentication, redirects, asset loading

### Database Integration
- Uses WordPress database with custom tables
- Migrations in `app/src/Database/`
- Models extend `DatabaseModel` or `ExternalApiModel`

### API Integration
- External API URL: `https://api.surecart.com`
- Models communicate with SureCart API for data operations
- Webhook handling for real-time updates

## Development Guidelines

### PHP Standards
- Follow WordPress coding standards with exceptions defined in `phpcs.xml`
- Use short array syntax `[]` instead of `array()`
- Namespace all classes under `SureCart\`
- Text domain for translations: `surecart`

### JavaScript Development
- Monorepo uses Yarn workspaces
- Components use Stencil.js (packages/components)
- Admin uses React (packages/admin)
- Blocks use WordPress block editor APIs

### Testing
- PHP unit tests in `.dev/tests/php/`
- E2E tests use Playwright
- Test configuration in `phpunit.xml` and `playwright.config.ts`

### Build Process
- Webpack configuration in `webpack.config.js`
- Entry points for different admin pages and components
- Assets copied from packages to dist during build

## Important Considerations
- Always run `yarn bootstrap` after fresh clone
- Use `yarn dev` for development to watch file changes
- The plugin integrates with multiple third-party services (LearnDash, MemberPress, etc.)
- Supports multiple payment processors configured through the admin
- Has extensive webhook support for real-time updates
- Includes abandoned cart recovery features
- Multi-language support with translation files in `languages/`