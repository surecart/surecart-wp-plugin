import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScFormatDate } from '../sc-format-date';

describe('sc-format-date', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScFormatDate],
      template: () => <sc-format-date date={1646774470} timeZone="cst" locale="en-US" type="timestamp"></sc-format-date>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
