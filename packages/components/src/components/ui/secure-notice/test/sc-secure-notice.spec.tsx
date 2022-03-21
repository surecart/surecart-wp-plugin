import { newSpecPage } from '@stencil/core/testing';
import { CESecureNotice } from '../sc-secure-notice';

describe('sc-secure-notice', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CESecureNotice],
      html: `<sc-secure-notice></sc-secure-notice>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
