import { Component, Host, h, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState } from '@store/checkout';
import { getGeoCoordinates } from '../../../../../functions/geolocation';

/** localStorage key that remembers the customer's decision so we honor it on future visits. */
const DECISION_KEY = 'sc_geo_capture_decision';

/**
 * Explains why location is requested (e.g. regional / purchasing-power-parity pricing) and gates
 * the browser geolocation prompt behind an explicit opt-in when capture is enabled by the merchant.
 */
@Component({
  tag: 'sc-checkout-geo-permission',
  styleUrl: 'sc-checkout-geo-permission.scss',
  shadow: true,
})
export class ScCheckoutGeoPermission {
  /** Whether the explainer dialog is open. */
  @State() open: boolean = false;

  /** Whether the customer dismissed our explainer ("Not now") on a previous visit. */
  wasDismissed(): boolean {
    try {
      return window.localStorage.getItem(DECISION_KEY) === 'declined';
    } catch {
      return false;
    }
  }

  /** Remember a dismissal so we don't re-show the explainer on every visit. */
  rememberDismissed() {
    try {
      window.localStorage.setItem(DECISION_KEY, 'declined');
    } catch {
      // Storage unavailable (private mode etc.) — the dismissal simply isn't remembered.
    }
  }

  /**
   * The browser's current geolocation permission, or null if the Permissions API is
   * unavailable (e.g. older Safari). Lets us avoid showing an explainer whose Allow
   * button can't actually trigger a prompt.
   */
  async getPermissionState(): Promise<PermissionState | null> {
    try {
      const status = await navigator.permissions?.query({ name: 'geolocation' as PermissionName });
      return status?.state ?? null;
    } catch {
      return null;
    }
  }

  async componentDidLoad() {
    // Nothing to do unless the merchant enabled capture and the browser can actually geolocate.
    if (!checkoutState.captureGeoAddressEnabled) return;
    if (!window?.isSecureContext || !navigator?.geolocation) return;

    const permission = await this.getPermissionState();

    // Already granted at the browser level: capture silently — no need to ask again.
    if (permission === 'granted') {
      this.capture();
      return;
    }

    // Blocked at the browser level: JS can't re-prompt, so don't show an Allow button we can't fulfill.
    // Checkout continues normally with no capture; the customer can re-enable in their browser settings.
    if (permission === 'denied') return;

    // State is 'prompt' (or unknown): respect a prior "Not now", otherwise explain before prompting.
    if (this.wasDismissed()) return;
    this.open = true;
  }

  /** Capture coordinates into the checkout store. They ride along on the next update/finalize. */
  async capture() {
    if (checkoutState.geoCoordinates) return;
    checkoutState.geoCoordinates = await getGeoCoordinates();
  }

  /** Customer opted in — close and fire the native browser prompt. */
  onAllow() {
    this.open = false;
    this.capture();
  }

  /** Customer dismissed — remember it and close. Checkout continues with no capture. */
  onDecline() {
    this.rememberDismissed();
    this.open = false;
  }

  render() {
    const { geoCapture } = checkoutState;

    // Defaults live here (not in PHP) so they're translatable and merchant fields can stay empty.
    const title = geoCapture?.title || __('See pricing for your region', 'surecart');
    const content =
      geoCapture?.content ||
      __(
        "We adjust prices to be fairer based on where you're shopping from. Allow location access to see the price for your region — it's used only to set your price, never stored or shared. Your browser will ask you to confirm next.",
        'surecart',
      );
    const allowLabel = geoCapture?.allowLabel || __('Allow location', 'surecart');
    const declineLabel = geoCapture?.declineLabel || __('Not now', 'surecart');

    return (
      <Host>
        <sc-dialog open={this.open} noHeader={true} onScRequestClose={() => this.onDecline()} class="geo-permission">
          <sc-dashboard-module style={{ '--sc-dashboard-module-spacing': '1em' }}>
            <sc-flex slot="heading" align-items="center" justify-content="flex-start">
              <sc-icon name="map-pin" style={{ color: 'var(--sc-color-primary-500)' }}></sc-icon>
              {title}
            </sc-flex>

            <div slot="description" class="geo-permission__content" innerHTML={content}></div>
          </sc-dashboard-module>

          <sc-button slot="footer" type="text" onClick={() => this.onDecline()}>
            {declineLabel}
          </sc-button>
          <sc-button slot="footer" type="primary" onClick={() => this.onAllow()}>
            {allowLabel}
            <sc-icon name="map-pin" slot="suffix"></sc-icon>
          </sc-button>
        </sc-dialog>
      </Host>
    );
  }
}
