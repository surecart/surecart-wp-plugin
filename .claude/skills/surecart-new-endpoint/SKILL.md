---
name: surecart-new-endpoint
description: Use this skill when the user wants to create a new SureCart REST endpoint, add a new API route, scaffold a new model with REST support, or add a new resource to the SureCart REST API. Scaffolds Model, Controller, RestServiceProvider, and registers in app/config.php.
version: 1.0.0
---

# New SureCart REST Endpoint

Guided workflow for creating a complete SureCart REST endpoint. Follows the 3-file pattern with config.php registration.

## Instructions

### Step 1 — Gather Requirements

Ask the user for:
1. **Resource name** — PascalCase singular (e.g., `ProductCollection`, `ShippingZone`)
2. **Model type** — API-backed (`Model` → lives on `api.surecart.com`) or local DB (`DatabaseModel` → WP custom table)
3. **Methods needed** — which of: `index`, `create`, `find`, `edit`, `delete`
4. **Any custom actions** beyond standard CRUD? (e.g., `sync`, `duplicate`, `activate`)
5. **Relationships to expand** — any nested models loaded via `->with([...])`?

If the user provides a task description (e.g., "endpoint for managing shipping zones"), infer these from context and only ask for what's genuinely unclear.

### Step 2 — Read Existing Patterns

Read these files to match current project style:
- `app/src/Controllers/Rest/ProductsController.php`
- `app/src/Rest/ProductsRestServiceProvider.php`
- `app/src/Models/Product.php`

If the new resource is database-backed, also read:
- `app/src/Models/Integration.php` (DatabaseModel example)

### Step 3 — Read config.php Registration Point

Use Grep to search for `RestServiceProvider` in `app/config.php` to find where similar REST providers are registered. Note the surrounding providers to find the right insertion point.

### Step 4 — Invoke the Scaffolder Agent

Use the `surecart-endpoint-scaffolder` agent with all gathered context:

Provide the agent: resource name, model type, endpoint slug (plural snake_case), methods needed, any custom actions, and any relationships to expand.

### Step 5 — Verify

After the scaffolder completes, verify:
- [ ] `app/src/Models/{Resource}.php` exists with correct base class
- [ ] `app/src/Controllers/Rest/{Resources}Controller.php` exists (plural class name, e.g., `ImportRowsController`)
- [ ] `app/src/Rest/{Resources}RestServiceProvider.php` exists with correct endpoint, controller, and methods (plural, e.g., `ImportRowsRestServiceProvider`)
- [ ] `app/config.php` 'providers' array contains `{Resources}RestServiceProvider::class`

If any check fails, fix it before finishing.

### Step 6 — Report

Summarize what was created:
```
Created REST endpoint for {Resource}:
- Route: /wp-json/surecart/v1/{resources}
- Model: app/src/Models/{Resource}.php ({type})
- Controller: app/src/Controllers/Rest/{Resources}Controller.php
- Provider: app/src/Rest/{Resources}RestServiceProvider.php
- Registered in app/config.php ✓
```
