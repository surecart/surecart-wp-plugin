import { newSpecPage } from '@stencil/core/testing';
import { CESecureNotice } from '../ce-secure-notice';

describe('ce-secure-notice', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CESecureNotice],
      html: `<ce-secure-notice></ce-secure-notice>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
