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
  @Prop() flexWrap: string;
  @Prop() stack: string;

  render() {
    return (
      <div
        part="base"
        class={{
          flex: true,
          ...(this.justifyContent ? { [`justify-${this.justifyContent}`]: true } : {}),
          ...(this.alignItems ? { [`align-${this.alignItems}`]: true } : {}),
          ...(this.flexDirection ? { [`direction-${this.flexDirection}`]: true } : {}),
          ...(this.columnGap ? { [`column-gap-${this.columnGap}`]: true } : {}),
          ...(this.flexWrap ? { [`wrap-${this.flexWrap}`]: true } : {}),
          ...(this.stack ? { [`stack-${this.stack}`]: true } : {}),
        }}
      >
        <slot></slot>
      </div>
    );
  }
}
