import readme from './readme.md';

export default {
  title: 'Button',
  args: {
    defaults: {
      innerText: 'Button',
    },
  },
  /**
   * Notes is an optional string which will be displayed in the "Notes"
   * tab for your component. It is recommended to use the generated readme,
   * however any string should suffice. This supports markdown.
   */
  notes: readme,
};
