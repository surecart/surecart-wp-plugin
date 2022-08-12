# ce-customer-subscription



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                  | Description | Type                                            | Default     |
| ------------------------ | -------------------------- | ----------- | ----------------------------------------------- | ----------- |
| `adHocAmount`            | `ad-hoc-amount`            |             | `number`                                        | `undefined` |
| `discount`               | --                         |             | `{ promotion_code?: string; coupon?: string; }` | `undefined` |
| `heading`                | `heading`                  |             | `string`                                        | `undefined` |
| `payment_method`         | --                         |             | `PaymentMethod`                                 | `undefined` |
| `priceId`                | `price-id`                 |             | `string`                                        | `undefined` |
| `quantity`               | `quantity`                 |             | `number`                                        | `undefined` |
| `quantityUpdatesEnabled` | `quantity-updates-enabled` |             | `boolean`                                       | `true`      |
| `subscriptionId`         | `subscription-id`          |             | `string`                                        | `undefined` |
| `successUrl`             | `success-url`              |             | `string`                                        | `undefined` |


## Dependencies

### Depends on

- [sc-format-date](../../../util/format-date)
- [sc-skeleton](../../../ui/skeleton)
- [sc-format-number](../../../util/format-number)
- [sc-product-line-item](../../../ui/product-line-item)
- [sc-line-item](../../../ui/line-item)
- [sc-coupon-form](../../../ui/coupon-form)
- [sc-divider](../../../ui/divider)
- [sc-flex](../../../ui/flex)
- [sc-icon](../../../ui/icon)
- [sc-alert](../../../ui/alert)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-card](../../../ui/card)
- [sc-form](../../../ui/form)
- [sc-button](../../../ui/button)
- [sc-text](../../../ui/text)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-upcoming-invoice --> sc-format-date
  sc-upcoming-invoice --> sc-skeleton
  sc-upcoming-invoice --> sc-format-number
  sc-upcoming-invoice --> sc-product-line-item
  sc-upcoming-invoice --> sc-line-item
  sc-upcoming-invoice --> sc-coupon-form
  sc-upcoming-invoice --> sc-divider
  sc-upcoming-invoice --> sc-flex
  sc-upcoming-invoice --> sc-icon
  sc-upcoming-invoice --> sc-alert
  sc-upcoming-invoice --> sc-dashboard-module
  sc-upcoming-invoice --> sc-card
  sc-upcoming-invoice --> sc-form
  sc-upcoming-invoice --> sc-button
  sc-upcoming-invoice --> sc-text
  sc-upcoming-invoice --> sc-block-ui
  sc-product-line-item --> sc-format-number
  sc-product-line-item --> sc-quantity-select
  sc-product-line-item --> sc-icon
  sc-quantity-select --> sc-icon
  sc-coupon-form --> sc-skeleton
  sc-coupon-form --> sc-line-item
  sc-coupon-form --> sc-tag
  sc-coupon-form --> sc-format-number
  sc-coupon-form --> sc-input
  sc-coupon-form --> sc-alert
  sc-coupon-form --> sc-button
  sc-coupon-form --> sc-block-ui
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  sc-dashboard-module --> sc-alert
  style sc-upcoming-invoice fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
