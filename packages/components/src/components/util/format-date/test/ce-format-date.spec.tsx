import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { CeFormatDate } from '../ce-format-date';

describe('ce-format-date', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeFormatDate],
      template: () => <ce-format-date date={1646774470} type="timestamp"></ce-format-date>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
