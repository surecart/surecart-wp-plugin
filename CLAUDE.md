# CLAUDE.md

Comprehensive context for Claude Code when working with the SureCart WordPress plugin.

## Project Overview

**SureCart** is a headless e-commerce WordPress plugin built on the **WP Emerge** framework. It communicates with `api.surecart.com` for transactional data while using WordPress for rendering, user management, and integrations. The plugin uses a monorepo structure with Yarn workspaces.

**Tech Stack:** PHP 7.4+ (WP Emerge), Stencil.js (web components), React 18 (admin), WordPress Interactivity API (next-gen blocks), Webpack, Playwright (E2E), PHPUnit.

**Constants** (defined in `surecart.php`):
- `SURECART_API_URL` = `https://api.surecart.com`
- `SURECART_APP_URL` = `https://app.surecart.com`
- `SURECART_JS_URL` = `https://js.surecart.com`
- `SURECART_PLUGIN_FILE`, `SURECART_PLUGIN_DIR`

---

## Directory Structure

```
surecart/
├── surecart.php                 # Main plugin file, defines constants, bootstraps app
├── app/
│   ├── config.php               # Master config: service providers, blocks, middleware, routes, webhooks
│   ├── hooks.php                # WordPress hook registrations
│   ├── helpers.php              # Global helper functions
│   ├── routes/
│   │   ├── web.php              # Public routes (buy page, upsell, webhooks, redirects)
│   │   ├── admin.php            # Admin routes (30+ pages with capability checks)
│   │   └── ajax.php             # AJAX routes (nonce refresh only)
│   └── src/
│       ├── SureCart.php          # Main bootstrap class (facade)
│       ├── Account/              # Account service provider
│       ├── Activation/           # Product activation handling
│       ├── Background/           # Background jobs, async webhooks, bulk actions
│       ├── BlockLibrary/         # Block registration, validation, patterns, quick views
│       ├── BlockValidator/       # Block validation rules
│       ├── Cart/                 # Shopping cart service
│       ├── Controllers/
│       │   ├── Admin/            # Admin page controllers (orders, products, settings...)
│       │   ├── Rest/             # 91 REST API controllers
│       │   └── Web/              # Public page controllers (buy, checkout, dashboard, upsell)
│       ├── Database/             # Migrations, table schemas (3 custom tables)
│       ├── Form/                 # Form handling
│       ├── Integrations/         # 20+ third-party integrations
│       ├── Middleware/           # 21 request middlewares
│       ├── Models/               # 120+ data models (API-backed and DB-backed)
│       │   ├── Traits/           # Model traits (HasDates, HasCustomer, HasPurchases, etc.)
│       │   └── Concerns/         # Shared model behaviors
│       ├── Permissions/          # Capability-based permission system
│       ├── Rest/                 # 88+ REST service providers (endpoint registration)
│       ├── Support/Errors/       # Error translation service
│       ├── Sync/                 # API ↔ WordPress data sync (jobs, tasks)
│       ├── Webhooks/             # Webhook processing service
│       └── WordPress/            # WP integration (assets, admin, themes, templates, cache, CLI)
├── packages/
│   ├── blocks/                  # Legacy blocks (91 blocks, PHP SSR + block.json)
│   │   └── Blocks/              # Block PHP classes extending BaseBlock
│   ├── blocks-next/             # Next-gen blocks (95 blocks, WP Interactivity API)
│   │   └── src/blocks/          # Each block: block.json + controller.php + view.php + edit.js
│   ├── components/              # Stencil.js web components (109 components)
│   │   └── src/
│   │       ├── components/      # Component source (tsx + scss)
│   │       └── store/           # Stencil stores (checkout, form, user)
│   ├── admin/                   # React admin UI (20+ page modules)
│   │   └── store/               # Redux-style stores (data, ui, account, page)
│   ├── components-react/        # React wrappers for Stencil components
│   ├── pages/                   # Full page templates (admin, checkout, dashboard)
│   └── router/                  # Frontend routing utilities
├── templates/                   # PHP view templates (cart, forms, patterns, pages, parts)
├── views/                       # Additional PHP views
├── styles/                      # Theme compat CSS (divi, bricks)
├── dist/                        # Built assets (DO NOT EDIT)
├── languages/                   # 69 language translations (.po, .mo, .json)
├── .dev/tests/                  # Test files
│   ├── php/                     # PHPUnit (107 test files: unit/ + feature/)
│   └── e2e/                     # Playwright E2E tests
├── webpack.config.js            # Root webpack config (23+ admin entry points)
├── composer.json                # PHP deps (pimple, guzzle/psr7, action-scheduler)
└── package.json                 # JS deps, yarn workspaces, build scripts
```

