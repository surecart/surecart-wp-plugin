import { registerIconLibrary } from './library';

export default () =>
  registerIconLibrary('default', {
    resolver: function (name) {
      return '../icons/feather/' + name + '.svg';
    },
    mutator: function (svg) {
      return svg.setAttribute('fill', 'none');
    },
  });
