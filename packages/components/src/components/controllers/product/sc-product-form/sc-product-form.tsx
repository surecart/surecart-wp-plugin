import { Component, h } from '@stencil/core';

@Component({
  tag: 'sc-product-form',
  styleUrl: 'sc-product-form.css',
  shadow: false,
})
export class ScProductForm {
  render() {
    return (
      <form
        onSubmit={e => {
          console.log(e);
          e.preventDefault();
          console.log('submitted');
        }}
      >
        <slot />
      </form>
      // <sc-form onScSubmit={() => console.log('submitted')}>
      //   <slot />
      // </sc-form>
    );
  }
}
