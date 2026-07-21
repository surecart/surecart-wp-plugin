import { __ } from '@wordpress/i18n';

/**
 * Default copy for the checkout location permission modal — the single source
 * shared by the dialog (sc-checkout-geo-permission) and the admin placeholders.
 *
 * Keep it accurate and neutral: the location IS stored on the order, and a rule
 * may surcharge as well as discount — so no "never stored" or "fairer" framing.
 */
export const getGeoPermissionDefaults = (): {
  title: string;
  content: string;
  allowLabel: string;
  declineLabel: string;
} => ({
  title: __('Location-based pricing', 'surecart'),
  content: __(
    'This store uses your approximate location (city, state, and country) to calculate pricing at checkout. Your location is saved to your order. Your browser will ask you to confirm next.',
    'surecart',
  ),
  allowLabel: __('Allow location', 'surecart'),
  declineLabel: __('Not now', 'surecart'),
});
