import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'ce-flex',
  styleUrl: 'ce-flex.scss',
  shadow: true,
})
export class CeFlex {
  @Prop() alignItems: string;
  @Prop() justifyContent: string;
  @Prop() flexDirection: string;

  render() {
    return (
      <div
        class={{
          flex: true,
          ...(this.justifyContent ? { [`justify-${this.justifyContent}`]: true } : {}),
          ...(this.alignItems ? { [`align-${this.alignItems}`]: true } : {}),
          ...(this.flexDirection ? { [`direction-${this.flexDirection}`]: true } : {}),
        }}
      >
        <slot></slot>
      </div>
    );
  }
}
