import { newE2EPage } from '@stencil/core/testing';

describe('sc-image-slider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-image-slider></sc-image-slider>');

    const element = await page.find('sc-image-slider');
    expect(element).toHaveClass('hydrated');
  });
  it('renders with images', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-image-slider has-thumbnails></sc-image-slider>');

    const element = await page.find('sc-image-slider');
    element.setProperty('images', [
      {
        src: 'http://placekitten.com/200/300',
        alt: 'Image 1',
      },
      {
        src: 'http://placekitten.com/200/300',
        alt: 'Image 2',
      },
      {
        src: 'http://placekitten.com/200/300',
        alt: 'Image 3',
      },
      {
        src: 'http://placekitten.com/200/300',
        alt: 'Image 4',
      },
      {
        src: 'http://placekitten.com/200/300',
        alt: 'Image 5',
      },
      {
        src: 'http://placekitten.com/200/300',
        alt: 'Image 6',
      },
    ]);
    await page.waitForChanges();
    expect(element).toHaveClass('hydrated');
    const thumbsContainer = await page.find(`sc-image-slider >>> .image-slider__thumbs`);
    expect(thumbsContainer).not.toBeNull();
    expect(thumbsContainer).toHaveClass('image-slider__thumbs--has-navigation');
    const thumbs = await page.findAll(`sc-image-slider >>> .image-slider__thumb`);
    expect(thumbs.length).toBe(6);
    expect(thumbs[0]).toHaveClass('swiper-slide-active');
  });
});
