# ce-skeleton



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description      | Type                           | Default   |
| -------- | --------- | ---------------- | ------------------------------ | --------- |
| `effect` | `effect`  | Animation effect | `"none" \| "pulse" \| "sheen"` | `'sheen'` |


## Shadow Parts

| Part          | Description |
| ------------- | ----------- |
| `"base"`      |             |
| `"indicator"` |             |


## CSS Custom Properties

| Name              | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `--border-radius` | The skeleton's border radius.                              |
| `--color`         | The color of the skeleton.                                 |
| `--sheen-color`   | The sheen color when the skeleton is in its loading state. |


## Dependencies

### Used by

 - [ce-card](../card)
 - [ce-coupon-form](../../controllers/coupon-form)
 - [ce-customer-subscription-edit](../../controllers/dashboard/customer-subscription-edit)
 - [ce-customer-subscription-plan](../../controllers/dashboard/customer-subscription-plan)
 - [ce-customer-subscriptions-list](../../controllers/dashboard/customer-subscriptions-list)
 - [ce-line-item-total](../../controllers/line-item-total)
 - [ce-line-items](../../controllers/line-items)
 - [ce-order-confirmation-line-items](../../controllers/order-confirmation-line-items)
 - [ce-order-summary](../../controllers/order-summary)
 - [ce-payment](../../controllers/payment)
 - [ce-price-choice](../../controllers/price-choice)
 - [ce-session-detail](../../controllers/session-detail)
 - [ce-session-subscription](../../controllers/session-subscription)

### Graph
```mermaid
graph TD;
  ce-card --> ce-skeleton
  ce-coupon-form --> ce-skeleton
  ce-customer-subscription-edit --> ce-skeleton
  ce-customer-subscription-plan --> ce-skeleton
  ce-customer-subscriptions-list --> ce-skeleton
  ce-line-item-total --> ce-skeleton
  ce-line-items --> ce-skeleton
  ce-order-confirmation-line-items --> ce-skeleton
  ce-order-summary --> ce-skeleton
  ce-payment --> ce-skeleton
  ce-price-choice --> ce-skeleton
  ce-session-detail --> ce-skeleton
  ce-session-subscription --> ce-skeleton
  style ce-skeleton fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
