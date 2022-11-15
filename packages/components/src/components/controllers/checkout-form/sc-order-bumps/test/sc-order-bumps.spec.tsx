import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Bump } from '../../../../../types';
import { ScOrderBumps } from '../sc-order-bumps';

describe('sc-order-bump', () => {
  it('renders empty if no bumps', async () => {
    const page = await newSpecPage({
      components: [ScOrderBumps],
      template: () => <sc-order-bumps></sc-order-bumps>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders default label', async () => {
    const page = await newSpecPage({
      components: [ScOrderBumps],
      template: () => <sc-order-bumps bumps={[{ name: 'Test', amount_off: 123 }] as Bump[]}></sc-order-bumps>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders custom label', async () => {
    const page = await newSpecPage({
      components: [ScOrderBumps],
      template: () => <sc-order-bumps label="custom" bumps={[{ name: 'Test', amount_off: 123 }] as Bump[]}></sc-order-bumps>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders custom label', async () => {
    const page = await newSpecPage({
      components: [ScOrderBumps],
      template: () => <sc-order-bumps label="custom" bumps={[{ name: 'Test', amount_off: 123 }] as Bump[]}></sc-order-bumps>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
