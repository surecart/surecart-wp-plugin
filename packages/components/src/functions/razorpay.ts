/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { RazorpayConstructor } from '../types';

/**
 * Razorpay Checkout JS SDK URL.
 */
export const RAZORPAY_CHECKOUT_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

/**
 * Client-side UI metadata for Razorpay's payment_method_types ids.
 *
 * The Razorpay `payment_method_types` endpoint returns only the method id (no icon / label),
 * unlike Mollie. This map is the single source of truth for the icon name and display label
 * used in the checkout choices AND on the customer dashboard payment-method rows.
 *
 * Keep the keys in sync with what the platform returns from
 * GET /processors/:id/payment_method_types for Razorpay.
 */
export const RAZORPAY_METHOD_META: Record<string, { icon: string; label: () => string }> = {
  card: { icon: 'razorpay', label: () => __('Card', 'surecart') },
  upi: { icon: 'upi', label: () => __('UPI', 'surecart') },
};

/**
 * Get a localized display label for a Razorpay method id (e.g. `upi` -> "UPI").
 * Returns `undefined` for unknown ids so callers can fall back to their existing
 * rendering (e.g. `textTransform: capitalize`).
 */
export const getRazorpayMethodLabel = (type?: string | null): string | undefined => (type ? RAZORPAY_METHOD_META[type]?.label() : undefined);

/**
 * Get the `sc-icon` name for a Razorpay method id. Falls back to the branded
 * razorpay swoosh for unknown ids.
 */
export const getRazorpayMethodIcon = (type?: string | null): string => (type && RAZORPAY_METHOD_META[type]?.icon) || 'razorpay';

/**
 * Cached Razorpay instance and load promise for singleton pattern.
 */
let razorpayInstance: RazorpayConstructor | null = null;
let loadPromise: Promise<RazorpayConstructor> | null = null;

/**
 * Load Razorpay SDK script.
 * Uses singleton pattern to avoid loading the script multiple times.
 *
 * @returns Promise that resolves to the Razorpay constructor.
 */
export const loadRazorpay = (): Promise<RazorpayConstructor> => {
  if (razorpayInstance) {
    return Promise.resolve(razorpayInstance);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = RAZORPAY_CHECKOUT_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      razorpayInstance = (window as any).Razorpay;
      resolve(razorpayInstance);
    };
    script.onerror = () => {
      loadPromise = null; // Reset so it can be retried.
      reject(new Error(__('Failed to load Razorpay script.', 'surecart')));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
};
