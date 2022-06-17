import { registerIconLibrary } from './library';
const registerIcons = (path = '') => {
  if (!path && !window?.scIconPath) {
    return;
  }
  return registerIconLibrary('default', {
    resolver: function (name) {
      const iconPath = path || window?.scIconPath;
      return `${iconPath?.replace(/\/$/, '')}/${name}.svg`;
    },
    mutator: function (svg) {
      return svg.setAttribute('fill', 'none');
    },
  });
};

window.registerSureCartIconPath = registerIcons;
window.registerSureCartIconLibrary = registerIconLibrary;
export { registerIconLibrary };
export default registerIcons;
