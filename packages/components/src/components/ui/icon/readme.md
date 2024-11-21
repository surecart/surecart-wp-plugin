# ce-register-icon-library



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                                                                                   | Type     | Default     |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `label`   | `label`   | An alternative description to use for accessibility. If omitted, the name or src will be used to generate it. | `string` | `undefined` |
| `library` | `library` | The name of a registered custom icon library.                                                                 | `string` | `'default'` |
| `name`    | `name`    | The name of the icon to draw.                                                                                 | `string` | `undefined` |
| `src`     | `src`     | An external URL of an SVG file.                                                                               | `string` | `undefined` |


## Events

| Event    | Description                       | Type                |
| -------- | --------------------------------- | ------------------- |
| `scLoad` | Emitted when the icon has loaded. | `CustomEvent<void>` |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


## Dependencies

### Used by

 - [sc-alert](../alert)
 - [sc-breadcrumb](../breadcrumb)
 - [sc-breadcrumbs](../breadcrumbs)
 - [sc-cancel-dialog](../../controllers/dashboard/sc-cancel-dialog)
 - [sc-cancel-survey](../../controllers/dashboard/sc-cancel-survey)
 - [sc-cart-form-submit](../../controllers/cart/cart-form-submit)
 - [sc-cart-header](../../controllers/cart/cart-header)
 - [sc-cart-icon](../sc-cart-icon)
 - [sc-cc-logo](../cc-logo)
 - [sc-charges-list](../../controllers/dashboard/charges-list)
 - [sc-checkout-mollie-payment](../../controllers/checkout-form/sc-checkout-mollie-payment)
 - [sc-checkout-stock-alert](../../controllers/checkout-form/checkout/checkout-stock-alert)
 - [sc-checkout-test-complete](../../controllers/checkout-form/checkout-test-complete)
 - [sc-coupon-form](../coupon-form)
 - [sc-customer-details](../customer-details)
 - [sc-dialog](../sc-dialog)
 - [sc-downloads-list](../../controllers/dashboard/sc-downloads-list)
 - [sc-drawer](../sc-drawer)
 - [sc-empty](../empty)
 - [sc-feature-demo-banner](../sc-feature-demo-banner)
 - [sc-fulfillments](../../controllers/dashboard/fulfillments)
 - [sc-image-slider](../sc-image-slider)
 - [sc-invoices-list](../../controllers/dashboard/invoices-list)
 - [sc-license](../../controllers/dashboard/sc-license)
 - [sc-licenses-list](../../controllers/dashboard/sc-licenses-list)
 - [sc-line-item-invoice-receipt-download](../../controllers/checkout-form/invoice-receipt-download)
 - [sc-login-form](../../controllers/login)
 - [sc-order](../../controllers/dashboard/order)
 - [sc-order-confirm-provider](../../providers/order-confirm-provider)
 - [sc-order-submit](../../controllers/checkout-form/order-submit)
 - [sc-orders-list](../../controllers/dashboard/orders-list)
 - [sc-pagination](../pagination)
 - [sc-password-nag](../../controllers/dashboard/sc-password-nag)
 - [sc-payment](../../controllers/checkout-form/payment)
 - [sc-payment-method](../sc-payment-method)
 - [sc-payment-method-details](../sc-payment-method-details)
 - [sc-payment-methods-list](../../controllers/dashboard/payment-methods-list)
 - [sc-product-item-list](../../controllers/products/sc-product-item-list)
 - [sc-product-line-item](../product-line-item)
 - [sc-product-selected-price](../../controllers/checkout-form/sc-product-selected-price)
 - [sc-provisional-banner](../sc-provisional-banner)
 - [sc-purchase-downloads-list](../purchase-downloads-list)
 - [sc-quantity-select](../quantity-select)
 - [sc-recurring-price-choice-container](../sc-recurring-price-choice-container)
 - [sc-rich-text](../rich-text)
 - [sc-select](../select)
 - [sc-subscription](../../controllers/dashboard/subscription)
 - [sc-subscription-ad-hoc-confirm](../../controllers/dashboard/subscription-ad-hoc-confirm)
 - [sc-subscription-details](../../controllers/dashboard/subscription-details)
 - [sc-subscription-next-payment](../../controllers/dashboard/subscription-details)
 - [sc-subscription-payment-method](../../controllers/dashboard/sc-subscription-payment-method)
 - [sc-subscription-switch](../../controllers/dashboard/subscription-switch)
 - [sc-subscription-variation-confirm](../../controllers/dashboard/subscription-variation-confirm)
 - [sc-subscriptions-list](../../controllers/dashboard/subscriptions-list)
 - [sc-tax-id-input](../tax-id-input)
 - [sc-toggle](../sc-toggle)
 - [sc-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)
 - [sc-upgrade-required](../sc-upgrade-required)
 - [sc-upsell](../../controllers/upsell/sc-upsell)
 - [sc-upsell-countdown-timer](../../controllers/upsell/sc-upsell-countdown-timer)
 - [sc-wordpress-user](../../controllers/dashboard/wordpress-user)

