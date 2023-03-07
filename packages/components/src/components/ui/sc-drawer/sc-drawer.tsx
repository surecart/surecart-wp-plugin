import { Component, Element, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { animateTo, stopAnimations } from '../../../functions/animate';
import { getAnimation, setDefaultAnimation } from '../../../functions/animation-registry';

@Component({
  tag: 'sc-drawer',
  styleUrl: 'sc-drawer.css',
  shadow: true,
})
export class ScDrawer {
  @Element() el: HTMLScDrawerElement;
  private drawer: HTMLElement;
  private panel: HTMLElement;
  private overlay: HTMLElement;

  private originalTrigger: HTMLElement | null;

  @Event({ cancelable: true }) scInitialFocus: EventEmitter<void>;
  @Event({ cancelable: true }) scRequestClose: EventEmitter<'close-button' | 'keyboard' | 'overlay'>;
  @Event() scShow: EventEmitter<void>;
  @Event() scHide: EventEmitter<void>;
  @Event() scAfterShow: EventEmitter<void>;
  @Event() scAfterHide: EventEmitter<void>;

  /** Indicates whether or not the drawer is open. You can use this in lieu of the show/hide methods. */
  @Prop({ reflect: true }) open: boolean = false;

  /**
   * The drawer's label as displayed in the header. You should always include a relevant label even when using
   * `no-header`, as it is required for proper accessibility.
   */
  @Prop({ reflect: true }) label = '';

  /** The direction from which the drawer will open. */
  @Prop({ reflect: true }) placement: 'top' | 'end' | 'bottom' | 'start' = 'end';

  /**
   * By default, the drawer slides out of its containing block (usually the viewport). To make the drawer slide out of
   * its parent element, set this prop and add `position: relative` to the parent.
   */
  @Prop({ reflect: true }) contained: boolean = false;

  /**
   * Removes the header. This will also remove the default close button, so please ensure you provide an easy,
   * accessible way for users to dismiss the drawer.
   */
  @Prop({ attribute: 'no-header', reflect: true }) noHeader: boolean = false;

  componentDidLoad() {
    this.drawer.hidden = !this.open;
    if (this.open && !this.contained) {
      this.lockBodyScrolling();
    }
  }

  disconnectedCallback() {
    this.unLockBodyScrolling();
  }

  lockBodyScrolling() {
    document.body.classList.add('sc-scroll-lock');
  }

  unLockBodyScrolling() {
    document.body.classList.remove('sc-scroll-lock');
  }

  /** Shows the drawer. */
  async show() {
    if (this.open) {
      return undefined;
    }
    this.open = true;
  }

  /** Hides the drawer */
  async hide() {
    if (!this.open) {
      return undefined;
    }
    this.open = false;
  }

  private requestClose(source: 'close-button' | 'keyboard' | 'overlay') {
    const slRequestClose = this.scRequestClose.emit(source);

    if (slRequestClose.defaultPrevented) {
      const animation = getAnimation(this.el, 'drawer.denyClose');
      animateTo(this.panel, animation.keyframes, animation.options);
      return;
    }

    this.hide();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.requestClose('keyboard');
    }
  }

  @Watch('open')
  async handleOpenChange() {
    if (this.open) {
      this.scShow.emit();
      this.originalTrigger = document.activeElement as HTMLElement;

      // Lock body scrolling only if the drawer isn't contained
      if (!this.contained) {
        this.lockBodyScrolling();
      }

      // When the drawer is shown, Safari will attempt to set focus on whatever element has autofocus. This causes the
      // drawer's animation to jitter, so we'll temporarily remove the attribute, call `focus({ preventScroll: true })`
      // ourselves, and add the attribute back afterwards.
      //
      // Related: https://github.com/shoelace-style/shoelace/issues/693
      //
      const autoFocusTarget = this.el.querySelector('[autofocus]');
      if (autoFocusTarget) {
        autoFocusTarget.removeAttribute('autofocus');
      }

      await Promise.all([stopAnimations(this.drawer), stopAnimations(this.overlay)]);
      this.drawer.hidden = false;

      // Set initial focus
      requestAnimationFrame(() => {
        const slInitialFocus = this.scInitialFocus.emit();

        if (!slInitialFocus.defaultPrevented) {
          // Set focus to the autofocus target and restore the attribute
          if (autoFocusTarget) {
            (autoFocusTarget as HTMLInputElement).focus({ preventScroll: true });
          } else {
            this.panel.focus({ preventScroll: true });
          }
        }

        // Restore the autofocus attribute
        if (autoFocusTarget) {
          autoFocusTarget.setAttribute('autofocus', '');
        }
      });

      const panelAnimation = getAnimation(this.el, `drawer.show${this.placement.charAt(0).toUpperCase() + this.placement.slice(1)}`);
      const overlayAnimation = getAnimation(this.el, 'drawer.overlay.show');
      await Promise.all([animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options), animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options)]);

      this.scAfterShow.emit();
    } else {
      // Hide
      this.scHide.emit();
      this.unLockBodyScrolling();

      await Promise.all([stopAnimations(this.drawer), stopAnimations(this.overlay)]);
      const panelAnimation = getAnimation(this.el, `drawer.hide${this.placement.charAt(0).toUpperCase() + this.placement.slice(1)}`);
      const overlayAnimation = getAnimation(this.el, 'drawer.overlay.hide');
      await Promise.all([animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options), animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options)]);

      this.drawer.hidden = true;

      // Restore focus to the original trigger
      const trigger = this.originalTrigger;
      if (typeof trigger?.focus === 'function') {
        setTimeout(() => trigger.focus());
      }

      this.scAfterHide.emit();
    }
  }

  render() {
    return (
      <div
        part="base"
        class={{
          'drawer': true,
          'drawer--open': this.open,
          'drawer--top': this.placement === 'top',
          'drawer--end': this.placement === 'end',
          'drawer--bottom': this.placement === 'bottom',
          'drawer--start': this.placement === 'start',
          'drawer--contained': this.contained,
          'drawer--fixed': !this.contained,
          // 'drawer--has-footer': this.hasSlotController.test('footer'),
        }}
        ref={el => (this.drawer = el as HTMLElement)}
        onKeyDown={(e: KeyboardEvent) => this.handleKeyDown(e)}
      >
        <div part="overlay" class="drawer__overlay" onClick={() => this.requestClose('overlay')} tabindex="-1" ref={el => (this.overlay = el as HTMLElement)}></div>
        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden={this.open ? 'false' : 'true'}
          aria-label={this.noHeader ? this.label : undefined}
          aria-labelledby={!this.noHeader ? 'title' : undefined}
          tabindex="0"
          ref={el => (this.panel = el as HTMLElement)}
        >
          {!this.noHeader && (
            <header part="header" class="drawer__header">
              <slot name="header">
                <h2 part="title" class="drawer__title" id="title">
                  {/** If there's no label, use an invisible character to prevent the header from collapsing */}
                  <slot name="label">{this.label.length > 0 ? this.label : ' '} </slot>
                </h2>
                <sc-icon
                  part="close-button"
                  exportparts="base:close-button__base"
                  class="drawer__close"
                  name="x"
                  label={
                    /** translators: Close this modal window. */
                    __('Close', 'surecart')
                  }
                  onClick={() => this.requestClose('close-button')}
                ></sc-icon>
              </slot>
            </header>
          )}
          <footer part="header-suffix" class="drawer__header-suffix">
            <slot name="header-suffix"></slot>
          </footer>
          <div part="body" class="drawer__body">
            <slot></slot>
          </div>
          <footer part="footer" class="drawer__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    );
  }
}