---

## Architecture & Patterns

### WP Emerge Framework

The plugin uses WP Emerge for MVC structure with Pimple dependency injection.

**Bootstrap flow:** `surecart.php` → composer autoload → `SureCart.php` facade → `app/config.php` (registers 168 service providers) → `app/hooks.php`

**Service Provider pattern:**
```php
// Each provider has register() and bootstrap() methods
class AccountServiceProvider implements ServiceProviderInterface {
    public function register($container) { /* bind to container */ }
    public function bootstrap($container) { /* hook into WordPress */ }
}
```

**Routing:** Routes defined in `app/routes/{web,admin,ajax}.php`, mapped to controllers via:
```php
\SureCart::route()->get()
    ->where('admin', 'sc-products')
    ->middleware('user.can:edit_sc_products')
    ->middleware('assets.components')
    ->handle('ProductsController@index');
```

### Model System

**Three model base classes:**

| Base Class | Storage | Examples |
|---|---|---|
| `Model` | SureCart API (`api.surecart.com`) | Product, Customer, Order, Checkout, Subscription |
| `DatabaseModel` | WordPress custom tables | Integration, IncomingWebhook, VariantOptionValue |
| `ExternalApiModel` | External APIs | IntegrationCatalog |

**API Model usage:**
```php
$product = Product::find($id);                    // GET /products/{id}
$products = Product::where(['archived' => false])->paginate(); // GET /products?archived=false
$product = Product::create(['name' => 'Foo']);     // POST /products
$product->update(['name' => 'Bar']);               // PATCH /products/{id}
$product->delete();                                // DELETE /products/{id}
```

**Key model traits:** `HasDates`, `HasCustomer`, `HasPurchases`, `HasBillingAddress`, `HasShippingAddress`, `HasPaymentIntent`, `HasPaymentMethod`, `HasDiscount`, `CanFinalize`, `CanDuplicate`, `HasImageSizes`, `HasCommissionStructure`

### Block Rendering Pipeline

**Legacy blocks** (`packages/blocks/Blocks/`): Extend `BaseBlock`, register via `register_block_type_from_metadata()`, render with PHP callback that outputs Stencil component tags.

**Next-gen blocks** (`packages/blocks-next/src/blocks/`): Use WordPress Interactivity API with controller.php → view.php pipeline:
```php
// controller.php — prepares data
$product = sc_get_product();
return 'file:./view.php';

// view.php — template with directives
<button data-wp-on--click="callbacks.redirectToCheckout"
        data-wp-bind--disabled="state.isUnavailable">
    <span data-wp-text="state.buttonText"></span>
</button>
```

**Component preloading** (in `app/config.php` under `'preload'`): Maps block names to required Stencil components to prevent layout shift:
```php
'surecart/checkout-form' => ['sc-checkout', 'sc-form', 'sc-checkout-unsaved-changes-warning'],
'surecart/product-buy-buttons' => ['sc-product-buy-button', 'sc-button'],
```

### Stencil.js Components

109 web components in `packages/components/src/components/`. Tag prefix: `sc-`.

**Component pattern:**
```tsx
@Component({ tag: 'sc-button', styleUrl: 'sc-button.scss', shadow: true })
export class ScButton {
    @Prop({ reflect: true }) type: 'primary' | 'success' | 'danger' = 'primary';
    @Prop({ reflect: true }) loading?: boolean = false;
    @Event() scClick: EventEmitter<void>;
    render() { /* JSX */ }
}
```

**State management:** Uses `@stencil/store` with xstate state machines for complex flows:
- `packages/components/src/store/checkout/store.ts` — checkout data
- `packages/components/src/store/form/store.ts` — form state machine
- Checkout machine states: `draft` → `updating` → `finalizing` → `paying` → `confirming` → `confirmed` → `redirecting`

### Admin (React)

Redux-style store in `packages/admin/store/` with modules: `account`, `page`, `ui`, `integration`, `notices`, `fetch`. Each has `reducer`, `actions`, `selectors`, `resolvers`, `controls`.

---

## Key Flows

### Checkout Flow

