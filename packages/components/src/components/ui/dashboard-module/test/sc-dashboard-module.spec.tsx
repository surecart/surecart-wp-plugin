import { newSpecPage } from '@stencil/core/testing';
import { ScDashboardModule } from '../sc-dashboard-module';

describe('sc-dashboard-module', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDashboardModule],
      html: `<sc-dashboard-module></sc-dashboard-module>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
