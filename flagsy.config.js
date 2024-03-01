const svgToDataUri = require('mini-svg-data-uri');
const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const [baseFontSize, { lineHeight: baseLineHeight }] =
  defaultTheme.fontSize.base;
const { spacing, borderWidth, borderRadius, boxShadow } = defaultTheme;

module.exports = plugin.withOptions(function (options = {}) {
  // Enable forms and tooltip by default if not specified in options.
  const { charts = false, forms = true, tooltips = true } = options;

  return function ({ addBase, addComponents, theme }) {
    // tooltip and popover styles
    if (tooltips) {
      addBase({
        [[`[type='checkbox']`, `[type='radio']`]]: {
          appearance: 'none',
          padding: '0',
          'print-color-adjust': 'exact',
          display: 'inline-block',
          'vertical-align': 'middle',
          'background-origin': 'border-box',
          'user-select': 'none',
          'flex-shrink': '0',
          height: spacing[4],
          width: spacing[4],
          color: theme('colors.primary.600', colors.blue[600]),
          'background-color': '#fff',
          'border-color': theme('colors.gray.300', colors.gray[300]),
          'border-width': borderWidth['DEFAULT'],
          '--tw-shadow': '0 0 #0000',
        },
        [`[type='checkbox']`]: {
          'border-radius': borderRadius['lg'],
        },
        [`[type='radio']`]: {
          'border-radius': '100%',
        },
        [[`[type='checkbox']:focus`, `[type='radio']:focus`]]: {
          outline: '2px solid transparent',
          'outline-offset': '2px',
          '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-ring-offset-width': '2px',
          '--tw-ring-offset-color': '#fff',
          '--tw-ring-color': theme('colors.primary.600', colors.blue[600]),
          '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
          '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
          'box-shadow': `var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)`,
        },
        [[
          `[type='checkbox']:checked`,
          `[type='radio']:checked`,
          `.dark [type='checkbox']:checked`,
          `.dark [type='radio']:checked`,
        ]]: {
          'border-color': `transparent`,
          'background-color': `currentColor`,
          'background-size': `0.55em 0.55em`,
          'background-position': `center`,
          'background-repeat': `no-repeat`,
        },
        [`[type='checkbox']:checked`]: {
          'background-image': `url("${svgToDataUri(
            `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M1 5.917 5.724 10.5 15 1.5"/>
                            </svg>`,
          )}")`,
          'background-repeat': `no-repeat`,
          'background-size': `0.7em 0.7em`,
          'print-color-adjust': `exact`,
        },
        [`[type='radio']:checked`]: {
          'background-image': `url("${svgToDataUri(
            `<svg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3"/></svg>`,
          )}")`,
          'background-size': `1em 1em`,
        },
        [`.dark [type='radio']:checked`]: {
          'background-image': `url("${svgToDataUri(
            `<svg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3"/></svg>`,
          )}")`,
          'background-size': `1em 1em`,
        },
        [`[type='checkbox']:indeterminate`]: {
          'background-image': `url("${svgToDataUri(
            `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                            <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M1 5.917 5.724 10.5 15 1.5"/>
                            </svg>`,
          )}")`,
          'background-color': `currentColor`,
          'border-color': `transparent`,
          'background-position': `center`,
          'background-repeat': `no-repeat`,
          'background-size': `0.55em 0.55em`,
          'print-color-adjust': `exact`,
        },
        [[
          `[type='checkbox']:indeterminate:hover`,
          `[type='checkbox']:indeterminate:focus`,
        ]]: {
          'border-color': 'transparent',
          'background-color': 'currentColor',
        },
      });
    }
  };
});
