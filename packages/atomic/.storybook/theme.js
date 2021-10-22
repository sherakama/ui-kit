import {create} from '@storybook/theming';

export default create({
  base: 'light',

  colorPrimary: '#333357',
  colorSecondary: '#1372ec',

  // UI
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: 'grey',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'black',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'black',
  barSelectedColor: '#1372ec',
  barBg: '#f6f7f9',

  // Form colors
  inputBg: 'white',
  inputBorder: '#CFD9E',
  inputTextColor: 'black',
  inputBorderRadius: 4,

  brandTitle: 'My custom storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://place-hold.it/350x150',
});