### Graph
```mermaid
graph TD;
  sc-alert --> sc-icon
  sc-breadcrumb --> sc-icon
  sc-breadcrumbs --> sc-icon
  sc-cancel-dialog --> sc-icon
  sc-cancel-survey --> sc-icon
  sc-cart-form-submit --> sc-icon
  sc-cart-header --> sc-icon
  sc-cart-icon --> sc-icon
  sc-cc-logo --> sc-icon
  sc-charges-list --> sc-icon
  sc-checkout-mollie-payment --> sc-icon
  sc-checkout-stock-alert --> sc-icon
  sc-checkout-test-complete --> sc-icon
  sc-coupon-form --> sc-icon
  sc-customer-details --> sc-icon
  sc-dialog --> sc-icon
  sc-downloads-list --> sc-icon
  sc-drawer --> sc-icon
  sc-empty --> sc-icon
  sc-feature-demo-banner --> sc-icon
  sc-fulfillments --> sc-icon
  sc-image-slider --> sc-icon
  sc-invoices-list --> sc-icon
  sc-license --> sc-icon
  sc-licenses-list --> sc-icon
  sc-line-item-invoice-receipt-download --> sc-icon
  sc-login-form --> sc-icon
  sc-order --> sc-icon
  sc-order-confirm-provider --> sc-icon
  sc-order-submit --> sc-icon
  sc-orders-list --> sc-icon
  sc-pagination --> sc-icon
  sc-password-nag --> sc-icon
  sc-payment --> sc-icon
  sc-payment-method --> sc-icon
  sc-payment-method-details --> sc-icon
  sc-payment-methods-list --> sc-icon
  sc-product-item-list --> sc-icon
  sc-product-line-item --> sc-icon
  sc-product-selected-price --> sc-icon
  sc-provisional-banner --> sc-icon
  sc-purchase-downloads-list --> sc-icon
  sc-quantity-select --> sc-icon
  sc-recurring-price-choice-container --> sc-icon
  sc-rich-text --> sc-icon
  sc-select --> sc-icon
  sc-subscription --> sc-icon
  sc-subscription-ad-hoc-confirm --> sc-icon
  sc-subscription-details --> sc-icon
  sc-subscription-next-payment --> sc-icon
  sc-subscription-payment-method --> sc-icon
  sc-subscription-switch --> sc-icon
  sc-subscription-variation-confirm --> sc-icon
  sc-subscriptions-list --> sc-icon
  sc-tax-id-input --> sc-icon
  sc-toggle --> sc-icon
  sc-upcoming-invoice --> sc-icon
  sc-upgrade-required --> sc-icon
  sc-upsell --> sc-icon
  sc-upsell-countdown-timer --> sc-icon
  sc-wordpress-user --> sc-icon
  style sc-icon fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
