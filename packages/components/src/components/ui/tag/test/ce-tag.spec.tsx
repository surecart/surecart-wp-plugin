import { newSpecPage } from '@stencil/core/testing';
import { CeTag } from '../ce-tag';

describe('ce-tag', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTag],
      html: `<ce-tag></ce-tag>`,
    });
    expect(page.root).toEqualHtml(`
    <ce-tag size="medium" type="info">
       <mock:shadow-root>
         <span class="tag tag--info tag--medium" part="base">
           <span class="tag__content" part="content">
             <slot></slot>
           </span>
         </span>
        </mock:shadow-root>
      </ce-tag>
    `);
  });
});
