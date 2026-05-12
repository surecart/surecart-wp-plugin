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
 * UI metadata for Razorpay `payment_method_types` ids — Razorpay's API returns only the id,
 * so this is the source of truth for icons/labels shown in checkout and on dashboard rows.
 * Keep keys in sync with GET /processors/:id/payment_method_types.
 */
export const RAZORPAY_METHOD_META: Record<string, { icon: string; label: () => string }> = {
  card: { icon: 'razorpay', label: () => __('Credit Card', 'surecart') },
  upi: { icon: 'upi', label: () => __('UPI', 'surecart') },
};

/** Localized label for a Razorpay method id. Returns `undefined` for unknown ids. */
export const getRazorpayMethodLabel = (type?: string | null): string | undefined => (type ? RAZORPAY_METHOD_META[type]?.label() : undefined);

/** `sc-icon` name for a Razorpay method id. Falls back to the branded razorpay icon. */
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
