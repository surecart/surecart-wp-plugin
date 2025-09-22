import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'sc-review-stars',
  styleUrl: 'sc-review-stars.css',
  shadow: true,
})
export class ScReviewStars {
  @Prop() rating: number;
  @Prop() size = 16;
  @Prop() color?: string;

  render() {
    const stars = [];
    const numericRating = this.rating || 0;

    for (let i = 1; i <= 5; i++) {
      const difference = numericRating - (i - 1);
      let fillPercentage = 0;

      if (difference >= 1) {
        fillPercentage = 100;
      } else if (difference >= 0.5) {
        fillPercentage = 50;
      } else if (difference > 0) {
        fillPercentage = Math.round(difference * 100);
      }

      const gradientId = `star-gradient-${i}-${this.rating}`;

      stars.push(
        <div class="star-container" style={{ width: `${this.size}px`, height: `${this.size}px` }}>
          <svg class="star-svg" width={this.size} height={this.size} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={gradientId}>
                <stop offset={`${fillPercentage}%`} stop-color={this.color ? this.color : 'var(--sc-review-stars-primary)'} />
                <stop offset={`${fillPercentage}%`} stop-color="var(--sc-review-stars-secondary)" />
              </linearGradient>
            </defs>
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill={fillPercentage > 0 ? `url(#${gradientId})` : 'var(--sc-review-stars-secondary)'}
              stroke={fillPercentage > 0 ? (this.color ? this.color : 'var(--sc-review-stars-primary)') : 'var(--sc-review-stars-secondary)'}
              stroke-width="1"
            />
          </svg>
        </div>,
      );
    }

    return <div part="base">{stars}</div>;
  }
}
