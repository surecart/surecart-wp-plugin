/**
 * This script dynamically injects the needed javascript files
 * on the site at runtime. This ensures maximum compatibility
 * with minification, CDNs and other services who may remove
 * the "module" type from the tag, or not support cors headers
 * for javascript files served through modules (I.E. Bunny.net).
 *
 * This purposely bypasses CDNs, so a user may want to opt-in to
 * our regular javascript module implementation, but will need
 * make sure CORS headers is enabled on their CDN in order to
 * support JavaScript modules cross domain.
 */
const surecartDomReady = function (callback) {
  document.readyState === 'interactive' || document.readyState === 'complete' ? callback() : document.addEventListener('DOMContentLoaded', callback);
};
surecartDomReady(function () {
  const url = window?.surecartComponents?.url || window?.parent?.surecartComponents?.url;
  if (url) {
    var script = document.createElement('script');
    script.type = 'module';
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
});
