# ce-product-line-item



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute                | Description                                                                                                                 | Type              | Default     |
| ---------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------- |
| `amount`               | `amount`                 | Product monetary amount                                                                                                     | `string`          | `undefined` |
| `bundleComponents`     | --                       | Bundle component line items, rendered as a read-only nested list under the main row when this line item is a bundle parent. | `LineItem[]`      | `[]`        |
| `displayAmount`        | `display-amount`         | Product display amount                                                                                                      | `string`          | `undefined` |
| `editable`             | `editable`               | Can we select the quantity                                                                                                  | `boolean`         | `true`      |
| `fees`                 | --                       | Product line item fees.                                                                                                     | `Fee[]`           | `undefined` |
| `image`                | --                       | Image attributes.                                                                                                           | `ImageAttributes` | `undefined` |
| `interval`             | `interval`               | Recurring interval (i.e. monthly, once, etc.)                                                                               | `string`          | `undefined` |
| `max`                  | `max`                    | The max allowed.                                                                                                            | `number`          | `undefined` |
| `name`                 | `name`                   | Product name                                                                                                                | `string`          | `undefined` |
| `note`                 | `note`                   | The line item note                                                                                                          | `string`          | `undefined` |
| `price`                | `price`                  | Price name                                                                                                                  | `string`          | `undefined` |
| `purchasableStatus`    | `purchasable-status`     | The purchasable status display                                                                                              | `string`          | `undefined` |
| `quantity`             | `quantity`               | Quantity                                                                                                                    | `number`          | `undefined` |
| `removable`            | `removable`              | Is the line item removable                                                                                                  | `boolean`         | `undefined` |
| `reviewButtonLink`     | `review-button-link`     | The review button link. If set, a review button will be shown linking to this URL.                                          | `string`          | `''`        |
| `scratch`              | `scratch`                | The line item scratch amount                                                                                                | `string`          | `undefined` |
| `scratchDisplayAmount` | `scratch-display-amount` | Product scratch display amount                                                                                              | `string`          | `undefined` |
| `separator`            | `separator`              | Separator between a bundle component's name and its variant options.                                                        | `string`          | `'·'`       |
| `showAllBundleItems`   | `show-all-bundle-items`  | Show every bundle component (default), or only those with a selected variant when set to `false`.                           | `boolean`         | `true`      |
| `sku`                  | `sku`                    | The SKU.                                                                                                                    | `string`          | `''`        |
| `trial`                | `trial`                  | Trial text                                                                                                                  | `string`          | `undefined` |
| `variant`              | `variant`                | Product variant label                                                                                                       | `string`          | `''`        |


## Events

| Event              | Description                        | Type                  |
| ------------------ | ---------------------------------- | --------------------- |
| `scRemove`         | Emitted when the quantity changes. | `CustomEvent<void>`   |
| `scUpdateQuantity` | Emitted when the quantity changes. | `CustomEvent<number>` |


## Shadow Parts

| Part                             | Description                                               |
| -------------------------------- | --------------------------------------------------------- |
| `"base"`                         | The component base                                        |
| `"component"`                    | A single bundle component row                             |
| `"description"`                  |                                                           |
| `"details"`                      | The collapsible details region (bundle components + note) |
| `"details__toggle"`              | The details expand/collapse toggle button                 |
| `"image"`                        | The product image                                         |
| `"line-item__price-description"` | The line item price description                           |
| `"placeholder__image"`           |                                                           |
| `"price"`                        | The product price                                         |
| `"price__amount"`                | The product price amount                                  |
| `"price__description"`           | The product price description                             |
| `"price__scratch"`               | The product price scratch                                 |
| `"product-line-item"`            | The product line item                                     |
| `"quantity"`                     | The product quantity                                      |
| `"quantity__input"`              | The product quantity input                                |
| `"quantity__minus"`              | The product quantity minus                                |
| `"quantity__minus-icon"`         | The product quantity minus icon                           |
| `"quantity__plus"`               | The product quantity plus                                 |
| `"quantity__plus-icon"`          | The product quantity plus icon                            |
| `"remove-icon__base"`            | The product remove icon                                   |
| `"static-quantity"`              | The product static quantity                               |
| `"suffix"`                       | The product suffix                                        |
| `"text"`                         | The product text                                          |
| `"title"`                        | The product title                                         |
| `"trial-fees"`                   |                                                           |


## Dependencies

### Used by

 - [sc-line-items](../../controllers/checkout-form/line-items)
 - [sc-order](../../controllers/dashboard/order)
 - [sc-order-confirmation-line-items](../../controllers/confirmation/order-confirmation-line-items)
 - [sc-subscription-next-payment](../../controllers/dashboard/subscription-details)
 - [sc-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Depends on

- [sc-icon](../icon)
- [sc-product-line-item-note](../product-line-item-note)
- [sc-quantity-select](../quantity-select)
- [sc-button](../button)

### Graph
```mermaid
graph TD;
  sc-product-line-item --> sc-icon
  sc-product-line-item --> sc-product-line-item-note
  sc-product-line-item --> sc-quantity-select
  sc-product-line-item --> sc-button
  sc-product-line-item-note --> sc-icon
  sc-quantity-select --> sc-icon
  sc-button --> sc-spinner
  sc-line-items --> sc-product-line-item
  sc-order --> sc-product-line-item
  sc-order-confirmation-line-items --> sc-product-line-item
  sc-subscription-next-payment --> sc-product-line-item
  sc-upcoming-invoice --> sc-product-line-item
  style sc-product-line-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
