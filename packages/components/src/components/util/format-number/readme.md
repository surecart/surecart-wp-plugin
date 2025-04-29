# ce-format-number



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                    | Description                                                                                    | Type                                             | Default     |
| -------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------- |
| `currency`                 | `currency`                   | The currency to use when formatting. Must be an ISO 4217 currency code such as `USD` or `EUR`. | `string`                                         | `'USD'`     |
| `currencyDisplay`          | `currency-display`           | How to display the currency.                                                                   | `"code" \| "name" \| "narrowSymbol" \| "symbol"` | `'symbol'`  |
| `locale`                   | `locale`                     | The locale to use when formatting the number.                                                  | `string`                                         | `undefined` |
| `maximumFractionDigits`    | `maximum-fraction-digits`    | The maximum number of fraction digits to use. Possible values are 0 - 20.                      | `number`                                         | `undefined` |
| `maximumSignificantDigits` | `maximum-significant-digits` | The maximum number of significant digits to use,. Possible values are 1 - 21.                  | `number`                                         | `undefined` |
| `minimumFractionDigits`    | `minimum-fraction-digits`    | The minimum number of fraction digits to use. Possible values are 0 - 20.                      | `number`                                         | `null`      |
| `minimumIntegerDigits`     | `minimum-integer-digits`     | The minimum number of integer digits to use. Possible values are 1 - 21.                       | `number`                                         | `undefined` |
| `minimumSignificantDigits` | `minimum-significant-digits` | The minimum number of significant digits to use. Possible values are 1 - 21.                   | `number`                                         | `undefined` |
| `noConvert`                | `no-convert`                 | Should we convert                                                                              | `boolean`                                        | `undefined` |
| `noGrouping`               | `no-grouping`                | Turns off grouping separators.                                                                 | `boolean`                                        | `false`     |
| `type`                     | `type`                       | The formatting style to use.                                                                   | `"currency" \| "decimal" \| "percent" \| "unit"` | `'decimal'` |
| `unit`                     | `unit`                       | The unit to use when formatting.                                                               | `string`                                         | `'lb'`      |
| `value`                    | `value`                      | The number to format.                                                                          | `number`                                         | `0`         |


## Dependencies

### Used by

 - [sc-coupon-form](../../ui/coupon-form)
 - [sc-fulfillments](../../controllers/dashboard/fulfillments)
 - [sc-order-detail](../../controllers/confirmation/order-detail)
 - [sc-price](../../ui/price)
 - [sc-price-range](../../ui/sc-price-range)
 - [sc-product-donation-amount-choice](../../controllers/checkout-form/product-donation-amount-choice)
 - [sc-product-item-price](../../controllers/products/sc-product-item-price)
 - [sc-product-line-item](../../ui/product-line-item)
 - [sc-product-price-choices](../../controllers/product/sc-product-price-choices)
 - [sc-recurring-price-choice-container](../../ui/sc-recurring-price-choice-container)
 - [sc-subscription-details](../../controllers/dashboard/subscription-details)
 - [sc-subscription-switch](../../controllers/dashboard/subscription-switch)

### Graph
```mermaid
graph TD;
  sc-coupon-form --> sc-format-number
  sc-fulfillments --> sc-format-number
  sc-order-detail --> sc-format-number
  sc-price --> sc-format-number
  sc-price-range --> sc-format-number
  sc-product-donation-amount-choice --> sc-format-number
  sc-product-item-price --> sc-format-number
  sc-product-line-item --> sc-format-number
  sc-product-price-choices --> sc-format-number
  sc-recurring-price-choice-container --> sc-format-number
  sc-subscription-details --> sc-format-number
  sc-subscription-switch --> sc-format-number
  style sc-format-number fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
