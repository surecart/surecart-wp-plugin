# ce-block-ui



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description | Type      | Default     |
| ------------- | ------------- | ----------- | --------- | ----------- |
| `spinner`     | `spinner`     |             | `boolean` | `undefined` |
| `transparent` | `transparent` |             | `boolean` | `undefined` |
| `zIndex`      | `z-index`     |             | `number`  | `1`         |


## Shadow Parts

| Part        | Description                |
| ----------- | -------------------------- |
| `"base"`    | The elements base wrapper. |
| `"content"` | The content (spinner)      |


## Dependencies

### Used by

 - [sc-address](../address)
 - [sc-cart](../../controllers/cart/sc-cart)
 - [sc-charges-list](../../controllers/dashboard/charges-list)
 - [sc-checkout](../../controllers/checkout-form/checkout)
 - [sc-compact-address](../sc-compact-address)
 - [sc-coupon-form](../coupon-form)
 - [sc-custom-order-price-input](../../controllers/checkout-form/custom-order-price-input)
 - [sc-customer-edit](../../controllers/dashboard/customer-edit)
 - [sc-donation-choices](../../controllers/checkout-form/donation-choices)
 - [sc-express-payment](../../controllers/checkout-form/express-payment)
 - [sc-form-state-provider](../../providers/form-state-provider)
 - [sc-invoices-list](../../controllers/dashboard/invoices-list)
 - [sc-login-form](../../controllers/login)
 - [sc-orders-list](../../controllers/dashboard/orders-list)
 - [sc-password-nag](../../controllers/dashboard/sc-password-nag)
 - [sc-payment-methods-list](../../controllers/dashboard/payment-methods-list)
 - [sc-purchase-downloads-list](../purchase-downloads-list)
 - [sc-subscription](../../controllers/dashboard/subscription)
 - [sc-subscription-ad-hoc-confirm](../../controllers/dashboard/subscription-ad-hoc-confirm)
 - [sc-subscription-cancel](../../controllers/dashboard/subscription-cancel)
 - [sc-subscription-payment](../../controllers/dashboard/subscription-payment)
 - [sc-subscription-payment-method](../../controllers/dashboard/sc-subscription-payment-method)
 - [sc-subscription-renew](../../controllers/dashboard/subscription-renew)
 - [sc-subscription-switch](../../controllers/dashboard/subscription-switch)
 - [sc-subscriptions-list](../../controllers/dashboard/subscriptions-list)
 - [sc-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)
 - [sc-wordpress-password-edit](../../controllers/dashboard/wordpress-password-edit)
 - [sc-wordpress-user-edit](../../controllers/dashboard/wordpress-user-edit)

### Depends on

- [sc-spinner](../spinner)

### Graph
```mermaid
graph TD;
  sc-block-ui --> sc-spinner
  sc-address --> sc-block-ui
  sc-cart --> sc-block-ui
  sc-charges-list --> sc-block-ui
  sc-checkout --> sc-block-ui
  sc-compact-address --> sc-block-ui
  sc-coupon-form --> sc-block-ui
  sc-custom-order-price-input --> sc-block-ui
  sc-customer-edit --> sc-block-ui
  sc-donation-choices --> sc-block-ui
  sc-express-payment --> sc-block-ui
  sc-form-state-provider --> sc-block-ui
  sc-invoices-list --> sc-block-ui
  sc-login-form --> sc-block-ui
  sc-orders-list --> sc-block-ui
  sc-password-nag --> sc-block-ui
  sc-payment-methods-list --> sc-block-ui
  sc-purchase-downloads-list --> sc-block-ui
  sc-subscription --> sc-block-ui
  sc-subscription-ad-hoc-confirm --> sc-block-ui
  sc-subscription-cancel --> sc-block-ui
  sc-subscription-payment --> sc-block-ui
  sc-subscription-payment-method --> sc-block-ui
  sc-subscription-renew --> sc-block-ui
  sc-subscription-switch --> sc-block-ui
  sc-subscriptions-list --> sc-block-ui
  sc-upcoming-invoice --> sc-block-ui
  sc-wordpress-password-edit --> sc-block-ui
  sc-wordpress-user-edit --> sc-block-ui
  style sc-block-ui fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
