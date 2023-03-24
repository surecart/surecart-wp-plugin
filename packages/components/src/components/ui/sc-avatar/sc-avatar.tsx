import { Component, h, State, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'sc-avatar',
  styleUrl: 'sc-avatar.css',
  shadow: true,
})
export class ScAvatar {
  @State() private hasError = false;

  /** The image source to use for the avatar. */
  @Prop() image = '';

  /** A label to use to describe the avatar to assistive devices. */
  @Prop() label = '';

  /** Initials to use as a fallback when no image is available (1-2 characters max recommended). */
  @Prop() initials = '';

  /** Indicates how the browser should load the image. */
  @Prop() loading: 'eager' | 'lazy' = 'eager';

  /** The shape of the avatar. */
  @Prop({ reflect: true }) shape: 'circle' | 'square' | 'rounded' = 'circle';

  @Watch('image')
  handleImageChange() {
    // Reset the error when a new image is provided
    this.hasError = false;
  }

  render() {
    return (
      <div
        part="base"
        class={{
          'avatar': true,
          'avatar--circle': this.shape === 'circle',
          'avatar--rounded': this.shape === 'rounded',
          'avatar--square': this.shape === 'square',
        }}
        role="img"
        aria-label={this.label}
      >
        {this.initials ? (
          <div part="initials" class="avatar__initials">
            {this.initials}
          </div>
        ) : (
          <div part="icon" class="avatar__icon" aria-hidden="true">
            <slot name="icon">
              <sl-icon name="person-fill" library="system"></sl-icon>
            </slot>
          </div>
        )}
        {this.image && !this.hasError && <img part="image" class="avatar__image" src={this.image} loading={this.loading} alt="" onError={() => (this.hasError = true)} />}
      </div>
    );
  }
}
