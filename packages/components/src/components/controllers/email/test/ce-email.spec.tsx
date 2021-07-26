import { newSpecPage } from '@stencil/core/testing';
import { CeEmail } from '../ce-email';

describe('ce-email', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeEmail],
      html: `<ce-email></ce-email>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-email size="medium">
        <ce-input autocomplete="email" help="" name="customer_email" type="email" value=""></ce-input>
      </ce-email>
    `);
  });
});
