import { newSpecPage } from '@stencil/core/testing';
import { CeSubmit } from '../ce-submit';

describe('ce-submit', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSubmit],
      html: `<ce-submit></ce-submit>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-submit full="" size="large">
        <ce-consumer></ce-consumer>
      </ce-submit>
    `);
  });
});
