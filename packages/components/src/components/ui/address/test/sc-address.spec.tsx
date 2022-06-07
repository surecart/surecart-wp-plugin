import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { ScAddress } from '../sc-address';

describe('sc-address', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScAddress],
      html: `<sc-address></sc-address>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders loading', async () => {
    const page = await newSpecPage({
      components: [ScAddress],
      html: `<sc-address loading="true"></sc-address>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders US address fields', async () => {
    const page = await newSpecPage({
      components: [ScAddress],
      template: () => <sc-address address={{ country: 'US', city: 'Monona', line_1: '303 Park Ave', line_2: null, postal_code: '12345', state: 'WI' }}></sc-address>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders CA address fields', async () => {
    const page = await newSpecPage({
      components: [ScAddress],
      template: () => <sc-address address={{ country: 'CA', city: 'Monona', line_1: '303 Park Ave', line_2: null, postal_code: '12345', state: 'WI' }}></sc-address>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders EU address fields', async () => {
    const page = await newSpecPage({
      components: [ScAddress],
      template: () => <sc-address address={{ country: 'UK', city: 'Monona', line_1: '303 Park Ave', line_2: null, postal_code: '12345', state: 'WI' }}></sc-address>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
