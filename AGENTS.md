# SureCart Agents

## Cursor Cloud specific instructions

### Overview

SureCart is a headless e-commerce WordPress plugin. It is a monorepo using Yarn 3.2.2 workspaces (with `nodeLinker: node-modules`) and Composer for PHP. The local dev environment uses `@wordpress/env` (wp-env) which runs WordPress + MySQL in Docker containers.

See `CLAUDE.md` for architecture details, `app/CLAUDE.md` for PHP patterns, and `packages/CLAUDE.md` for JS/blocks patterns.

### Running the dev environment

1. **Start Docker daemon** (if not already running): `sudo dockerd &>/tmp/dockerd.log &` then `sudo chmod 666 /var/run/docker.sock`
2. **Start wp-env**: `yarn wp-env start` — starts WordPress on port 8000 (dev) and 8889 (tests)
3. **Build assets**: First run `yarn bootstrap` to build Stencil web components, React wrappers, and legacy blocks (in dependency order). Then run `npx wp-scripts build` for admin/store webpack bundles into `dist/`, and `yarn workspace @surecart/blocks-next build` for next-gen blocks.
4. **Dev watch mode**: `yarn dev` runs `composer install && yarn start:workspace` which watches all packages. This is a long-running process.

### wp-env gotcha: plugin directory name

wp-env mounts the repo as the directory name of the workspace (e.g. `workspace`), but PHPUnit bootstrap expects the plugin at `surecart/surecart.php`. After starting wp-env, create symlinks in both containers:

```bash
yarn wp-env run cli bash -c "ln -sf /var/www/html/wp-content/plugins/workspace /var/www/html/wp-content/plugins/surecart"
yarn wp-env run tests-cli bash -c "ln -sf /var/www/html/wp-content/plugins/workspace /var/www/html/wp-content/plugins/surecart"
```

### Key commands

| Task | Command |
|------|---------|
| Install PHP deps | `composer install` |
| Install JS deps | `yarn install` |
| Bootstrap (first build) | `yarn bootstrap` |
| Build admin assets | `npx wp-scripts build` |
| Build blocks-next | `yarn workspace @surecart/blocks-next build` |
| Start wp-env | `yarn wp-env start` |
| Stop wp-env | `yarn wp-env stop` |
| PHPUnit tests | `yarn wp-env run tests-cli ./vendor/bin/phpunit --env-cwd=wp-content/plugins/workspace -- --testdox` |
| PHP linting (PHPCS) | `vendor/bin/phpcs --standard=phpcs.xml <file>` |
| PHPStan analysis | `composer analyse` |
| JS lint | `yarn lint:js` (has pre-existing ESLint version conflict — see note below) |
| E2E tests | `yarn test:e2e` (requires Playwright browsers installed) |
| WP admin login | http://localhost:8000/wp-admin/ — user: `admin`, pass: `password` |

### ESLint version conflict

The root `eslint@6.8.0` devDependency conflicts with the newer `@wordpress/eslint-plugin` bundled in `@wordpress/scripts`. Running `yarn lint:js` may fail with plugin resolution errors. PHP linting via PHPCS/PHPStan works correctly.

### Build dependency order

`yarn bootstrap` must run before `yarn dev` or any webpack build. Build sequence: Stencil components -> `components-react` wrappers -> `blocks` + `blocks-next`. After modifying Stencil components, rebuild before blocks.
