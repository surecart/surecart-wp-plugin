import { newSpecPage } from '@stencil/core/testing';
import { CeTaxIdInput } from '../ce-tax-id-input';

describe('ce-tax-id-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTaxIdInput],
      html: `<ce-tax-id-input></ce-tax-id-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Renders UK VAT Tax Type', async () => {
    const page = await newSpecPage({
      components: [CeTaxIdInput],
      html: `<ce-tax-id-input country="GB"></ce-tax-id-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Renders EU VAT Tax Type', async () => {
    const page = await newSpecPage({
      components: [CeTaxIdInput],
      html: `<ce-tax-id-input country="DE"></ce-tax-id-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Renders CA Tax Type', async () => {
    const page = await newSpecPage({
      components: [CeTaxIdInput],
      html: `<ce-tax-id-input country="CA"></ce-tax-id-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Renders AU Tax Type', async () => {
    const page = await newSpecPage({
      components: [CeTaxIdInput],
      html: `<ce-tax-id-input country="AU"></ce-tax-id-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
