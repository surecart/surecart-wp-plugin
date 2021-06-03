import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'ce-skeleton',
  styleUrl: 'ce-skeleton.scss',
  shadow: true,
})
export class CESkeleton {
  /** Animation effect */
  @Prop() effect: 'pulse' | 'sheen' | 'none' = 'sheen';

  render() {
    return (
      <div
        part="base"
        class={{
          'skeleton': true,
          'skeleton--pulse': this.effect === 'pulse',
          'skeleton--sheen': this.effect === 'sheen',
        }}
        aria-busy="true"
        aria-live="polite"
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    );
  }
}
