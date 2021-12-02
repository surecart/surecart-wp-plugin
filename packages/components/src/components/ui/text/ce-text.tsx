import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'ce-text',
  styleUrl: 'ce-text.scss',
  shadow: true,
})
export class CeText {
  @Prop() tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' = 'p';

  render() {
    const CustomTag = this.tag;

    return (
      <CustomTag class="title">
        <slot />
      </CustomTag>
    );
  }
}
