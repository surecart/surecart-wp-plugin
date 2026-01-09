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