1. **Create draft** — `POST /wp-json/surecart/v1/checkouts` → creates empty Checkout on API
2. **Update checkout** — `PATCH /wp-json/surecart/v1/checkouts/{id}` → adds email, line items, addresses, coupons
3. **Finalize** — `POST /wp-json/surecart/v1/checkouts/{id}/finalize` → validates, processes payment
4. **Confirm** — `DraftCheckoutsController->finalize()` → confirms payment, links customer to WP user
5. **Post-purchase hooks** — `do_action('surecart/purchase_created', $purchase)` triggers integrations

**State machine:** `draft` → `finalizing` → `paying` → `confirming` → `confirmed` → `redirecting`

**Payment processors:** Stripe, PayPal, Paystack, Razorpay, Mollie, Manual methods

### Product Page Rendering

1. Custom post type `sc_product` registered via `PostTypeServiceProvider`
2. Query var `surecart_current_product` set on product pages
3. `render_block_context` filter injects `surecart/product` context into blocks
4. Next-gen blocks use `sc_get_product()` in controller.php
5. Stencil components hydrate for interactivity (buy button, price display, variants)

### Webhook Processing

1. API sends POST to `/surecart/webhooks` → `WebhookController@receive`
2. `WebhooksMiddleware` validates HMAC-SHA256 signature
3. Payload stored in `surecart_incoming_webhooks` table
4. Background processing via `AsyncWebhookService`
5. WordPress actions fired: `surecart/purchase_created`, `surecart/purchase_revoked`, etc.
6. Integration services respond to events (grant/revoke access)

**Tracked events:** `customer.updated`, `purchase.created/updated/invoked/revoked`, `price.created/updated/deleted`, `product.created/updated/deleted/stock_adjusted`, `subscription.renewed`, `account.updated`

### Subscription Lifecycle

Model: `Subscription` at endpoint `subscriptions`. Key traits: `HasCustomer`, `HasPrice`, `HasPurchase`, `HasDates`. Supports: current period tracking, cancellation, renewal, preservation settings.

---

## Data Model

### Core Entities & Relationships

```
Account (shop) ──┬── Product ──── Price ──── Variant
                  │                            └── VariantOption → VariantOptionValue (DB)
                  ├── Customer ←→ WordPress User (synced)
                  │     └── PaymentMethod
                  ├── Checkout ── LineItem ── Purchase
                  │     ├── Discount ← Coupon/Promotion
                  │     ├── ShippingChoice
                  │     └── PaymentIntent → Charge
                  ├── Order (from finalized Checkout)
                  │     └── Fulfillment → FulfillmentItem
                  ├── Subscription ── Period
                  ├── Invoice
                  ├── License → Activation
                  ├── Affiliation → Referral → ReferralItem
                  ├── Bump, UpsellFunnel → Upsell
                  └── Webhook → IncomingWebhook (DB)
```

### Key Models (120+)

**E-commerce:** Product, Price, Variant, VariantOption, ProductGroup, ProductCollection, ProductMedia, Media
**Purchases:** Customer, Checkout, Order, Purchase, AbandonedCheckout, LineItem
**Billing:** Subscription, Period, Invoice, PaymentMethod, PaymentIntent, Charge, Refund
**Marketing:** Coupon, Promotion, Discount, Bump, Upsell, UpsellFunnel, Affiliation, Referral
**Shipping/Tax:** ShippingMethod, ShippingProfile, ShippingRate, ShippingZone, TaxProtocol, TaxZone
**Content:** Download, License, Activation, GalleryItem, Form
**Protocol models:** OrderProtocol, SubscriptionProtocol, CustomerNotificationProtocol, AbandonedCheckoutProtocol, AffiliationProtocol, CustomerPortalProtocol

---

## API Layer

All API-backed models communicate with `https://api.surecart.com`. Authentication via API token stored in WordPress options (`ApiToken::get()`).

**REST endpoints** registered via service providers in `app/src/Rest/` (88+ providers). Base: `/wp-json/surecart/v1/{resource}`. Each supports standard CRUD with permission checks.

**Key custom endpoints:**
- `POST /checkouts/{id}/finalize` — finalize payment
- `POST /checkouts/{id}/confirm` — confirm after payment
- `POST /products/{id}/sync` — sync product to WordPress
- `PUT /customers/{id}/connect/{user_id}` — link customer to WP user

**Error handling:** API errors return `WP_Error`. `ErrorsTranslationService` translates error codes + field names into user-friendly messages. Three tiers: code translation, attribute+type translation, options translation (with currency formatting).

---

## Block System Deep Dive

### Legacy Blocks (91 blocks in `packages/blocks/Blocks/`)

