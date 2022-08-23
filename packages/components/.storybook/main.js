module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    'storybook-addon-mock/register',
  ],
  framework: '@storybook/html',
  babelDefault: config => {
    return {
      ...config,
      plugins: [...config.plugins, [require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }]],
    };
  },
};