// Top
setDefaultAnimation('drawer.showTop', {
  keyframes: [
    { opacity: 0, transform: 'translateY(-100%)' },
    { opacity: 1, transform: 'translateY(0)' },
  ],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('drawer.hideTop', {
  keyframes: [
    { opacity: 1, transform: 'translateY(0)' },
    { opacity: 0, transform: 'translateY(-100%)' },
  ],
  options: { duration: 250, easing: 'ease' },
});

// End
setDefaultAnimation('drawer.showEnd', {
  keyframes: [
    { opacity: 0, transform: 'translateX(100%)' },
    { opacity: 1, transform: 'translateX(0)' },
  ],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('drawer.hideEnd', {
  keyframes: [
    { opacity: 1, transform: 'translateX(0)' },
    { opacity: 0, transform: 'translateX(100%)' },
  ],
  options: { duration: 250, easing: 'ease' },
});

// Bottom
setDefaultAnimation('drawer.showBottom', {
  keyframes: [
    { opacity: 0, transform: 'translateY(100%)' },
    { opacity: 1, transform: 'translateY(0)' },
  ],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('drawer.hideBottom', {
  keyframes: [
    { opacity: 1, transform: 'translateY(0)' },
    { opacity: 0, transform: 'translateY(100%)' },
  ],
  options: { duration: 250, easing: 'ease' },
});

// Start
setDefaultAnimation('drawer.showStart', {
  keyframes: [
    { opacity: 0, transform: 'translateX(-100%)' },
    { opacity: 1, transform: 'translateX(0)' },
  ],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('drawer.hideStart', {
  keyframes: [
    { opacity: 1, transform: 'translateX(0)' },
    { opacity: 0, transform: 'translateX(-100%)' },
  ],
  options: { duration: 250, easing: 'ease' },
});

// Deny close
setDefaultAnimation('drawer.denyClose', {
  keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.01)' }, { transform: 'scale(1)' }],
  options: { duration: 250 },
});

// Overlay
setDefaultAnimation('drawer.overlay.show', {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('drawer.overlay.hide', {
  keyframes: [{ opacity: 1 }, { opacity: 0 }],
  options: { duration: 250, easing: 'ease' },
});
