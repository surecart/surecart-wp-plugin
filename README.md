SureCart. Based on the [WP Emerge](https://github.com/htmlburger/wpemerge) framework.

## Summary

-   [Requirements](#requirements)
-   [Directory structure](#directory-structure)
-   [Credits](#credits)

## Requirements

-   [PHP](http://php.net/) >= 5.5
-   [WordPress](https://wordpress.org/) >= 4.7
-   [Composer](https://getcomposer.org/)
-   [Node.js](https://nodejs.org/en/) >= 12
-   [Yarn](https://yarnpkg.com/en/) or NPM

## Directory structure

```
wp-content/plugins/surecart
├── app/
│   ├── helpers/              # Helper files, add your own here as well.
│   ├── routes/               # Register your WP Emerge routes.
│   │   ├── admin.php
│   │   ├── ajax.php
│   │   └── web.php
│   ├── src/                  # PSR-4 autoloaded classes.
│   │   ├── Controllers/      # Controller classes for WP Emerge routes.
│   │   ├── Routing/          # Register your custom routing conditions etc.
│   │   ├── View/             # Register your view composers, globals etc.
│   │   ├── WordPress/        # Register post types, taxonomies, menus etc.
│   │   └── ...
│   ├── config.php            # WP Emerge configuration.
│   ├── helpers.php           # Require your helper files here.
│   ├── hooks.php             # Register your actions and filters here.
│   └── version.php           # WP Emerge version handling.
├── dist/                     # Bundles, optimized images etc.
├── languages/                # Language files.
├── resources/
│   ├── build/                # Build process configuration.
│   ├── fonts/
│   ├── images/
│   ├── scripts/
│   │   ├── admin/            # Administration scripts.
│   │   └── frontend/         # Front-end scripts.
│   ├── styles/
│   │   ├── admin/            # Administration styles.
│   │   ├── frontend/         # Front-end styles.
│   │   └── shared/           # Shared styles.
│   └── vendor/               # Any third-party, non-npm assets.
├── vendor/                   # Composer packages.
├── views/
│   ├── layouts/
│   └── partials/
├── screenshot-1.png          # Plugin screenshot.
├── surecart.php              # Bootstrap plugin.
└── ...
```

### Notable directories

#### `app/helpers/`

Add PHP helper files here. Helper files should include **function definitions only**. See below for information on where to put actions, filters, classes etc.

#### `app/src/`

Add PHP class files here. All clases in the `SureCart\` namespace are autoloaded in accordance with [PSR-4](http://www.php-fig.org/psr/psr-4/).

#### `resources/images/`

Add images for styling here. Optimized copies will be placed in `dist/images/` when running the build process.

#### `resources/styles/frontend/`

Add .css and .scss files to add them to the front-end bundle. Don't forget to `@import` them in `index.scss`.

#### `resources/styles/admin/`

The admin styles directory which works identically to the `resources/styles/frontend/` directory.

#### `resources/scripts/frontend/`

Add JavaScript files here to add them to the frontend bundle. The entry point is `index.js`.

#### `resources/scripts/admin/`

The admin scripts directory which works identically to the `resources/scripts/frontend/` directory.

#### `views/`

1. `views/layouts/` - Layouts that other views extend.
2. `views/partials/` - Small snippets that are meant to be reused throughout other views.
3. `views/` - Full page views that may extend layouts and may include partials.

Avoid adding any PHP logic in any of these views, unless it pertains to layouting. Business logic should go into:

-   Helper files (`app/helpers/*.php`)
-   Service classes
-   [WP Emerge Controllers](https://docs.wpemerge.com/#/framework/routing/controllers)

## Credits

SureCart is powered by the [WP Emerge framework](https://wpemerge.com/).
