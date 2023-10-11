/**
 * External dependencies.
 */
import { Component, h, Event, EventEmitter, Watch, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { state as errorState } from '@store/notices';
import { ResponseError } from '../../../types';
import { getAdditionalErrorMessages } from '@store/notices/getters';

/**
 * @part base - The elements base wrapper.
 * @part icon - The alert icon.
 * @part text - The alert text.
 * @part title - The alert title.
 * @part message - The alert message.
 * @part close - The close icon.
 */
@Component({
  tag: 'sc-error',
  shadow: true,
})
export class ScFormErrorProvider {
  /** Set the state. */
  @Event() scUpdateError: EventEmitter<ResponseError>;

  /** Error to display. */
  @Prop() error: ResponseError | null;

  /** Trigger the error event when an error happens  */
  @Watch('error')
  handleErrorUpdate(val) {
    this.scUpdateError.emit(val);
  }

  render() {
    return !!errorState?.message ? (
      <sc-alert exportparts="base, icon, text, title, message, close" type="danger" scrollOnOpen={true} open={!!errorState?.message} closable={!!errorState?.dismissible}>
        {errorState?.message && <span slot="title" innerHTML={errorState.message}></span>}
        {(getAdditionalErrorMessages() || []).map((message, index) => (
          <div innerHTML={message} key={index}></div>
        ))}
      </sc-alert>
    ) : null;
  }
}
