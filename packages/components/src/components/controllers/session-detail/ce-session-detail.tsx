import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutSession } from '../../../types';

@Component({
  tag: 'ce-session-detail',
  styleUrl: 'ce-session-detail.scss',
  shadow: true,
})
export class CeSessionDetail {
  @Prop() checkoutSession: CheckoutSession;
  @Prop() value: string;
  @Prop() loading: boolean;
  @Prop() label: string;

  getPropByPath(object, path, defaultValue) {
    const _path = Array.isArray(path) ? path : path.split('.');
    if (object && _path.length) return this.getPropByPath(object[_path.shift()], _path, defaultValue);
    return object === undefined ? defaultValue : object;
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

    let value = this.getPropByPath(this?.checkoutSession || {}, this.value, '');
    if (!value) {
      value = this.getPropByPath(this?.checkoutSession?.metadata || {}, this.value, '');
    }

    if (!value) {
      return null;
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
          <slot name="value">{value}</slot>
        </span>
      </div>
    );
  }
}

openWormhole(CeSessionDetail, ['checkoutSession', 'loading'], false);
