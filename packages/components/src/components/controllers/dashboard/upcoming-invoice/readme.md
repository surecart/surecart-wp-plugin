# ce-customer-subscription



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type                                            | Default     |
| ---------------- | ----------------- | ----------- | ----------------------------------------------- | ----------- |
| `discount`       | --                |             | `{ promotion_code?: string; coupon?: string; }` | `undefined` |
| `heading`        | `heading`         |             | `string`                                        | `undefined` |
| `payment_method` | --                |             | `PaymentMethod`                                 | `undefined` |
| `priceId`        | `price-id`        |             | `string`                                        | `undefined` |
| `quantity`       | `quantity`        |             | `number`                                        | `undefined` |
| `subscriptionId` | `subscription-id` |             | `string`                                        | `undefined` |
| `successUrl`     | `success-url`     |             | `string`                                        | `undefined` |


## Dependencies

### Depends on

- [ce-format-date](../../../util/format-date)
- [ce-skeleton](../../../ui/skeleton)
- [ce-text](../../../ui/text)
- [ce-format-number](../../../util/format-number)
- [ce-product-line-item](../../../ui/product-line-item)
- [ce-line-item](../../../ui/line-item)
- [ce-coupon-form](../../../ui/coupon-form)
- [ce-divider](../../../ui/divider)
- [ce-flex](../../../ui/flex)
- [ce-icon](../../../ui/icon)
- [ce-alert](../../../ui/alert)
- [ce-dashboard-module](../../../ui/dashboard-module)
- [ce-card](../../../ui/card)
- [ce-form](../../../ui/form)
- [ce-button](../../../ui/button)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-upcoming-invoice --> ce-format-date
  ce-upcoming-invoice --> ce-skeleton
  ce-upcoming-invoice --> ce-text
  ce-upcoming-invoice --> ce-format-number
  ce-upcoming-invoice --> ce-product-line-item
  ce-upcoming-invoice --> ce-line-item
  ce-upcoming-invoice --> ce-coupon-form
  ce-upcoming-invoice --> ce-divider
  ce-upcoming-invoice --> ce-flex
  ce-upcoming-invoice --> ce-icon
  ce-upcoming-invoice --> ce-alert
  ce-upcoming-invoice --> ce-dashboard-module
  ce-upcoming-invoice --> ce-card
  ce-upcoming-invoice --> ce-form
  ce-upcoming-invoice --> ce-button
  ce-upcoming-invoice --> ce-block-ui
  ce-product-line-item --> ce-format-number
  ce-product-line-item --> ce-line-item
  ce-product-line-item --> ce-quantity-select
  ce-quantity-select --> ce-dropdown
  ce-quantity-select --> ce-menu
  ce-quantity-select --> ce-menu-item
  ce-coupon-form --> ce-skeleton
  ce-coupon-form --> ce-line-item
  ce-coupon-form --> ce-tag
  ce-coupon-form --> ce-format-number
  ce-coupon-form --> ce-input
  ce-coupon-form --> ce-alert
  ce-coupon-form --> ce-button
  ce-coupon-form --> ce-block-ui
  ce-input --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  ce-dashboard-module --> ce-alert
  style ce-upcoming-invoice fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