Each block directory contains `Block.php` (extends `BaseBlock`) + `block.json`. Registered in `app/config.php` under `'blocks'` array. Render callback outputs Stencil component HTML.

### Next-Gen Blocks (95 blocks in `packages/blocks-next/src/blocks/`)

Each block has: `block.json` (apiVersion 3, supports interactivity), `controller.php` (data prep), `view.php` (PHP template with `data-wp-*` directives), `edit.js` (block editor React component), optional `style.scss`.

**Registration:** `packages/blocks-next/index.php` auto-registers from `build/blocks/**/block.json`. Uses `block_type_metadata_settings` filter to add controller support.

**Context flow:** `render_block_context` filter injects `surecart/product` for product pages. Unique IDs generated per product-list block via `sc_unique_product_list_id()`.

**Shared script modules** (externals in blocks-next webpack): `@surecart/dialog`, `@surecart/cart`, `@surecart/sidebar`, `@surecart/api-fetch`, `@surecart/checkout-service`, `@surecart/checkout-events`, `@surecart/a11y`

---

## CSS/Styling Architecture

**CSS custom properties** with `--sc-` prefix for theming:
```scss
--sc-color-gray-{100-900}, --sc-color-white, --sc-color-black
--sc-input-border-color, --sc-input-border-radius-large
--sc-cart-main-label-text-color
--sc-sticky-purchase-background-color
--sc-transition-fast, --sc-spacing-large
```

**Dark mode:** `.surecart-theme-dark` class overrides custom properties.

**Style locations:**
- Component styles: `packages/components/src/components/**/*.scss` (162 files, shadow DOM scoped)
- Block styles: `packages/blocks-next/src/blocks/*/style.scss`
- Theme compat: `styles/divi-compatibility.css`, `styles/bricks-compatibility.css`

**Enqueueing:** `ComponentAssetsMiddleware` loads component assets. `AssetsServiceProvider` registers scripts/styles. Selective loading per page.

---

## Build & Development

### Commands

| Command | Description |
|---|---|
| `composer install` | Install PHP dependencies |
| `yarn` | Install JS dependencies |
| `yarn bootstrap` | Build components → components-react → blocks (required first time) |
| `yarn dev` | Start dev mode with file watching |
| `yarn plugin:release` | Full production build + i18n + composer cleanup |
| `yarn test:php` | PHPUnit via wp-env |
| `yarn test:e2e` | Playwright E2E tests |
| `yarn test:e2e:ui` | Playwright with browser UI |
| `./vendor/bin/phpcs` | PHP coding standards |
| `./vendor/bin/phpstan analyse` | PHP static analysis (level 0) |
| `yarn lint:js` | ESLint |
| `yarn lint:css` | Stylelint |
| `yarn i18n` | Generate translation files |

### Webpack

Root `webpack.config.js` extends `@wordpress/scripts`. 23+ entry points for admin pages. Aliases: `@scripts` → packages/, `@blocks` → packages/blocks/Blocks, `@admin` → packages/admin, `@surecart/data` → packages/admin/store/data.

**CopyPlugin** moves: icon-assets, components dist, blocks dist, kses.json.

**blocks-next** has its own webpack with two configs (styles + scripts) and externals for shared modules.

### Monorepo Packages

| Package | Tech | Purpose |
|---|---|---|
| `@surecart/components` | Stencil.js | 109 web components |
| `@surecart/components-react` | TypeScript | React wrappers for Stencil |
| `@surecart/blocks` | WP Scripts | Legacy Gutenberg blocks |
| `@surecart/blocks-next` | WP Scripts + Interactivity | Next-gen blocks |
| `@surecart/admin` | React 18 | Admin interface modules |
| `@surecart/pages` | JS | Page templates |
| `@surecart/router` | JS | Frontend routing |

---

## Testing

### PHPUnit

- Config: `phpunit.xml`, bootstrap: `.dev/tests/php/bootstrap.php`
- Suites: `unit/` and `feature/` in `.dev/tests/php/`
- 107 test files covering REST endpoints, models, controllers, integrations, webhooks
- Fixtures in `.dev/tests/php/unit/controllers/rest/fixtures/` and `models/` subdirs
- Run: `yarn test:php` (via wp-env)

### Playwright E2E

- Config: `playwright.config.ts`, base URL: `http://localhost:8889`
- Tests in `.dev/tests/e2e/` (checkout, products, provisional-account)
- Global setup authenticates, seeds checkout pages/forms
- Single worker, 60s timeout, Chromium only
- Run: `yarn test:e2e`, `yarn test:e2e:ui`, `yarn test:e2e:debug`

