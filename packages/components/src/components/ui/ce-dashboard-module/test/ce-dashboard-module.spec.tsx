import { newSpecPage } from '@stencil/core/testing';
import { CeDashboardModule } from '../ce-dashboard-module';

describe('ce-dashboard-module', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeDashboardModule],
      html: `<ce-dashboard-module></ce-dashboard-module>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-dashboard-module>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-dashboard-module>
    `);
  });
});
