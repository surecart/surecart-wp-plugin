import { Component, h, Prop, State, Element, Watch, Event, EventEmitter } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { animateTo, stopAnimations } from '../../../functions/animate';
import { getAnimation, setDefaultAnimation } from '../../../functions/animation-registry';
import { lockBodyScrolling, unlockBodyScrolling } from '../../../functions/scroll';

@Component({
  tag: 'sc-dialog',
  styleUrl: 'sc-dialog.scss',
  shadow: true,
})
export class ScDialog {
  @Element() el!: HTMLElement;

  private dialog: HTMLElement;
  private panel: HTMLElement;
  private overlay: HTMLElement;

  private originalTrigger: HTMLElement | null;

  /** Indicates whether or not the dialog is open. You can use this in lieu of the show/hide methods. */
  @Prop({ reflect: true }) open: boolean = false;

  /**
   * The dialog's label as displayed in the header. You should always include a relevant label even when using
   * `no-header`, as it is required for proper accessibility.
   */
  @Prop({ reflect: true }) label = '';

  /**
   * Disables the header. This will also remove the default close button, so please ensure you provide an easy,
   * accessible way for users to dismiss the dialog.
   */
  @Prop({ reflect: true }) noHeader: boolean = false;

  /** Does this have a footer */
  @State() hasFooter: boolean = false;

  /** Request close event */
  @Event({ cancelable: true }) scRequestClose: EventEmitter<'close-button' | 'keyboard' | 'overlay'>;
  @Event() scShow: EventEmitter<void>;
  @Event() scAfterShow: EventEmitter<void>;
  @Event() scHide: EventEmitter<void>;
  @Event() scAfterHide: EventEmitter<void>;
  @Event({ cancelable: true }) scInitialFocus: EventEmitter<void>;

  /** Shows the dialog. */
  async show() {
    if (this.open) {
      return undefined;
    }
    this.open = true;
  }

  /** Hides the dialog */
  async hide() {
    if (!this.open) {
      return undefined;
    }
    this.open = false;
  }

  private requestClose(source: 'close-button' | 'keyboard' | 'overlay') {
    const slRequestClose = this.scRequestClose.emit(source);

    if (slRequestClose.defaultPrevented) {
      const animation = getAnimation(this.el, 'dialog.denyClose');
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
      // Show
      this.scShow.emit();

      lockBodyScrolling(this.el);

      // When the dialog is shown, Safari will attempt to set focus on whatever element has autofocus. This can cause
      // the dialogs's animation to jitter (if it starts offscreen), so we'll temporarily remove the attribute, call
      // `focus({ preventScroll: true })` ourselves, and add the attribute back afterwards.
      //
      // Related: https://github.com/shoelace-style/shoelace/issues/693
      //
      const autoFocusTarget = this.el.querySelector('[autofocus]');
      if (autoFocusTarget) {
        autoFocusTarget.removeAttribute('autofocus');
      }

      await Promise.all([stopAnimations(this.dialog), stopAnimations(this.overlay)]);
      this.dialog.hidden = false;

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

      const panelAnimation = getAnimation(this.el, 'dialog.show');
      const overlayAnimation = getAnimation(this.el, 'dialog.overlay.show');
      await Promise.all([animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options), animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options)]);

      this.scAfterShow.emit();
    } else {
      // Hide
      this.scHide.emit();
      await Promise.all([stopAnimations(this.dialog), stopAnimations(this.overlay)]);
      const panelAnimation = getAnimation(this.el, 'dialog.hide');
      const overlayAnimation = getAnimation(this.el, 'dialog.overlay.hide');
      await Promise.all([animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options), animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options)]);
      this.dialog.hidden = true;

      unlockBodyScrolling(this.el);

      // Restore focus to the original trigger
      const trigger = this.originalTrigger;
      if (typeof trigger?.focus === 'function') {
        setTimeout(() => trigger.focus());
      }

      this.scAfterHide.emit();
    }
  }

  componentDidLoad() {
    this.hasFooter = !!this.el.querySelector('[slot="footer"]');
    this.dialog.hidden = !this.open;

    if (this.open) {
      lockBodyScrolling(this.el);
    }
  }

  disconnectedCallback() {
    unlockBodyScrolling(this.el);
  }

  render() {
    return (
      <div
        part="base"
        ref={el => (this.dialog = el as HTMLElement)}
        class={{
          'dialog': true,
          'dialog--open': this.open,
          'dialog--has-footer': this.hasFooter,
        }}
        onKeyDown={e => this.handleKeyDown(e)}
      >
        <div part="overlay" class="dialog__overlay" onClick={() => this.requestClose('overlay')} tabindex="-1"></div>
        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden={this.open ? 'false' : 'true'}
          aria-label={this.noHeader || this.label}
          aria-labelledby={!this.noHeader || 'title'}
          tabindex="0"
        >
          {!this.noHeader && (
            <header part="header" class="dialog__header">
              <h2 part="title" class="dialog__title" id="title">
                <slot name="label"> {this.label.length > 0 ? this.label : String.fromCharCode(65279)} </slot>
              </h2>
              <sc-icon
                part="close-button"
                exportparts="base:close-button__base"
                class="dialog__close"
                name="x"
                label={__('Close', 'surecart')}
                onClick={() => this.requestClose('close-button')}
              ></sc-icon>
            </header>
          )}
          <div part="body" class="dialog__body">
            <slot></slot>
          </div>
          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    );
  }
}

setDefaultAnimation('dialog.show', {
  keyframes: [
    { opacity: 0, transform: 'scale(0.8)' },
    { opacity: 1, transform: 'scale(1)' },
  ],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('dialog.hide', {
  keyframes: [
    { opacity: 1, transform: 'scale(1)' },
    { opacity: 0, transform: 'scale(0.8)' },
  ],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('dialog.denyClose', {
  keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }],
  options: { duration: 250 },
});

setDefaultAnimation('dialog.overlay.show', {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  options: { duration: 250 },
});

setDefaultAnimation('dialog.overlay.hide', {
  keyframes: [{ opacity: 1 }, { opacity: 0 }],
  options: { duration: 250 },
});
