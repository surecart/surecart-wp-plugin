/**
 * Track an event with Google Analytics or Google Tag Manager
 *
 * @param googleEventName The name of the event to track
 * @param eventData The data to send with the event
 *
 * @returns void
 */
export const trackEvent = (googleEventName: string, eventData: any | null) => {
  if (!window?.dataLayer && !window?.gtag) return;
  if (!eventData) return;

  // Handle dataLayer for Google Tag Manager
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce transactions
    window.dataLayer.push({
      event: googleEventName,
      ecommerce: eventData,
    });
  } else {
    // Handle gtag for Google Analytics
    window.gtag('event', googleEventName, eventData);
  }
};
