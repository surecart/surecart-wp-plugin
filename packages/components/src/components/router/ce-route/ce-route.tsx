import { Component, Host, h, Prop, EventEmitter, Event, Watch } from '@stencil/core';
import { getQueryArgs } from '@wordpress/url';
import dotProp from 'dot-prop-immutable';

@Component({
  tag: 'ce-route',
  shadow: true,
})
export class CeRoute {
  @Prop({ reflect: true }) queryVar: string = '';
  @Prop() default: boolean;
  @Prop({ reflect: true, mutable: true }) matched: boolean;
  @Prop() location?: string;

  @Event({ composed: true, cancelable: true, bubbles: true }) ceNavigationComplete: EventEmitter<void>;

  componentWillLoad() {
    window.onpopstate = () => {
      this.checkRoute();
    };
    this.checkRoute();
  }

  checkRoute() {
    const args = getQueryArgs(window.location.href) as object;
    this.matched = !!dotProp.get(args, this.queryVar);
  }

  @Watch('matched')
  handleMatchedChange(newValue: boolean) {
    if (newValue) {
      this.ceNavigationComplete.emit();
    }
  }

  @Watch('location')
  handleLocationChange() {
    this.checkRoute();
  }

  render() {
    if (!this.matched) {
      return null;
    }

    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