---

## Common Patterns & Conventions

### Naming Conventions

- **PHP classes:** PascalCase, namespaced under `SureCart\`, `SureCartBlocks\`
- **Models:** Singular (Product, Customer, Order), match API endpoint name
- **REST providers:** `{Model}RestServiceProvider.php` in `app/src/Rest/`
- **REST controllers:** `{Model}Controller.php` in `app/src/Controllers/Rest/`
- **Blocks:** `surecart/{block-name}` in block.json
- **Stencil components:** `sc-{component-name}` tag, `Sc{ComponentName}` class
- **Admin entry points:** `admin/{page-name}` in webpack
- **Text domain:** `surecart` for all `__()`, `_e()`, `esc_html__()` calls
- **Capabilities:** `edit_sc_{model}s`, `publish_sc_{model}s`, `delete_sc_{model}s`

### How to Add a New Block (Next-Gen)

1. Create directory in `packages/blocks-next/src/blocks/{block-name}/`
2. Add `block.json` with `apiVersion: 3`, `name: "surecart/{block-name}"`, `supports: { interactivity: true }`
3. Add `controller.php` to prepare server data, return `'file:./view.php'`
4. Add `view.php` with `data-wp-*` directives for interactivity
5. Add `edit.js` for block editor UI
6. Optional: `style.scss` for frontend styles
7. If using Stencil components, add preload mapping in `app/config.php`

### How to Add a New REST Endpoint

1. Create model in `app/src/Models/{ModelName}.php` extending `Model`
2. Create controller in `app/src/Controllers/Rest/{ModelName}Controller.php` extending `RestController`
3. Create service provider in `app/src/Rest/{ModelName}RestServiceProvider.php` extending `RestServiceProvider`
4. Set `$endpoint`, `$methods` (index, create, find, edit, delete), permission callbacks
5. Register provider in `app/config.php` under service providers array

### How to Add a New Model

1. Create `app/src/Models/{ModelName}.php`
2. Extend `Model` (API-backed) or `DatabaseModel` (WordPress DB)
3. Set `protected $endpoint = 'model_name';` and `protected $object_name = 'model_name';`
4. Add traits as needed (HasDates, HasCustomer, etc.)
5. For API models, the endpoint maps to `api.surecart.com/{endpoint}`

### Error Handling Pattern

```php
// In controllers: always check for WP_Error
$result = $model->create($data);
if (is_wp_error($result)) {
    return $result; // REST layer returns proper error response
}

// In integrations: wrap in try-catch
try {
    do_action('surecart/purchase_created', $purchase);
} catch (\Exception $e) {
    error_log($e->getMessage());
}
```

### Hook Extension Pattern

```php
// React to purchases
add_action('surecart/purchase_created', function($purchase) { /* grant access */ });
add_action('surecart/purchase_revoked', function($purchase) { /* revoke access */ });

// Customize checkout
add_filter('surecart/checkout/validate', function($errors, $args, $request) {
    // Add custom validation
    return $errors;
}, 10, 3);

