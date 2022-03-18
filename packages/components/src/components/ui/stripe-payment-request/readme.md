# ce-stripe-payment-request



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                         | Type                       | Default     |
| ----------------- | ------------------- | --------------------------------------------------- | -------------------------- | ----------- |
| `amount`          | `amount`            | Amount                                              | `number`                   | `0`         |
| `country`         | `country`           | Country                                             | `string`                   | `'US'`      |
| `currencyCode`    | `currency-code`     | Currency                                            | `string`                   | `'usd'`     |
| `debug`           | `debug`             | Is this in debug mode.                              | `boolean`                  | `false`     |
| `error`           | --                  |                                                     | `ResponseError`            | `undefined` |
| `formId`          | `form-id`           | This is required to validate the form on the server | `number \| string`         | `undefined` |
| `label`           | `label`             | Label                                               | `string`                   | `'total'`   |
| `order`           | --                  | Checkout Session                                    | `Order`                    | `undefined` |
| `paymentMethod`   | `payment-method`    |                                                     | `string`                   | `undefined` |
| `prices`          | --                  |                                                     | `{ [id: string]: Price; }` | `undefined` |
| `publishableKey`  | `publishable-key`   | Stripe publishable key                              | `string`                   | `undefined` |
| `stripeAccountId` | `stripe-account-id` | Your stripe connected account id.                   | `string`                   | `undefined` |
| `theme`           | `theme`             | Payment request theme                               | `string`                   | `'dark'`    |


## Events

| Event                    | Description | Type                   |
| ------------------------ | ----------- | ---------------------- |
| `ceFormSubmit`           |             | `CustomEvent<any>`     |
| `cePaid`                 |             | `CustomEvent<void>`    |
| `cePayError`             |             | `CustomEvent<any>`     |
| `cePaymentRequestLoaded` |             | `CustomEvent<boolean>` |
| `ceSetState`             |             | `CustomEvent<string>`  |
| `ceUpdateOrderState`     |             | `CustomEvent<any>`     |


## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"button"` |             |


## Dependencies

### Used by

 - [ce-express-payment](../../controllers/checkout-form/express-payment)

### Depends on

- [ce-alert](../alert)

### Graph
```mermaid
graph TD;
  ce-stripe-payment-request --> ce-alert
  ce-alert --> ce-icon
  ce-express-payment --> ce-stripe-payment-request
  style ce-stripe-payment-request fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
