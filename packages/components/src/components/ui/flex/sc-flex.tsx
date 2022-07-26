import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'sc-flex',
  styleUrl: 'sc-flex.scss',
  shadow: true,
})
export class ScFlex {
  @Prop() alignItems: string;
  @Prop() justifyContent: string;
  @Prop() flexDirection: string;
  @Prop() columnGap: string;

  render() {
    return (
      <div
        class={{
          flex: true,
          ...(this.justifyContent ? { [`justify-${this.justifyContent}`]: true } : {}),
          ...(this.alignItems ? { [`align-${this.alignItems}`]: true } : {}),
          ...(this.flexDirection ? { [`direction-${this.flexDirection}`]: true } : {}),
          ...(this.columnGap ? { [`column-gap-${this.columnGap}`]: true } : {}),
        }}
      >
        <slot></slot>
      </div>
    );
  }
}
