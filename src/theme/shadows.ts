import { Shadows } from '@mui/material/styles/shadows';

function createShadow() {
  return `box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);`;
}

// Source: https://gist.github.com/serglo/f9f0be9a66fd6755a0bda85f9c64e85f
const shadows: Shadows = [
  'none',

  /* Shadow 1dp */
  'box-shadow: 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20);',

  /* Shadow 2dp */
  'box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.20);',

  /* Shadow 3dp */
  'box-shadow: 0 3px 4px 0 rgba(0,0,0,0.14), 0 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);',

  /* Shadow 4dp */
  'box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.20);',

  /* Shadow 6dp */
  'box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20);',

  /* Shadow 8dp */
  'box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.20);',

  /* Shadow 9dp */
  'box-shadow: 0 9px 12px 1px rgba(0,0,0,0.14), 0 3px 16px 2px rgba(0,0,0,0.12), 0 5px 6px -3px rgba(0,0,0,0.20);',

  /* Shadow 12dp */
  'box-shadow: 0 12px 17px 2px rgba(0,0,0,0.14), 0 5px 22px 4px rgba(0,0,0,0.12), 0 7px 8px -4px rgba(0,0,0,0.20);',

  /* Shadow 16dp */
  'box-shadow: 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.20);',

  /* Shadow 24dp */
  'box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.20);',

  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
  createShadow(),
];

export default shadows;
