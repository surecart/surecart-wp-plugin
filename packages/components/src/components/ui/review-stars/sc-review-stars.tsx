import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'sc-review-stars',
  styleUrl: 'sc-review-stars.scss',
  shadow: true,
})
export class ScReviewStars {
  @Prop() rating: number = 0;
  @Prop() size = 20;

  render() {
    const wholeStars = Math.floor(this.rating);
    const hasHalf = wholeStars < this.rating;

    const stars = Array.from({ length: 5 }).map((_, idx) => {
      const i = idx + 1;
      const isFull = i <= wholeStars;
      const isHalf = hasHalf && i === wholeStars + 1;

      return (
        <sc-icon
          name={isHalf ? 'half-star' : 'star'}
          class={{
            'full-star': isFull,
            'half-star': isHalf,
            'empty-star': !isFull && !isHalf,
          }}
          style={{
            width: `${this.size}px`,
            height: `${this.size}px`,
          }}
        ></sc-icon>
      );
    });

    return <div part="base">{stars}</div>;
  }
}
