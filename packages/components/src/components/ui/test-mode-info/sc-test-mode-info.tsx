import { Component, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * @part base - The elements base wrapper.
 * @part trigger - The trigger.
 * @part panel - The panel.
 */
@Component({
  tag: 'sc-test-mode-info',
  styleUrl: 'sc-test-mode-info.scss',
})
export class ScTestModeInfo {
  render() {
    return (
      <sc-popover skidding={30}>
        <slot name="trigger" slot="trigger" />
        <span slot="title">{__('How to switch from Test to Live mode', 'surecart')}</span>
        <div class="sc-test-mode-info-content" slot="content">
          <ol>
            <li>
              {__('From the Admin Bar', 'surecart')}
              <ul>
                <li>{__('Select any product & proceed to its checkout page.', 'surecart')}</li>
                <li>{__('Access the dropdown menu & select the live mode.', 'surecart')}</li>
              </ul>
              <img src={`${window?.scData?.plugin_url}/images/change-from-adminbar.png`} alt={__('Screenshot showing how to change mode from the admin bar', 'surecart')} />
            </li>
            <li>
              {__('From the Editor', 'surecart')}
              <ul>
                <li>{__('Navigate to the custom Forms section under SureCart.', 'surecart')}</li>
                <li>{__('Select the checkout form.', 'surecart')}</li>
                <li>{__('Select "Live" from the dropdown. Hit Update!', 'surecart')}</li>
              </ul>
              <img src={`${window?.scData?.plugin_url}/images/change-from-editor.png`} alt={__('Screenshot showing how to change mode from the editor', 'surecart')} />
            </li>
          </ol>
        </div>
        <div class="sc-test-mode-info-footer" slot="footer">
          <sc-button size="small" type="link" target="_blank" href="https://surecart.com/docs/how-to-make-test-payments/">
            {__('Documentation ', 'surecart')} <sc-icon name="external-link" />
          </sc-button>
          <sc-button size="small" type="link" target="_blank" href="https://surecart.com/contact-us/">
            {__('Open a ticket ', 'surecart')} <sc-icon name="external-link" />
          </sc-button>
        </div>
      </sc-popover>
    );
  }
}
