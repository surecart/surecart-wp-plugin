import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutSession } from '../../../types';
import dotProp from 'dot-prop-immutable';

@Component({
  tag: 'ce-session-detail',
  styleUrl: 'ce-session-detail.scss',
  shadow: true,
})
export class CeSessionDetail {
  @Prop() checkoutSession: CheckoutSession;
  @Prop() value: string;
  @Prop() fallback: string;
  @Prop() metaKey: string;
  @Prop() loading: boolean;
  @Prop() label: string;

  getPropByPath(object, path, defaultValue) {
    if (object && path.length) return this.getPropByPath(object[path.shift()], path, defaultValue);
    return object === undefined ? defaultValue : object;
  }

  getValue() {
    if (!this.value) {
      return;
    }

    let value = '';

    // get metadata value
    if (this.value === 'metadata') {
      return dotProp.get(this?.checkoutSession?.metadata, this.value || '');
    }

    // get value
    value = dotProp.get(this?.checkoutSession, this.value || '');

    // if number, format it
    if (typeof value === 'number') {
      value = <ce-format-number type="currency" currency={this?.checkoutSession?.currency} value={value}></ce-format-number>;
    }

    return value;
  }

  render() {
    if (this.loading) {
      return (
        <div
          part="base"
          class={{
            'session-detail': true,
          }}
        >
          <span part="label" class="session-detail__label">
            <ce-skeleton style={{ width: '60px', height: '8px', display: 'inline-block' }}></ce-skeleton>
          </span>
          <span part="value" class="session-detail__value">
            <ce-skeleton style={{ width: '120px', display: 'inline-block' }}></ce-skeleton>
          </span>
        </div>
      );
    }

    const value = this.getValue();
    if (!value) {
      if (!this.fallback) {
        return;
      }
    }

    return (
      <div
        part="base"
        class={{
          'session-detail': true,
        }}
      >
        <span part="label" class="session-detail__label">
          <slot name="label">{this.label}</slot>
        </span>
        <span part="value" class="session-detail__value">
          <slot name="value">{value || this.fallback}</slot>
        </span>
      </div>
    );
  }
}

openWormhole(CeSessionDetail, ['checkoutSession', 'loading'], false);
