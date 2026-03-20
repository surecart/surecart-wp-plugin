---
name: surecart-new-integration
description: Use this skill when the user wants to create a new SureCart third-party plugin integration, add support for a new LMS or membership plugin, scaffold an integration service, or connect a WordPress plugin to SureCart's purchase lifecycle. Scaffolds IntegrationService, ServiceProvider, and registers in app/config.php.
version: 1.0.0
---

# New SureCart Integration

Guided workflow for creating a complete SureCart third-party plugin integration. Follows the IntegrationService + PurchaseSyncInterface pattern used by all integrations (LearnDash, BuddyBoss, etc.).

## Instructions

### Step 1 — Gather Requirements

Ask the user for:
1. **Integration name** — PascalCase (e.g., `WooCommerce`, `TutorLMS`, `MemberPress`)
2. **Detection** — how to detect the plugin is active: constant (`defined('PLUGIN_CONST')`), function (`function_exists('fn_name')`), or class (`class_exists('ClassName')`)
3. **Item type** — what does the integration grant access to? (e.g., "Course", "Membership", "Group", "Download")
4. **Model level** — does the integration map at `product`, `price`, or `variant` level? (usually `product`)

### Step 2 — Read Existing Patterns

Read the LearnDash integration as the canonical reference:
- `app/src/Integrations/LearnDash/LearnDashService.php`
- `app/src/Integrations/LearnDash/LearnDashServiceProvider.php`

If the new integration is similar to another existing one, read that too for additional context:
- `app/src/Integrations/` — list available integrations to find the closest match

### Step 3 — Read config.php Registration Point

Use Grep to search for `Integrations\\` in `app/config.php` to find where other integration providers are registered. Note the surrounding entries to find the right alphabetical/grouped insertion point.

### Step 4 — Invoke the Integration Builder Agent

Use the `surecart-integration-builder` agent with all gathered context:

Provide the agent: integration name, detection mechanism, item type label, model level (product/price/variant), and integration slug (kebab-case).

### Step 5 — Verify

After the builder completes, verify:
- [ ] `app/src/Integrations/{Name}/{Name}Service.php` exists
- [ ] Service implements all 6 `IntegrationInterface` methods: `getName()`, `getModel()`, `getLogo()`, `getLabel()`, `getItemLabel()`, `getItemHelp()`
- [ ] Service implements all 3 `PurchaseSyncInterface` methods: `onPurchaseCreated()`, `onPurchaseInvoked()`, `onPurchaseRevoked()`
- [ ] Service has `enabled()` method with correct detection
- [ ] `app/src/Integrations/{Name}/{Name}ServiceProvider.php` exists
- [ ] `app/config.php` 'providers' array contains `{Name}ServiceProvider::class`

If any interface methods are missing, add them before finishing.

### Step 6 — Logo Reminder

Remind the user:
```
Integration scaffolded. You'll need to add a logo SVG file:
  app/src/Integrations/{Name}/{integration-slug}.svg

This is displayed in the SureCart integrations settings UI.
```

### Step 7 — Report

```
Created SureCart integration for {IntegrationName}:
- Service: app/src/Integrations/{Name}/{Name}Service.php
  - Detection: {mechanism}
  - Item type: {label}
  - Purchase sync: onPurchaseCreated, onPurchaseInvoked, onPurchaseRevoked ✓
- Provider: app/src/Integrations/{Name}/{Name}ServiceProvider.php
- Registered in app/config.php ✓

Next: Add logo at app/src/Integrations/{Name}/{integration-slug}.svg
```
