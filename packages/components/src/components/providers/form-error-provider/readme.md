# sc-form-error-provider



<!-- Auto Generated Below -->


## Overview

This component checks to make sure there is an error component
and adds one if it's missing.

## Dependencies

### Used by

 - [sc-checkout](../../controllers/checkout-form/checkout)

### Depends on

- [sc-checkout-form-errors](../../controllers/checkout-form/checkout-form-errors)

### Graph
```mermaid
graph TD;
  sc-form-error-provider --> sc-checkout-form-errors
  sc-checkout-form-errors --> sc-alert
  sc-alert --> sc-icon
  sc-checkout --> sc-form-error-provider
  style sc-form-error-provider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
