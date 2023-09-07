/**
 * External dependencies.
 */
import { Component, h, Event, EventEmitter, Watch, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { getErrorMessage, getErrorMessages, getNoticeTitle } from '@store/notices/getters';
import { state as errorState } from '@store/notices';
import { ResponseError } from '../../../types';

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

  /**
   * Render the error messages.
   *
   * If there is only one error message, render it as a string.
   * Otherwise, render it as a list.
   *
   * @returns string
   */
  renderErrorMessages() {
    // if notice title and error message are same, then return empty.
    if (getNoticeTitle() === getErrorMessage()) {
      return '';
    }

    return (
      <ul>
        {getErrorMessages().map((message, key) => (
          <li key={key}>{message}</li>
        ))}
      </ul>
    );
  }

  render() {
    return !!getErrorMessages()?.length ? (
      <sc-alert
        exportparts="base, icon, text, title, message, close"
        type="danger"
        scrollOnOpen={true}
        open={!!getErrorMessage()}
        closable={errorState?.dismissible}
        title={getNoticeTitle()}
      >
        {this.renderErrorMessages()}
      </sc-alert>
    ) : null;
  }
}
