import { newSpecPage } from '@stencil/core/testing';
import { ScAvatar } from '../sc-avatar';

describe('sc-avatar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScAvatar],
      html: `<sc-avatar></sc-avatar>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('renders initials', async () => {
    const page = await newSpecPage({
      components: [ScAvatar],
      html: `<sc-avatar initials="AG"></sc-avatar>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('has square shape', async () => {
    const page = await newSpecPage({
      components: [ScAvatar],
      html: `<sc-avatar shape="square"></sc-avatar>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('has rounded shape', async () => {
    const page = await newSpecPage({
      components: [ScAvatar],
      html: `<sc-avatar shape="rounded"></sc-avatar>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('has a label', async () => {
    const page = await newSpecPage({
      components: [ScAvatar],
      html: `<sc-avatar label="Avatar label"></sc-avatar>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('has an image', async () => {
    const page = await newSpecPage({
      components: [ScAvatar],
      html: `<sc-avatar image="https://s.gravatar.com/avatar/286186a3bf41fb8452d02941833caa24?s=80"></sc-avatar>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
