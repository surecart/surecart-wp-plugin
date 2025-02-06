import { newSpecPage } from '@stencil/core/testing';
import { ScInvoiceStatusBadge } from '../sc-invoice-status-badge';

describe('sc-invoice-status-badge', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScInvoiceStatusBadge],
      html: `<sc-invoice-status-badge></sc-invoice-status-badge>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
