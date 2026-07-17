# SureCart - Claude Context

Headless e-commerce WordPress plugin. All transactional data (products, checkouts, orders, subscriptions) lives on `api.surecart.com` — WordPress handles rendering, users, and integrations. Built on **WP Emerge** framework with Pimple DI. Monorepo with Yarn workspaces.

See also: `app/CLAUDE.md` (PHP patterns), `packages/CLAUDE.md` (JS/blocks patterns), `Workflow.md` (task workflow rules).

## Coding Guidelines

When writing, reviewing, or refactoring code, follow the **`karpathy-guidelines`** skill (`.claude/skills/karpathy-guidelines/SKILL.md`) — think before coding, simplicity first, surgical changes, goal-driven execution. Invoke it via the Skill tool at the start of a coding task.

## Architecture

Bootstrap: `surecart.php` -> composer autoload -> `SureCart` facade -> `app/config.php` (168 service providers) -> `app/hooks.php`

Service providers have `register($container)` + `bootstrap($container)` methods. All registered in `app/config.php` under `'providers'`.

API auth: `ApiToken::get()` — token stored in WP options. All outbound API calls go to `api.surecart.com`.

PSR-4: `SureCart\` -> `app/src/`, `SureCartBlocks\` -> `packages/blocks/`, `SureCartCore\` -> `core/core/src/`

## Model System

Three base classes — choosing wrong one breaks everything:

-   **`Model`** — API-backed. CRUD goes to `api.surecart.com/{endpoint}`. Set `$endpoint` and `$object_name`.
-   **`DatabaseModel`** — WordPress custom tables (`surecart_*`). Local DB storage.
-   **`ExternalApiModel`** — Third-party external APIs. Rarely extended.

```php
Product::find($id);                                    // GET /products/{id}
Product::where(['archived' => false])->paginate();     // GET /products?archived=false
Product::create(['name' => 'Foo']);                     // POST /products
```

## Checkout Flow

Most complex flow in the plugin. Involves both PHP REST layer and JS state machine.

1. **Create draft** — `POST /wp-json/surecart/v1/checkouts`
2. **Update** — `PATCH .../checkouts/{id}` (email, line items, addresses, coupons)
3. **Finalize** — `POST .../checkouts/{id}/finalize` -> validates, processes payment
4. **Confirm** — `DraftCheckoutsController::finalize()` -> confirms, links Customer to WP User
5. **Post-purchase** — `do_action('surecart/purchase_created', $purchase)` fires per purchase

**JS state machine** (`packages/components/src/components/providers/form-state-provider/checkout-machine.ts`):
States: `draft` -> `updating` -> `finalizing` -> `paying` -> `confirming` -> `paid` -> `confirmed` -> `redirecting`
Terminal states: `expired`, `locked`, `test_mode_restricted`, `failure`

Payment processors: Stripe, PayPal, Paystack, Razorpay, Mollie, Manual.

## Two Block Systems

Two systems coexist. **All new blocks go to next-gen.**

-   **Legacy** (`packages/blocks/Blocks/`): `Block.php` extends `BaseBlock`, renders Stencil HTML. Maintenance only.
-   **Next-gen** (`packages/blocks-next/src/blocks/`): WordPress Interactivity API. `controller.php` -> `view.php` pipeline. Auto-registered from `build/blocks/**/block.json`.

```php
// controller.php — runs on render, has $attributes, $content, $block
$product = sc_get_product();
return 'file:./view.php';
```

Context: `surecart/product` injected via `render_block_context` filter when `surecart_current_product` query var is set.

## Component Preloading

When next-gen blocks use Stencil `sc-*` components, add preload mapping in `app/config.php` under `'preload'` key. Omitting this causes layout shift.

```php
'surecart/product-buy-buttons' => ['sc-product-buy-button', 'sc-button'],
```

## Webhook System

-   Webhooks auto-register on SSL only (skipped on localhost)
-   Signature validation: HMAC-SHA256 via `WebhooksMiddleware`
-   Payload stored in `surecart_incoming_webhooks` table, processed async via `AsyncWebhookService` (Action Scheduler)
-   Key actions fired: `surecart/purchase_created`, `surecart/purchase_revoked`, `surecart/purchase_invoked`, `surecart/purchase_updated`, `surecart/customer_updated`, `surecart/subscription_renewed`, `surecart/account_updated`

## Hook Patterns

```php
// Purchase lifecycle:
add_action('surecart/purchase_created', fn($purchase) => /* grant access */);
add_action('surecart/purchase_revoked', fn($purchase) => /* revoke access */);

