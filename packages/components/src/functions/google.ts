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

/**
 * Listen to a custom event and call a callback when the event is fired
 *
 * @param eventToListenTo The name of the event to listen to
 * @param callback The callback to call when the event is fired
 *
 * @returns void
 */
export const listenToEvent = (eventToListenTo: string, callback: (e: CustomEvent) => any | null) => {
  window.addEventListener(eventToListenTo, callback);
};

/**
 * Listen to a custom event and track it with Google Analytics or Google Tag Manager
 *
 * @param eventToListenTo The name of the event to listen to
 * @param googleEventName The name of the google event to track
 * @param getEventData A function to get the data to send with the event
 *
 * @returns void
 */
export const listenAndTrack = (eventToListenTo: string, googleEventName: string, getEventData: (e: CustomEvent) => any | null) => {
  listenToEvent(eventToListenTo, (e: CustomEvent) => {
    trackEvent(googleEventName, getEventData(e));
  });
};
