# SureCart PHP Backend Patterns

Patterns and conventions for working in the `app/` directory. See root `CLAUDE.md` for architecture overview.

## Adding a New Model

```php
// app/src/Models/MyModel.php
namespace SureCart\Models;

class MyModel extends Model {              // or DatabaseModel for WP DB storage
    protected $endpoint = 'my_models';     // maps to api.surecart.com/my_models
    protected $object_name = 'my_model';
}
```

Available traits: `HasDates`, `HasCustomer`, `HasPurchases`, `HasBillingAddress`, `HasShippingAddress`, `HasPaymentIntent`, `HasPaymentMethod`, `HasDiscount`, `CanFinalize`, `CanDuplicate`, `HasImageSizes`, `HasSubscriptions`, `HasProcessorType`, `HasShippingChoices`, `HasCommissionStructure`

## Adding a New REST Endpoint

Three-file pattern, then register in `app/config.php`:

```php
// 1. Model (see above)

// 2. app/src/Controllers/Rest/MyModelController.php
class MyModelController extends RestController {
    protected $class = MyModel::class;
}

// 3. app/src/Rest/MyModelRestServiceProvider.php
class MyModelRestServiceProvider extends RestServiceProvider {
    protected $endpoint = 'my_models';           // /wp-json/surecart/v1/my_models
    protected $controller = MyModelController::class;
    protected $methods = ['index', 'create', 'find', 'edit', 'delete'];
}

// 4. Add MyModelRestServiceProvider::class to 'providers' array in app/config.php
```

Permission callbacks use `current_user_can('edit_sc_my_models')` pattern.

## Error Handling

```php
// Controllers: propagate WP_Error upward — REST layer auto-converts to response
$result = MyModel::create($data);
if (is_wp_error($result)) {
    return $result;
}

// Integrations: wrap in try-catch to prevent one integration killing others
try {
    do_action('surecart/purchase_created', $purchase);
} catch (\Exception $e) {
    error_log($e->getMessage());
}
```

`ErrorsTranslationService` translates API error codes to user messages automatically via lookup files in `Support/Errors/`. Do not duplicate translation logic.

## Adding a New Integration

All integrations extend `IntegrationService` and implement `PurchaseSyncInterface`:

```php
// Required abstract methods from IntegrationService:
getName(), getModel(), getLogo(), getLabel(), getItemLabel(), getItemHelp()

// Required from PurchaseSyncInterface:
onPurchaseCreated($integration, $wp_user)
onPurchaseInvoked($integration, $wp_user)
onPurchaseRevoked($integration, $wp_user)
```

- Integration data (product/price/variant -> third-party item mapping) stored in `surecart_integrations` table via `Integration` model (DatabaseModel)
- Register service provider in `app/config.php` under `'providers'`
- Actions fire from `DraftCheckoutsController::finalize()` and webhook processor — do not hook them manually

## Routes and Middleware

```php
// app/routes/admin.php pattern:
\SureCart::route()->get()
    ->where('admin', 'sc-products')
    ->middleware('user.can:edit_sc_products')
    ->middleware('assets.components')        // loads Stencil component assets
    ->handle('ProductsController@index');
```

Non-obvious middleware alias keys: `assets.components`, `assets.brand_colors`, `assets.admin_colors`, `nonce`, `webhooks`, `edit_model`, `archive_model`

## Webhook Event -> WordPress Action Mapping

| API Event | WordPress Action |
|---|---|
| `purchase.created` | `surecart/purchase_created` |
| `purchase.revoked` | `surecart/purchase_revoked` |
| `purchase.invoked` | `surecart/purchase_invoked` |
| `purchase.updated` | `surecart/purchase_updated` |
| `customer.updated` | `surecart/customer_updated` |
| `account.updated` | `surecart/account_updated` |
| `subscription.renewed` | `surecart/subscription_renewed` |

Price/product CRUD events also fire but are rarely hooked externally.
