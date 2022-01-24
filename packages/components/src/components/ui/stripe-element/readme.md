# ce-stripe-element



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                           | Type                             | Default     |
| ----------------- | ------------------- | --------------------------------------------------------------------- | -------------------------------- | ----------- |
| `disabled`        | `disabled`          | Whether this field is disabled                                        | `boolean`                        | `undefined` |
| `hasFocus`        | `has-focus`         | Inputs focus                                                          | `boolean`                        | `undefined` |
| `label`           | `label`             | The input's label. Alternatively, you can use the label slot.         | `string`                         | `undefined` |
| `mode`            | `mode`              | Mode for the payment                                                  | `"live" \| "test"`               | `'live'`    |
| `order`           | --                  | The checkout session object for finalizing intents                    | `Order`                          | `undefined` |
| `publishableKey`  | `publishable-key`   | Stripe publishable key                                                | `string`                         | `undefined` |
| `secureText`      | `secure-text`       | The input's help text. Alternatively, you can use the help-text slot. | `string`                         | `''`        |
| `showLabel`       | `show-label`        | Should we show the label                                              | `boolean`                        | `true`      |
| `size`            | `size`              | The input's size.                                                     | `"large" \| "medium" \| "small"` | `'medium'`  |
| `stripeAccountId` | `stripe-account-id` | Your stripe connected account id.                                     | `string`                         | `undefined` |


## Events

| Event        | Description | Type                |
| ------------ | ----------- | ------------------- |
| `cePaid`     |             | `CustomEvent<void>` |
| `cePayError` |             | `CustomEvent<any>`  |


## Dependencies

### Used by

 - [ce-payment](../../controllers/payment)

### Depends on

- [ce-input](../input)

### Graph
```mermaid
graph TD;
  ce-stripe-element --> ce-input
  ce-input --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-payment --> ce-stripe-element
  style ce-stripe-element fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