// Control features
add_filter('surecart/checkout/auto-login-new-user', '__return_false');
add_filter('surecart/checkout/finduser', '__return_false');
```

---

## Third-Party Integrations

Located in `app/src/Integrations/`. All implement `PurchaseSyncInterface` with methods: `onPurchaseCreated()`, `onPurchaseRevoked()`, `onPurchaseInvoked()`, `onPurchaseUpdated()`.

**LMS:** LearnDash, LearnDash Groups, LifterLMS, TutorLMS
**Membership:** MemberPress, BuddyBoss
**Page Builders:** Elementor (full suite: widgets, dynamic tags, documents, templates), Beaver Builder, Bricks, Divi, Avada
**SEO:** Yoast, Rank Math, SEOPress, The SEO Framework, AIOSEO
**Marketing:** AffiliateWP, ThriveAutomator (triggers, data objects)
**Other:** User (WP role assignment), SureRank, Etch, HelpWidget

Integration data stored in `surecart_integrations` table linking product/price/variant IDs to third-party item IDs.

---

## Database

3 custom WordPress tables:

| Table | Purpose |
|---|---|
| `surecart_integrations` | Links products/prices/variants to third-party services (LearnDash courses, MemberPress levels, etc.) |
| `surecart_incoming_webhooks` | Audit log of incoming webhooks (payload, processed_at, source) |
| `surecart_variant_option_values` | Product variant option value storage |

Migrations managed by `MigrationsServiceProvider` using `Table` class wrapping `dbDelta()`. Version tracked in WP options.

---

## Middleware Reference

| Middleware | Config Key | Purpose |
|---|---|---|
| `ComponentAssetsMiddleware` | `assets.components` | Loads Stencil web component assets |
| `BrandColorMiddleware` | `assets.brand_colors` | Injects brand colors into styles |
| `AdminColorMiddleware` | `assets.admin_colors` | Applies admin color scheme |
| `NonceMiddleware` | `nonce` | CSRF protection |
| `WebhooksMiddleware` | `webhooks` | Validates HMAC-SHA256 webhook signatures |
| `EditModelMiddleware` | `edit_model` | Nonce + capability check for editing |
| `ArchiveModelMiddleware` | `archive_model` | Model archive/restore validation |
| `CheckoutRedirectMiddleware` | (route) | Redirects to proper checkout page |
| `LoginLinkMiddleware` | (route) | Handles login link generation |
| `UpsellMiddleware` | (route) | Sets up upsell page context |

---

## Gotchas & Important Notes

1. **Never edit `dist/`** — always edit source in `packages/` and build
2. **`yarn bootstrap` required** before first `yarn dev` — builds Stencil components that other packages depend on
3. **API-backed models** don't store data locally — all CRUD goes through `api.surecart.com`
4. **Two block systems coexist** — legacy (`packages/blocks/`) and next-gen (`packages/blocks-next/`). New blocks should use next-gen with Interactivity API
5. **Component preloading** in `config.php` is critical for performance — add mappings when creating blocks that use Stencil components
6. **Webhook signature validation** uses HMAC-SHA256 with registered webhook secret. Webhooks only register on SSL (skips localhost by default)
7. **Customer ↔ WP User sync** happens on checkout confirmation. `SyncsCustomer` trait handles linking
8. **Permission system** uses WordPress capabilities prefixed with `sc_` (e.g., `edit_sc_products`, `publish_sc_customers`)
9. **Translation** text domain is `surecart`. 69 languages supported. Loco Translate compatible via single JSON file approach
10. **State machine** in checkout (`checkout-machine.ts`) — debugging checkout issues requires understanding state transitions
11. **Background processing** — webhooks and bulk actions use Action Scheduler (`woocommerce/action-scheduler`)
12. **Autoloading** — PSR-4: `SureCart\` → `app/src/`, `SureCartBlocks\` → `packages/blocks/`, `SureCartCore\` → `core/core/src/`

---

## Key Files Reference

| File | Purpose |
|---|---|
| `surecart.php` | Plugin entry point, defines constants |
| `app/config.php` | Master config (168 service providers, 47 blocks, middleware, routes, webhooks, permissions) |
| `app/routes/admin.php` | All admin page routes (605 lines) |
| `app/routes/web.php` | Public routes (buy page, webhooks, redirects) |
| `app/src/Models/Model.php` | Base API-backed model class |
| `app/src/Models/Checkout.php` | Checkout model (checkout flow core) |
| `app/src/Models/Product.php` | Product model |
| `app/src/Controllers/Rest/CheckoutsController.php` | Checkout REST endpoint (finalize, confirm) |
| `app/src/Controllers/Rest/DraftCheckoutsController.php` | Draft checkout handling + post-purchase hooks |
| `app/src/Rest/RestServiceProvider.php` | Base REST service provider (endpoint registration pattern) |
| `app/src/Support/Errors/ErrorsTranslationService.php` | Error code → user message translation |
| `app/src/Integrations/IntegrationService.php` | Integration event dispatch orchestrator |
| `app/src/Webhooks/WebhooksService.php` | Webhook registration and processing |
| `app/src/Middleware/WebhooksMiddleware.php` | Webhook HMAC-SHA256 signature validation |
| `packages/components/src/components/controllers/checkout-form/` | Stencil checkout components |
| `packages/components/src/store/form/store.ts` | Checkout form state store |
| `packages/components/src/components/providers/form-state-provider/checkout-machine.ts` | Checkout state machine (xstate) |
| `packages/blocks-next/index.php` | Next-gen block registration + context injection |
| `packages/blocks-next/src/blocks/` | 95 next-gen block source directories |
| `packages/admin/store/` | Redux-style admin stores |
| `webpack.config.js` | Root webpack (admin entry points, CopyPlugin, aliases) |
| `packages/blocks-next/webpack.config.js` | Blocks-next webpack (styles + scripts, shared externals) |
