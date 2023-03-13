import { newSpecPage } from '@stencil/core/testing';
import { ScLicenseActivations } from '../sc-license-activations';

describe('sc-license-activations', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScLicenseActivations],
      html: `<sc-license-activations></sc-license-activations>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-license-activations>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-license-activations>
    `);
  });
});