// Checkout filters:
add_filter('surecart/checkout/validate', fn($errors, $args, $req) => $errors, 10, 3);
add_filter('surecart/checkout/auto-login-new-user', '__return_false');
add_filter('surecart/checkout/finduser', '__return_false');
```

## Conventions

-   Capabilities: `edit_sc_{model}s`, `publish_sc_{model}s`, `delete_sc_{model}s`
-   Text domain: `surecart` for all i18n calls
-   Stencil tags: `sc-{name}`, classes: `Sc{Name}`
-   Block names: `surecart/{block-name}`
-   Comments: explain the _why_ or a non-obvious edge, not what the code already says, and keep them short — long comments go unread. Keep the docblocks WordPress coding standards / PHPCS require (PHP functions, classes, hooks, `@param`/`@return`); just make their summary line meaningful instead of restating the function name.

## Entity Relationships

```
Account (shop)
├── Product -> Price -> Variant -> VariantOption -> VariantOptionValue (DB)
├── Customer <-> WP_User (synced at checkout confirmation)
│     └── PaymentMethod
├── Checkout -> LineItem -> Purchase
│     ├── Discount <- Coupon / Promotion
│     ├── ShippingChoice
│     └── PaymentIntent -> Charge
├── Order (from finalized Checkout)
│     └── Fulfillment -> FulfillmentItem
├── Subscription -> Period
├── Invoice
├── License -> Activation
└── Affiliation -> Referral -> ReferralItem
```

## PHPUnit Tests

**Run via Docker** (never run phpunit directly):

```bash
yarn run test:php                             # full suite
yarn run test:php --group=specific-test-group # specific group(s)
```

**Location:** `.dev/tests/php/unit/` — mirrors `app/src/` structure. Extend `SureCartUnitTestCase` (which extends `WP_UnitTestCase`). Use `\Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration` trait. Bootstrap only the providers you need in `setUp()`. WP functions (`get_option`, `update_option`, `wp_set_current_user`, etc.) work natively. Mock SureCart facade services via `\SureCart::alias('account', fn() => ...)`. `tearDown` cleanup is automatic.

## Feature Documentation for PRs

When working on a PR that introduces user-facing changes, add feature documentation directly in the PR description under the `## Feature Documentation` section. This helps the documentation team generate release-ready docs using AI — no markdown files in the repo.

**When to add:** Any PR with user-facing changes (new features, UI changes, new settings, behavior changes).
**When to skip:** Internal refactors, bug fixes with no visible change, test-only changes.

Use the `/surecart-feature-doc` skill to auto-generate and update the PR description from the branch diff. It analyzes changes, generates the documentation, and updates the PR via `gh pr edit`.

## Comments

PHP gets full WP-style docblocks (class, method, property, `@var`/`@param`/`@return`) — non-negotiable for phpcs. JS/TS comments must add information the code, function name, or variable names don't already convey; restating the code is a smell. Keep kept comments to 1–2 lines.

## Git

-   Never commit without the user's explicit request to add and commit. Always ask for a review before committing.
-   **Never add `Co-Authored-By` lines to commit messages.** Commits should use the developer's git account only.

## Critical Gotchas

1. **Never edit `dist/`** — edit source in `packages/`, then build
2. **`yarn bootstrap` required** before first `yarn dev` — builds Stencil components that other packages depend on
3. **API models store nothing in WP DB** — never query WordPress tables for Product, Checkout, Order, etc.
4. **Always check `is_wp_error()`** on model operations before proceeding
5. **`app/config.php` is the master registry** — service providers, blocks, preload mappings all go here
6. **Customer <-> WP User sync** happens during checkout confirmation via `SyncsCustomer` trait
7. **Background processing** uses Action Scheduler (`woocommerce/action-scheduler`), not WP cron
8. **Don't use \ before WP functions**, While using WordPress functions, like don't use `\is_wp_error()`, use like `is_wp_error()`
